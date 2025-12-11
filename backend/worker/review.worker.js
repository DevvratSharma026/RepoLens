//worker needs all the things that our express app need
require('dotenv').config();
const mongoose = require('mongoose');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const ReviewRequest = require('../models/ReviewRequest');
const RepoSnapShot = require('../models/RepoSnapShot');


const MONGO_URI = process.env.MONGO_URI;
const s3_Bucket = process.env.S3_BUCKET;
const s3_Region = process.env.S3_REGION;
const s3_Secret = process.env.S3_SECRET;
const s3_Key = process.env.S3_KEY;
const POLL_INTERVAL_MS = parseInt(process.env.WORKER_POLL_INTERVAL_MS, 10) || 5000;

//block 1: initialize the s3 client
const s3 = new S3Client({
    region: s3_Region,
    credentials: {
        accessKeyId: s3_Key,
        secretAccessKey: s3_Secret
    },
});

//connect to mongoose to fetch the pending request
async function connectDB() {
    await mongoose.connect(MONGO_URI);
    console.log("MonogDB connected")
}

//helper function to parse s3://bucket/prefix/ into {bucket, prefix}
function pasresS3Uri(s3uri) {
    if (!s3uri || !s3uri.startsWith('s3://')) return null;

    const without = s3uri.replace('s3://', '');
    const parts = without.split('/');
    const bucket = parts.shift();
    const prefix = parts.join('/');
    return { bucket, prefix };
}

//list objects under prefix 
async function listObjects(bucket, prefix) {
    const objects = [];
    let continuationToken = undefined;

    do {
        const cmd = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            continuationToken,
            MaxKeys: 1000
        });

        const resp = await s3.send(cmd);
        if (resp.Contents) {
            objects.push(...resp.Contents.map(o => ({ key: o.Key, size: o.Size })))
        }
        continuationToken = resp.IsTruncated ? resp.NextContinuationToken : undefined;
    } while (continuationToken);
    return objects;
}

//minimal "review" that inspects snapshot files and returns a summary object
async function runReviewForSnapshot(snapShot) {
    const parsed = pasresS3Uri(snapShot.s3Path);
    if (!parsed) throw new Error("Invalid s3 path on snapshot");

    const bucket = parsed.bucket;
    const prefix = parsed.prefix;

    const objects = await listObjects(bucket, prefix);

    //placeholder review result
    const result = {
        fileCount: objects.length,
        totalBytes: objects.reduce((s, o) => s + (o.Size || 0), 0),
        topLanguages: snapShot.languageStats || {},
        sampleFiles: objects.slice(0, 10).map(o => o.Key),
        notes: 'Placeholder review: replace with your LLM-based analysis',
    };

    return result;
}

//claim + process one pending request
//purpose: atomically claim a job and process it so multiple workers do not clash
async function ProcessOnePending() {
    //atomically find and claim one pending review request
    const reviewReq = await ReviewRequest.findOneAndUpdate(
        { status: 'pending' },
        { $set: { status: 'processing', startedAt: new Date() } },
        { new: true }
    );

    if (!reviewReq) return null;

    console.log(`worker claimed review ${reviewReq._id.toString()}`);

    try {
        //load the snapshot
        const snapShot = await RepoSnapShot.findById(reviewReq.snapShotId).lean();
        if (!snapShot) throw new Error("snapShot not found");

        //run the review pipeline
        const reviewResult = await runReviewForSnapshot(snapShot);

        //persist result and mark completed
        reviewReq.status = 'completed';
        reviewReq.result = {
            ...reviewReq,
            finishedAt: new Date(),
        }

        await reviewReq.save();

        console.log(`worker completed review ${reviewReq._id.toString()}`);
        return reviewReq;
    } catch (err) {
        console.log(`worker error processing ${reviewReq._id.toString()}`, err.message);
        //mark as failed 
        try {
            reviewReq.status = 'failed';
            reviewReq.result = {
                error: err.message,
                finishedAt: new Date(),
            };
            await reviewReq.save();
        } catch(saveErr) {
            console.error('worker failed while saving failed status', saveErr.message);;
        }
        return reviewReq;
    }

}

//polling loop
let shuttingDown = false;
async function pollingLoop() {
    console.log('Worker starting polling loop, interval ms =', POLL_INTERVAL_MS);
    while (!shuttingDown) {
        try {
            const processed = await ProcessOnePending();
            if (!processed) {
                //nothing processed: sleep for POLL_INTERVAL_MS
                await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
            } else {
                //processed one job: loop immediatetly to look for more
            }
        } catch (err) {
            console.error('worker polling loop error', err);
            //avoid tight error loop
            await new Promise(r => setTimeout(r, POLL_INTERVAL_MS));
        }
    }
}

//shutdown handler
async function shutdown() {
    console.log('worker shutting down...');

    shuttingDown = true;
    try {
        await mongoose.disconnect();
        console.log('worker mongo disconnected');
    } catch(err) {
        console.warn('worker error during the mongo disconnect', err.message);
    }
    process.exit(1);
}

process.on('SIGINT', shutdown);
process.on('SIGNTERM', shutdown);

//main loop
(async function main() {
    try {
        await connectDB();
        await pollingLoop();
    } catch (err) {
        console.error('[Worker] fatel error', err);
        process.exit(1);
    }
})();
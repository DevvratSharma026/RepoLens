//worker needs all the things that our express app need
require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');

const ReviewRequest = require('../models/ReviewRequest');
const RepoSnapShot = require('../models/RepoSnapShot');

const path = require('path');
const { downloadSnapshotFromS3 } = require('../services/s3DownloadSnapshot');
const { selectFiles } = require('../services/fileSelect.service');
const { chunkFiles } = require('../services/chunker.service');
const { reviewChunkWithLLM, validateConfig: validateLLMConfig } = require('../services/llm.service');
const { aggregateChunkResults } = require('../services/aggregation.service');

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
function parsesS3Uri(s3uri) {
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
async function runReviewForSnapshot({ snapShot, reviewId }) {
    if (!reviewId) {
        throw new Error('reviewId missing in runreviewforsnapshot');
    }
    //1. parse S3 URI
    const parsed = parsesS3Uri(snapShot.s3Path);
    if (!parsed) throw new Error("Invalid s3 path on snapshot");

    //2. download snapshot to local workspace
    const workspace = await downloadSnapshotFromS3({
        bucket: parsed.bucket,
        prefix: parsed.prefix,
        reviewId
    });

    try {
        // Validate LLM config before processing
        validateLLMConfig();

        //3. select eligible files
        const files = selectFiles({ baseDir: workspace.localPath });
        if (files.length === 0) {
            throw new Error('No eligible files found in snapshot');
        }

        //4. chunk files
        const { chunks, truncated } = chunkFiles({ files });

        if (chunks.length === 0) {
            throw new Error('No chunks created from files');
        }

        //5. Review each chunk with LLM 
        const chunkResults = [];
        let successfulChunks = 0;
        const chunkErrors = [];

        for (const chunk of chunks) {
            try {
                const res = await reviewChunkWithLLM(chunk);
                chunkResults.push(res);
                successfulChunks++;
            } catch (err) {
                console.error(`[LLM] chunk failed: ${chunk.filePath} (${chunk.chunkIndex + 1}/${chunk.totalChunks}) - ${err.message}`);
                chunkErrors.push({ chunk: chunk.filePath, error: err.message });
            }
        }

        if (successfulChunks === 0) {
            const errorSummary = chunkErrors.length > 0 
                ? ` All chunks failed. First error: ${chunkErrors[0].error}` 
                : ' No chunks were processed.';
            throw new Error(`All LLM chunks reviews failed.${errorSummary}`);
        }

        //6. aggregate results
        const result = aggregateChunkResults({
            chunkResults,
            meta: {
                filesReviewed: files.length,
                chunkAnalyzed: successfulChunks,
                languages: Object.keys(snapShot.languageStats || {}),
                truncated
            }
        });
        return result;
    } finally {
        //7. cleanup always - remove downloaded files from local storage
        const tmpDir = path.join(process.cwd(), 'tmp', 'worker', reviewId.toString());
        try {
            if (fs.existsSync(tmpDir)) {
                fs.rmSync(tmpDir, { recursive: true, force: true });
            }
        } catch (cleanupErr) {
            console.warn(`[worker] failed to cleanup tmp directory: ${tmpDir}`, cleanupErr.message);
        }
    }
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
        const reviewResult = await runReviewForSnapshot({ snapShot, reviewId: reviewReq._id });

        //persist result and mark completed
        reviewReq.status = 'completed';
        reviewReq.result = reviewResult;
        reviewReq.finishedAt = new Date();

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
        } catch (saveErr) {
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
    } catch (err) {
        console.warn('worker error during the mongo disconnect', err.message);
    }
    process.exit(1);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

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
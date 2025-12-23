//we gonna be download the snapshot from s3 to the local file so that the worker can read it
const { ListObjectsV2Command, GetObjectCommand, S3Client } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path'); 

const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
        accessKeyId:process.env.S3_KEY,
        secretAccessKey:process.env.S3_SECRET
    }
})

function streamToFile(readable, filePath) {
    return new Promise((resolve, reject) => {
        const writeStream = fs.createWriteStream(filePath);
        readable.pipe(writeStream);
        readable.on('error', reject);
        readable.on('finish', resolve);
        writeStream.on('error', reject);
    });
}

async function downloadSnapshotFromS3( { bucket, prefix, reviewId } ) {
    const baseDir = path.join(process.cwd(), 'tmp', 'worker', reviewId.toString());
    fs.mkdirSync(baseDir, {recursive: true});

    let continuationToken;
    let downloadFiles = 0;

    do{
        const listCmd = new ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
            ContinuationToken: continuationToken
        });

        const listResp = await s3.send(listCmd);

        if(!listResp.Contents) break;

        for(const obj of listResp.Contents) {
            //skip "folder" keys
            if(obj.Key.endsWith('/')) continue;

            const relativePath = obj.Key.replace(prefix, '');
            const localFilePath = path.join(baseDir, relativePath);

            fs.mkdirSync(path.dirname(localFilePath), {recursive: true});

            const getCmd = new GetObjectCommand({
                Bucket: bucket,
                Key: obj.Key
            }); 

            const fileResp = await s3.send(getCmd);
            await streamToFile(fileResp.Body, localFilePath);

            downloadFiles++;
        }
        continuationToken = listResp.IsTruncated
            ? listResp.NextContinuationToken
            : undefined;
    } while(continuationToken);

    return {
        localPath: baseDir,
        fileCount: downloadFiles
    };
}

module.exports = { downloadSnapshotFromS3 };
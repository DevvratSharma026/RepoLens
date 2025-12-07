// src/services/s3UploadFolder.js
const fs = require('fs');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const s3 = require('./s3');

async function uploadFolderToS3(localFolderPath, s3Prefix) {
  // ensure prefix ends with /
  if (!s3Prefix.endsWith('/')) s3Prefix += '/';

  // 1. recursively collect all files
  function walk(dir) {
    const results = [];
    const list = fs.readdirSync(dir);

    for (const file of list) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        results.push(...walk(filePath));
      } else {
        results.push(filePath);
      }
    }
    return results;
  }

  const allFiles = walk(localFolderPath);

  // 2. upload each file maintaining folder structure
  for (const filePath of allFiles) {
    const relative = path.relative(localFolderPath, filePath).replace(/\\/g, '/');
    const s3Key = `${s3Prefix}${relative}`;

    const upload = new Upload({
      client: s3,
      params: {
        Bucket: process.env.S3_BUCKET,
        Key: s3Key,
        Body: fs.createReadStream(filePath),
      },
    });

    await upload.done();
  }

  return `s3://${process.env.S3_BUCKET}/${s3Prefix}`;
}

module.exports = uploadFolderToS3;

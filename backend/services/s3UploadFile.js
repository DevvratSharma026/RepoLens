// src/services/s3UploadFile.js
const fs = require('fs');
const path = require('path');
const { Upload } = require('@aws-sdk/lib-storage');
const s3 = require('./s3');

module.exports = async function uploadFileToS3(localFilePath, s3Key) {
  const fileStream = fs.createReadStream(localFilePath);

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: process.env.S3_BUCKET,
      Key: s3Key,
      Body: fileStream,
    },
  });

  await upload.done();

  return `s3://${process.env.S3_BUCKET}/${s3Key}`;
};

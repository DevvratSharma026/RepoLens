const unzip = require('../utils/unZip')
const detectLanguage = require('../utils/langDetect')
const path = require('path');
const uploadFolderToS3 = require('../services/s3UploadFolder');
const RepoSnapShot = require('../models/RepoSnapShot');
const fs = require('fs');
const os = require('os');
const fsSync = require('fs');
const cleanupPath = require('../utils/cleanup');

exports.upload = async (req, res) => {
    try {
        //multer should populate req.file
        if (!req.file || !req.file.path) {
            return res.status(400).json({
                success: false,
                message: "No ZIP file provided"
            });
        }

        // ensure tmp/uploads exists (already does, but safe)
        const uploadDir = path.join(process.cwd(), "tmp/uploads");

        if (!fsSync.existsSync(uploadDir)) {
            fsSync.mkdirSync(uploadDir, { recursive: true });
        }

        // create a safe, owned path
        const safeZipPath = path.join(
            uploadDir,
            `${Date.now()}-${req.file.originalname}`
        );

        // MOVE the file immediately (this is the critical step)
        await fs.rename(req.file.path, safeZipPath);

        // from now on, ONLY use this
        const zipPath = safeZipPath;
        const originalname = req.file.originalname;
        const userId = req.user ? req.user._id : null;

        //1. unzip the file (return the extracted folder path)
        const extractedPath = await unzip(zipPath);

        //2. detect the language
        const languageStats = detectLanguage(extractedPath);

        //3. upload extracted folder to s3
        const repoName = req.body.repoName || path.basename(extractedPath);
        const ts = Date.now();
        const keyPreFix = `snapshots/${userId || 'anon'}/${ts}`;

        //upload folder to s3 -> s3uploadFolder
        const s3Path = await uploadFolderToS3(extractedPath, keyPreFix);

        //4.create a reposnapshot record in DB
        const snapshot = await RepoSnapShot.create({
            userId,
            repoName,
            s3Path,
            languageStats,
            originalName: originalname,
            meta: {
                keyPreFix,
                uploadedFileName: originalname
            },
            createdAt: new Date(),
        });

        //5. remove the uploaded and extracted zip files
        try {
            await cleanupPath(zipPath);
            await cleanupPath(extractedPath);
        } catch (cleanupErr) {
            console.warn('Cleanup error (non-fatel)', cleanupErr);
        }

        //6. return results

        //quick reply so frontend knows upload succeeded and mind the path
        return res.status(200).json({
            success: true,
            message: "ZIP extracted and language and uploaded to s3",
            snapshotId: snapshot._id,
            s3Path,
            languageStats,
            uploadedBy: userId
        });
    } catch (err) {
        console.error('Uploaded controller error ', err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        })
    }
}
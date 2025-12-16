const fetchGitHubUrl = require("../utils/githubFetch");
const unZip = require("../utils/unZip");
const detectLanguage = require("../utils/langDetect");
const uploadFolderToS3 = require("../services/s3UploadFolder");
const RepoSnapshot = require('../models/RepoSnapShot');
const path = require('path');
const cleanupPath = require('../utils/cleanup');

exports.createSnapshotFromGitHub = async (req, res) => {
    try {
        const {repoUrl} = req.body;
        const userId = req.user ? req.user._id : null;
        
        if(!repoUrl) {
            return res.status(400).json({
                success: false,
                message: "RepoURL is required"
            });
        }

        //1. download github zip reop zip to tmp
        const zipPath = await fetchGitHubUrl(repoUrl);

        //2. unzip (reuse existing util)
        const extractedPath = await unZip(zipPath);

        //3. language detection
        const languageStats = detectLanguage(extractedPath);

        //4. upload to s3
        const ts = Date.now();
        const keyPrefix = `snapshots/${userId || 'anon'}/${ts}`;
        const s3Path = await uploadFolderToS3(extractedPath, keyPrefix);

        //5. create snapshot
        const snapshot = await RepoSnapshot.create({
            userId, 
            repoName: path.basename(repoUrl),
            s3Path,
            languageStats,
            meta: {
                source: 'github',
                repoUrl,
                keyPrefix,
            }
        });

        return res.status(201).json({
            success: true,
            message: 'Github repo snapshot created',
            snapshotId: snapshot._id,
            s3Path,
            languageStats
        });
    } catch(err) {
        console.error("Github snapshot error", err);
        return res.status(500).json({
            success: false,
            message: "Failed to create snapshot from github",
            error: err.message
        });
    } finally {
        await cleanupPath(zipPath);
        await cleanupPath(extractedPath);
    }
}
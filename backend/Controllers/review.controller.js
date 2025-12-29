const RepoSnapShot = require("../models/RepoSnapShot");
const ReviewRequest = require("../models/ReviewRequest");

exports.createReview = async (req, res) => {
    try {
        const { snapShotId } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!snapShotId) {
            return res.status(400).json({
                success: false,
                message: "snapShotId is required"
            });
        }

        //verify snapshot exists
        const snapShot = await RepoSnapShot.findById(snapShotId).lean();
        if (!snapShot) {
            return res.status(404).json({
                success: false,
                message: "RepoSnapShot not found"
            });
        }

        //create review request with status pending
        const review = await ReviewRequest.create({
            snapShotId,
            requestBy: userId,
            status: 'pending',
            createdAt: Date.now(),
        });

        //respond with the review request id so frontend/worker can ref it
        return res.status(201).json({
            success: true,
            message: "Review request created",
            reviewId: review._id,
            status: review.status
        });
    } catch (err) {
        console.error("Create Review error", err);
        return res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        })
    }
};

exports.getReview = async (req, res) => {
    try {
        const reviewId = req.params.id;
        if (!reviewId) {
            return res.status(400).json({
                success: false,
                message: "reviewId required"
            });
        }

        // Validate ObjectId format
        const mongoose = require('mongoose');
        if (!mongoose.Types.ObjectId.isValid(reviewId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid reviewId format"
            });
        }

        //populate snapshot info (lean for performance)
        const review = await ReviewRequest.findById(reviewId).lean().populate({
            path: 'snapShotId',
            select: 'repoName s3Path languageStats meta createdAt',
        });

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found"
            });
        }

        return res.json({
            success: true,
            review: {
                _id: review._id,
                status: review.status,
                result: review.result || null,
                createdAt: review.createdAt,
                startedAt: review.startedAt || null,
                finishedAt: review.result?.finishedAt || null,
                snapshot: review.snapShotId || null,
            },
        });
    } catch (err) {
        console.error('getReview error', err);
        return res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
}
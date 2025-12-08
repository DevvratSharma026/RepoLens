const RepoSnapShot = require("../models/RepoSnapShot");
const ReviewRequest = require("../models/ReviewRequest");

exports.createReview = async (req, res) => {
    try {
        const { snapShotId } = req.body;
        const userId = req.user ? req.user._id : null;
        
        if(!snapShotId) {
            return res.status(400).json({
                success: false,
                message: "snapShotId is required"
            });
        }

        //verify snapshot exists
        const snapShot = await RepoSnapShot.findById(snapShotId).lean();
        if(!snapShot) {
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
    } catch(err) {
        console.error("Create Review error", err);
        return res.status(500).json({
            success: false,
            message: "server error",
            error: err.message
        })
    }
}
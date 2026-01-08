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

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    
    if (!userId) {
        return res.status(401).json({
            success: false,
            message: 'User not authenticated'
        });
    }
    
    // Convert userId to ObjectId if it's a string
           const mongoose = require('mongoose');
           const userObjectId = mongoose.Types.ObjectId.isValid(userId) 
               ? new mongoose.Types.ObjectId(userId) 
               : userId;
   
           const allUserReviews = await ReviewRequest.find({ requestBy: userObjectId }).lean();
    const stats = await ReviewRequest.aggregate([
      {
        $match: {
          requestBy: userId,
          status: 'completed' //only count completed reviews
        }
      },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          totalIssues: {
            $sum: {
              $ifNull: ["$result.meta.issuesFound", 0]
            }
          },
          totalSuggestions: {
            $sum: {
              $ifNull: ["$meta.suggestionsCount", 0]
            }
          }
        }
      }
    ]);
    const result = stats[0] || {
      totalReviews: 0,
      totalIssues: 0,
      totalSuggestions: 0
    };
    
    return res.json({
      success: true,
      stats: {
        totalReviews: result.totalReviews,
        totalIssues: result.totalIssues,
        totalSuggestions: result.totalSuggestions
      }
    })
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user._id;
    const limit = parseInt(req.query.limit) || 10;
    
    if(!userId) {
      return res.status(400).json({ success: false, message: 'user not authenticated' });
    }
    
    const reviews = await ReviewRequest.find({ requestBy: userId })
      .populate({
        path: 'snapShotId',
        select: "repoName languageStats meta createdAt"
      })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();
  
    //format the reviews for frontend
    const formattedReviews = reviews.map(review => ({
      id: review._id,
        repository: review.snapShotId?.repoName || 'Unknown Repository',
          branch: review.snapShotId?.meta?.branch || 'main',
            status: review.status,
              issues: review.result?.meta?.issuesFound || null,
                suggesstions: review.result?.meta?.suggestionsCount || null,
                  time: review.createdAt,
                    snapshot: review.snapShotId
    }));
    
    return res.json({
      success: true,
      reviews: formattedReviews
    });
    
  } catch (err) {
          return res.status(500).json({
              success: false,
              message: 'Server error',
              error: err.message
          });
  }
}
const mongoose = require('mongoose');

const reviewRequestSchema = new mongoose.Schema({
    snapShotId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RepoSnapShot',
        required: true,
    },
    requestBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false,
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'failed'],
        default: "pending"
    },
    result: {
        type: Object,
        default: null,
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("ReviewRequest", reviewRequestSchema);
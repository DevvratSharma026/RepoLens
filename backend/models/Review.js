const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
    },
    repoName: String,
    repoUrl: String,

    storageRef: {
        type: String
    },
    linterResults: {
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    aiSummary: {
        type: mongoose.Schema.Types.Mixed,
        defautl: {},
    },
    sampleFiles: [{
        path: String,
        snippet: String,
    },],

    status: {
        type: String,
        enum: ["pending", "running", "done", "failed"],
        default: "pending",
    },

    startedAt: Date,
    finishedAt: Date,

    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {versionKey: false});

module.exports = mongoose.model("Review", reviewSchema);
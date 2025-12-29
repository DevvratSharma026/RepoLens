const mongoose = require('mongoose');

const reposnapshotSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: false
    },
    repoName: {
        type: String,
        required: true,
    },
    s3Path: {
        type: String,
        required: true,
    },
    languageStats: {
        type: Object,
        default: {}
    },
    meta: {
        type: Object,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('RepoSnapShot', reposnapshotSchema);
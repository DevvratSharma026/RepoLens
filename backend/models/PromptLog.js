const mongoose = require('mongoose');

const promptLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
    },
    review: {
        type: mongoose.Schema.ObjectId,
        ref: "Review",
    },
    model: String,
    prompt: String,

    response: {
        type: mongoose.Schema.Types.Mixed,
    },

    tokens: Number,

    createAt: {
        type: Date,
        default: Date.now,
    },
}, {versionKey: false});

module.exports = mongoose.model("PromptLog", promptLogSchema)
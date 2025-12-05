const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref:"User",
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
        index: {expires: 0},
    },
    used: {
        type: Boolean,
        default: false,
    },
}, {versionKey: false});

module.exports = mongoose.model("Otp", otpSchema);
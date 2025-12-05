const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    firstName:{
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    roles: {
        type: [String],
        default: ["user"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastSeen: {
        type: Date,
    },

}, {versionKey: false});

module.exports = mongoose.model("User", userSchema);
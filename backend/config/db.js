const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log("MonogDB connected")
    } catch(err) {
        console.log("Connection error in DB", err.message);
        process.exit(1);
    }
}

module.exports = connectDB;
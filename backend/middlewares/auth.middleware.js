const jwt = require("jsonwebtoken");
const User = require("../models/User");
require('dotenv').config()

exports.auth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.startsWith('Bearer ');

        if(!token) {
            return res.status(401).json({
                success: false,
                messgae: "Unauthorized access"
            });
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const userId = decode.userId || decode.userid;

        if(!userId) {
            return res.status(401).json({ success: false, message: 'Invalid token payload' });
        }

        const user = await User.findById(userId).select("-password");
        if(!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            })
        }
        req.user = user;
        next();
    } catch(err) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        })
    }
}
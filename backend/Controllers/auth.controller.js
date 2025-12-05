const { bcryptjs } = require("bcryptjs");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const { issueOtpForUser, verifyOtpForUser } = require("../services/otp.service");
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword } = req.body;

        //validate fields
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(404).json({
                success: false,
                message: "All Fields are required",
            });
        }

        //check the password matches or not
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password are not same",
            });
        }

        //check if user already exists or not
        const existingUser = await User.findOne({ email });

        if (existingUser && existingUser.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please Login instead."
            });
        }

        //hash the password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;

        if (!existingUser) {
            user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isVerified: false
            });
        } else {
            // Logic for updating existing unverified user (if desired)
            existingUser.firstName = firstName;
            existingUser.lastName = lastName;
            existingUser.password = hashedPassword;
            user = await existingUser.save();
        }
        //call the otp service
        await issueOtpForUser(user._id, user.email);

        return res.status(200).json({
            success: true,
            message: "Otp sent successfully"
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot signup right now.',
            err: err.message
        });
    }
}

exports.verifyOtp = async (req, res) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "email and code is required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        //verify otp
        await verifyOtpForUser(user._id, code);

        //mark user verified
        user.isVerified = true;
        await user.save();

        return res.json({
            success: true,
            message: "Verified. You can login now"
        })
    } catch (err) {
        const status = err.status || 500;
        return res.status(status).json({ success: false, message: err.message || "Verification failed" });
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not found"
            });
        }
        if (!user.isVerified) {
            return res.status(404).json({
                success: false,
                message: "Please verify your email via OTP first"
            });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials.',
            });
        }

        const payload = {
            email: user.email,
            userId: user._id
        }
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: '24h' });

        const safeUser = user.toObject();
        delete safeUser.password;
        delete safeUser.__v;

        const isProd = process.env.NDOE_ENV === 'production';
        const cookieOptions = {
            expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? 'none' : 'lax'
        };

        res
            .cookie('token', token, cookieOptions)
            .status(200).json({
                success: true,
                token,
                user: safeUser,
                message: "User login successfull",
            });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot login right now.',
        });
    }
}
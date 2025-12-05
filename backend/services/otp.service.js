const nodemailer = require('nodemailer');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { now } = require('mongoose');
require('dotenv').config();

let MAIL_FROM = process.env.MAIL_USER;
let OTP_TTL_MIN = Number(process.env.MAIL_USER || 5);
let OTP_RATE_LIMIT = Number(process.env.MAIL_USER || 3);

//generate the 6 digit OTP
function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

async function createTransporter() {
    return nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined,
        secure: process.env.MAIL_SECURE === "true", // true for 465
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        }
    });
}


async function issueOtpForUser(userId, email) {
    if(!userId || !email) throw new Error("userid or email not found");

    //ensure user exists
    const user = await User.findById(userId);
    if(!user) throw new Error("User not found");

    //simple rate limit : count OTPs in last hour
    const oneHourAgo = new Date(Date.now() - 60*60*1000);
    const recentCount = await Otp.countDocuments({user: userId, createdAT: {$gte: oneHourAgo}});

    if(recentCount >= OTP_RATE_LIMIT) {
        const err = new Error("Too many request for OTP. Try again later");
        err.status = 429;
        throw err;
    }
    
    //generate otp
    const code = generateOtp();
    
    const otpDoc = await Otp.create({
        user: userId,
        code,
        expiresAt,
        used: false,
        createdAT: now,
    });
    
    //prepare email content
    const subject = "Your verification OTP";
    const text = `Your verification code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`;
    const html = `<p>Your verification code is <strong>${code}</strong></p>`;
    
    //attempt to send the mail
    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: MAIL_FROM,
            to: email,
            subject,
            text,
            html,
        });
    } catch(err) {
        console.warn("OTP email send failed, falling back to console. DEV OTP: ", code);
    }
    
    //return success
    const result = {success: true};
    if (process.env.NODE_ENV !== "production") result.devCode = code;
    
    return result;
}

module.exports = {issueOtpForUser};
const User = require("../models/User");
const Otp = require("../models/Otp");
const { Resend } = require("resend");

let MAIL_FROM = process.env.MAIL_USER;
let OTP_TTL_MIN = Number(process.env.OTP_TTL_MIN || 5);
let OTP_RATE_LIMIT = Number(process.env.OTP_RATE_LIMIT || 3);
const resend = new Resend(process.env.RESEND_API_KEY)

//generate the 6 digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}



async function issueOtpForUser(userId, email) {
  if (!userId || !email) throw new Error("userid or email not found");

  //ensure user exists
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  //simple rate limit : count OTPs in last hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
  const recentCount = await Otp.countDocuments({
    user: userId,
    createdAt: { $gte: oneHourAgo },
  });

  if (recentCount >= OTP_RATE_LIMIT) {
    const err = new Error("Too many request for OTP. Try again later");
    err.status = 429;
    throw err;
  }

  //generate otp
  const code = generateOtp();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + OTP_TTL_MIN * 60 * 1000);

  const otpDoc = await Otp.create({
    user: userId,
    code,
    expiresAt,
    used: false,
    createdAt: now,
  });

  //prepare email content
  const subject = "Your verification OTP";
  const text = `Your verification code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); border: 1px solid #e5e7eb; }
    .header { background-color: #4f46e5; padding: 32px; text-align: center; }
    .content { padding: 40px; text-align: center; }
    .logo { font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: -1px; }
    .title { font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 16px; }
    .text { font-size: 16px; color: #4b5563; line-height: 24px; margin-bottom: 32px; }
    .code-container { background-color: #f3f4f6; border-radius: 8px; padding: 24px; margin-bottom: 32px; border: 1px dashed #d1d5db; }
    .code { font-family: 'Monaco', 'Consolas', monospace; font-size: 36px; font-weight: 800; color: #4f46e5; letter-spacing: 8px; }
    .footer { padding: 32px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #9ca3af; }
    .link { color: #4f46e5; text-decoration: none; font-weight: 500; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Repo Lens AI</div>
    </div>
    <div class="content">
      <h1 class="title">Verify your email address</h1>
      <p class="text">Thanks for signing up! To finish creating your account, please enter the following verification code in your browser:</p>

      <div class="code-container">
        <span class="code">${code}</span>
      </div>

      <p class="text" style="font-size: 14px;">This code will expire in 5 minutes. If you didn't request this email, you can safely ignore it.</p>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Your Company Inc. All rights reserved.</p>
      <p>
        <a href="#" class="link">Privacy Policy</a> •
        <a href="#" class="link">Support</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

  //attempt to send the mail
  try {
    await resend.emails.send({
      from: "Repo Lens <onboarding@repolens.ai>", // works without domain setup
      to: email,
      subject,
      html,
    });
  } catch (err) {
    console.warn(
      "OTP email send failed, falling back to console. DEV OTP:",
      code
    );
    console.error("Resend error:", err);
  }


  //return success
  const result = { success: true };
  if (process.env.NODE_ENV !== "production") result.devCode = code;

  return result;
}

async function verifyOtpForUser(userId, code) {
  if (!userId || !code) {
    throw new Error("userId and code are required");
  }

  const otpDoc = await Otp.findOne({ user: userId, used: false }).sort({
    createdAt: -1,
  });

  if (!otpDoc) {
    const err = new Error("Invalid or expired OTP code");
    err.status = 400;
    throw err;
  }
  if (otpDoc.expiresAt < new Date()) {
    const err = new Error("OTP has expired");
    err.status = 400;
    throw err;
  }
  if (code !== otpDoc.code) {
    const err = new Error("Invalid OTP");
    err.status = 400;
    throw err;
  }

  otpDoc.used = true;
  await otpDoc.save();

  return true;
}

module.exports = { issueOtpForUser, verifyOtpForUser };

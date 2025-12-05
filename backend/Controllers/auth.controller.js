const { default: bcrypt } = require("bcryptjs");
const User = require("../models/User");
const { issueOtpForUser } = require("../services/otp.service");

exports.singup = async (req, res) => {
    try {
        const {firstName, lastName, email, password, confirmPassword} = req.body;

        //validate fields
        if(!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(404).json({
                success: false,
                message: "All Fields are required",
            });
        }

        //check the password matches or not
        if(password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: "Password and confirm password are not same",
            });
        }

        //check if user already exists or not
        const existingUser = await User.findOne({email});

        if(existingUser && existingUser.isVerified) {
            return res.status(400).json({
                success: false,
                message: "User already exists. Please Login instead."
            });
        }

        //hash the password
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        let user;

        if(!existingUser) {
            user = await User.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                isVerified: false
            });
        } else {
            //update the unverified user info
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

    } catch(err) {
        return res.status(500).json({
            success: false,
            message: 'Cannot signup right now.'
        });
    }
}
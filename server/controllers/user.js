import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import sendEmail from "../utills/sendEmail.js";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

import User from "../models/userModel.js";
import Profile from "../models/profileModel.js";

//SIGNUP USER
export const signup = asyncHandler(async (req, res) => {
    const { email, password, confirmPassword, firstName, lastName } = req.body;

    //validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Please fill all required fields");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 characters");
    }

    //check if user email already exists
    const existingUser = await User.findOne({ email });
    //get userProfile and append to login auth detail
    const userProfile = await Profile.findOne({ userId: existingUser?._id });
    console.log("profile=" + userProfile);

    if (existingUser) {
        res.status(400);
        throw new Error("User already exist");
    }

    if (password !== confirmPassword) {
        res.status(400);
        throw new Error("Passwords don't match");
    }

    // const hashedPassword = await bcrypt.hash(password,12);

    const result = await User.create({
        email,
        password,
        name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, SECRET, { expiresIn: "1h" });

    //Sent HTTP only cookie
    res.cookie("token", token, {
        // expires: new Date(Date.now() + 1000 * 86400), // 1 Day
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 3600), // 1 Hour
    });

    if (result) {
        res.status(200).json({ result, userProfile, token });
    } else {
        res.status(400);
        throw new Error("Something went wrong");
    }
});

//SIGNIN USER
export const signin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    //validation
    if (!email || !password) {
        res.status(400);
        throw new Error("Please add email and password");
    }

    //check user exists or not
    const existingUser = await User.findOne({ email });
    //get userProfile and append to login auth detail
    const userProfile = await Profile.findOne({ userId: existingUser?._id });
    console.log("profile=" + userProfile);

    if (!existingUser) {
        res.status(400);
        throw new Error("User not found, please signup");
    }

    //user exist, compare password
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

    //If credentials are valid, create a token for the user
    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SECRET, { expiresIn: "1h" });

    //Sent HTTP only cookie
    res.cookie("token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 3600), // 1 Day
    });

    console.log(token);

    //Then send the token to the client/frontend
    if (existingUser && isPasswordCorrect) {
        res.status(200).json({
            result: existingUser,
            userProfile,
            token,
        });
    } else {
        res.status(400);
        throw new Error("Invalid Email or Password");
    }
});

//LOGOUT USER
export const logoutUser = asyncHandler(async (req, res, next) => {
    res.cookie("token", "", {
        // path: "/",
        httpOnly: true,
        expires: new Date(0), //current second
        // sameSite: "none",
        // secure: true,
    });
    return res.status(200).json({ message: "Successfully Logged Out..." });
});

//GET LOGIN STATUS
export const getLoginStatus = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    // console.log("token from login status "+token)

    if (!token) {
        return res.json(false);
    }

    //verify token
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    if (verified) {
        return res.json(true);
    }
    return res.json(false);
});

//FORGOT PASSWORD
export const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        res.status(404);
        throw new Error("User does not exist");
    }

    //Create reset token
    let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
    console.log(resetToken);

    //Hash token before saving to DB
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    //Construct Reset Url
    // const resetUrl=`${process.env.FRONTEND_URL}/reset/${resetToken}`;

    user.resetToken = hashedToken;
    user.expiresToken = Date.now() + 1 * 60 * 60 * 1000; // 1 Hour

    const baseUrl = process.env.BASE_URL;
    // const baseUrl = "http://localhost:3000"

    await user.save();

    //Reset Email
    const message = `
        <h2>Hello ${user.name}</h2>
        <p>You requested for password reset from Arc Invoicing application</p>
        <p>This reset link is valid for only 30 minutes.</p>
        <h5>Please click this <a href="${baseUrl}/reset/${resetToken}">link</a> to reset your password</h5>
        <p>Link not clickable?, copy and paste the following url in your address bar.</p>
        <p>${baseUrl}/reset/${resetToken}</p>
        <P>If this was a mistake, just ignore this email and nothing will happen.</P>
        <p>Regards...</p>
        <p>Accountill Team</p>
        `;
    const subject = "Password Reset Request";
    const send_to = user.email;
    const sent_from = process.env.SMTP_USER;

    try {
        await sendEmail(subject, message, send_to, sent_from);
        res.status(200).json({ success: true, message: "Reset Email Sent..." });
    } catch (error) {
        console.log(error);
        res.status(500);
        throw new Error("Email not sent, please try again");
    }
});

export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body;
    const sentToken = req.body.token;

    if (!password) {
        res.status(400);
        throw new Error("Please provide new password");
    }
    if (password.length < 6) {
        res.status(400);
        throw new Error("Password must be up to 6 character");
    }

    //Hash token, then compare to Token in DB
    const hashedToken = crypto.createHash("sha256").update(sentToken).digest("hex");

    //find user
    const user = await User.findOne({ resetToken: hashedToken, expiresToken: { $gt: Date.now() } });

    if (!user) {
        res.status(404);
        throw new Error("Invalid or Expired Token");
    }

    user.password = password;
    user.resetToken = undefined;
    user.expireToken = undefined;

    await user.save();
    res.status(200).json({
        message: "Password updated Success, Please Login...",
    });
});

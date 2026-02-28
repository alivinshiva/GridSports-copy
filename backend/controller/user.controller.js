import userModel from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateOTP } from "../service/otp.generator.js";
import { sendCookies } from "../middleware/send.cookies.js";
import { sendPhoneForgotOtp, sendPhoneVerificationOtp } from "../service/twilio.service.js";
import { SALT_ROUNDS, OTP_EXPIRY_TIME, COOKIE_NAME } from "../config/constants.js";



// @desc Register new user
// @route POST /api/v1/user/signup
// @access Public

export const signupController = async (req, res) => {
    try {
        const { name, phoneNumber, password } = req.body;

        const userExist = await userModel.findOne({ phoneNumber });

        if (userExist) {
            if (userExist.isVerifiedPhone) {
                return res.status(400).json({ success: false, message: "User already exists" });
            };

            if (userExist.name !== name) {
                userExist.name = name;
            };

            const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

            userExist.password = hashPassword;


            const otp = generateOTP();

            userExist.verificationTokenPhone = otp;
            userExist.verificationTokenExpiresAtPhone = Date.now() + OTP_EXPIRY_TIME;

            userExist.lastLogin = new Date();

            await userExist.save();

            await sendCookies(userExist._id, res);

            try {
                await sendPhoneVerificationOtp(userExist.phoneNumber, userExist.name, otp);
            } catch (error) {
                return res
                    .status(500)
                    .json({
                        success: false,
                        message: "Failed to send Verification otp on mobile",
                        error: error.message
                    });
            };

            return res.status(200).json({ success: true, message: "OTP sent successfully" });
        };

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        const otp = generateOTP();

        const newUser = new userModel({
            name,
            phoneNumber,
            password: hashPassword,
            verificationTokenPhone: otp,
            verificationTokenExpiresAtPhone: Date.now() + OTP_EXPIRY_TIME,
        });

        await newUser.save();

        await sendCookies(newUser._id, res);

        try {
            await sendPhoneVerificationOtp(newUser.phoneNumber, newUser.name, otp);
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Verification otp on mobile",
                    error: error.message
                });
        };

        return res.status(201).json({ success: true, message: "OTP sent successfully", name: newUser.name });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// @desc Verify Phone Number
// @route POST /api/v1/user/verify-phone
// @access Public

export const verifyPhoneController = async (req, res) => {
    try {
        const { code } = req.body;

        const codeExist = await userModel.findOne({ verificationTokenPhone: code, verificationTokenExpiresAtPhone: { $gt: Date.now() } });

        if (!codeExist) {
            return res.status(400).json({ success: false, message: "Invalid credentials or expired OTP" });
        };

        codeExist.isVerifiedPhone = true;
        codeExist.verificationTokenPhone = undefined;
        codeExist.verificationTokenExpiresAtPhone = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        return res.status(200).json({ success: true, message: "Phone number verified successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// @desc Login-phoneNumber
// @route POST /api/v1/user/login-phone
// @access Public

export const loginPhoneNumberController = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;

        const userExist = await userModel.findOne({ phoneNumber });

        if (!userExist) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        };

        if (!userExist.isVerifiedPhone) {
            return res.status(400).json({ success: false, message: "Please verify your phone number to login" });
        };

        const isPasswordMatch = await bcrypt.compare(password, userExist.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        };

        userExist.lastLogin = new Date();

        await userExist.save();

        await sendCookies(userExist._id, res);

        return res.status(200).json({ success: true, message: "Login successfully", name: userExist.name, email: userExist.email, role: userExist.isAdmin });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// @desc Change Password
// @route PUT /api/v1/user/change-password
// @access Private

export const changePasswordController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { oldPassword, newPassword } = req.body;

        const userExist = await userModel.findById(loggedInUser);

        if (!userExist) {
            return res.status(400).json({ success: false, message: "User not exist" });
        };

        if (!userExist.isVerifiedPhone) {
            return res.status(400).json({ success: false, message: "Please verify your phone number first" });
        };

        const isPasswordMatch = await bcrypt.compare(oldPassword, userExist.password);

        if (!isPasswordMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        };

        const hashPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

        userExist.password = hashPassword;

        await userExist.save();

        return res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// @desc Forgot Password
// @route PUT /api/v1/user/forgot-password
// @access Public

export const forgotPasswordController = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        const userExist = await userModel.findOne({ phoneNumber });

        if (!userExist) {
            return res.status(400).json({ success: false, message: "User not exist" });
        };

        if (!userExist.isVerifiedPhone) {
            return res.status(400).json({ success: false, message: "Please verify your phone number first" });
        };

        const otp = generateOTP();

        userExist.resetPasswordTokenPhone = otp;
        userExist.resetPasswordTokenPhoneExpiresAt = Date.now() + OTP_EXPIRY_TIME;

        await userExist.save();

        try {
            await sendPhoneForgotOtp(userExist.phoneNumber, userExist.name, otp);
        } catch (error) {
            return res
                .status(500)
                .json({
                    success: false,
                    message: "Failed to send Forgot Password otp on mobile",
                    error: error.message
                });
        };

        return res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// desc Verify Forgot Password Otp
// route PUT /api/v1/user/reset-password
// access Public

export const verifyForgotPasswordOtpController = async (req, res) => {
    try {
        const { code, password } = req.body;

        const codeExist = await userModel.findOne({ resetPasswordTokenPhone: code, resetPasswordTokenPhoneExpiresAt: { $gt: Date.now() } });

        if (!codeExist) {
            return res.status(400).json({ success: false, message: "Invalid credentials or OTP expired" });
        };

        const hashPassword = await bcrypt.hash(password, SALT_ROUNDS);

        codeExist.password = hashPassword;
        codeExist.lastLogin = new Date();

        codeExist.isVerifiedPhone = true;
        codeExist.resetPasswordTokenPhone = undefined;
        codeExist.resetPasswordTokenPhoneExpiresAt = undefined;

        await codeExist.save();

        await sendCookies(codeExist._id, res);

        return res.status(200).json({ success: true, message: "Password changed successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc Logout User
// route POST /api/v1/user/logout
// access Private

export const logoutController = async (req, res) => {
    try {
        res.clearCookie(COOKIE_NAME, "", { maxAge: 0 });
        return res.status(200).json({ success: true, message: "Logout successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
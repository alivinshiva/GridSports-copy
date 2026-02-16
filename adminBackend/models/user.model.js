import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerifiedPhone: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetPasswordTokenPhone: {
        type: String
    },
    resetPasswordTokenPhoneExpiresAt: {
        type: Date
    },
    verificationTokenPhone: {
        type: String
    },
    verificationTokenExpiresAtPhone: {
        type: Date
    },
}, { timestamps: true, minimize: true });

export default mongoose.model("User", userSchema);
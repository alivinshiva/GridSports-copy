import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { COOKIE_NAME } from "../config/constants.js";

export const verifyCookies = async (req, res, next) => {
    try {
        const token = req.cookies[COOKIE_NAME];

        if (!token) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Unauthorized User"
                });
        };

        const decode = jwt.verify(token, process.env.JWT_TOKEN);

        if (!decode) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: "Authorization failed"
                });
        };

        const user = await userModel.findById(decode.userId).select("-password");

        if (!user) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: "User not found"
                });
        };

        if (!user.isVerifiedPhone) {
            return res.status(401).json({
                success: false,
                message: "Please verify your phone number before proceeding."
            });
        };

        req.user = user;

        next();

    } catch (error) {
        // Pass JWT errors to error handler
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Invalid or expired token" });
        }
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
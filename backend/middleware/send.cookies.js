import jwt from "jsonwebtoken";
import { COOKIE_NAME, COOKIE_MAX_AGE, JWT_EXPIRES_IN } from "../config/constants.js";

export const sendCookies = async (userId, res) => {
    try {
        const token = jwt.sign(
            { userId },
            process.env.JWT_TOKEN,
            { expiresIn: JWT_EXPIRES_IN }
        );

        const cookieOptions = {
            maxAge: COOKIE_MAX_AGE,
            httpOnly: true, // Prevent XSS attacks
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
            secure: process.env.NODE_ENV === "production" // HTTPS only in production
        };

        res.cookie(COOKIE_NAME, token, cookieOptions);
    }
    catch (error) {
        return res.status(500).json({
            success: false, message: "Internal Server Error", error: error.message,
        });
    };
};
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.config.js";
import { validateEnv } from "./config/env.validation.js";
import { connectDb } from "./config/db.connect.js";
import userRouter from "./router/user.router.js";
import profileRouter from "./router/profile.router.js";
import adminRouter from "./router/admin.router.js";
import leaderboardRouter from "./router/leaderboard.router.js";
import notificationRouter from "./router/notification.router.js";
import { errorHandler, notFoundHandler } from "./middleware/error.handler.js";

dotenv.config();

// Validate environment variables before starting server
validateEnv();

const app = express();

const PORT = process.env.PORT || 5000;

connectDb();

// Security middleware
app.use(helmet());

app.use(cookieParser());

// Remove redundant body-parser (express.json() is sufficient)
app.use(express.json({ limit: '10mb' })); // Add size limit for security
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// CORS configuration using environment variable
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:5173", "http://localhost:5174"];
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);

        const isDevLocalhost = process.env.NODE_ENV !== 'production' && /^http:\/\/localhost:\d+$/.test(origin);
        const isAllowed = allowedOrigins.includes(origin);

        if (isDevLocalhost || isAllowed) {
            return callback(null, true);
        }

        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: "GET,POST,PUT,DELETE",
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 requests per windowMs
    message: { success: false, message: 'Too many attempts, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

// General rate limiter for all routes
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(generalLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Server is healthy",
        timestamp: new Date().toISOString()
    });
});


app.get("/", (req, res) => {
    res.send("Server Working");
});

// Apply rate limiter to auth routes
app.use("/api/v1/user", authLimiter, userRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/leaderboard", leaderboardRouter);
app.use("/api/v1/notification", notificationRouter);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});

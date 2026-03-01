import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import logger from "./config/logger.config.js";
import { validateEnv } from "./config/env.validation.js";
import { connectDb } from "./config/db.connect.js";
import weekendRouter from "./router/weekend.router.js";
import challengeRouter from "./router/challenge.router.js";
import submissionRouter from "./router/submission.router.js";
import heroRouter from "./router/hero.router.js";
import tribeRouter from "./router/tribe.router.js";
import tagRouter from "./router/tag.router.js";
import commentRouter from "./router/comment.router.js";
import { errorHandler, notFoundHandler } from "./middleware/error.handler.js";

dotenv.config();

// Validate environment variables before starting server
validateEnv();

const app = express();
const PORT = process.env.PORT || 5001;

connectDb();

// Security middleware
app.use(helmet());

app.use(cookieParser());

// Remove redundant body-parser (express.json() is sufficient)
app.use(express.json({ limit: '50mb' })); // Higher limit for media uploads
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Rate limiter for admin operations
const adminLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 1000, // Development-friendly limit for admin operations
    message: { success: false, message: 'Too many requests, please try again later' },
    standardHeaders: true,
    legacyHeaders: false,
});

app.use(adminLimiter);

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        success: true, 
        message: "Admin Server is healthy",
        timestamp: new Date().toISOString()
    });
});

app.get("/", (req, res) => {
    res.send("Admin Server Working");
});

app.use("/api/v1/weekend", weekendRouter);
app.use("/api/v1/challenge", challengeRouter);
app.use("/api/v1/submission", submissionRouter);
app.use("/api/v1/hero", heroRouter);
app.use("/api/v1/tribe", tribeRouter);
app.use("/api/v1/tag", tagRouter);
app.use("/api/v1/comment", commentRouter);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Global error handler - must be last
app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Admin Server running on port ${PORT}`);
    logger.info(`Environment: ${process.env.NODE_ENV}`);
});

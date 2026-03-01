import mongoose from "mongoose";
import logger from "./logger.config.js";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        logger.info("Database Connected Successfully");
    } catch (error) {
        logger.error(`Database Connection Error: ${error.message}`);
        process.exit(1); // Exit if database connection fails
    }
};
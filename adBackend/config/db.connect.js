import mongoose from "mongoose";

export const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Admin Database Connected Successfully");
    } catch (error) {
        console.error("❌ Admin Database Connection Error:", error.message);
        process.exit(1); // Exit if database connection fails
    }
};   
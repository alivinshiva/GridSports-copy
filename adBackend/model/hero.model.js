import mongoose from "mongoose";

const heroSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imageId: {
        type: String, // Cloudinary public_id
        required: true
    }
}, { timestamps: true });

export default mongoose.model("Hero", heroSchema);

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tribe: {
        type: String,
        enum: ["ORANGE TRIBE", "SCARLET TRIBE", "AZURE TRIBE", "SILVER TRIBE", "GREEN TRIBE", "BLUE TRIBE", "PINK TRIBE", "WHITE TRIBE", "CARBON TRIBE", "GRAPHITE TRIBE", "ONYX TRIBE"],
        required: true
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    },
    switches: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);


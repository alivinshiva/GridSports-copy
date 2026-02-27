import mongoose from "mongoose";

const tribeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        enum: ["ORANGE TRIBE", "SCARLET TRIBE", "AZURE TRIBE", "SILVER TRIBE", "GREEN TRIBE", "BLUE TRIBE", "PINK TRIBE", "WHITE TRIBE", "CARBON TRIBE", "GRAPHITE TRIBE", "ONYX TRIBE"]
    },
    totalPoints: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Tribe", tribeSchema);

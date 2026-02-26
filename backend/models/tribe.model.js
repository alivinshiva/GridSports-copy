import mongoose from "mongoose";

const tribeSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
        enum: ["IRON TRIBE", "ROYAL TRIBE", "INDIGO TRIBE", "EMERALD TRIBE", "ORANGE TRIBE", "SCARLET TRIBE", "CRIMSON TRIBE", "PLATINUM TRIBE", "TITANIUM TRIBE", "AZURE TRIBE", "SILVER TRIBE"]
    },
    totalPoints: {
        type: Number,
        default: 0
    },
    previousRank: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("Tribe", tribeSchema);

import mongoose from "mongoose";

const profileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tribe: {
        type: String,
        enum: ["IRON TRIBE", "ROYAL TRIBE", "INDIGO TRIBE", "EMERALD TRIBE", "ORANGE TRIBE", "SCARLET TRIBE", "CRIMSON TRIBE", "PLATINUM TRIBE", "TITANIUM TRIBE", "AZURE TRIBE"],
        required: true
    },
    imageUrl: {
        type: String
    },
    imageId: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Profile", profileSchema);


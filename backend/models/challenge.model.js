import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    challengeId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    raceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Race",
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String, // Creator Prompt
        required: true
    },
    rules: {
        type: String, // Rules and timing instructions
        default: ""
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["Photo", "Video", "Mixed", "Photo + text", "Video (max 8s)", "Video (20–30s)", "Photo template (Top 10) or 10s video", "Video (7–12s)", "Video (12–18s)", "Photo + text (≤10 words) OR 6–8s video"], // Expanded based on prompt
        required: true
    },
    openTime: {
        type: Date,
        required: true
    },
    closeTime: {
        type: Date,
        required: true
    },
    raterTags: [{
        type: String,
        trim: true
    }],
    shareHook: {
        type: String,
        trim: true
    },
    adminStatus: {
        type: String,
        enum: ["Draft", "Published", "Archived"],
        default: "Draft"
    }
}, { timestamps: true });

export default mongoose.model("Challenge", challengeSchema);

import mongoose from "mongoose";

const challengeSchema = new mongoose.Schema({
    weekend: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "weekend",
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    imageId: {
        type: String,
        required: true
    },
    startAt: {
        type: Date,
        required: true
    },
    endAt: {
        type: Date,
        required: true
    },
    round: {
        type: Number,
        required: true,
    },
    rules: [
        {
            type: String,
            trim: true
        }
    ],
    tags: [
        {
            type: String,
            trim: true
        }
    ],
    season: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ["PHOTO", "VIDEO", "TEXT", "MIXED"],
        default: "PHOTO"
    },
    status: {
        type: String,
        enum: ["UPCOMING", "ACTIVE", "CLOSED"],
        default: "UPCOMING"
    },
    scoringType: {
        type: String,
        enum: ["SIMPLE", "DETAILED"],
        default: "SIMPLE"
    },
    parameters: [
        {
            name: { type: String, required: true },
            maxPoints: { type: Number, required: true }
        }
    ],
    comments: [
        {
            type: String,
            trim: true
        }
    ]
}, { timestamps: true });

export default mongoose.model("challenge", challengeSchema);

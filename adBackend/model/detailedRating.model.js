import mongoose from "mongoose";

const detailedRatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "challenge",
        required: true
    },
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "submission",
        required: true
    },
    ratings: [
        {
            parameterName: { type: String, required: true },
            score: { type: Number, required: true }
        }
    ],
    totalScore: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Ensure a user can only have one detailed rating per submission
detailedRatingSchema.index({ user: 1, submission: 1 }, { unique: true });

export default mongoose.model("detailedRating", detailedRatingSchema);

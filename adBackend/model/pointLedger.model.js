import mongoose from "mongoose";

const pointLedgerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    tribe: {
        type: String,
        required: true
    },
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "challenge", // or challenge
    },
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "submission"
    },
    actionType: {
        type: String,
        required: true,
        // Examples: UPLOAD, RATE_SIMPLE_LIKE, RATE_SIMPLE_LOVE, RATE_SIMPLE_DISLIKE, SHARE
    },
    basePoints: {
        type: Number,
        required: true
    },
    multiplier: {
        type: Number,
        default: 1.0
    },
    finalPoints: {
        type: Number,
        required: true
    }
}, { timestamps: true });

// Prevent duplicate points for the same action per challenge/submission for a user
// e.g., a user can only rate "LOVE" on a specific submission once.
// We'll enforce logic in the service but a partial index could help if actionTypes are strictly defined per item.
export default mongoose.model("PointLedger", pointLedgerSchema);

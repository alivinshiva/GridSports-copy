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
        ref: "challenge"
    },
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "submission"
    },
    actionType: {
        type: String,
        required: true
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

export default mongoose.model("PointLedger", pointLedgerSchema);

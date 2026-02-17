import mongoose from "mongoose";
/* =========================
   Weekend Main Schema
========================= */

const weekendSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    season: {
        type: Number,
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
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ["UPCOMING", "ACTIVE", "COMPLETED"],
        default: "UPCOMING"
    },
    count: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

export default mongoose.model("weekend", weekendSchema);


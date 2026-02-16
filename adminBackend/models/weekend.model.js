import mongoose from "mongoose";

const weekendSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    round: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Weekend", weekendSchema);

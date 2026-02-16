import mongoose from "mongoose";

const raceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    weekendId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Weekend",
        required: true
    },
    round: {
        type: String,
        required: true,
        trim: true
    },
    dates: {
        practice: { type: Date, required: true },
        qualifying: { type: Date, required: true },
        race: { type: Date, required: true }
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("Race", raceSchema);

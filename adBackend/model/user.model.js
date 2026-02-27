import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
    },
    tribe: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tribe"
    }
}, { timestamps: true });

export default mongoose.model("user", userSchema);

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true
    }
}, { timestamps: true });

export default mongoose.model("comment", commentSchema);

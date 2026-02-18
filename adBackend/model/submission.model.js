import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
    challenge: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "challenge",
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    mediaUrl: {
        type: String,
        required: true
    },
    mediaId: {
        type: String,
        required: true
    },
    mediaType: {
        type: String,
        enum: ['image', 'video'],
        required: true
    }
}, { timestamps: true });

export default mongoose.model("submission", submissionSchema);

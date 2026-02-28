import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., 'CHALLENGE_LIVE', 'WEEKEND_LIVE', 'GENERAL'
        default: 'GENERAL'
    },
    entityId: {
        type: mongoose.Schema.Types.ObjectId,
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// TTL Index: Automatically delete documents 3 days (259200 seconds) after they are created
notificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 259200 });

export default mongoose.model("Notification", notificationSchema);

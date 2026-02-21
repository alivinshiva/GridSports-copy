import mongoose from "mongoose";
import notificationModel from "../model/notification.model.js";

/**
 * Distribute a notification to all users in the system.
 * @param {string} title 
 * @param {string} message 
 * @param {string} type - 'CHALLENGE_LIVE', 'WEEKEND_LIVE'
 * @param {string} entityId - Reference ID of the challenge or weekend
 */
export const distributeNotificationToAllUsers = async (title, message, type, entityId) => {
    try {
        // Fetch all user IDs directly using the base connection
        const users = await mongoose.connection.db.collection('users').find({}, { projection: { _id: 1 } }).toArray();

        // Create notification documents
        const notifications = users.map(user => ({
            user: user._id,
            title,
            message,
            type,
            entityId,
            isRead: false
        }));

        if (notifications.length > 0) {
            await notificationModel.insertMany(notifications);
            console.log(`Successfully distributed ${notifications.length} notifications for ${type}`);
        }
    } catch (error) {
        console.error("Error distributing notifications:", error);
    }
};

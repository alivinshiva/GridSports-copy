import notificationModel from "../models/notification.model.js";

// desc get all notifications for a user
// method GET
// path /api/v1/notification/
// access private
export const getUserNotifications = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const notifications = await notificationModel.find({ user: loggedInUser }).sort({ createdAt: -1 }).limit(20);

        return res.status(200).json({ success: true, message: "Notifications fetched successfully", data: notifications });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc mark a notification as read (and delete it per requirements)
// method POST
// path /api/v1/notification/:id/read
// access private
export const markNotificationRead = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUser = req.user;

        // Ensure user can only delete their own notifications
        const notification = await notificationModel.findOneAndDelete({ _id: id, user: loggedInUser });
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        return res.status(200).json({ success: true, message: "Notification marked read and deleted" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc delete a notification explicitly
// method DELETE
// path /api/v1/notification/:id
// access private
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const loggedInUser = req.user;

        const notification = await notificationModel.findOneAndDelete({ _id: id, user: loggedInUser });
        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        return res.status(200).json({ success: true, message: "Notification deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

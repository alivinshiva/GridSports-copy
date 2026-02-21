import express from "express";
import { deleteNotification, getUserNotifications, markNotificationRead } from "../controller/notification.controller.js";
import { verifyCookies } from "../middleware/verify.cookie.js";

const notificationRouter = express.Router();

// all routes require auth
notificationRouter.use(verifyCookies);

notificationRouter.route("/").get(getUserNotifications);
notificationRouter.route("/:id/read").post(markNotificationRead);
notificationRouter.route("/:id").delete(deleteNotification);

export default notificationRouter;

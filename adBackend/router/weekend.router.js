import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createWeekendMiddleware, updateWeekendMiddleware } from "../middleware/weekend.middleware.js";
import { createWeekendController, deleteWeekendController, getAllActiveWeekendController, getAllUpcomingWeekendController, getAllWeekendsController, getWeekendByIdController, updateWeekendController } from "../controller/weekend.controller.js";

const weekendRouter = express.Router();

weekendRouter.route("/add").post(upload.single("image"), createWeekendMiddleware, createWeekendController);
weekendRouter.route("/all").get(getAllWeekendsController);
weekendRouter.route("/details/:id").get(getWeekendByIdController);
weekendRouter.route("/update/:id").put(updateWeekendMiddleware, updateWeekendController);
weekendRouter.route("/delete/:id").delete(deleteWeekendController);
weekendRouter.route("/active").get(getAllActiveWeekendController);
weekendRouter.route("/upcoming").get(getAllUpcomingWeekendController);

export default weekendRouter;
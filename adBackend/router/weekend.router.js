import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createWeekendMiddleware, updateWeekendMiddleware } from "../middleware/weekend.middleware.js";
import { createWeekendController, getAllWeekendsController, getWeekendByIdController, updateWeekendController } from "../controller/weekend.controller.js";

const weekendRouter = express.Router();

weekendRouter.route("/add").post(upload.single("image"), createWeekendMiddleware, createWeekendController);
weekendRouter.route("/all").get(getAllWeekendsController);
weekendRouter.route("/details/:id").get(getWeekendByIdController);
weekendRouter.route("/update/:id").put(updateWeekendMiddleware, updateWeekendController);

export default weekendRouter;
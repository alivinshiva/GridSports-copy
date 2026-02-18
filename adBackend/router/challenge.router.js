import express from "express";
import { createChallangeController, getAllChallengesController, getSingleChallengeController, updateChallengeController, deleteChallengeController, getChallengesByWeekendIdController } from "../controller/challenge.controller.js";
import { createChallengeMiddleware, updateChallengeMiddleware } from "../middleware/challange.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const challengeRouter = express.Router();

challengeRouter.route("/add").post(upload.single("image"), createChallengeMiddleware, createChallangeController);
challengeRouter.route("/all").get(getAllChallengesController);
challengeRouter.route("/details/:id").get(getSingleChallengeController);
challengeRouter.route("/update/:id").put(updateChallengeMiddleware, updateChallengeController);
challengeRouter.route("/delete/:id").delete(deleteChallengeController);
challengeRouter.route("/weekend/:weekendId").get(getChallengesByWeekendIdController);

export default challengeRouter;

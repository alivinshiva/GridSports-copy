import express from "express";
import { createChallangeController, getAllChallengesController, getSingleChallengeController, updateChallengeController, deleteChallengeController } from "../controller/challenge.controller.js";
import { createChallengeMiddleware } from "../middleware/challange.middleware.js";

const challengeRouter = express.Router();

challengeRouter.route("/add").post(createChallengeMiddleware, createChallangeController);
challengeRouter.route("/all").get(getAllChallengesController);
challengeRouter.route("/details/:id").get(getSingleChallengeController);
challengeRouter.route("/update/:id").put(updateChallengeController);
challengeRouter.route("/delete/:id").delete(deleteChallengeController);

export default challengeRouter;

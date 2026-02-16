import express from "express";
import {
    createChallengeController,
    createRaceController,
    getAllRacesController,
    getChallengesByRaceController,
    createWeekendController,
    getAllWeekendsController
} from "../controller/admin.controller.js";

import upload from "../middleware/upload.js";

const adminRouter = express.Router();

adminRouter.route("/create-weekend").post(upload.single("image"), createWeekendController);
adminRouter.route("/weekends").get(getAllWeekendsController);

adminRouter.route("/create-race").post(upload.single("image"), createRaceController);
adminRouter.route("/races").get(getAllRacesController);

adminRouter.route("/create-challenge").post(upload.single("image"), createChallengeController);
adminRouter.route("/challenges/:raceId").get(getChallengesByRaceController);

export default adminRouter;

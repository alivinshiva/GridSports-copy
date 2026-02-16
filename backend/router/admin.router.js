import express from "express";
import { verifyCookies } from "../middleware/verify.cookie.js";
import { isAdmin } from "../middleware/admin.middleware.js";
import { createChallengeController, createRaceController, getAllRacesController, getChallengesByRaceController } from "../controller/admin.controller.js";

const adminRouter = express.Router();

adminRouter.route("/create-race").post(verifyCookies, isAdmin, createRaceController);
adminRouter.route("/races").get(verifyCookies, isAdmin, getAllRacesController);

adminRouter.route("/create-challenge").post(verifyCookies, isAdmin, createChallengeController);
adminRouter.route("/challenges/:raceId").get(verifyCookies, isAdmin, getChallengesByRaceController);

export default adminRouter;

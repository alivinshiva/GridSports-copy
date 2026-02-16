import express from "express";
import { getActiveWeekendController, getWeekendDetailsController, getRaceDetailsController, getChallengeDetailsController } from "../controller/public.controller.js";

const publicRouter = express.Router();

publicRouter.route("/active-weekend").get(getActiveWeekendController);
publicRouter.route("/weekend/:id").get(getWeekendDetailsController);
publicRouter.route("/race/:id").get(getRaceDetailsController);
publicRouter.route("/challenge/:id").get(getChallengeDetailsController);

export default publicRouter;

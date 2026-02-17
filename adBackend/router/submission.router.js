import express from "express";
import { getAllSubmissionsController } from "../controller/submission.controller.js";

const submissionRouter = express.Router();

submissionRouter.route("/all").get(getAllSubmissionsController);

export default submissionRouter;

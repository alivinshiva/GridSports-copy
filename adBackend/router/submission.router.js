import express from "express";
import { addSubmissionController, getAllRandomSubmissionController, getAllSubmissionsController, getSingleSubmissionController } from "../controller/submission.controller.js";
import { verifyCookies } from "../middleware/verify.cookies.js";
import { upload } from "../middleware/multer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.route("/all").get(getAllSubmissionsController);
submissionRouter.route("/add").post(verifyCookies, upload.single("image"), addSubmissionController); // one bugs available not fixed right now
submissionRouter.route("/all-random").get(getAllRandomSubmissionController);
submissionRouter.route("/single/:id").get(getSingleSubmissionController);

export default submissionRouter;

import express from "express";
import { addSubmissionController, getAllLoggedInUserImageSubmission, getAllLoggedInUserVideoSubmission, getAllRandomSubmissionController, getAllSubmissionsController, getSingleSubmissionController } from "../controller/submission.controller.js";
import { verifyCookies } from "../middleware/verify.cookies.js";
import { upload } from "../middleware/multer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.route("/all").get(getAllSubmissionsController);
submissionRouter.route("/add").post(verifyCookies, upload.single("image"), addSubmissionController); // one bugs available not fixed right now
submissionRouter.route("/all-random").get(getAllRandomSubmissionController);
submissionRouter.route("/single/:id").get(getSingleSubmissionController);
submissionRouter.route("/all-image-submission").get(verifyCookies, getAllLoggedInUserImageSubmission);
submissionRouter.route("/all-video-submission").get(verifyCookies, getAllLoggedInUserVideoSubmission);

export default submissionRouter;

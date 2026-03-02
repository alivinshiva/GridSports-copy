import express from "express";
import { addSubmissionController, getAllLoggedInUserImageSubmission, getAllLoggedInUserVideoSubmission, getAllRandomSubmissionController, getAllSubmissionsController, getSingleSubmissionController, rateDetailedController, rateSubmissionController, shareSubmissionController, checkUserSubmissionController, getFeedIdsController, getBatchSubmissionsController } from "../controller/submission.controller.js";
import { verifyCookies } from "../middleware/verify.cookies.js";
import { upload } from "../middleware/multer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.route("/all").get(verifyCookies, getAllSubmissionsController);
submissionRouter.route("/add").post(verifyCookies, upload.single("image"), addSubmissionController); // one bugs available not fixed right now
submissionRouter.route("/all-random").get(verifyCookies, getAllRandomSubmissionController);
submissionRouter.route("/feed-ids").post(verifyCookies, getFeedIdsController);
submissionRouter.route("/batch").post(verifyCookies, getBatchSubmissionsController);
submissionRouter.route("/single/:id").get(getSingleSubmissionController);
submissionRouter.route("/all-image-submission").get(verifyCookies, getAllLoggedInUserImageSubmission);
submissionRouter.route("/all-video-submission").get(verifyCookies, getAllLoggedInUserVideoSubmission);
submissionRouter.route("/check/:challengeId").get(verifyCookies, checkUserSubmissionController);

submissionRouter.route("/rate").post(verifyCookies, rateSubmissionController);
submissionRouter.route("/rate-detailed").post(verifyCookies, rateDetailedController);
submissionRouter.route("/share/record").post(verifyCookies, shareSubmissionController);

export default submissionRouter;

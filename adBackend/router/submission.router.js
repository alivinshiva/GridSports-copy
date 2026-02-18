import express from "express";
import { addSubmissionController, getAllSubmissionsController } from "../controller/submission.controller.js";
import { verifyCookies } from "../middleware/verify.cookies.js";
import { upload } from "../middleware/multer.middleware.js";

const submissionRouter = express.Router();

submissionRouter.route("/all").get(getAllSubmissionsController);
submissionRouter.route("/add").post(verifyCookies, upload.single("image"), addSubmissionController);

export default submissionRouter;

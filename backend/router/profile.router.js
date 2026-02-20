import express from "express";
import { verifyCookies } from "../middleware/verify.cookie.js";
import { createTribeMiddleware } from "../middleware/profile.middleware.js";
import { createTribeController, deleteImageController, getLoggedProfileController, onlyTribeInformation, uploadProfileImageController } from "../controller/profile.controller.js";
import { upload } from "../middleware/multer.middleware.js";

const profileRouter = express.Router();

profileRouter.route("/create-tribe").post(verifyCookies, createTribeMiddleware, createTribeController);
profileRouter.route("/upload-image").put(upload.single("image"), verifyCookies, uploadProfileImageController);
profileRouter.route("/delete-image").delete(verifyCookies, deleteImageController);
profileRouter.route("/profile-details").get(verifyCookies, getLoggedProfileController);
profileRouter.route("/only-tribe-information").get(verifyCookies, onlyTribeInformation);

export default profileRouter;
import express from "express";
import { changePasswordMiddleware, forgotPasswordPhoneMiddleware, loginPhoneNumberMiddleware, otpMiddleware, resetPasswordPhoneMiddleware, signupMiddleware } from "../middleware/user.middleware.js";
import { changePasswordController, forgotPasswordController, loginPhoneNumberController, logoutController, signupController, verifyForgotPasswordOtpController, verifyPhoneController } from "../controller/user.controller.js";
import { verifyCookies } from "../middleware/verify.cookie.js";

const userRouter = express.Router();

userRouter.route("/signup").post(signupMiddleware, signupController);
userRouter.route("/verify-phone").post(otpMiddleware, verifyPhoneController);
userRouter.route("/login-phone").post(loginPhoneNumberMiddleware, loginPhoneNumberController);
userRouter.route("/change-password").put(verifyCookies, changePasswordMiddleware, changePasswordController);
userRouter.route("/forgot-password").put(forgotPasswordPhoneMiddleware, forgotPasswordController);
userRouter.route("/reset-password").put(resetPasswordPhoneMiddleware, verifyForgotPasswordOtpController);
userRouter.route("/logout").post(verifyCookies, logoutController);

export default userRouter;
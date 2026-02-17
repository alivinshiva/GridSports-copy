import express from "express";
import { getAllUsersController } from "../controller/admin.controller.js";


const adminRouter = express.Router();

adminRouter.route("/all").get(getAllUsersController);

export default adminRouter;

import express from "express";
import { deleteASingleUserById, getAllUsersController } from "../controller/admin.controller.js";


const adminRouter = express.Router();

adminRouter.route("/all").get(getAllUsersController);
adminRouter.route("/delete/:id").delete(deleteASingleUserById);

export default adminRouter;

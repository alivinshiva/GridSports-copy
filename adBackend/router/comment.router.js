import express from "express";

import { createCommentController, getAllCommentsController, deleteCommentController } from "../controller/comment.controller.js";

const commentRouter = express.Router();

commentRouter.route("/add").post(createCommentController);
commentRouter.route("/all").get(getAllCommentsController);
commentRouter.route("/delete/:id").delete(deleteCommentController);

export default commentRouter;
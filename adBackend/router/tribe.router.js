import express from "express";
import { addPoints, getAllTribes } from "../controller/tribe.controller.js";
import { createTribeMiddleware } from "../middleware/tribe.middleware.js";

const router = express.Router();

router.post("/add-points", createTribeMiddleware, addPoints);
router.get("/all", getAllTribes);

export default router;

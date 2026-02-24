import express from "express";
import { addPoints, getAllTribes } from "../controller/tribe.controller.js";

const router = express.Router();

router.post("/add-points", addPoints);
router.get("/all", getAllTribes);

export default router;

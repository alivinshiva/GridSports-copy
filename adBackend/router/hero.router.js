import express from "express";
import { upload } from "../middleware/multer.middleware.js";
import { createHeroController, deleteHeroController, getAllHeroesController, updateHeroController } from "../controller/hero.controller.js";

const heroRouter = express.Router();

// Public route to fetch heroes
heroRouter.route("/all").get(getAllHeroesController);

// Max 1 file upload using 'image' form key
heroRouter.route("/add").post(upload.single("image"), createHeroController);
heroRouter.route("/update/:id").put(upload.single("image"), updateHeroController);
heroRouter.route("/delete/:id").delete(deleteHeroController);

export default heroRouter;

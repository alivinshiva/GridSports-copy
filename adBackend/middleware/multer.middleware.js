import multer from "multer";
import { storage } from "../config/cloudinary.config.js";

export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024
    }
});
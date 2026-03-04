import cloudinaryModule from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import dotenv from "dotenv";
dotenv.config();


const cloudinary = cloudinaryModule.v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video");

        return {
            folder: "TrilliumFlowSports",
            resource_type: isVideo ? "video" : "image",
            public_id: file.fieldname + "-" + Date.now(),
            format: file.originalname.split(".").pop(),
            transformation: isVideo
                ? [{ quality: "auto" }]
                : [{ quality: "auto:best" }]
        };
    }
});


export default cloudinary;
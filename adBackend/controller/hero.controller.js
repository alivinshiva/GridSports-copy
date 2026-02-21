import heroModel from "../model/hero.model.js";
import cloudinary from "../config/cloudinary.config.js";

// desc create hero
// method POST
// path /api/v1/hero/add
// access private
export const createHeroController = async (req, res) => {
    try {
        const { name, location } = req.body;
        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }
        if (!name || !location) {
            return res.status(400).json({ success: false, message: "Name and location are required" });
        }

        const hero = new heroModel({
            name,
            location,
            imageUrl: image.path,
            imageId: image.filename
        });

        await hero.save();

        return res.status(201).json({ success: true, message: "Hero Created Successfully", data: hero });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc get all heroes
// method GET
// path /api/v1/hero/all
// access public/private
export const getAllHeroesController = async (req, res) => {
    try {
        const heroes = await heroModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Heroes Fetched Successfully", data: heroes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc update hero
// method PUT
// path /api/v1/hero/update/:id
// access private
export const updateHeroController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, location } = req.body;
        const image = req.file;

        const hero = await heroModel.findById(id);
        if (!hero) {
            return res.status(404).json({ success: false, message: "Hero Not Found" });
        }

        // Handle text updates
        if (name) hero.name = name;
        if (location) hero.location = location;

        // Handle image update
        if (image) {
            try {
                // Delete old image from cloudinary
                if (hero.imageId) {
                    await cloudinary.uploader.destroy(hero.imageId);
                }
            } catch (err) {
                console.error("Cloudinary cleanup error:", err);
            }
            // Set new image data
            hero.imageUrl = image.path;
            hero.imageId = image.filename;
        }

        await hero.save();

        return res.status(200).json({ success: true, message: "Hero Updated Successfully", data: hero });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc delete hero
// method DELETE
// path /api/v1/hero/delete/:id
// access private
export const deleteHeroController = async (req, res) => {
    try {
        const { id } = req.params;

        const hero = await heroModel.findById(id);
        if (!hero) {
            return res.status(404).json({ success: false, message: "Hero Not Found" });
        }

        // Delete image from cloudinary
        try {
            if (hero.imageId) {
                await cloudinary.uploader.destroy(hero.imageId);
            }
        } catch (err) {
            console.error("Cloudinary cleanup error:", err);
        }

        await heroModel.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Hero Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

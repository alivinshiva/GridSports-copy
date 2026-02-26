import tagModel from "../model/tag.model.js";

// desc Create Tag
// method POST
// path /api/v1/tag/create
// access private
export const createTagController = async (req, res) => {
    try {
        const { name } = req.body;
        if (!name || name.trim() === "") {
            return res.status(400).json({ success: false, message: "Tag name is required" });
        }

        let formattedName = name.trim();
        if (!formattedName.startsWith('#')) {
            formattedName = `#${formattedName}`;
        }

        const existingTag = await tagModel.findOne({ name: formattedName });
        if (existingTag) {
            return res.status(400).json({ success: false, message: "Tag already exists" });
        }

        const tag = new tagModel({ name: formattedName });
        await tag.save();

        return res.status(201).json({ success: true, message: "Tag created successfully", data: tag });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc Get All Tags
// method GET
// path /api/v1/tag/all
// access public/private
export const getAllTagsController = async (req, res) => {
    try {
        const tags = await tagModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Tags fetched successfully", data: tags });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc Delete Tag
// method DELETE
// path /api/v1/tag/delete/:id
// access private
export const deleteTagController = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await tagModel.findById(id);

        if (!tag) {
            return res.status(404).json({ success: false, message: "Tag not found" });
        }

        await tagModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Tag deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

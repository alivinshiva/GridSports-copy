import commentModel from "../model/comment.model.js";

// desc create comment
// method POST
// path /api/v1/comment/add
// access private
export const createCommentController = async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, message: "Comment text is required" });
        }

        const existingComment = await commentModel.findOne({ text: text.trim() });
        if (existingComment) {
            return res.status(400).json({ success: false, message: "Comment already exists" });
        }

        const newComment = new commentModel({ text: text.trim() });
        await newComment.save();

        return res.status(201).json({ success: true, message: "Comment added successfully", data: newComment });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc get all comments
// method GET
// path /api/v1/comment/all
// access private
export const getAllCommentsController = async (req, res) => {
    try {
        const comments = await commentModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, message: "Comments fetched successfully", data: comments });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc delete comment
// method DELETE
// path /api/v1/comment/delete/:id
// access private
export const deleteCommentController = async (req, res) => {
    try {
        const { id } = req.params;

        const comment = await commentModel.findById(id);
        if (!comment) {
            return res.status(404).json({ success: false, message: "Comment not found" });
        }

        await commentModel.findByIdAndDelete(id);
        return res.status(200).json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

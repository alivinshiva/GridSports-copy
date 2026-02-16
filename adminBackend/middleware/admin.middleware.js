import userModel from "../models/user.model.js";

export const isAdmin = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await userModel.findById(userId);

        if (!user || user.isAdmin !== true) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }
        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

import Tribe from "../model/tribe.model.js";

// @desc    Add points to a specific tribe
// @route   POST /api/v1/tribe/add-points
// @access  Admin
export const addPoints = async (req, res) => {
    try {
        const { tribeName, points } = req.body;

        if (!tribeName || points === undefined) {
            return res.status(400).json({
                success: false,
                message: "Please provide both tribeName and points to add."
            });
        }

        const pointsToAdd = Number(points);
        if (isNaN(pointsToAdd)) {
            return res.status(400).json({
                success: false,
                message: "Points must be a valid number."
            });
        }

        const tribe = await Tribe.findOne({ name: tribeName });

        if (!tribe) {
            return res.status(404).json({
                success: false,
                message: `Tribe with name '${tribeName}' not found.`
            });
        }

        // Add the points
        tribe.totalPoints += pointsToAdd;
        await tribe.save();

        return res.status(200).json({
            success: true,
            message: `Successfully added ${pointsToAdd} points to ${tribeName}.`,
            data: tribe
        });

    } catch (error) {
        console.error("Error in addPoints controller:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while adding points to tribe."
        });
    }
};

// @desc    Get all tribes (useful for populating dropdown in frontend)
// @route   GET /api/v1/tribe/all
// @access  Admin
export const getAllTribes = async (req, res) => {
    try {
        const tribes = await Tribe.find().select('name totalPoints').sort({ name: 1 });

        return res.status(200).json({
            success: true,
            message: "Fetched all tribes successfully.",
            data: tribes
        });
    } catch (error) {
        console.error("Error in getAllTribes controller:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching tribes."
        });
    }
};

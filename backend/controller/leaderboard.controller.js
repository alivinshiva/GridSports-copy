import profileModel from "../models/profile.model.js";
import tribeModel from "../models/tribe.model.js";

// @desc Get Creator Leaderboard
// @route GET /api/v1/leaderboard/creators
// @access Public
export const getCreatorLeaderboard = async (req, res) => {
    try {
        const creators = await profileModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $match: { "userDetails.creatorPoints": { $gt: 0 } } },
            { $sort: { "userDetails.creatorPoints": -1 } },
            { $limit: 100 },
            {
                $project: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    avatar: "$imageUrl",
                    tribe: 1,
                    points: "$userDetails.creatorPoints"
                }
            }
        ]);

        return res.status(200).json({ success: true, message: "Creator Leaderboard Fetched", data: creators });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// @desc Get Ranker Leaderboard
// @route GET /api/v1/leaderboard/rankers
// @access Public
export const getRankerLeaderboard = async (req, res) => {
    try {
        const rankers = await profileModel.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            { $match: { "userDetails.rankerPoints": { $gt: 0 } } },
            { $sort: { "userDetails.rankerPoints": -1 } },
            { $limit: 100 },
            {
                $project: {
                    _id: "$userDetails._id",
                    name: "$userDetails.name",
                    avatar: "$imageUrl",
                    tribe: 1,
                    points: "$userDetails.rankerPoints"
                }
            }
        ]);

        return res.status(200).json({ success: true, message: "Ranker Leaderboard Fetched", data: rankers });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// @desc Get Tribe Leaderboard
// @route GET /api/v1/leaderboard/tribes
// @access Public
export const getTribeLeaderboard = async (req, res) => {
    try {
        // We can either fetch from Tribe model directly or aggregate all users.
        // Since we created Tribe model and update its totalPoints dynamically:
        const tribes = await tribeModel.find({ totalPoints: { $gt: 0 } }).sort({ totalPoints: -1 });

        return res.status(200).json({ success: true, message: "Tribe Leaderboard Fetched", data: tribes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

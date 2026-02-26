import profileModel from "../models/profile.model.js";
import tribeModel from "../models/tribe.model.js";
import userModel from "../models/user.model.js";

// @desc Get Creator Leaderboard
// @route GET /api/v1/leaderboard/creators
// @access Public
export const getCreatorLeaderboard = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

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
            { $skip: skip },
            { $limit: limit },
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

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
            { $skip: skip },
            { $limit: limit },
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
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 15;
        const skip = (page - 1) * limit;

        const tribes = await tribeModel.find({ totalPoints: { $gt: 0 } })
            .sort({ totalPoints: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({ success: true, message: "Tribe Leaderboard Fetched", data: tribes });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// @desc Get Current User Rank
// @route GET /api/v1/leaderboard/me
// @access Private
export const getCurrentUserRank = async (req, res) => {
    try {
        const userId = req.user._id;

        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        const profile = await profileModel.findOne({ user: userId });

        let creatorRank = null;
        if (user.creatorPoints > 0) {
            creatorRank = await userModel.countDocuments({
                creatorPoints: { $gt: user.creatorPoints }
            }) + 1;
        }

        let rankerRank = null;
        if (user.rankerPoints > 0) {
            rankerRank = await userModel.countDocuments({
                rankerPoints: { $gt: user.rankerPoints }
            }) + 1;
        }

        let tribeRank = null;
        let tribePoints = 0;
        let tribeAvatar = null;
        if (profile && profile.tribe) {
            const userTribe = await tribeModel.findOne({ name: profile.tribe });
            if (userTribe) {
                tribePoints = userTribe.totalPoints || 0;
                if (tribePoints > 0) {
                    tribeRank = await tribeModel.countDocuments({
                        totalPoints: { $gt: tribePoints }
                    }) + 1;
                }
                tribeAvatar = userTribe.avatar || null;
            }
        }

        return res.status(200).json({
            success: true,
            data: {
                creatorRank,
                creatorPoints: user.creatorPoints,
                rankerRank,
                rankerPoints: user.rankerPoints,
                tribe: profile ? profile.tribe : null,
                tribeRank,
                tribePoints,
                tribeAvatar,
                avatar: profile ? profile.imageUrl : null,
                name: user.name
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

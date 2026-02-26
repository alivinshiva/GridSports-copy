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

        const data = creators.map((c, idx) => {
            return {
                _id: c._id,
                name: c.name,
                avatar: c.avatar,
                tribe: c.tribe,
                points: c.points
            };
        });

        return res.status(200).json({ success: true, message: "Creator Leaderboard Fetched", data });
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

        const data = rankers.map((r, idx) => {
            return {
                _id: r._id,
                name: r.name,
                avatar: r.avatar,
                tribe: r.tribe,
                points: r.points
            };
        });

        return res.status(200).json({ success: true, message: "Ranker Leaderboard Fetched", data });
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

        const data = tribes.map((t, idx) => {
            return {
                _id: t._id,
                name: t.name,
                totalPoints: t.totalPoints
            };
        });

        return res.status(200).json({ success: true, message: "Tribe Leaderboard Fetched", data });
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

        // --- Creator rank & totals ---
        let creatorRank = null;
        const totalCreators = await userModel.countDocuments({ creatorPoints: { $gt: 0 } });
        if (user.creatorPoints > 0) {
            creatorRank = await userModel.countDocuments({
                creatorPoints: { $gt: user.creatorPoints }
            }) + 1;
        }

        // Top-3 creator points
        const top3Creators = await userModel.find({ creatorPoints: { $gt: 0 } })
            .sort({ creatorPoints: -1 })
            .limit(3)
            .select("creatorPoints");
        const top3CreatorPoints = top3Creators.map(u => u.creatorPoints);

        // --- Ranker rank & totals ---
        let rankerRank = null;
        const totalRankers = await userModel.countDocuments({ rankerPoints: { $gt: 0 } });
        if (user.rankerPoints > 0) {
            rankerRank = await userModel.countDocuments({
                rankerPoints: { $gt: user.rankerPoints }
            }) + 1;
        }

        // Top-3 ranker points
        const top3Rankers = await userModel.find({ rankerPoints: { $gt: 0 } })
            .sort({ rankerPoints: -1 })
            .limit(3)
            .select("rankerPoints");
        const top3RankerPoints = top3Rankers.map(u => u.rankerPoints);

        // --- Tribe rank & totals ---
        let tribeRank = null;
        let tribePoints = 0;
        let tribeAvatar = null;
        const totalTribes = await tribeModel.countDocuments({ totalPoints: { $gt: 0 } });
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

        // Top-3 tribe points
        const top3Tribes = await tribeModel.find({ totalPoints: { $gt: 0 } })
            .sort({ totalPoints: -1 })
            .limit(3)
            .select("totalPoints");
        const top3TribePoints = top3Tribes.map(t => t.totalPoints);

        return res.status(200).json({
            success: true,
            data: {
                creatorRank,
                creatorPoints: user.creatorPoints,
                totalCreators,
                top3CreatorPoints,
                rankerRank,
                rankerPoints: user.rankerPoints,
                totalRankers,
                top3RankerPoints,
                tribe: profile ? profile.tribe : null,
                tribeRank,
                tribePoints,
                totalTribes,
                top3TribePoints,
                tribeAvatar,
                avatar: profile ? profile.imageUrl : null,
                name: user.name
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


import raceModel from "../models/race.model.js";
import challengeModel from "../models/challenge.model.js";
import weekendModel from "../models/weekend.model.js";

// desc: Get Active Weekend Data
// path: GET /api/v1/public/active-weekend
// access: Public
export const getActiveWeekendController = async (req, res) => {
    try {
        // 1. Find the active or next upcoming weekend
        const weekend = await weekendModel.findOne().sort({ startDate: -1 });

        if (!weekend) {
            return res.status(200).json({ success: true, data: null, message: "No active weekend found" });
        }

        // 2. Find races for this weekend
        const races = await raceModel.find({ weekendId: weekend._id }).sort({ "dates.race": 1 });

        // 3. Find challenges for these races
        // Get all race IDs
        const raceIds = races.map(race => race._id);
        const challenges = await challengeModel.find({ raceId: { $in: raceIds } }).sort({ challengeId: 1 });

        return res.status(200).json({
            success: true,
            data: {
                weekend,
                races,
                challenges
            }
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get Weekend Details by ID
// path: GET /api/v1/public/weekend/:id
// access: Public
export const getWeekendDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const weekend = await weekendModel.findById(id);

        if (!weekend) {
            return res.status(404).json({ success: false, message: "Weekend not found" });
        }

        const races = await raceModel.find({ weekendId: id }).sort({ "dates.race": 1 });

        return res.status(200).json({ success: true, data: { weekend, races } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get Race Details by ID
// path: GET /api/v1/public/race/:id
// access: Public
export const getRaceDetailsController = async (req, res) => {
    try {
        const { id } = req.params;
        const race = await raceModel.findById(id).populate('weekendId');

        if (!race) {
            return res.status(404).json({ success: false, message: "Race not found" });
        }

        const challenges = await challengeModel.find({ raceId: id }).sort({ challengeId: 1 });

        return res.status(200).json({ success: true, data: { race, challenges } });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get Challenge Details by ID (challengeId or _id)
// path: GET /api/v1/public/challenge/:id
// access: Public
export const getChallengeDetailsController = async (req, res) => {
    try {
        const { id } = req.params;

        // First try by custom challengeId field
        let challenge = await challengeModel.findOne({ challengeId: id });

        // Fallback: try by MongoDB _id
        if (!challenge && id.match(/^[0-9a-fA-F]{24}$/)) {
            challenge = await challengeModel.findById(id);
        }

        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge not found" });
        }

        return res.status(200).json({ success: true, data: challenge });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

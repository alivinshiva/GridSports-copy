import raceModel from "../models/race.model.js";
import challengeModel from "../models/challenge.model.js";

// desc: Create a new Race
// path: POST /api/v1/admin/create-race
// access: Private (Admin)
export const createRaceController = async (req, res) => {
    try {
        const { name, round, dates, slug } = req.body;

        // Basic Validation
        if (!name || !round || !dates || !slug) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingRace = await raceModel.findOne({ slug });
        if (existingRace) {
            return res.status(400).json({ success: false, message: "Race with this slug already exists" });
        }

        const newRace = new raceModel({
            name,
            round,
            dates,
            slug
        });

        await newRace.save();

        return res.status(201).json({ success: true, message: "Race created successfully", data: newRace });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get all Races
// path: GET /api/v1/admin/races
// access: Private (Admin)
export const getAllRacesController = async (req, res) => {
    try {
        const races = await raceModel.find().sort({ "dates.race": 1 });
        return res.status(200).json({ success: true, data: races });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Create a new Challenge
// path: POST /api/v1/admin/create-challenge
// access: Private (Admin)
export const createChallengeController = async (req, res) => {
    try {
        const { challengeId, raceId, title, description, type, openTime, closeTime, raterTags, shareHook } = req.body;

        const existingChallenge = await challengeModel.findOne({ challengeId });
        if (existingChallenge) {
            return res.status(400).json({ success: false, message: "Challenge ID already exists" });
        }

        const newChallenge = new challengeModel({
            challengeId,
            raceId,
            title,
            description,
            type,
            openTime,
            closeTime,
            raterTags,
            shareHook
        });

        await newChallenge.save();

        return res.status(201).json({ success: true, message: "Challenge created successfully", data: newChallenge });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get Challenges by Race ID
// path: GET /api/v1/admin/challenges/:raceId
// access: Private (Admin)
export const getChallengesByRaceController = async (req, res) => {
    try {
        const { raceId } = req.params;
        const challenges = await challengeModel.find({ raceId }).sort({ challengeId: 1 });
        return res.status(200).json({ success: true, data: challenges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

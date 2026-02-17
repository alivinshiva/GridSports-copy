import raceModel from "../models/race.model.js";
import challengeModel from "../models/challenge.model.js";
import weekendModel from "../models/weekend.model.js";
import mongoose from "mongoose";

// desc: Create a new Weekend
// path: POST /api/v1/admin/create-weekend
// access: Private (Admin)
export const createWeekendController = async (req, res) => {
    try {
        const { name, slug, startDate, endDate, round } = req.body;

        if (!name || !slug || !startDate || !endDate || !round) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const existingWeekend = await weekendModel.findOne({ slug });
        if (existingWeekend) {
            return res.status(400).json({ success: false, message: "Weekend with this slug already exists" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = req.file.path;
        } else {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        const newWeekend = new weekendModel({
            name,
            slug,
            startDate,
            endDate,
            round,
            image: imageUrl
        });

        await newWeekend.save();

        return res.status(201).json({ success: true, message: "Weekend created successfully", data: newWeekend });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get all Weekends
// path: GET /api/v1/admin/weekends
// access: Private (Admin)
export const getAllWeekendsController = async (req, res) => {
    try {
        const weekends = await weekendModel.find().sort({ startDate: 1 });
        return res.status(200).json({ success: true, data: weekends });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Create a new Race
// path: POST /api/v1/admin/create-race
// access: Private (Admin)
export const createRaceController = async (req, res) => {
    try {
        const { name, round, dates, slug, weekendId } = req.body;

        console.log("Creating Race:", { name, round, slug, weekendId });

        // Basic Validation
        if (!name || !round || !dates || !slug || !weekendId) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        if (!mongoose.Types.ObjectId.isValid(weekendId)) {
            return res.status(400).json({ success: false, message: "Invalid Weekend ID" });
        }

        // Validate Weekend ID
        // Note: mongoose import might be needed if not globally available, but normally we check using regex or mongoose.isValidObjectId
        // assuming mongoose is imported in the file or we blindly trust for now, but adding a try-catch for the save or explicit check is better.

        const existingRace = await raceModel.findOne({ slug });
        if (existingRace) {
            return res.status(400).json({ success: false, message: "Race with this slug already exists" });
        }

        let imageUrl = "";
        if (req.file) {
            imageUrl = req.file.path;
        } else {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

        let parsedDates;
        try {
            parsedDates = JSON.parse(dates);
        } catch (e) {
            return res.status(400).json({ success: false, message: "Invalid date format" });
        }

        const newRace = new raceModel({
            name,
            round,
            dates: parsedDates, // Dates come as string from FormData
            slug,
            image: imageUrl,
            weekendId
        });

        await newRace.save();

        return res.status(201).json({ success: true, message: "Race created successfully", data: newRace });

    } catch (error) {
        console.error("Error creating race:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc: Get all Races
// path: GET /api/v1/admin/races
// access: Private (Admin)
export const getAllRacesController = async (req, res) => {
    try {
        const races = await raceModel.find().populate('weekendId', 'name').sort({ "dates.race": 1 });
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
        const { challengeId, raceId, title, description, rules, type, openTime, closeTime, raterTags, shareHook } = req.body;

        const existingChallenge = await challengeModel.findOne({ challengeId });
        if (existingChallenge) {
            return res.status(400).json({ success: false, message: "Challenge ID already exists" });
        }

        // Validate Race ID
        if (!mongoose.Types.ObjectId.isValid(raceId)) {
            return res.status(400).json({ success: false, message: "Invalid Race ID format" });
        }
        const existingRace = await raceModel.findById(raceId);
        if (!existingRace) {
            return res.status(404).json({ success: false, message: "Race not found" });
        }

        const newChallenge = new challengeModel({
            challengeId,
            raceId,
            title,
            description,
            rules,
            type,
            openTime,
            closeTime,
            raterTags: typeof raterTags === 'string' ? raterTags.split(',').map(tag => tag.trim()) : raterTags,
            shareHook,
            image: req.file ? req.file.path : ""
        });

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Image is required" });
        }

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

import challangeModel from "../model/challange.model.js";
import weekendModel from "../model/weekend.model.js";



// desc create challenge
// method POST
// path /api/v1/challenge/add
// access private

export const createChallangeController = async (req, res) => {
    try {
        const { weekend, name, description, startAt, endAt, round, rules, type, status, season } = req.body;

        const image = req.file;

        if (!image) {
            return res.status(400).json({ success: false, message: "Image is required" });
        };

        const weekendExist = await weekendModel.findById(weekend);

        if (!weekendExist) {
            return res.status(404).json({ success: false, message: "Weekend Not Found" });
        };

        if (weekendExist.count >= 6) {
            return res.status(400).json({ success: false, message: "Maximum 6 challenges can be created in a weekend" });
        };

        const newChallange = new challangeModel({
            weekend,
            name,
            description,
            startAt,
            endAt,
            round,
            rules,
            type,
            status,
            image: image.path,
            imageId: image.public_id,
            count: weekendExist.count + 1,
            season: weekendExist.season
        });

        const savedWeekend = await newChallange.save();

        return res.status(201).json({ success: true, message: "Challenge Created Successfully", data: savedWeekend });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc get all challenges
// method GET
// path /api/v1/challenge/all
// access public
export const getAllChallengesController = async (req, res) => {
    try {
        const challenges = await challangeModel.find({});
        return res.status(200).json({ success: true, message: "Challenges Fetched Successfully", data: challenges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// desc get single challenge
// method GET
// path /api/v1/challenge/details/:id
// access public
export const getSingleChallengeController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        };

        const challenge = await challangeModel.findById(id);

        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge Not Found" });
        };

        return res.status(200).json({ success: true, message: "Challenge Fetched Successfully", data: challenge });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// desc update challenge
// method PUT
// path /api/v1/challenge/update/:id
// access private
export const updateChallengeController = async (req, res) => {
    try {
        const { id } = req.params;

        const { status } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        };

        const challenge = await challangeModel.findById(id);

        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge Not Found" });
        };

        const updatedChallenge = await challangeModel.findByIdAndUpdate(id, { status }, { new: true });

        return res.status(200).json({ success: true, message: "Challenge Updated Successfully", data: updatedChallenge });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



// desc delete challenge
// method DELETE
// path /api/v1/challenge/delete/:id
// access private
export const deleteChallengeController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        };

        const challenge = await challangeModel.findById(id);

        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge Not Found" });
        };

        await challangeModel.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Challenge Deleted Successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
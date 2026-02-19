import challangeModel from "../model/challange.model.js";
import weekendModel from "../model/weekend.model.js";
import submissionModel from "../model/submission.model.js";


// desc create challenge
// method POST
// path /api/v1/challenge/add
// access private

export const createChallangeController = async (req, res) => {
    // console.log(req.body);
    try {
        const { weekend, name, description, startAt, endAt, round, rules, type, status, season } = req.body;

        const image = req.file;
        // console.log("Uploaded File:", image);

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
            imageUrl: image.path,
            imageId: image.filename,
            season: season || String(weekendExist.season),
            count: weekendExist.count + 1
        });

        const savedWeekend = await newChallange.save();

        return res.status(201).json({ success: true, message: "Challenge Created Successfully", data: savedWeekend });

    } catch (error) {
        // console.error("Error creating challenge:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc get all challenges
// method GET
// path /api/v1/challenge/all
// access public
export const getAllChallengesController = async (req, res) => {
    try {
        const challenges = await challangeModel.find({}).populate("weekend", "location");
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
        console.log(id)

        if (!id) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        };

        const challenge = await challangeModel.findById(id).populate("weekend", "title location startDate endDate season imageUrl status");

        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge Not Found" });
        };

        const submissionCount = await submissionModel.countDocuments({ challenge: id });

        return res.status(200).json({
            success: true,
            message: "Challenge Fetched Successfully",
            data: { ...challenge.toObject(), submissionCount }
        });

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


// desc get challenges by weekend id
// method GET
// path /api/v1/challenge/weekend/:weekendId
// access private
export const getChallengesByWeekendIdController = async (req, res) => {
    try {
        const { weekendId } = req.params;

        if (!weekendId) {
            return res.status(400).json({ success: false, message: "Weekend ID is required" });
        };

        const challenges = await challangeModel.find({ weekend: weekendId }).populate("weekend", "title location imageUrl season startDate endDate");

        return res.status(200).json({ success: true, message: "Challenges Fetched Successfully", data: challenges });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// desc get all active challanges controller
// method GET
// path /api/v1/challenge/active
// access private
export const getAllActiveChallangesController = async (req, res) => {
    try {
        const challenges = await challangeModel.find({ status: "ACTIVE" }).populate("weekend", "title location");
        return res.status(200).json({ success: true, message: "Challenges Fetched Successfully", data: challenges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// desc get all closed challanges controller
// method GET
// path /api/v1/challenge/closed
// access private
export const getAllClosedChallangesController = async (req, res) => {
    try {
        const challenges = await challangeModel.find({ status: "CLOSED" }).populate("weekend", "title location");
        return res.status(200).json({ success: true, message: "Challenges Fetched Successfully", data: challenges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// desc get all upcoming challanges controller
// method GET
// path /api/v1/challenge/upcoming
// access private
export const getAllUpcomingChallangesController = async (req, res) => {
    try {
        const challenges = await challangeModel.find({ status: "UPCOMING" }).populate("weekend", "title location");
        return res.status(200).json({ success: true, message: "Challenges Fetched Successfully", data: challenges });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
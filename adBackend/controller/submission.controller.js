import submissionModel from "../model/submission.model.js";



// description: "Get all submissions",
// route: "/api/v1/submission/get-all-submissions",
// method: "GET",
// access: "public",
// controller: "getAllSubmissionsController"

export const getAllSubmissionsController = async (req, res) => {
    try {
        const submissions = await submissionModel.find({})
            .populate("user", "fullName username profilePic")
            .populate("challenge", "name")
            .sort({ createdAt: -1 });

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


export const addSubmissionController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { challenge } = req.body;
        // console.log("This is a challange id", challenge)

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Media file is required" });
        }

        const mediaUrl = req.file.path;
        const mediaType = req.file.mimetype.startsWith('video') ? 'video' : 'image';

        const submission = await submissionModel.create({
            challenge,
            user: loggedInUser,
            mediaUrl,
            mediaId: req.file.filename,
            mediaType
        });

        return res.status(200).json({ success: true, message: "Submission Added Successfully", data: submission });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
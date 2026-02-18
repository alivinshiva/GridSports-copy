import submissionModel from "../model/submission.model.js";



// description: "Get all submissions with limit",
// route: "/api/v1/submission/get-all-submissions",
// method: "GET",
// access: "private",
// controller: "getAllSubmissionsController"

export const getAllSubmissionsController = async (req, res) => {
    try {
        const submissions = await submissionModel.find({}).sort({ createdAt: -1 }).limit(10);

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc add submission
// method POST
// path /api/v1/submission/add
// access private

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


// desc get all submission
// method GET
// path /api/v1/submission/get-all-submission
// access private

export const getAllRandomSubmissionController = async (req, res) => {
    try {
        const count = await submissionModel.countDocuments();
        const random = Math.floor(Math.random() * count);

        const resultSubmissions = await submissionModel.find({}).skip(random).limit(10);

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: resultSubmissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc get single submission
// method GET
// path /api/v1/submission/get-single-submission/:id
// access private

export const getSingleSubmissionController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Submission ID is required" });
        };

        const submission = await submissionModel.findById(id);

        if (!submission) {
            return res.status(404).json({ success: false, message: "Submission Not Found" });
        };

        return res.status(200).json({ success: true, message: "Submission Fetched Successfully", data: submission });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
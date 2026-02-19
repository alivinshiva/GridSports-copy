import submissionModel from "../model/submission.model.js";
import cloudinary from "../config/cloudinary.config.js";



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
        };

        const alreadyUpload = await submissionModel.findOne({ user: loggedInUser, challenge });

        if (alreadyUpload) {
            return res.status(400).json({ success: false, message: "You have already uploaded a submission for this challenge" });
        };

        // delete the image from cloudinary
        try {
            await cloudinary.uploader.destroy(alreadyUpload.mediaId);
        } catch (cloudinaryError) {
            return res.status(500).json({ success: false, message: "Cloudinary Server Error", error: cloudinaryError.message });
        };

        const challangeStatus = await challengeModel.findById(challenge);

        if (challangeStatus.status === 'CLOSED') {
            return res.status(400).json({ success: false, message: "Challenge is closed" });
        };

        if (challangeStatus.status === 'UPCOMING') {
            return res.status(400).json({ success: false, message: "Challenge is upcoming" });
        };

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
// this is for all random video 
// this is for all random video 
export const getAllRandomSubmissionController = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 15;

        // Use aggregate with $sample to get random documents
        const resultSubmissions = await submissionModel.aggregate([
            { $sample: { size: limit } }
        ]);

        // console.log("This is a random submission");
        // console.log(resultSubmissions);

        // Aggregate returns plain objects, so if we needed virtuals we'd need to hydrate them,
        // but for basic display this is fine. If full model features are needed:
        // const resultSubmissions = await submissionModel.find({ _id: { $in: randomDocs.map(d => d._id) } });
        // For now, simpler is better as per instruction.

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



export const getAllLoggedInUserImageSubmission = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await submissionModel.countDocuments({ user: loggedInUser, mediaType: 'image' });
        const submissions = await submissionModel.find({ user: loggedInUser, mediaType: 'image' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);


        console.log(page, limit, skip, total, submissions.length);

        return res.status(200).json({
            success: true,
            message: "Submissions Fetched Successfully",
            data: submissions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: skip + submissions.length < total
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


export const getAllLoggedInUserVideoSubmission = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const total = await submissionModel.countDocuments({ user: loggedInUser, mediaType: 'video' });
        const submissions = await submissionModel.find({ user: loggedInUser, mediaType: 'video' })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        return res.status(200).json({
            success: true,
            message: "Submissions Fetched Successfully",
            data: submissions,
            pagination: {
                total,
                page,
                pages: Math.ceil(total / limit),
                hasMore: skip + submissions.length < total
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};



export const getAllSubmissionOnParticularChallanage = async (req, res) => {
    try {
        const { challenge } = req.params;

        if (!challenge) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        };

        if (!mongoose.Types.ObjectId.isValid(challenge)) {
            return res.status(400).json({ success: false, message: "Invalid Challenge ID" });
        };

        const submissions = await submissionModel.find({ challenge }).populate("challenge", "name");

        console.log(submissions);

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
import submissionModel from "../model/submission.model.js";
import cloudinary from "../config/cloudinary.config.js";
import { processRating, processShare, processSubmissionUpload, processDetailedRating } from "../service/scoring.service.js";
import challengeModel from "../model/challange.model.js";
import detailedRatingModel from "../model/detailedRating.model.js";



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
        const { challenge, tags } = req.body;
        // console.log("This is a challange id", challenge)

        // Parse tags if it comes as a JSON string from form data
        let parsedTags = [];
        if (tags) {
            if (Array.isArray(tags)) {
                parsedTags = tags;
            } else if (typeof tags === 'string') {
                try {
                    parsedTags = JSON.parse(tags);
                } catch (e) {
                    // Try treating it as a single string tag if JSON parse fails
                    parsedTags = [tags];
                }
            }
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "Media file is required" });
        };

        const alreadyUpload = await submissionModel.findOne({ user: loggedInUser, challenge });

        if (alreadyUpload) {
            // Delete the newly uploaded file to avoid orphaned files in cloudinary since we are rejecting
            try {
                if (req.file && req.file.filename) {
                    await cloudinary.uploader.destroy(req.file.filename);
                }
            } catch (err) {
                console.error("Cloudinary cleanup error:", err);
            }
            return res.status(400).json({ success: false, message: "You have already uploaded a submission for this challenge" });
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
            mediaType,
            tags: parsedTags
        });

        const hasTags = !!req.body.tags && req.body.tags.length > 0;
        // Award points for uploading
        const pointResult = await processSubmissionUpload(loggedInUser, challenge, submission._id, challangeStatus.startAt, hasTags);

        return res.status(200).json({
            success: true,
            message: "Submission Added Successfully",
            data: submission,
            pointsEarned: pointResult.data?.pointsEarned || 0
        });
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
        const randomDocs = await submissionModel.aggregate([
            { $sample: { size: limit } }
        ]);

        // Hydrate and populate to get challenge parameters
        const resultSubmissions = await submissionModel.find({ _id: { $in: randomDocs.map(d => d._id) } })
            .populate("challenge", "name scoringType parameters");

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

        const submissions = await submissionModel.find({ challenge }).populate("challenge", "name scoringType parameters");

        console.log(submissions);

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};

export const checkUserSubmissionController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { challengeId } = req.params;

        if (!challengeId) {
            return res.status(400).json({ success: false, message: "Challenge ID is required" });
        }

        const existingSubmission = await submissionModel.findOne({ user: loggedInUser, challenge: challengeId });

        return res.status(200).json({ success: true, hasSubmitted: !!existingSubmission });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const rateSubmissionController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { submissionId, ratingType } = req.body; // 'LOVE', 'LIKE', 'DISLIKE'

        if (!submissionId || !ratingType) {
            return res.status(400).json({ success: false, message: "Missing submissionId or ratingType" });
        }

        const result = await processRating(loggedInUser, submissionId, ratingType);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const shareSubmissionController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { submissionId } = req.body;

        if (!submissionId) {
            return res.status(400).json({ success: false, message: "Missing submissionId" });
        }

        const result = await processShare(loggedInUser, submissionId);

        if (!result.success) {
            return res.status(400).json(result);
        }

        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

export const rateDetailedController = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { submissionId, challengeId, ratings } = req.body;
        // ratings is an array: [{ parameterName: "Audio", score: 10 }, ...]

        if (!submissionId || !challengeId || !ratings || !Array.isArray(ratings)) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const totalScore = ratings.reduce((acc, curr) => acc + curr.score, 0);

        const hasComment = !!req.body.comment || !!req.body.comments;
        // Use the scoring service to process and award points
        const processResult = await processDetailedRating(loggedInUser, submissionId, challengeId, ratings, hasComment);

        if (!processResult.success) {
            return res.status(400).json(processResult);
        }

        return res.status(200).json({
            success: true,
            message: "Detailed ratings saved successfully",
            points: processResult.data
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
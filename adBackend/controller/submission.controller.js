import submissionModel from "../model/submission.model.js";
import mongoose from "mongoose";
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


import jwt from "jsonwebtoken";

// desc get all submission
// method GET
// path /api/v1/submission/get-all-submission
// access private
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
            .populate("challenge", "name scoringType parameters comments");

        let submissionsWithRatings = resultSubmissions.map(sub => sub.toObject());

        // Extract user from token if present, but don't fail if absent
        let loggedInUserId = null;
        try {
            const token = req.cookies.TrIWOoeGridSports;
            if (token) {
                const decode = jwt.verify(token, process.env.JWT_TOKEN);
                if (decode) loggedInUserId = decode.userId;
            }
        } catch (e) {
            // ignore token errors for random feed
        }

        if (loggedInUserId) {
            const subIds = submissionsWithRatings.map(sub => sub._id);

            // Fetch normal ratings
            const pointLedgers = await import("../model/pointLedger.model.js").then(m => m.default).then(model =>
                model.find({
                    user: loggedInUserId,
                    submission: { $in: subIds },
                    actionType: { $regex: /^RATE_/ }
                })
            ).catch(() => []);

            // Fetch detailed ratings breakdown
            const detailedRatings = await detailedRatingModel.find({
                user: loggedInUserId,
                submission: { $in: subIds }
            }).catch(() => []);

            const ledgerMap = {};
            pointLedgers.forEach(pl => {
                ledgerMap[pl.submission.toString()] = pl.actionType;
            });

            const detailedMap = {};
            detailedRatings.forEach(dr => {
                const breakdown = {};
                dr.ratings.forEach(r => { breakdown[r.parameterName] = r.score; });
                detailedMap[dr.submission.toString()] = { ratings: breakdown, comment: dr.comment };
            });

            // Map ratings onto the submissions
            submissionsWithRatings = submissionsWithRatings.map(sub => {
                const subIdStr = sub._id.toString();

                // Normal ratings e.g., 'RATE_LOVE' -> 'LOVE'
                const actionType = ledgerMap[subIdStr];
                if (actionType) {
                    if (actionType.startsWith('RATE_')) {
                        sub.userRating = actionType.replace('RATE_', ''); // 'LOVE', 'LIKE', 'DISLIKE' or 'DETAILED'
                    } else if (actionType && !sub.challenge.parameters) {
                        sub.userRating = actionType;
                    }
                    // for custom simple parameters the frontend saves the param name, actually frontend uses the custom param name for rateSubmission ('RATE_' is only for love/like/dislike? Wait!
                    // Let me check frontend handleRate)
                }

                if (detailedMap[subIdStr]) {
                    sub.detailedUserRating = detailedMap[subIdStr];
                }

                return sub;
            });
        }

        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissionsWithRatings });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};

const getSafeObjectIds = (ids) => {
    if (!Array.isArray(ids)) return [];
    return ids
        .filter((id) => mongoose.Types.ObjectId.isValid(id))
        .map((id) => new mongoose.Types.ObjectId(id));
};

const attachRatingsForUser = async (submissions, loggedInUserId) => {
    if (!loggedInUserId || submissions.length === 0) return submissions;

    const subIds = submissions.map(sub => sub._id);

    const pointLedgers = await import("../model/pointLedger.model.js").then(m => m.default).then(model =>
        model.find({
            user: loggedInUserId,
            submission: { $in: subIds },
            actionType: { $regex: /^RATE_/ }
        })
    ).catch(() => []);

    const detailedRatings = await detailedRatingModel.find({
        user: loggedInUserId,
        submission: { $in: subIds }
    }).catch(() => []);

    const ledgerMap = {};
    pointLedgers.forEach(pl => {
        ledgerMap[pl.submission.toString()] = pl.actionType;
    });

    const detailedMap = {};
    detailedRatings.forEach(dr => {
        const breakdown = {};
        dr.ratings.forEach(r => { breakdown[r.parameterName] = r.score; });
        detailedMap[dr.submission.toString()] = { ratings: breakdown, comment: dr.comment };
    });

    return submissions.map(sub => {
        const subIdStr = sub._id.toString();
        const actionType = ledgerMap[subIdStr];

        if (actionType) {
            if (actionType.startsWith('RATE_')) {
                sub.userRating = actionType.replace('RATE_', '');
            } else if (actionType && !sub.challenge?.parameters) {
                sub.userRating = actionType;
            }
        }

        if (detailedMap[subIdStr]) {
            sub.detailedUserRating = detailedMap[subIdStr];
        }

        return sub;
    });
};

// desc get random feed IDs (excluding user's own posts)
// method POST
// path /api/v1/submission/feed-ids
// access private
export const getFeedIdsController = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id || req.user;
        const limit = Math.min(parseInt(req.query.limit) || 50, 50);
        const excludeIds = getSafeObjectIds(req.body?.excludeIds || []);

        const matchStage = {};
        if (loggedInUserId) {
            matchStage.user = { $ne: loggedInUserId };
        }
        if (excludeIds.length > 0) {
            matchStage._id = { $nin: excludeIds };
        }

        const ids = await submissionModel.aggregate([
            { $match: matchStage },
            { $sample: { size: limit } },
            { $project: { _id: 1 } }
        ]);

        return res.status(200).json({
            success: true,
            data: { ids: ids.map(i => i._id.toString()) }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

// desc get batch submissions by IDs (excluding user's own posts)
// method POST
// path /api/v1/submission/batch
// access private
export const getBatchSubmissionsController = async (req, res) => {
    try {
        const loggedInUserId = req.user?._id || req.user;
        const ids = getSafeObjectIds(req.body?.ids || []);

        if (!Array.isArray(req.body?.ids) || ids.length === 0) {
            return res.status(400).json({ success: false, message: "IDs array required" });
        }

        const query = { _id: { $in: ids } };
        if (loggedInUserId) {
            query.user = { $ne: loggedInUserId };
        }

        const submissions = await submissionModel.find(query)
            .populate("challenge", "name scoringType parameters comments")
            .lean();

        let submissionsWithRatings = await attachRatingsForUser(submissions, loggedInUserId);

        // Preserve request order
        const submissionMap = {};
        submissionsWithRatings.forEach(sub => {
            submissionMap[sub._id.toString()] = sub;
        });

        const ordered = req.body.ids
            .map(id => submissionMap[id])
            .filter(Boolean);

        return res.status(200).json({ success: true, message: "Batch Fetched Successfully", data: ordered });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// desc get single submission
// method GET
// path /api/v1/submission/single/:id
// access public (used for shared links)

export const getSingleSubmissionController = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Submission ID is required" });
        };

        const submission = await submissionModel.findById(id)
            .populate("user", "name profilePic tribe")
            .populate("challenge", "name description scoringType parameters comments");

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

        // Find challenge to get weightage parameters
        const challenge = await challengeModel.findById(challengeId);
        if (!challenge) {
            return res.status(404).json({ success: false, message: "Challenge not found" });
        }

        // Calculate total percentage score
        let totalScore = 0;
        ratings.forEach(r => {
            const paramDef = challenge.parameters.find(p => p.name === r.parameterName);
            const weightage = paramDef ? paramDef.maxPoints : 0;
            const baseScore = (r.score / 5) * weightage;
            const finalPercentScore = (weightage / 100) * baseScore;
            totalScore += finalPercentScore;
        });

        const hasComment = !!req.body.comment || !!req.body.comments;
        // Use the scoring service to process and award points
        const processResult = await processDetailedRating(loggedInUser, submissionId, challengeId, ratings, hasComment);

        if (!processResult.success) {
            return res.status(400).json(processResult);
        }

        // Save detailed rating breakdown to DB
        await detailedRatingModel.findOneAndUpdate(
            { user: loggedInUser, submission: submissionId },
            {
                challenge: challengeId,
                ratings: ratings,
                totalScore: totalScore,
                comment: req.body.comment || null
            },
            { upsert: true, new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Detailed ratings saved successfully",
            points: processResult.data
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
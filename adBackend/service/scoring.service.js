import mongoose from "mongoose";
import pointLedgerModel from "../model/pointLedger.model.js";
import submissionModel from "../model/submission.model.js";

// Utility to get user Profile (Tribe) since it is stored in the `backend` DB inside `profiles` collection
export const getUserProfile = async (userId) => {
    try {
        const db = mongoose.connection.db;
        const profile = await db.collection("profiles").findOne({ user: new mongoose.Types.ObjectId(userId) });
        return profile;
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
};

// Add points directly to the user's specific point type field and the tribe's totalPoints field.
export const awardPoints = async (userId, tribeName, userPointType, points) => {
    if (points === 0) return;
    try {
        const db = mongoose.connection.db;
        const updateField = userPointType === 'creator' ? 'creatorPoints' : 'rankerPoints';
        const userUpdateQuery = { $inc: { [updateField]: points, totalPoints: points } }; // Keep totalPoints for safety

        // Update user
        await db.collection("users").updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            userUpdateQuery
        );

        // Update tribe (we created a tribes collection)
        await mongoose.connection.db.collection("tribes").updateOne(
            { name: tribeName },
            { $inc: { totalPoints: points } },
            { upsert: true }
        );
    } catch (error) {
        console.error("Error awarding points:", error);
    }
};

export const processRating = async (rankerId, submissionId, ratingType) => {
    // ratingType: 'LOVE' (+10), 'LIKE' (+5), 'DISLIKE' (0)

    // Check if ranker already rated
    const existingLedger = await pointLedgerModel.findOne({
        user: rankerId,
        submission: submissionId,
        actionType: { $in: ['RATE_LOVE', 'RATE_LIKE', 'RATE_DISLIKE'] }
    });

    if (existingLedger) {
        return { success: false, message: "You have already rated this submission." };
    }

    const submission = await submissionModel.findById(submissionId).populate("challenge");
    if (!submission) return { success: false, message: "Submission not found" };

    const creatorId = submission.user;
    const challengeId = submission.challenge._id;

    // Get profiles to calculate multipliers
    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(creatorId);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : "NONE";
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    // --- RANKER POINTS ---
    // Rule: Rate Simple = 3. Context Multiplier: Own tribe = 1, Other tribe = 0.25 (for F1 mode)
    let rankerMultiplier = (rankerTribe === creatorTribe) ? 1 : 0.25;
    let rankerBasePoints = 3;

    // Time Bonus for Ranker (assuming submission createdAt)
    const hoursSinceUpload = (Date.now() - new Date(submission.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpload < 24) rankerBasePoints += 2;
    else if (hoursSinceUpload < 48) rankerBasePoints += 1;

    let rankerFinalPoints = rankerBasePoints * rankerMultiplier;

    // Save Ranker Ledger
    await pointLedgerModel.create({
        user: rankerId,
        tribe: rankerTribe,
        challenge: challengeId,
        submission: submissionId,
        actionType: `RATE_${ratingType}`,
        basePoints: rankerBasePoints,
        multiplier: rankerMultiplier,
        finalPoints: rankerFinalPoints
    });

    // Award Ranker
    await awardPoints(rankerId, rankerTribe, 'ranker', rankerFinalPoints);

    // --- CREATOR POINTS ---
    // Rule: Love = +10, Like = +5, Dislike = 0
    let creatorBasePoints = 0;
    if (ratingType === 'LOVE') creatorBasePoints = 10;
    if (ratingType === 'LIKE') creatorBasePoints = 5;

    let creatorMultiplier = 1; // Creator multiplier is always 1
    let creatorFinalPoints = creatorBasePoints * creatorMultiplier;

    if (creatorFinalPoints > 0) {
        // Save Creator Ledger
        await pointLedgerModel.create({
            user: creatorId,
            tribe: creatorTribe,
            challenge: challengeId,
            submission: submissionId,
            actionType: `RECEIVED_${ratingType}`,
            basePoints: creatorBasePoints,
            multiplier: creatorMultiplier,
            finalPoints: creatorFinalPoints
        });

        // Award Creator
        await awardPoints(creatorId, creatorTribe, 'creator', creatorFinalPoints);
    }

    return {
        success: true,
        message: "Rating processed successfully",
        data: {
            rankerPointsEarned: rankerFinalPoints,
            creatorPointsEarned: creatorFinalPoints
        }
    };
};

export const processShare = async (rankerId, submissionId) => {
    const existingLedger = await pointLedgerModel.findOne({
        user: rankerId,
        submission: submissionId,
        actionType: 'SHARE'
    });

    if (existingLedger) {
        return { success: true, message: "Shared successfully (no points awarded this time)", data: { pointsEarned: 0 } };
    }

    const submission = await submissionModel.findById(submissionId);
    if (!submission) return { success: false, message: "Submission not found" };

    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(submission.user);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : "NONE";
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    let multiplier = (rankerTribe === creatorTribe) ? 1 : 0.25;
    let basePoints = 12; // Ranker points for sharing (or standard)
    let finalPoints = basePoints * multiplier;

    await pointLedgerModel.create({
        user: rankerId,
        tribe: rankerTribe,
        challenge: submission.challenge,
        submission: submissionId,
        actionType: 'SHARE',
        basePoints,
        multiplier,
        finalPoints
    });

    await awardPoints(rankerId, rankerTribe, 'ranker', finalPoints);

    // Also award points to the CREATOR
    let creatorBasePoints = 12; // Creator gets 12 points when shared
    await pointLedgerModel.create({
        user: submission.user,
        tribe: creatorTribe,
        challenge: submission.challenge,
        submission: submissionId,
        actionType: 'RECEIVED_SHARE',
        basePoints: creatorBasePoints,
        multiplier: 1,
        finalPoints: creatorBasePoints
    });

    await awardPoints(submission.user, creatorTribe, 'creator', creatorBasePoints);

    return {
        success: true,
        message: "Share processed successfully",
        data: { pointsEarned: finalPoints, creatorPointsEarned: creatorBasePoints }
    };
};

export const processSubmissionUpload = async (userId, challengeId, submissionId, challengeStartAt) => {
    const existingLedger = await pointLedgerModel.findOne({
        user: userId,
        submission: submissionId,
        actionType: 'SUBMISSION_UPLOAD'
    });

    if (existingLedger) {
        return { success: false, message: "Upload points already awarded." };
    }

    const creatorProfile = await getUserProfile(userId);
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    let basePoints = 5; // Default points for uploading
    if (challengeStartAt) {
        const hoursSinceStart = (Date.now() - new Date(challengeStartAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceStart <= 24) {
            basePoints = 10;
        }
    }

    await pointLedgerModel.create({
        user: userId,
        tribe: creatorTribe,
        challenge: challengeId,
        submission: submissionId,
        actionType: 'SUBMISSION_UPLOAD',
        basePoints: basePoints,
        multiplier: 1,
        finalPoints: basePoints
    });

    await awardPoints(userId, creatorTribe, 'creator', basePoints);

    return {
        success: true,
        message: "Upload points awarded successfully",
        data: { pointsEarned: basePoints }
    };
};

export const processDetailedRating = async (rankerId, submissionId, challengeId, ratingsArray) => {
    const pointLedgerModel = (await import('../model/pointLedger.model.js')).default;
    const submissionModel = (await import('../model/submission.model.js')).default;

    const existingLedger = await pointLedgerModel.findOne({
        user: rankerId,
        submission: submissionId,
        actionType: 'RATE_DETAILED'
    });

    if (existingLedger) {
        return { success: false, message: 'You have already rated this submission.' };
    }

    const submission = await submissionModel.findById(submissionId);
    if (!submission) return { success: false, message: 'Submission not found' };

    const creatorId = submission.user;

    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(creatorId);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : 'NONE';
    const creatorTribe = creatorProfile ? creatorProfile.tribe : 'NONE';

    // 1. Calculate the Average
    const totalScore = ratingsArray.reduce((acc, curr) => acc + curr.score, 0);
    const averageScore = ratingsArray.length > 0 ? totalScore / ratingsArray.length : 0;

    let rankerMultiplier = (rankerTribe === creatorTribe) ? 1 : 0.25;
    let rankerBasePoints = 5;
    let rankerFinalPoints = rankerBasePoints * rankerMultiplier;

    await pointLedgerModel.create({
        user: rankerId,
        tribe: rankerTribe,
        challenge: challengeId,
        submission: submissionId,
        actionType: 'RATE_DETAILED',
        basePoints: rankerBasePoints,
        multiplier: rankerMultiplier,
        finalPoints: rankerFinalPoints
    });

    await awardPoints(rankerId, rankerTribe, 'ranker', rankerFinalPoints);

    // Creator gets exactly the mathematical average as points!
    if (averageScore > 0) {
        const creatorFinalPoints = Number(averageScore.toFixed(2));

        await pointLedgerModel.create({
            user: creatorId,
            tribe: creatorTribe,
            challenge: challengeId,
            submission: submissionId,
            actionType: 'RECEIVED_DETAILED_RATING',
            basePoints: creatorFinalPoints,
            multiplier: 1,
            finalPoints: creatorFinalPoints
        });

        await awardPoints(creatorId, creatorTribe, 'creator', creatorFinalPoints);

        return {
            success: true,
            message: 'Detailed rating processed successfully',
            data: {
                rankerPointsEarned: rankerFinalPoints,
                creatorPointsEarned: creatorFinalPoints,
                averageScore: averageScore
            }
        };
    }

    return { success: true, message: 'Processed, but no points awarded', data: { averageScore } };
};
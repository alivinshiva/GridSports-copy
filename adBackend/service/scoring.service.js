import mongoose from "mongoose";
import pointLedgerModel from "../model/pointLedger.model.js";
import submissionModel from "../model/submission.model.js";
import challengeModel from "../model/challange.model.js";

// -- UTILS --

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

export const awardPoints = async (userId, tribeName, userPointType, points, actionType = "UNKNOWN") => {
    if (points === 0) return;
    try {
        const db = mongoose.connection.db;
        const updateField = userPointType === 'creator' ? 'creatorPoints' : 'rankerPoints';
        const userUpdateQuery = { $inc: { [updateField]: points, totalPoints: points } };

        await db.collection("users").updateOne(
            { _id: new mongoose.Types.ObjectId(userId) },
            userUpdateQuery
        );

        if (tribeName && tribeName !== "NONE") {
            await db.collection("tribes").updateOne(
                { name: tribeName },
                { $inc: { totalPoints: points } },
                { upsert: true }
            );
        }
        console.log(`[Scoring] Awarded ${points} points to User ${userId} (${userPointType}) in Tribe ${tribeName} for action: ${actionType}`);
    } catch (error) {
        console.error("Error awarding points:", error);
    }
};

const getStartOfDay = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
}

const checkDailyCap = async (userId, actionPrefix, limit) => {
    const startOfDay = getStartOfDay();
    const count = await pointLedgerModel.countDocuments({
        user: userId,
        actionType: { $regex: `^${actionPrefix}` },
        createdAt: { $gte: startOfDay },
        isCapped: false
    });
    return count < limit;
}

const logPointTransaction = async (userId, tribe, challengeId, weekendId, submissionId, actionType, basePoints, multiplier, isCapped) => {
    const finalPoints = isCapped ? 0 : Number((basePoints * multiplier).toFixed(2));

    await pointLedgerModel.create({
        user: userId,
        tribe: tribe,
        weekend: weekendId,
        challenge: challengeId,
        submission: submissionId,
        actionType,
        basePoints,
        multiplier,
        finalPoints,
        isCapped
    });

    if (!isCapped && finalPoints !== 0) {
        const userPointType = actionType.startsWith("RECEIVED_") || actionType.startsWith("SUBMISSION_") || actionType.startsWith("CREATOR_") ? 'creator' : 'ranker';
        await awardPoints(userId, tribe, userPointType, finalPoints, actionType);
    }

    return finalPoints;
};

// -- F1 STREAKS & MISSIONS --

const processRaterMissions = async (userId, weekendId, rankerProfile) => {
    const rankerTribe = rankerProfile ? rankerProfile.tribe : "NONE";

    const allWeekendRatings = await pointLedgerModel.find({
        user: userId,
        weekend: weekendId,
        isCapped: false,
        actionType: { $regex: /^RATE_/ }
    });

    if (allWeekendRatings.length === 0) return;

    const awardedMissions = await pointLedgerModel.find({
        user: userId,
        weekend: weekendId,
        actionType: { $regex: /^RATER_MISSION_/ }
    });
    const awardedTypes = new Set(awardedMissions.map(m => m.actionType));

    let ownTribeCount = 0;
    let otherTribeCount = 0;

    for (const r of allWeekendRatings) {
        if (r.multiplier === 1) ownTribeCount++;
        else if (r.multiplier === 0.25) otherTribeCount++;
    }

    const totalCount = ownTribeCount + otherTribeCount;
    const effectiveMultiplier = totalCount > 0 ? ((ownTribeCount * 1.0) + (otherTribeCount * 0.25)) / totalCount : 0.25;

    if (totalCount >= 20 && !awardedTypes.has("RATER_MISSION_20")) {
        await logPointTransaction(userId, rankerTribe, null, weekendId, null, "RATER_MISSION_20", 20, effectiveMultiplier, false);
    }

    if (totalCount >= 50 && !awardedTypes.has("RATER_MISSION_50")) {
        await logPointTransaction(userId, rankerTribe, null, weekendId, null, "RATER_MISSION_50", 50, effectiveMultiplier, false);
    }

    if (!awardedTypes.has("RATER_MISSION_COVERAGE")) {
        const uniqueChallenges = new Set(allWeekendRatings.map(r => r.challenge ? r.challenge.toString() : ""));
        uniqueChallenges.delete("");
        if (uniqueChallenges.size >= 6) {
            await logPointTransaction(userId, rankerTribe, null, weekendId, null, "RATER_MISSION_COVERAGE", 30, effectiveMultiplier, false);
        }
    }

    if (!awardedTypes.has("RATER_MISSION_STREAK")) {
        const daysWithAction = new Set();
        for (const r of allWeekendRatings) {
            const day = new Date(r.createdAt).getDay();
            if (day === 0 || day === 5 || day === 6) {
                daysWithAction.add(day);
            }
        }
        if (daysWithAction.has(0) && daysWithAction.has(5) && daysWithAction.has(6)) {
            await logPointTransaction(userId, rankerTribe, null, weekendId, null, "RATER_MISSION_STREAK", 25, effectiveMultiplier, false);
        }
    }
};

const processCreatorMissions = async (userId, weekendId, creatorProfile) => {
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";
    const allUploads = await pointLedgerModel.find({
        user: userId,
        weekend: weekendId,
        actionType: 'SUBMISSION_UPLOAD'
    });

    if (allUploads.length === 0) return;

    const awardedMissions = await pointLedgerModel.find({
        user: userId,
        weekend: weekendId,
        actionType: { $regex: /^CREATOR_MISSION_/ }
    });
    const awardedTypes = new Set(awardedMissions.map(m => m.actionType));

    const uniqueChallenges = new Set(allUploads.map(r => r.challenge ? r.challenge.toString() : ""));
    uniqueChallenges.delete("");
    const count = uniqueChallenges.size;

    if (count >= 3 && !awardedTypes.has("CREATOR_MISSION_3_OF_6")) {
        await logPointTransaction(userId, creatorTribe, null, weekendId, null, "CREATOR_MISSION_3_OF_6", 12, 1.0, false);
    }
    if (count >= 5 && !awardedTypes.has("CREATOR_MISSION_5_OF_6")) {
        await logPointTransaction(userId, creatorTribe, null, weekendId, null, "CREATOR_MISSION_5_OF_6", 18, 1.0, false);
    }
    if (count >= 6 && !awardedTypes.has("CREATOR_MISSION_6_OF_6")) {
        await logPointTransaction(userId, creatorTribe, null, weekendId, null, "CREATOR_MISSION_6_OF_6", 25, 1.0, false);
    }

    if (!awardedTypes.has("CREATOR_MISSION_STREAK")) {
        const daysWithAction = new Set();
        for (const r of allUploads) {
            const day = new Date(r.createdAt).getDay();
            if (day === 0 || day === 5 || day === 6) daysWithAction.add(day);
        }
        if (daysWithAction.has(0) && daysWithAction.has(5) && daysWithAction.has(6)) {
            await logPointTransaction(userId, creatorTribe, null, weekendId, null, "CREATOR_MISSION_STREAK", 20, 1.0, false);
        }
    }
};

const checkSubmissionMilestones = async (submissionId, creatorId, creatorTribe, challengeId, weekendId) => {
    const ratingCount = await pointLedgerModel.countDocuments({
        submission: submissionId,
        actionType: { $regex: /^RATE_/ }
    });

    const milestonesAlready = await pointLedgerModel.find({
        submission: submissionId,
        actionType: { $regex: /^RECEIVED_MILESTONE_/ }
    });
    const types = new Set(milestonesAlready.map(m => m.actionType));

    if (ratingCount >= 5 && !types.has("RECEIVED_MILESTONE_5")) {
        await logPointTransaction(creatorId, creatorTribe, challengeId, weekendId, submissionId, "RECEIVED_MILESTONE_5", 5, 1.0, false);
    }
    if (ratingCount >= 10 && !types.has("RECEIVED_MILESTONE_10")) {
        await logPointTransaction(creatorId, creatorTribe, challengeId, weekendId, submissionId, "RECEIVED_MILESTONE_10", 10, 1.0, false);
    }
    if (ratingCount >= 25 && !types.has("RECEIVED_MILESTONE_25")) {
        await logPointTransaction(creatorId, creatorTribe, challengeId, weekendId, submissionId, "RECEIVED_MILESTONE_25", 20, 1.0, false);
    }
    if (ratingCount >= 50 && !types.has("RECEIVED_MILESTONE_50")) {
        await logPointTransaction(creatorId, creatorTribe, challengeId, weekendId, submissionId, "RECEIVED_MILESTONE_50", 40, 1.0, false);
    }
};

// -- MAIN ENDPOINTS --

export const processRating = async (rankerId, submissionId, ratingType) => {
    const existingLedger = await pointLedgerModel.findOne({
        user: rankerId,
        submission: submissionId,
        actionType: { $regex: /^RATE_/ }
    });

    if (existingLedger) return { success: false, message: "You have already rated this submission." };

    const submission = await submissionModel.findById(submissionId).populate("challenge");
    if (!submission) return { success: false, message: "Submission not found" };

    const creatorId = submission.user;
    const challenge = submission.challenge;
    const challengeId = challenge._id;
    const weekendId = challenge.weekend;

    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(creatorId);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : "NONE";
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    const isCapped = !(await checkDailyCap(rankerId, "RATE_EASY", 120));

    let rankerMultiplier = (rankerTribe === creatorTribe) ? 1.0 : 0.25;
    let rankerBasePoints = 3;

    const hoursSinceUpload = (Date.now() - new Date(submission.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpload < 24) rankerBasePoints += 2;
    else if (hoursSinceUpload < 48) rankerBasePoints += 1;

    // Early Traction Bonus
    const firstRatingsCount = await pointLedgerModel.countDocuments({
        submission: submissionId,
        actionType: { $regex: /^RATE_/ }
    });
    if (firstRatingsCount < 25) {
        const earlyCapped = !(await checkDailyCap(rankerId, "EARLY_TRACTION", 25));
        if (!earlyCapped) {
            await logPointTransaction(rankerId, rankerTribe, challengeId, weekendId, submissionId, "EARLY_TRACTION", 2, rankerMultiplier, false);
        }
    }

    const targetActionType = ratingType.startsWith('RATE_') ? ratingType : `RATE_${ratingType}`;

    const rankerFinal = await logPointTransaction(rankerId, rankerTribe, challengeId, weekendId, submissionId, targetActionType, rankerBasePoints, rankerMultiplier, isCapped);

    await checkSubmissionMilestones(submissionId, creatorId, creatorTribe, challengeId, weekendId);
    await processRaterMissions(rankerId, weekendId, rankerProfile);

    return {
        success: true,
        message: "Rating processed successfully",
        data: { rankerPointsEarned: rankerFinal, creatorPointsEarned: 0 }
    };
};

export const processDetailedRating = async (rankerId, submissionId, challengeId, ratingsArray, hasComment = true) => {

    const existingLedger = await pointLedgerModel.findOne({
        user: rankerId,
        submission: submissionId,
        actionType: 'RATE_DETAILED'
    });

    if (existingLedger) return { success: false, message: 'You have already rated this submission.' };

    const submission = await submissionModel.findById(submissionId).populate("challenge");
    if (!submission) return { success: false, message: 'Submission not found' };

    const creatorId = submission.user;
    const challenge = submission.challenge;
    const weekendId = challenge.weekend;

    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(creatorId);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : 'NONE';
    const creatorTribe = creatorProfile ? creatorProfile.tribe : 'NONE';

    const isCapped = !(await checkDailyCap(rankerId, "RATE_DETAILED", 60));

    let rankerMultiplier = (rankerTribe === creatorTribe) ? 1.0 : 0.25;

    // Calculate total weighted percentage score
    let totalWeightedScore = 0;
    ratingsArray.forEach(r => {
        const paramDef = challenge.parameters.find(p => p.name === r.parameterName);
        const weightage = paramDef ? paramDef.maxPoints : 0; // maxPoints stores weightage now

        // 1. Calculate the user's base score for this parameter out of its weightage
        // e.g. 4/5 stars on a 35 weightage parameter = 28 points
        const baseScore = (r.score / 5) * weightage;

        // 2. Calculate the final percentage based on the weightage 
        // e.g. 35% of those 28 points = 9.8 points
        const finalPercentScore = (weightage / 100) * baseScore;

        totalWeightedScore += finalPercentScore;
    });

    let rankerBasePoints = totalWeightedScore / 10;

    // Add bonus points
    if (hasComment) rankerBasePoints += 2;

    const hoursSinceUpload = (Date.now() - new Date(submission.createdAt).getTime()) / (1000 * 60 * 60);
    if (hoursSinceUpload < 24) rankerBasePoints += 2;
    else if (hoursSinceUpload < 48) rankerBasePoints += 1;

    // Early Traction Bonus
    const firstRatingsCount = await pointLedgerModel.countDocuments({
        submission: submissionId,
        actionType: { $regex: /^RATE_/ }
    });
    if (firstRatingsCount < 25) {
        const earlyCapped = !(await checkDailyCap(rankerId, "EARLY_TRACTION", 25));
        if (!earlyCapped) {
            await logPointTransaction(rankerId, rankerTribe, challengeId, weekendId, submissionId, "EARLY_TRACTION", 2, rankerMultiplier, false);
        }
    }

    // Multiply the base points (from the percentage calculation) using the multiplier rule
    const rankerFinal = await logPointTransaction(rankerId, rankerTribe, challengeId, weekendId, submissionId, 'RATE_DETAILED', rankerBasePoints, rankerMultiplier, isCapped);

    await checkSubmissionMilestones(submissionId, creatorId, creatorTribe, challengeId, weekendId);
    await processRaterMissions(rankerId, weekendId, rankerProfile);

    // --- Console Log for Detailed Rating ---
    const paramLog = ratingsArray.map(r => `  ${r.parameterName}: ${r.score}⭐`).join('\n');
    console.log(
        `[Detailed Rating] User ${rankerId} rated Submission ${submissionId}\n` +
        `${paramLog}\n` +
        `  Weighted Total Score : ${totalWeightedScore.toFixed(2)}%\n` +
        `  Base Points (÷10)    : ${(totalWeightedScore / 10).toFixed(2)}\n` +
        `  Comment Bonus        : ${hasComment ? '+2' : '0'}\n` +
        `  Time Bonus           : +${(rankerBasePoints - (totalWeightedScore / 10) - (hasComment ? 2 : 0)).toFixed(2)}\n` +
        `  Tribe Multiplier     : x${rankerMultiplier} (${rankerTribe} → ${creatorTribe})\n` +
        `  Capped               : ${isCapped}\n` +
        `  Final Ranker Points  : ${rankerFinal}`
    );
    // ---------------------------------------

    return {
        success: true,
        message: 'Detailed rating processed successfully',
        data: {
            rankerPointsEarned: rankerFinal,
            creatorPointsEarned: 0,
            averageScore: 0
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
        return { success: true, message: "Shared successfully", data: { pointsEarned: 0 } };
    }

    const submission = await submissionModel.findById(submissionId).populate("challenge");
    if (!submission) return { success: false, message: "Submission not found" };

    const challenge = submission.challenge;
    const weekendId = challenge.weekend;

    const rankerProfile = await getUserProfile(rankerId);
    const creatorProfile = await getUserProfile(submission.user);

    const rankerTribe = rankerProfile ? rankerProfile.tribe : "NONE";
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    const isCapped = !(await checkDailyCap(rankerId, "SHARE", 1));

    let multiplier = (rankerTribe === creatorTribe) ? 1.0 : 0.25;
    let basePoints = 12;

    const rankerFinal = await logPointTransaction(rankerId, rankerTribe, challenge._id, weekendId, submissionId, 'SHARE', basePoints, multiplier, isCapped);

    return {
        success: true,
        message: "Share processed",
        data: { pointsEarned: rankerFinal }
    };
};

export const processSubmissionUpload = async (userId, challengeId, submissionId, challengeStartAt, hasTags = false) => {
    const existingLedger = await pointLedgerModel.findOne({
        user: userId,
        submission: submissionId,
        actionType: 'SUBMISSION_UPLOAD'
    });

    if (existingLedger) {
        return { success: false, message: "Upload points already awarded." };
    }

    const challenge = await challengeModel.findById(challengeId);
    const weekendId = challenge.weekend;

    const creatorProfile = await getUserProfile(userId);
    const creatorTribe = creatorProfile ? creatorProfile.tribe : "NONE";

    let basePoints = 8;
    if (hasTags) basePoints += 2;

    if (challengeStartAt) {
        const hoursSinceStart = (Date.now() - new Date(challengeStartAt).getTime()) / (1000 * 60 * 60);
        if (hoursSinceStart <= 24) basePoints += 4;
        else if (hoursSinceStart <= 48) basePoints += 2;
    }

    const finalPoints = await logPointTransaction(userId, creatorTribe, challengeId, weekendId, submissionId, 'SUBMISSION_UPLOAD', basePoints, 1.0, false);

    await processCreatorMissions(userId, weekendId, creatorProfile);

    return {
        success: true,
        message: "Upload points awarded successfully",
        data: { pointsEarned: finalPoints }
    };
};
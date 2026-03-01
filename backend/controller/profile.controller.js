import cloudinary from "../config/cloudinary.config.js";
import profileModel from "../models/profile.model.js";
import userModel from "../models/user.model.js";
import tribeModel from "../models/tribe.model.js";
import pointLedgerModel from "../models/pointLedger.model.js";
import logger from "../config/logger.config.js";



// desc: Create Tribe
// path: POST / api/v1/profile/create-tribe
// access: Private

// bugs available not check the db directly update th ui totally depended on the frontend logic - fix the issue 
export const createTribeController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const { tribe } = req.body;

        const alreadyTribeMember = await profileModel.findOne({ user: loggedInUser });

        if (alreadyTribeMember && alreadyTribeMember.tribe) {
            return res.status(400).json({ success: false, message: "You are already a tribe member" });
        };

        const newTribe = new profileModel({
            user: loggedInUser,
            tribe
        });

        const savedTribe = await newTribe.save();

        return res.status(200).json({ success: true, message: "Tribe Created Successfully", data: savedTribe });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// desc: Upload Profile Image
// path: PUT / api/v1/profile/upload-image
// access: Private

export const uploadProfileImageController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const image = req.file;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Please Upload an Image"
            });
        }

        const profile = await profileModel.findOne({ user: loggedInUser });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        // Delete old image if exists
        if (profile.imageId) {
            const deleteImage = await cloudinary.uploader.destroy(profile.imageId);

            if (deleteImage.result !== "ok") {
                return res.status(500).json({
                    success: false,
                    message: "Failed to delete old image"
                });
            }
        }

        // Save new image
        profile.imageUrl = image.path;
        profile.imageId = image.filename;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile Image Uploaded Successfully",
            data: profile
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


// desc: Delete Profile Image
// path: DELETE / api/v1/profile/delete-image
// access: Private

export const deleteImageController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        // Find the profile first
        const profile = await profileModel.findOne({ user: loggedInUser });

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }

        if (!profile.imageId) {
            return res.status(400).json({
                success: false,
                message: "No profile image to delete"
            });
        }

        // Delete from Cloudinary
        const deleteImage = await cloudinary.uploader.destroy(profile.imageId);

        if (deleteImage.result !== "ok") {
            return res.status(500).json({
                success: false,
                message: "Failed to delete image from Cloudinary"
            });
        }

        // Remove image fields from DB
        profile.imageUrl = null;
        profile.imageId = null;

        await profile.save();

        return res.status(200).json({
            success: true,
            message: "Profile Image Deleted Successfully",
            data: profile
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};


// desc: Get Logged Profile
// path: GET / api/v1/profile/profile-details
// access: Private

export const getLoggedProfileController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const profile = await profileModel.findOne({ user: loggedInUser }).populate("user", "name isAdmin creatorPoints rankerPoints");
        // console.log("This is a profile", profile);

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile Not Found" });
        };

        return res.status(200).json({ success: true, message: "Profile fetched Successfully", data: profile });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


export const onlyTribeInformation = async (req, res) => {
    try {
        const loggedInUser = req.user._id;

        const profile = await profileModel.findOne({ user: loggedInUser }).select("tribe");

        if (!profile) {
            return res.status(404).json({ success: false, message: "Profile Not Found" });
        };

        return res.status(200).json({ success: true, message: "Profile fetched Successfully", data: profile });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};

// desc: Switch Tribe with F1 Penalties
// path: PUT /api/v1/profile/switch-tribe
// access: Private

export const switchTribeController = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const { newTribe } = req.body;

        if (!newTribe) return res.status(400).json({ success: false, message: "New tribe is required" });

        const profile = await profileModel.findOne({ user: loggedInUser });
        if (!profile) return res.status(404).json({ success: false, message: "Profile not found" });

        if (profile.switches >= 2) {
            return res.status(400).json({ success: false, message: "You have reached the maximum of 2 tribe switches per season." });
        }

        if (profile.tribe === newTribe) {
            return res.status(400).json({ success: false, message: "You are already in this tribe." });
        }

        const oldTribeName = profile.tribe;

        const fixedFee = 150;
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const recentPoints = await pointLedgerModel.aggregate([
            { $match: { user: loggedInUser, isCapped: false, createdAt: { $gte: sevenDaysAgo } } },
            { $group: { _id: null, total: { $sum: "$finalPoints" } } }
        ]);

        const recentPointsTotal = recentPoints.length > 0 ? recentPoints[0].total : 0;
        const clawbackFee = Math.floor(recentPointsTotal * 0.30);
        const totalPenalty = fixedFee + clawbackFee;

        await userModel.findByIdAndUpdate(loggedInUser, {
            $inc: {
                totalPoints: -Math.abs(totalPenalty),
                rankerPoints: -Math.abs(totalPenalty)
            }
        });

        if (oldTribeName) {
            await tribeModel.findOneAndUpdate({ name: oldTribeName }, {
                $inc: { totalPoints: -Math.abs(totalPenalty) }
            }, { upsert: true });
        }

        await pointLedgerModel.create({
            user: loggedInUser,
            tribe: oldTribeName || "NONE",
            actionType: 'TRIBE_SWITCH_PENALTY',
            basePoints: -totalPenalty,
            multiplier: 1.0,
            finalPoints: -totalPenalty,
            isCapped: false
        });

        profile.tribe = newTribe;
        profile.switches = (profile.switches || 0) + 1;
        await profile.save();

        logger.info(`[Tribe Switch] User ${loggedInUser} switched from ${oldTribeName} to ${newTribe}. Penalty: -${totalPenalty}`);

        return res.status(200).json({
            success: true,
            message: `Successfully switched to ${newTribe}. Applied a penalty of ${totalPenalty} points (${fixedFee} fixed + ${clawbackFee} clawback).`,
            data: { switchesRemaining: 2 - profile.switches, totalPenalty }
        });

    } catch (error) {
        logger.error(`Error switching tribe: ${error.message}`, { userId: loggedInUser });
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};
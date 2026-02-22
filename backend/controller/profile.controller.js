import cloudinary from "../config/cloudinary.config.js";
import profileModel from "../models/profile.model.js";



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
}
import submissionModel from "../model/submission.model.js";

export const getAllSubmissionsController = async (req, res) => {
    try {
        const submissions = await submissionModel.find({}).populate("user").populate("challenge");
        return res.status(200).json({ success: true, message: "Submissions Fetched Successfully", data: submissions });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};

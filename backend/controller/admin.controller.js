import userModel from "../models/user.model.js";


// description : get all users
// method : GET
// url : /api/v1/admin/all
// access : private

export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({}).select("-password");
        return res.status(200).json({ success: true, message: "Users Fetched Successfully", data: users });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
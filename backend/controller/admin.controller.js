import mongoose from "mongoose";
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



// desc: delete a single user by id
// method : DELETE
// url : /api/v1/admin/delete/:id
// access : private

export const deleteASingleUserById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ success: false, message: "Id is missing" });
        };

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: "Invalid Id" });
        };

        const user = await userModel.findById(id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found" });
        };

        await userModel.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "User Deleted Successfully" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
import weekendModel from "../model/weekend.model.js";
import { distributeNotificationToAllUsers } from "../service/notification.service.js";

// description : create weekend
// method : POST
// url : /api/v1/weekend/add
// access : protected

export const createWeekendController = async (req, res) => {
    try {
        const { title, season, location, startDate, endDate, status } = req.body;

        const image = req.file;

        if (!image) {
            // console.log("Image missing");
            return res.status(400).json({ success: false, message: "Image is required" });
        };

        const weekendData = new weekendModel({
            title,
            season,
            location,
            imageUrl: image.path,
            imageId: image.filename,
            startDate,
            endDate,
            status
        });

        const savedWeekend = await weekendData.save();

        if (status === 'ACTIVE') {
            await distributeNotificationToAllUsers(
                "New Weekend Live!",
                `${title} is now active and ready.`,
                "WEEKEND_LIVE",
                savedWeekend._id
            );
        }

        return res.status(201).json({ success: true, message: "Weekend Created Successfully", data: savedWeekend });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// description : get all weekends
// method : GET
// url : /api/v1/weekend/all
// access : private

export const getAllWeekendsController = async (req, res) => {
    try {
        const weekends = await weekendModel.find({});
        return res.status(200).json({ success: true, message: "Weekends Fetched Successfully", data: weekends });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// description : get weekend by id
// method : GET
// url : /api/v1/weekend/details/:id
// access : private

export const getWeekendByIdController = async (req, res) => {
    try {
        const { id } = req.params;
        const weekend = await weekendModel.findById(id);
        return res.status(200).json({ success: true, message: "Weekend Fetched Successfully", data: weekend });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// description : update weekend
// method : PUT
// url : /api/v1/weekend/update/:id
// access : private

export const updateWeekendController = async (req, res) => {
    try {
        const { id } = req.params;

        const { status } = req.body;

        const weekendExist = await weekendModel.findById(id);

        if (!weekendExist) {
            return res.status(404).json({ success: false, message: "Weekend Not Found" });
        };

        const prevStatus = weekendExist.status;
        weekendExist.status = status;
        await weekendExist.save();

        if (status === 'ACTIVE' && prevStatus !== 'ACTIVE') {
            await distributeNotificationToAllUsers(
                "Weekend Live!",
                `${weekendExist.title} is now active.`,
                "WEEKEND_LIVE",
                weekendExist._id
            );
        }

        return res.status(200).json({ success: true, message: "Weekend Updated Successfully", data: weekendExist });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};



// description : delete weekend
// method : DELETE
// url : /api/v1/weekend/delete/:id
// access : private

export const deleteWeekendController = async (req, res) => {
    try {
        const { id } = req.params;
        const weekendExist = await weekendModel.findById(id);

        if (!weekendExist) {
            return res.status(404).json({ success: false, message: "Weekend Not Found" });
        };

        await weekendModel.findByIdAndDelete(id);

        return res.status(200).json({ success: true, message: "Weekend Deleted Successfully" });

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


export const getAllActiveWeekendController = async (req, res) => {
    try {
        const weekends = await weekendModel.find({ status: "ACTIVE" });
        return res.status(200).json({ success: true, message: "Active Weekends Fetched Successfully", data: weekends });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
}
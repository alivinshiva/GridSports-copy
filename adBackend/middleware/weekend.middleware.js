import joi from "joi";


// description : create weekend middleware
// method : POST
// url : /api/v1/weekend
// access : private

export const createWeekendMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            title: joi.string().trim().min(5).max(100).required(),
            season: joi.number().integer().min(1).required(),
            location: joi.string().trim().min(2).max(100).required(),
            startDate: joi.date().required(),
            endDate: joi.date().greater(joi.ref("startDate")).required(),
            status: joi.string().valid("UPCOMING", "ACTIVE", "COMPLETED").optional().empty("")
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error?.details?.[0]?.message });
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


// description : update weekend middleware
// method : PUT
// url : /api/v1/weekend/update/:id
// access : private

export const updateWeekendMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            status: joi.string().valid("UPCOMING", "ACTIVE", "COMPLETED").optional().empty("")
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error?.details?.[0]?.message });
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};
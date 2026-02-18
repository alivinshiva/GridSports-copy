import joi from "joi";


// desc create challenge middleware
// method POST
// path /api/v1/challenge/add
// access private

export const createChallengeMiddleware = async (req, res, next) => {
    // console.log(req.body);

    // multer processes form-data. If 'rules' appears once, it's a string. If multiple times, it's an array.
    // Joi expects an array.
    if (req.body.rules) {
        if (typeof req.body.rules === 'string') {
            // If it's a string, it might be a single rule "Rule 1" or potentially a JSON string if the user changed frontend. 
            // But based on current frontend "data.append('rules', rule)", it sends raw strings.
            // We simply wrap it.
            req.body.rules = [req.body.rules];
        }
    }

    try {
        const schema = joi.object({
            weekend: joi.string().trim().length(24).pattern(/^[0-9a-fA-F]{24}$/).required(),
            name: joi.string().trim().min(3).max(100).required(),
            description: joi.string().trim().min(5).max(1000).required(),
            startAt: joi.date().required(),
            endAt: joi.date().greater(joi.ref("startAt")).required(),
            round: joi.number().integer().greater(0).required(),
            rules: joi.array().items(joi.string().trim()).required(),
            type: joi.string().valid("PHOTO", "VIDEO", "TEXT", "MIXED").required(),
            status: joi.string().valid("UPCOMING", "ACTIVE", "CLOSED").required(),
            season: joi.string().required()
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


// desc update challenge middleware
// method PUT
// path /api/v1/challenge/update/:id
// access private

export const updateChallengeMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            status: joi.string().valid("UPCOMING", "ACTIVE", "CLOSED").required()
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

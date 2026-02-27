import joi from "joi";

export const createTribeMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            tribe: joi.string().valid("ORANGE TRIBE", "SCARLET TRIBE", "AZURE TRIBE", "SILVER TRIBE", "GREEN TRIBE", "BLUE TRIBE", "PINK TRIBE", "WHITE TRIBE", "CARBON TRIBE", "GRAPHITE TRIBE", "ONYX TRIBE").required(),
            tribeName: joi.string().optional(),
            points: joi.number().optional()
        }).unknown(true); // Allow other fields like 'points' or alternative naming just in case

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};

import joi from "joi";

export const createTribeMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            tribe: joi.string().valid("IRON TRIBE", "ROYAL TRIBE", "INDIGO TRIBE", "EMERALD TRIBE", "ORANGE TRIBE", "SCARLET TRIBE", "CRIMSON TRIBE", "PLATINUM TRIBE", "TITANIUM TRIBE", "AZURE TRIBE").required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error.details[0].message });
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    };
};


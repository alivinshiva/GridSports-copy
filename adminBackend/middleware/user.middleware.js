import joi from "joi";

// Signup middleware
export const signupMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            name: joi.string().min(5).max(50).trim().required(),
            phoneNumber: joi.string().pattern(/^\+91[0-9]{10}$/).length(13).required(),
            password: joi.string().min(8).max(100).required()
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


// Login PhoneNumber Middleware
export const loginPhoneNumberMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            phoneNumber: joi.string().pattern(/^\+91[0-9]{10}$/).length(13).required(),
            password: joi.string().min(8).max(100).required()
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


// OTP Middleware
export const otpMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            code: joi.string().length(4).trim().required()
        });

        const { error } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({ success: false, message: error?.details?.[0]?.message });
        };

        next();

    } catch (error) {
        return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
    }
};


// forgot password middleware
export const forgotPasswordPhoneMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            phoneNumber: joi.string().pattern(/^\+91[0-9]{10}$/).length(13).required(),
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


// reset password middleware
export const resetPasswordPhoneMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            code: joi.string().length(4).trim().required(),
            password: joi.string().min(8).max(100).required()
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


// change password middleware
export const changePasswordMiddleware = async (req, res, next) => {
    try {
        const schema = joi.object({
            oldPassword: joi.string().min(8).max(100).required(),
            newPassword: joi.string().min(8).max(100).required()
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
import mongoose from "mongoose";

// Validate MongoDB ObjectId
export const isValidObjectId = (id) => {
    return mongoose.Types.ObjectId.isValid(id);
};

// Middleware to validate ObjectId in params
export const validateObjectIdParam = (paramName = 'id') => {
    return (req, res, next) => {
        const id = req.params[paramName];
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: `${paramName} is required`
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${paramName} format`
            });
        }

        next();
    };
};

// Middleware to validate ObjectId in body
export const validateObjectIdBody = (fieldName) => {
    return (req, res, next) => {
        const id = req.body[fieldName];
        
        if (!id) {
            return res.status(400).json({
                success: false,
                message: `${fieldName} is required`
            });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: `Invalid ${fieldName} format`
            });
        }

        next();
    };
};

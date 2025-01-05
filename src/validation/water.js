import Joi from "joi";

export const addWaterSchema = Joi.object({
    amount: Joi.number().min(50).max(15000).required().messages({
        "number.min": "Amount of water must be greater than 50 milliliters",
        "number.max": "Amount of water must be less than or equal to 15000 milliliters",
        "any.required": "Amount of water is required",
    }),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).required().messages({
        "string.base": "Date must be a string",
        "string.pattern.base": "Date must be in the format 'YYYY-MM-DDTHH:mm:ss'",
        "any.required": "Date is required",
    }),
});

export const patchWaterSchema = Joi.object({
    amount: Joi.number().min(50).max(15000).messages({
        "number.min": "Amount of water must be greater than 50 milliliters",
        "number.max": "Amount of water must be less than or equal to 15000 milliliters"
    }),
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/).messages({
        "string.base": "Date must be a string",
        "string.pattern.base": "Date must be in the format 'YYYY-MM-DDTHH:mm:ss'",
    })
});

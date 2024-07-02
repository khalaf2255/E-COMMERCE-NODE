import joi from "joi";
import { generalFields } from "../../middleware/validation.js";


export const createReview = joi.object({
    comment: joi.string().min(3).max(150).required(),
    rate: joi.number().positive().min(1).max(5).required(),
    productId: generalFields.id,
}).required();


export const updateReview = joi.object({
    comment: joi.string().min(3).max(150).required(),
    rate: joi.number().positive().min(1).max(5).required(),
    productId: generalFields.id,
    reviewId: generalFields.id,
}).required();

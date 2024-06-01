import joi from 'joi'

export const addProduct = joi.object({
    productName: joi.string().min(3).max(20).required(),
    price: joi.string().min(3).max(10).required(),
    type: joi.string().min(3).max(10).required(),
    discount: joi.number(),
    copun: joi.boolean(),
    userId:  joi.string(),
    user:  joi.object(),
}).required();


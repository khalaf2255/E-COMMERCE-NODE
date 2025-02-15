import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createCoupon = joi.object({
    name: joi.string().min(2).max(25).required(),
    file: generalFields.file.required(),
    amount: joi.number().min(1).max(100).required(),
    expireDate: joi.date().greater(Date.now()).required()

}).required()


export const updateCoupon = joi.object({
    couponId: generalFields.id,
    name: joi.string().min(2).max(20),
    file: generalFields.file,
    amount: joi.number().min(1).max(100).required(),
    expireDate: joi.date().greater(Date.now())
})   
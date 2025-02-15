import joi from 'joi'
import { generalFields } from '../../middleware/validation.js'

export const createOrder = joi.object({
    note: joi.string().min(1),
    reason: joi.string().min(1),
    address: joi.string().min(1).required(),
    phone: joi.array().items(
        joi.string().pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
    ).min(1).max(3).required(),
    couponName: joi.string(),
    paymentType: joi.string().valid("cash", "card"),
    products: joi.array().items(
        joi.object({
            productId: generalFields.id,
            quantity: joi.number().positive().integer().min(1).required()
        })
    ).min(1)
}).required()



export const cancelOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(1).required(),
}).required()

export const rejectedOrder = joi.object({
    orderId: generalFields.id,
    reason: joi.string().min(1).required(),
}).required()

export const changeOrderStatus = joi.object({
    orderId: generalFields.id,
    status: joi.string().min(1).required(),
}).required()


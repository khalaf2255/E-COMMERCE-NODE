import joi from 'joi'
import { generalFields } from '../../middleware/validation.js';

export const signup = joi.object({
    //body
    firstname: joi.string().min(3).max(20),
    lastname: joi.string().min(3).max(20),
    phone: joi.string().min(3).max(11),
    username: joi.string().alphanum().min(3).max(20).required(),
    email: generalFields.email,
    password: generalFields.password,
    cPassword: generalFields.cPassword,
    role: joi.string().min(2).max(20),
    gender: joi.string().min(2).max(20),
    file: generalFields.file
}).required();

export const login = joi.object({
    email: generalFields.email,
    password: generalFields.password
}).required()

export const sendCode  = joi.object({
    email: generalFields.email
}).required()

export const forgetPassword  = joi.object({
    email: generalFields.email,
    forgetCode: joi.number().required(),
    password: generalFields.password,
    cPassword: generalFields.cPassword,
}).required()

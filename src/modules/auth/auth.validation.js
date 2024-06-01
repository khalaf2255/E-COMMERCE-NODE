// import joi from 'joi'

// export const signup = joi.object({
//     //body
//     firstname: joi.string().min(3).max(20),
//     lastname: joi.string().min(3).max(10),
//     phone: joi.string().min(3).max(10),
//     username: joi.string().alphanum().min(3).max(20).required(),
//     email: joi.string().email(
//         { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'pro'] } }
//     ).required(),
//     password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
//     cPassword: joi.string().valid(joi.ref("password")).required(),
//     //params
//     // flag: joi.boolean().required()
// }).required();


// // export const signup = {

// //     body: joi.object({
// //         firstname: joi.string().min(3).max(20),
// //         lastname: joi.string().min(3).max(10),
// //         username: joi.string().alphanum().min(3).max(20).required(),
// //         email: joi.string().email(
// //             { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'hambozo'] } }
// //         ).required(),
// //         password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
// //         cPassword: joi.string().valid(joi.ref("password")).required(),

// //     }).required(),

// //     params: joi.object({
// //         flag:joi.boolean().required()
// //     }).required()

// // }

// export const login =  joi.object({
//         email: joi.string().email({ minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'hambozo'] } }).required(),
//         password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
//     }).required()

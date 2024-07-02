import joi from 'joi'
import { generalFields } from "./../../middleware/validation.js"

//* ADD TO WISHLIST ------------->
export const addToWishlist = joi.object({
    productId: generalFields.id
})
//* REMOVE FROM WISHLIST ------------->
export const removefromWishlist = joi.object({
    productId: generalFields.id
})
//* MAKE A VAKIDATION ON HEADERS KEYS.
export const headers = joi.object({
    authorization: generalFields.headers
})

//* MAKE A VAKIDATION ON BODY KEYS.
export const createProduct = joi.object({

    name: joi.string().min(3).max(150).required(),
    description: joi.string().min(3).max(150000).required(),
    size: joi.array(),
    colors: joi.array(),
    stock: joi.number().positive().integer().min(1).required(),
    price: joi.number().positive().min(1).required(),
    discount: joi.number().positive().min(1),

    categoryId: generalFields.id,
    subCategoryId: generalFields.id,
    brandId: generalFields.id,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file.required()).length(1).required(),
        subImages: joi.array().items(generalFields.file).length(1)
    })
}).required();

//* MAKE A VAKIDATION ON BODY KEYS.
export const updateProduct = joi.object({

    name: joi.string().min(3).max(150),
    description: joi.string().min(3).max(150000),
    size: joi.array(),
    colors: joi.array(),
    stock: joi.number().positive().integer().min(1),
    price: joi.number().positive().min(1),
    discount: joi.number().positive().min(1),

    productId: generalFields.optionalId,
    categoryId: generalFields.optionalId,
    subCategoryId: generalFields.optionalId,
    brandId: generalFields.optionalId,

    file: joi.object({
        mainImage: joi.array().items(generalFields.file).length(1),
        subImages: joi.array().items(generalFields.file)
    })
}).required();


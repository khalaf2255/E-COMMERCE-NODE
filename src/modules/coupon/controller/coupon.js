import cloudinary from './../../../uitls/couldinary.js'
import couponModel from "./../../../../DB/model/Coupon.model.js"
import { asyncHandler } from '../../../uitls/errorHandling.js'
import { generalFields } from '../../../middleware/validation.js'


export const getCoupon = async (req, res, next) => {
    return res.status(201).send({ message: "Brand" })
}


// *createcoupon -------------------------------------------------------->
export const createCoupon = asyncHandler(async (req, res, next) => {

    const { name } = req.body
    const { user, file } = req


    const checkCouponName = await couponModel.findOne({ name: req.body.name })
    if (checkCouponName) return next(new Error(`Duplicate coupon name: ${name} `), { cause: 409 })

    if (file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `coupon` })
        req.body.image = { secure_url, public_id, folder }
    }
    
    // *HANDLE THE EXPIRE DATE FOR COUPON --------------------<
    req.body.expireDate = new Date(req.body.expireDate)
    req.body.createdBy = user._id
    const coupon = await couponModel.create(req.body)

    return res.send({ message: "Done", coupon })
})


// *updatecoupon --------------------------------------------------------<
export const updateCoupon = asyncHandler(async (req, res, next) => {

    const coupon = await couponModel.findById(req.params.couponId)
    if (!coupon) return next(new Error(`This coupon not exist OR In-valid id`, { cause: 400 }))


    if (req.body.name) {
        if (coupon.name == req.body.name) return next(new Error(`Sorry! can not update with the same name.`, { cause: 400 }))
        if (await couponModel.findOne({ name: req.body.name })) return next(new Error(`Sorry! This coupon is already exist.`, { cause: 400 }))
        coupon.name = req.body.name
    }

    // *UPDATE THE EXPIRE DATE FOR COUPON --------------------<
    if (req.body.expireDate) coupon.expireDate = new Date(req.body.expireDate)
    if (req.body.amount) coupon.amount = req.body.amount
    if (req.body.expireDate) coupon.expireDate = req.body.expireDate
    if (req.file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `coupon` })
        if (coupon.image) {
            await cloudinary.uploader.destroy(coupon.image.public_id)
        }
        coupon.image = { secure_url, public_id, folder }
    }

    coupon.updatedBy = req.user._id
    coupon.save()
    return res.send({ message: "Done", coupon })

}) 
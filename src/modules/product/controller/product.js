import { asyncHandler } from '../../../uitls/errorHandling.js'
import subCategoryModel from '../../../../DB/model/Subcategory.model.js'
import brandModel from '../../../../DB/model/Brand.model.js'
import userModel from '../../../../DB/model/User.model.js'
import productModel from '../../../../DB/model/Product.model.js'
import cloudinary from "cloudinary"
import slugify from 'slugify'
import { nanoid } from 'nanoid'
import { paginate } from '../../../uitls/paginate.js'
import ApiFeatuers from './apiFeatures.js'



export const getProduct = asyncHandler(async (req, res, next) => {


    const apiFeatures = new ApiFeatuers(productModel.find().populate(
        [
            {
                path: "review",
                populate: [
                    { path: "user", select: "username" }
                ]
            }
        ]), req.query)
        // ]), req.query).paginate().filter().sort().search().select()


    const products = await apiFeatures.mongooseQuery
    for (let i = 0; i < products.length; i++) {
        let calcRating = 0
        for (let x = 0; x < products[i].review.length; x++) {
            calcRating += products[i].review[x].rate
            console.log(calcRating);
        }
        let avgRating = calcRating / products[i].review.length
        const product = products[i].toObject()
        product.avgRating = avgRating
        products[i] = product

    }

    return res.status(201).send({ message: "Done", products })
})


// *PREPAIR THE (CREATION-PRODUCT END POINT) ---------------------------------->
// *----------------------------------------------------------------------------
// *----------------------------------------------------------------------------

export const createProduct = asyncHandler(async (req, res, next) => {

    const { name, categoryId, subCategoryId, brandId, price, discount } = req.body
    // *CHECK THE CATEGORY-ID AND SUBCATEGORY-ID -------------------------------------->
    if (!await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
        return next(new Error("CategoryId or SubcategoryId is In-valid"))
    }
    // *CHECK THE BRAND-ID -------------------------------------->
    if (!await brandModel.findOne({ _id: brandId })) {
        return next(new Error("BrandId is In-valid"))
    }

    // *SLUGIFY THE PRODUCT-NAME -------------------------------------->
    if (name) {
        req.body.name = name
        req.body.slug = slugify(name, {
            replacement: '-',
            lower: true,
            trim: true
        })
    }

    // *COUNT THE FINAL-PRICE ---------------------------------------->
    req.body.finalPreice = price - (price * ((discount || 0) / 100))

    // *UPLOAD THE MAIN-PRODUCT-IMAGE -------------------------------------->
    const customId = nanoid()
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/mainImage` })
    req.body.mainImage = { secure_url, public_id }

    // *UPLOAD THE SUB-PRODUCT-IMAGES -------------------------------------->

    if (req.files.subImages) {
        req.body.subImages = []
        for (const file of req.files.subImages) {
            console.log(req.files.subImages);
            const customId = nanoid()
            const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `${process.env.APP_NAME}/product/${req.body.customId}/subImages` })
            req.body.subImages.push({ secure_url, public_id })
        }
    }

    // *RECORD THE USER-UPDATED  -------------------------------------->
    req.body.createdBy = req.user._id
    const product = await productModel.create(req.body)
    return res.status(201).send({ message: "Product", product })
})



// *PREPAIR THE (UPDATE-PRODUCT END POINT) ---------------------------------->
// *----------------------------------------------------------------------------
// *----------------------------------------------------------------------------

export const updateProduct = asyncHandler(async (req, res, next) => {

    // *GET DATA FROM BODY AND PAEAMS ---------------------------------------->
    const { productId } = req.params
    const { name, categoryId, subCategoryId, brandId, price, discount, colors, size } = req.body


    // *CHECK THE PRODUCT IS EXIST OR NOT ---------------------------------------->
    const product = await productModel.findById(productId)
    if (!product) return next(new Error("Product-id is In-valid"))

    // *CHECK THE CATEGORY ID AND SUBCATEGORY ID -------------------------------------->
    if (categoryId && subCategoryId) {
        if (!await subCategoryModel.findOne({ _id: subCategoryId, categoryId })) {
            return next(new Error("CategoryId or SubcategoryId is In-valid"))
        }
        product.categoryId = categoryId
        product.subCategoryId = subCategoryId
    }

    // *CHECK THE BRAMD-ID  -------------------------------------->
    if (brandId) {
        if (!await brandModel.findOne({ _id: brandId })) {
            return next(new Error("BrandId is In-valid"))
        }
        product.brandId = brandId

    }

    // *SLUGIFY THE PRODUCT-NAME -------------------------------------->
    if (name) {
        product.name = req.body.name
        product.slug = slugify(name, '-')
        // *req.body.name = slugify(name, {
        // *    replacement: '-',
        // *    lower: true,
        // *    trim: true
        // *})
    }

    // *RECORED THE NEW COLORS IN DATA-BASE ---------------------------------------->
    if (colors) product.colors = req.body.colors

    // *RECORED THE NEW SIZE IN DATA-BASE ---------------------------------------->
    if (size) product.size = req.body.size

    // *COUNT THE FINAL-PRICE ---------------------------------------->
    if (price && discount) {
        console.log("price && discount");
        product.finalPrice = price - (price * ((discount) / 100))
        product.price = price
        product.discount = discount
    } else if (price) {
        console.log("price");
        product.finalPrice = price - (price * ((product.discount) / 100))
        product.price = price
    } else if (discount) {
        console.log("discount");
        product.finalPrice = product.price - (product.price * ((discount) / 100))
        product.discount = discount
    }


    // *UPLOAD THE MAIN-PRODUCT-IMAGE -------------------------------------->
    if (req.files?.mainImage?.length) {
        const customId = nanoid()
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.mainImage[0].path, { folder: `${process.env.APP_NAME}/product/${customId}/mainImage` })
        await cloudinary.uploader.destroy(product.mainImage.public_id)
        product.mainImage = { secure_url, public_id }
    }

    // *UPLOAD THE SUB-PRODUCT-IMAGES -------------------------------------->
    if (req.files?.subImages?.length) {
        const customId = nanoid()
        if (req.files.subImages) {
            product.subImages = []
            for (const file of req.files.subImages) {
                const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `product` })
                for (const el of product.subImages) {
                    await cloudinary.uploader.destroy(el.public_id)
                }
                product.subImages.push({ secure_url, public_id })
            }
        }
    }
    // *RECORD THE USER-UPDATED WITH PRODUCT  -------------------------------------->
    product.updatedBy = req.user._id

    // *RECORD THE UPDATED FIELDS IN DATA-BASE  -------------------------------------->
    await productModel.updateOne({ _id: product._id }, req.body)

    // *SAVE PRODUCT  -------------------------------------->
    product.save()

    return res.status(201).send({ message: "Product", product })
})


//* ADD TO WISHLIST ------------------>
export const addToWishlist = asyncHandler(async (req, res, next) => {
    const product = await productModel.findById(req.params.productId)
    if (!product) return next(new Error("In-valid productId", { cause: 400 }))
    await userModel.updateOne({ _id: req.user._id }, { $addToSet: { wishlist: req.params.productId } })
    return res.status(201).send({ message: "Done", wishlist: req.user.wishlist })
})

//* REMOVE FROM WISHLIST ------------------>
export const removefromWishlist = asyncHandler(async (req, res, next) => {
    await userModel.updateOne({ _id: req.user._id }, { $pull: { wishlist: req.params.productId } })
    return res.status(201).send({ message: "Done", wishlist: req.user.wishlist })
})

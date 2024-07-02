import cloudinary from '../../../uitls/couldinary.js'
import subcategoryModel from "../../../../DB/model/Subcategory.model.js"
import slugify from 'slugify'
import { asyncHandler } from '../../../uitls/errorHandling.js'
import { generalFields } from '../../../middleware/validation.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import { nanoid } from 'nanoid'

// *getSubcategory -------------------------------------------------------->
export const getSubcategory = asyncHandler(async (req, res, next) => {
    const subcategories = await subcategoryModel.find({})
    return res.send({ message: "Done", subcategories })
})

// *createsubcategory -------------------------------------------------------->
export const createSubcategory = asyncHandler(async (req, res, next) => {

    const { categoryId } = req.params
    const { user } = req
    console.log(user);
    if (user.role != "admin") return next(new Error(`Sorry, You don't have an access to ctreate subCategory`), { cause: 409 })

    const category = await categoryModel.findById(categoryId)

    if (!category) return next(new Error(`In-valid category ID`, { cause: 400 }))

    const { name } = req.body

    const customId = nanoid()
    const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `subcategory` })

    const checksubcategory = await subcategoryModel.findOne({ name })
    if (checksubcategory) return next(new Error(`Duplicate subcategory name => ( ${name} ) <=`), { cause: 409 })

    const subcategory = await subcategoryModel.create({
        name,
        slug: slugify(name, "-"),
        image: { secure_url, public_id, folder },
        customId,
        categoryId,
        createdBy: user._id
    })

    return res.send({ message: "Done", subcategory, user })

})


// *updateSubcategory -------------------------------------------------------->
export const updateSubcategory = asyncHandler(async (req, res, next) => {

    const { categoryId, subCategoryId } = req.params


    const subcategory = await subcategoryModel.findOne({ _id: subCategoryId, categoryId })
    console.log(subcategory);
    if (!subcategory) return next(new Error(`This subcategory not exist OR In-valid id`, { cause: 400 }))

    if (req.body.name) {
        if (subcategory.name == req.body.name) return next(new Error(`Sorry! can not update with the same name.`, { cause: 400 }))
        if (await subcategoryModel.findOne({ name: req.body.name })) return next(new Error(`Sorry! This subcategory is already exist.`, { cause: 400 }))
        subcategory.name = req.body.name
        subcategory.slug = slugify(req.body.name, "-")
    }

    if (req.file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `subcategory` })
        await cloudinary.uploader.destroy(subcategory.image.public_id)
        subcategory.image = { secure_url, public_id, folder }
    }

    subcategory.updatedBy = req.user._id
    subcategory.save()
    return res.send({ message: "Done", subcategory })

}) 
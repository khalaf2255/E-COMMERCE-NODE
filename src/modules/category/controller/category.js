import cloudinary from './../../../uitls/couldinary.js'
import categoryModel from "./../../../../DB/model/Category.model.js"
import slugify from 'slugify'
import { asyncHandler } from '../../../uitls/errorHandling.js'
import { generalFields } from '../../../middleware/validation.js'

// *createCategory -------------------------------------------------------->
export const getCategory = asyncHandler(async (req, res, next) => {

    // *const categories = await categoryModel.find({}).populate({ path: 'author' })
    const categories = await categoryModel.find({}).populate([
        {
            path: 'subcategoryItem'
        }
    ])
    console.log(categories);
    // *const categories = await categoryModel.find({})
    return res.send({ message: "Done", categories })

})

// *createCategory -------------------------------------------------------->
export const createCategory = asyncHandler(async (req, res, next) => {

    const { name } = req.body
    const { user, file } = req

    console.log(file);
    if (user.role != "admin") return next(new Error(`Sorry, You don't have access to ctreate category`), { cause: 409 })
    const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `category` })

    const checkCategory = await categoryModel.findOne({ name })
    if (checkCategory) return next(new Error(`Duplicate category name => ( ${name} ) <=`), { cause: 409 })

    const category = await categoryModel.create({
        name,
        slug: slugify(name, "-"),
        image: { secure_url, public_id, folder },
        createdBy: user._id
    })

    return res.send({ message: "Done", category })

})


// *updateCategory -------------------------------------------------------->
export const updateCategory = asyncHandler(async (req, res, next) => {

    const category = await categoryModel.findById(req.params.categoryId)
    if (!category) return next(new Error(`This category not exist OR In-valid id`, { cause: 400 }))

    if (req.body.name) {
        if (category.name == req.body.name) return next(new Error(`Sorry! can not update with the same name.`, { cause: 400 }))
        if (await categoryModel.findOne({ name: req.body.name })) return next(new Error(`Sorry! This category is already exist.`, { cause: 400 }))
        category.name = req.body.name
        category.slug = slugify(req.body.name, "-")
    }

    if (req.file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `category` })
        await cloudinary.uploader.destroy(category.image.public_id)
        category.image = { secure_url, public_id, folder }
    }
    
    category.updatedBy = req.user._id
    category.save()
    return res.send({ message: "Done", category })

}) 
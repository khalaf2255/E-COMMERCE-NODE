import cloudinary from './../../../uitls/couldinary.js'
import categoryModel from "./../../../../DB/model/Category.model.js"
import slugify from 'slugify'
import { asyncHendler } from '../../../uitls/errorHandling.js'
import { generalFields } from '../../../middleware/validation.js'
 
// createCategory -------------------------------------------------------->
export const createCategory = asyncHendler(async (req, res, next) => {
 
    const { name } = req.body
    const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `Ecommerce/category` })

    const checkCategory = await categoryModel.findOne({ name })
    if (checkCategory) return next(new Error(`Duplicate category name => ( ${name} ) <=`), { cause: 409 })

    const category = await categoryModel.create({
        name,
        slug: slugify(name, "-"),
        image: { secure_url, public_id }
    })
    return res.send({ message: "Done", category })

})
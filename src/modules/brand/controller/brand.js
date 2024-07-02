import brandModel from "../../../../DB/model/Brand.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";
import { asyncHandler } from "../../../uitls/errorHandling.js";
import cloudinary from "cloudinary"
export const getBrand = async (req, res, next) => {


    // *const brand = await brandModel.find({}).populate({ path: 'author' })
    const brand = await brandModel.find({})
    console.log(brand);
    // *const brand = await brandModel.find({})
    return res.status(201).send({ message: "Done", brand })


}





// *createBrand -------------------------------------------------------->
export const createBrand = asyncHandler(async (req, res, next) => {

    const { name } = req.body
    // *const { name, categoryName } = req.body
    const { user, file } = req

    // *console.log(categoryName);

    if (user.role != "admin") return next(new Error(`Sorry, You don't have access to ctreate brand`), { cause: 409 })

    const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `brand` })

    const checkBrand = await brandModel.findOne({ name })



    // *const categories = await categoryModel.findOne({ name: categoryName })
    // *console.log("ss" + categories);
    if (checkBrand) return next(new Error(`Duplicate brand name => ( ${name} ) <=`), { cause: 409 })

    const brand = await brandModel.create({
        name,
        logo: { secure_url, public_id, folder },
        addedBy: user._id,
        // *categoryName,
        // *categories: { categoryId: categories._id }
    })
    return res.send({ message: "Done", brand })

})




// *updatebrand -------------------------------------------------------->
export const updateBrand = asyncHandler(async (req, res, next) => {

    const brand = await brandModel.findById(req.params.brandId)
    if (!brand) return next(new Error(`This brand not exist OR In-valid id`, { cause: 400 }))

    if (req.body.name) {
        if (brand.name == req.body.name) return next(new Error(`Sorry! can not update with the same name.`, { cause: 400 }))
        if (await brandModel.findOne({ name: req.body.name })) return next(new Error(`Sorry! This brand is already exist.`, { cause: 400 }))
        brand.name = req.body.name
    }

    if (req.file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `brand` })
        await cloudinary.uploader.destroy(brand.logo.public_id)
        brand.logo = { secure_url, public_id, folder }
    }
    brand.updatedBy = req.user._id
    console.log(brand.updatedBy);
    brand.save()
    return res.send({ message: "Done", brand })

}) 
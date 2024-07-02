import { validation } from '../../middleware/validation.js';
import * as validators from "./category.validation.js"
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import * as categoryController from './controller/category.js'
import subcategory from '../subCategory/subcategory.router.js'
import { Router } from "express"
import { authFun, roles } from '../../middleware/authntication.js';
import { endPoint } from './category.endPoint.js';
const router = Router({ caseSensitive: false });




router.use("/:categoryId/subcategory", subcategory)

// *router.get("/", authFun(Object.values(roles)), categoryController.getCategory)
router.get("/",  categoryController.getCategory)

router.post("/",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createCategory),
    categoryController.createCategory)


router.put("/:categoryId",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateCategory),
    categoryController.updateCategory)


export default router


 
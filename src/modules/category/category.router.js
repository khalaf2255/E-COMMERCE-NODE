import { validation } from '../../middleware/validation.js';
import * as validators from "./category.validation.js"
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import * as categoryController from './controller/category.js'
import { Router } from "express"
const router = Router();


router.post("/",
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createCategory),
    categoryController.createCategory)

    
export default router   
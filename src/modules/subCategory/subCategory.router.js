import { validation } from '../../middleware/validation.js';
import * as validators from "./subcategory.validation.js"
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import * as subCategoryController from './controller/subcategory.js'
import { Router } from "express"
import { authFun, roles } from '../../middleware/authntication.js';
import { endPoint } from './subcategory.endPoint.js';
const router = Router({ mergeParams: true });


router.get("/", authFun(Object.values(roles)), subCategoryController.getSubcategory)

router.post("/",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createSubcategory),
    subCategoryController.createSubcategory)


router.put("/:subCategoryId",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateSubcategory),
    subCategoryController.updateSubcategory)


export default router   
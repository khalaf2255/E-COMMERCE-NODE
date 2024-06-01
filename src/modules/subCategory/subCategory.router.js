import * as subCategoryController from  './subCategory.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", subCategoryController.getSubCategory) 

export default router 
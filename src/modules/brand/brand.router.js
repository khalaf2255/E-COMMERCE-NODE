import { authFun, roles } from '../../middleware/authntication.js';
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import { endPoint } from './brand.endPoint.js';
import * as brandController from './controller/brand.js'
import * as validators from './brand.validation.js'
import { Router } from "express"
const router = Router();

// *router.get("/", authFun(Object.values(roles)), brandController.getBrand)
router.get("/",brandController.getBrand)

router.post("/",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createBrand),
    brandController.createBrand)


router.put("/:brandId",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateBrand),
    brandController.updateBrand)


export default router;
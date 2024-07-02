import * as validators from "./coupon.validation.js"
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import * as couponController from './controller/coupon.js'
import { Router } from "express"
import { authFun, roles } from '../../middleware/authntication.js';
import { endPoint } from './coupon.endPoint.js';
import { validation } from "../../middleware/validation.js";

const router = Router();

router.get("/", authFun(Object.values(roles)), couponController.getCoupon)


router.post("/",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.createCoupon),
    couponController.createCoupon)


router.put("/:couponId",
    authFun(endPoint.create),
    fileUpload(fileValidation.image).single("image"),
    validation(validators.updateCoupon),
    couponController.updateCoupon)


export default router





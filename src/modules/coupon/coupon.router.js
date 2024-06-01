import * as couponController from  './coupon.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", couponController.getCoupon) 

export default router 
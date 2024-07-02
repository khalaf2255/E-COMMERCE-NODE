import * as orderController from './controller/order.js'
import * as validators from './order.validation.js'
import { authFun } from "./../../middleware/authntication.js"
import { Router } from "express"
import { endPoint } from './order.endPoint.js';
import { validation } from '../../middleware/validation.js';

const router = Router();

router.post("/",
     authFun(endPoint.createOrder),
     validation(validators.createOrder),
     orderController.createOrder)

router.patch("/cancel/:orderId",
     authFun(endPoint.cancelOrder),
     validation(validators.cancelOrder),
     orderController.cancelOrder)

router.patch("/reject/:orderId",
     authFun(endPoint.rejectedOrder),
     validation(validators.rejectedOrder),
     orderController.rejectedOrder)

router.patch("/:orderId/admin",
     authFun(endPoint.changeOrderStatus),
     validation(validators.changeOrderStatus),
     orderController.changeStatusByAdmin)

export default router  
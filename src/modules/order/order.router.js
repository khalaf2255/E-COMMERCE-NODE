import * as orderController from  './order.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", orderController.getOrder) 

export default router 
import * as productController from  './product.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", productController.getProduct) 

export default router 
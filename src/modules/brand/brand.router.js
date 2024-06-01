import * as brandController from  './brand.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", brandController.getBrand) 

export default router 
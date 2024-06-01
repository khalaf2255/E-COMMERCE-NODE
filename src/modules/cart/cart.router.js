import * as cartController from  './cart.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", cartController.getCart) 

export default router 
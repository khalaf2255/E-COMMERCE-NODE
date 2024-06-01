 import * as authController from  './auth.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", authController.getUsers) 

export default router 
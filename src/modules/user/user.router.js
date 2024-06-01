import * as userController from  './user.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", userController.getUser) 

export default router 
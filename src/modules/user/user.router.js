import { authFun, roles } from '../../middleware/authntication.js';
import * as userController from './controller/user.js'
import { Router } from "express"
const router = Router();

router.get("/", 
    userController.getUser)

// *router.patch("/sendCode", userController.sendCode)


export default router   
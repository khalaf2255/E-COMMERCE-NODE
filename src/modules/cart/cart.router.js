import { authFun } from '../../middleware/authntication.js';
import { endPoint } from './cart.endPoint.js';
import * as cartController from './controller/cart.js'
import { Router } from "express"
const router = Router();

router.get("/",
    cartController.getCart)


router.post("/",
    authFun(endPoint.create),
    cartController.createCart)


router.patch("/remove",
    authFun(endPoint.remove),
    cartController.removeItems)


router.patch("/clearCart",
    authFun(endPoint.remove),
    cartController.clearCart)

export default router 
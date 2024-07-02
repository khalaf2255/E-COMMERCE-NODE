import { authFun, roles } from '../../middleware/authntication.js';
import { validation } from '../../middleware/validation.js';
import { fileUpload, fileValidation } from '../../uitls/multer.js';
import { endPoint } from './auth.endPoint.js';
import * as authController from './controller/auth.js'
import * as validators from './auth.validation.js'
import { Router } from "express"
const router = Router();

// *router.get("/", authFun(Object.values(roles)), authController.getUsers)
router.get("/", authController.getUsers)
router.post("/signup", fileUpload(fileValidation.image).single("image"), validation(validators.signup), authController.signup)
router.get("/confirmEmail/:token", authController.confirmEmail)
router.get("/newConfirmEmail/:token", authController.newConfirmEmail)
router.post("/login", validation(validators.login), authController.login)
router.put("/upadteUser/:userId", authFun(endPoint.create), fileUpload(fileValidation.image).single("image"), authController.upadteUser)
router.delete("/:email", authController.deleteUser)
router.patch("/sendCode", validation(validators.sendCode), authController.sendCode)
router.patch("/forgetPassword", validation(validators.forgetPassword), authController.forgetPassword)


export default router        
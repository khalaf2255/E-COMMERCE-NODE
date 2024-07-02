import * as productController from './controller/product.js'
import { fileUpload, fileValidation } from '../../uitls/multer.js'
import * as validators from "./product.vaildation.js"
import { Router } from "express"
import { authFun } from '../../middleware/authntication.js';
import { endPoint } from './product.endPoint.js';
import { validation } from './../../middleware/validation.js';
import reviewRouter from './../reviews/reviews.router.js';
const router = Router();

router.use("/:productId/review", reviewRouter)

router.get("/", productController.getProduct)


router.post("/",
    // *MIDDLEWARE TO CHECK THE HEADERS KEYS
    validation(validators.headers, true),
    // *MIDDLEWARE AUTHINTCATION AND AUTHORIZATION USRS
    authFun(endPoint.create),
    // *MIDDLEWARE YPLOAD IMAGES
    fileUpload(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ]),
    // *MIDDLEWARE TO CHECK THE HEADERS KEYS
    validation(validators.createProduct),
    // *CREATION'S END-POINT
    productController.createProduct)


router.put("/:productId",
    // *MIDDLEWARE TO CHECK THE HEADERS KEYS
    validation(validators.headers, true),
    // *MIDDLEWARE AUTHINTCATION AND AUTHORIZATION USRS
    authFun(endPoint.update),
    // *MIDDLEWARE YPLOAD IMAGES
    fileUpload(fileValidation.image).fields([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 },
    ]),
    // *MIDDLEWARE TO CHECK THE HEADERS KEYS
    validation(validators.updateProduct),
    // *UPDATE'S END-POINT
    productController.updateProduct)

// * ADD TO WISH LIST 
router.patch("/:productId/wishlist",
    authFun(endPoint.addToWishlist),
    validation(validators.addToWishlist),
    productController.addToWishlist)

// * DELETE FROM WISH LIST 
router.patch("/:productId/wishlist/remove",
    authFun(endPoint.removefromWishlist),
    validation(validators.removefromWishlist),
    productController.removefromWishlist)



export default router 
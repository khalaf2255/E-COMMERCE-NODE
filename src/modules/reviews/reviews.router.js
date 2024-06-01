import * as reviewsController from  './reviews.endPoint.js'
import {Router} from "express"
const router = Router();

router.get("/", reviewsController.getReviews) 

export default router 
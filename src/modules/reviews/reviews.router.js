import { endPoint } from '../reviews/reviews.endPoint.js';
import * as reviewsController from './controller/reviews.js'
import * as validators from './reviews.validation.js'
import { validation } from '../../middleware/validation.js';
import { authFun } from '../../middleware/authntication.js';
import { Router } from "express"
const router = Router({ mergeParams: true });


router.post("/",
    authFun(endPoint.createReview),
    validation(validators.createReview),
    reviewsController.createReview)

router.put("/:reviewId",
    authFun(endPoint.updateReview),
    validation(validators.updateReview),
    reviewsController.updateReview)

export default router 
import { asyncHandler } from "../../../uitls/errorHandling.js";
import orderModel from "../../../../DB/model/Order.model.js";
import reviewModel from "../../../../DB/model/Review.model.js";

export const createReview = asyncHandler(async (req, res, next) => {

    const { productId } = req.params
    const { comment, rate } = req.body

    const order = await orderModel.findOne({
        userId: req.user._id,
        status: "delivered",
        'products.productId': productId
    })
    if (!order) return next(new Error("Cannot review order before recive it", { cause: 400 }))

    const checkReview = await reviewModel.findOne({ createdBy: req.user._id, productId, orderId: order.orderId })
    if (checkReview) return next(new Error("You already reviwed this product", { cause: 400 }))

    const review = await reviewModel.create({
        comment,
        rate,
        productId,
        orderId: order.orderId,
        createdBy: req.user._id

    })

    return res.status(201).send({ message: "Done", review })
})



export const updateReview = asyncHandler(async (req, res, next) => {
    const { productId, reviewId } = req.params
    await reviewModel.updateOne({ _id: reviewId, productId }, req.body)
    const review = await reviewModel.findById(reviewId)
    return res.status(201).send({ message: "Done", review })
})

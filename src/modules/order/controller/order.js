import couponModel from "../../../../DB/model/Coupon.model.js"
import productModel from "../../../../DB/model/Product.model.js"
import orderModel from "./../../../../DB/model/Order.model.js"
import cardModel from "./../../../../DB/model/Cart.model.js"
import { asyncHandler } from "../../../uitls/errorHandling.js";
import cartModel from "./../../../../DB/model/Cart.model.js";
import { clearCartFun, removeItemsFromCart } from "../../cart/controller/cart.js";

export const createOrder = asyncHandler(async (req, res, next) => {

    if (!req.body.products) {
        const cart = await cartModel.findOne({ userId: req.user._id })
        if (!cart || !cart?.products?.length) return next(new Error(`This cart is empty`, { cause: 404 }))
        req.body.isCart = true
        req.body.products = cart.products

    }

    const { phone, address, couponName, note, reason, paymentType } = req.body;

    //* CHECL IF ----> USER SEND A COUPON OR USED IY BEFOR OR THE COUPON EXPIRE DATE -------------<
    if (couponName) {
        const coupon = await couponModel.findOne({ name: couponName, usedBy: { $nin: req.user._id } })
        if (!coupon || coupon.expireDate.getTime() < Date.now()) {
            return next(new Error(`In-valid or expired coupon`, { cause: 404 }))
        }
        //* RECORD THE COUPON IN REQ.BODY ---------------------------<
        req.body.coupon = coupon
    }

    //* CHECK PRODUCT ( ID, STOCK, ISDELETED) -----------------------------------<
    const productsUsedIds = []
    const finalProductList = []
    let subTotal = 0
    for (let product of req.body.products) {

        const checkedProduct = await productModel.findOne({
            _id: product.productId,
            stock: { $gte: product.quantity },
            isDeleted: false
        })

        if (!checkedProduct) return next(new Error(`In-valid product`, { cause: 404 }))

        if (req.body.isCart) product = product.toObject()

        //* PREPAIR THE PRODUCT DATA ------------------<
        product.unitPrice = checkedProduct.price;
        product.finalPrice = product.quantity * checkedProduct.price;
        product.name = checkedProduct.name;
        finalProductList.push(product)
        productsUsedIds.push(product.productId)
        subTotal += product.finalPrice
    }


    //* CHECK IF ORDER EXIST --------------<
    const checkORder = await orderModel.findOneAndDelete({ userId: req.user._id })
    if (checkORder) return next(new Error(`This Order list is already exist`, { cause: 400 }))
    // await  checkORder.save()


    //* RECORD OREDER REQUEST ON DATA-BASE --------------->
    const order = await orderModel.create({
        userId: req.user._id,
        address,
        phone,
        note,
        products: finalProductList,
        couponId: req?.body?.coupon?._id,
        subTotal,
        finalPrice: subTotal - (subTotal * ((req.body?.coupon?.amount || 0) / 100)).toFixed(2),
        paymentType,
        status: paymentType == "card" ? "waitPaymen" : "placed",
        reason
    })

    //* DECREASE THE PRODUCTS STOCK --------------<
    for (const product of req.body.products) { await productModel.updateOne({ _id: product.productId }, { $inc: { stock: -parseInt(product.quantity) } }) }

    //* PUSH COUPON ID IN USED-BY ---------------<
    if (req.body.coupon) await couponModel.updateOne({ _id: req.body.coupon._id }, { $addToSet: { usedBy: req.user._id } })

    //* CLEAR THE CHOSEN ITEMS FROM THE CART ---------------<

    if (req.body.isCart) {
        // await cartModel.updateOne({ userId: req.user._id }, { products: [] })
        await clearCartFun(req.user._id)
    } else {
        console.log(await cartModel.findOne({ userId: req.user._id }))

        await removeItemsFromCart(productIds, req.user._id)

        // await cartModel.updateOne({ userId: req.user._id }, {
        //     $pull: {
        //         products: {
        //             productId: { $in: productsUsedIds }
        //         }
        //     }
        // })
    }

    return res.status(201).send({ message: "Done", order })
})


export const cancelOrder = asyncHandler(async (req, res, next) => {

    const { reason } = req.body
    const { orderId } = req.params

    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })
    if (!order) return next(new Error("In-valid order-id", { cause: 404 }))

    if ((order?.status != "placed" && order?.paymentType == "cash") ||
        (order?.status != "waitPaymen" && order?.paymentType == "card"))
        return next(new Error(`Cannot cancel your order after it been changed ${order.status}`, { cause: 400 }))

    const canceledOrder = await orderModel.updateOne({ _id: orderId }, { status: "canceled", reason, updatedBy: req.user._id })
    if (!canceledOrder.matchedCount) return next(new Error(`Faild to cancel your order`, { cause: 400 }))

    //* INCREASE THE PRODUCTS STOCK --------------<
    for (const product of order.products) { await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } }) }

    //* REMOVE COUPON ID FROM USED-BY ---------------<
    if (order.couponId) await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    await order.save()

    return res.status(200).send({ message: "Done", order })
})


export const changeStatusByAdmin = asyncHandler(async (req, res, next) => {

    const { status } = req.body
    const { orderId } = req.params

    const order = await orderModel.findOne({ _id: orderId })
    if (!order) return next(new Error("In-valid order-id", { cause: 404 }))
        
    if (order.status == "canceled") return next(new Error("Cannot change status order is already canceled", { cause: 404 }))
    if (order.status == "delivered") return next(new Error("Order is already delivered", { cause: 404 }))
    if (order.status == "onWay") return next(new Error("Order is already on way", { cause: 404 }))

    const canceledOrder = await orderModel.updateOne({ _id: orderId }, { status, updatedBy: req.user._id })
    if (!canceledOrder.matchedCount) return next(new Error(`Faild to cancel your order`, { cause: 400 }))

    await order.save()
    return res.status(200).send({ message: "Done", order })
})



export const rejectedOrder = asyncHandler(async (req, res, next) => {

    const { reason } = req.body
    const { orderId } = req.params

    const order = await orderModel.findOne({ _id: orderId, userId: req.user._id })
    if (!order) return next(new Error("In-valid order-id", { cause: 404 }))

    if ((order?.status != "placed" && order?.paymentType == "cash") ||
        (order?.status != "waitPaymen" && order?.paymentType == "card"))
        return next(new Error(`Cannot rejected your order after it been changed ${order.status}`, { cause: 400 }))

    const rejectededOrder = await orderModel.updateOne({ _id: orderId }, { status: "rejected", reason, updatedBy: req.user._id })
    if (!rejectededOrder.matchedCount) return next(new Error(`Faild to rejected your order`, { cause: 400 }))

    //* INCREASE THE PRODUCTS STOCK --------------<
    for (const product of order.products) { await productModel.updateOne({ _id: product.productId }, { $inc: { stock: parseInt(product.quantity) } }) }

    //* REMOVE COUPON ID FROM USED-BY ---------------<
    if (order.couponId) await couponModel.updateOne({ _id: order.couponId }, { $pull: { usedBy: req.user._id } })
    await order.save()

    return res.status(200).send({ message: "Done", order })
})

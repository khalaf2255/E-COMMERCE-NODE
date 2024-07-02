import cartModel from "../../../../DB/model/Cart.model.js";
import productModel from "./../../../../DB/model/Product.model.js"
import { asyncHandler } from './../../../uitls/errorHandling.js'


export const getCart = asyncHandler(async (req, res, next) => {
    const cart = await cartModel.find();
    return res.status(201).send({ message: "Done", cart })

})
export const createCart = asyncHandler(async (req, res, next) => {

    // *GET THE DATA FROM BODY ------------------------>
    const { productId, quantity } = req.body

    // *CHECK THE PRODUCT IS EXIST OR NOT WITH PRODUC-ID ------------------------>
    const product = await productModel.findById(productId);

    // *IF THE PRODUCT DOSEN'T EXIST < STOP ...... > ------------------------>
    if (!product) return next(new Error(`In-valid product-id`, { cause: 400 }))

    // *IF THE PRODUCT IS EXIS < CONTINUE ..... >  ------------------------>

    // *THEN, COMPARE THE QUANTITY WITH THE PRODUCT-STOCK IN DATA-BASE ------------------->
    if (product.stock < quantity || product.isDeleted) {

        // *ADD THE PRODUCT TO THE WISHUSERLIST TO SEND NOTIFECATION ----------------->
        await productModel.updateOne({ _id: productId }, { $addToSet: { wishUserList: req.user._id } })
        return next(new Error(`In-valid quantity, the stock has: ${product.stock} product only`, { cause: 400 }))
    }


    // *CHECK, IF THE CARD EXIST BY USING USER-ID WITH USER LOGGED-IN ------------------------->
    const cart = await cartModel.findOne({ userId: req.user._id })

    // *IF CARD DOSEN'T EXIST, WILL CREATE IT ------------------------->
    if (!cart) {
        const newCart = await cartModel.create({
            userId: req.user._id,
            products: [{ productId, quantity }]
        })
        return res.status(201).send({ message: "Done", cart: newCart })
    }

    // *IF CARD IS EXIST------------------------->
    // *1] WE WILL CHECK IF THE PRODUCT-ID IN (REQ.BODY) MATCHED WITH PRODUCT-ID IN (DATA-BASE)

    let matchedProduct = false;
    for (let i = 0; i < cart.products.length; i++) {

        // *IF MATCHED, WILL UPDATE THE QUANTITY IN (DATA-BASE) WITH THE NEW VALUE COMES (REQ.BODY)
        if (cart.products[i].productId.toString() == productId) {
            cart.products[i].quantity = quantity
            matchedProduct = true;
            break;
        }

    }

    // *IF DOSEN'T  MATCHED,
    // *2]  WILL PUSH THE NEW PRODUCT TO THE USER CARD
    if (!matchedProduct) {
        cart.products.push({ productId, quantity })
    }

    // *SAVE THE NEW REQUESTS TO THE CART IN DATA-BASE
    await cart.save()
    return res.status(201).send({ message: "Done", cart })

})


export async function removeItemsFromCart(productIds, userId) {
    const cart = await cartModel.updateOne({ userId }, {
        $pull: {
            products: {
                productId: { $in: productIds }
            }
        }
    })
    return cart
}


export const removeItems = asyncHandler(async (req, res, next) => {
    const { productIds } = req.body
    const cart = await removeItemsFromCart(productIds, req.user._id)
    return res.status(200).send({ message: "Done", cart })
})


export async function clearCartFun(userId) {
    const cart = await cartModel.findOne({ userId }, { products: [] })
    return cart
}

export const clearCart = asyncHandler(async (req, res, next) => {
    const cart = await clearCartFun(req.user._id) 
    return res.status(200).send({ message: "Done", cart })
})
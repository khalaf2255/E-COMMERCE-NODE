import connectDB from "../DB/connection.js"
import authRouter from "./modules/auth/auth.router.js"
import userRouter from "./modules/user/user.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import categoryRouter from "./modules/category/category.router.js"
import subCategoryRouter from "./modules/subCategory/subCategory.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import reviewsRouter from "./modules/reviews/reviews.router.js"
// import productRouter from "./modules/product/product.router.js"
import orderRouter from "./modules/order/order.router.js"
// import { globalError } from "./uitls/errorHandling.js"
// import cors from 'cors' 


const initApp = (app, express) => {
    app.use(express.json())
    // app.use(cors())

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    // app.use("/product", productRouter)
    app.use("/category", categoryRouter)
    app.use("/subCategory", subCategoryRouter)
    app.use("/reviews", reviewsRouter)
    app.use("/coupon", couponRouter)
    app.use("/cart", cartRouter)
    app.use("/order", orderRouter)
    app.use("/brand", brandRouter)



    app.use("*", (req, res, next) => {
        return res.send({ message: "In-valid Routing" });
    })

    // app.use(globalError)
    connectDB()

}
 
export default initApp;
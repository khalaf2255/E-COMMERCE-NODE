import connectDB from "../DB/connection.js"
import authRouter from "./modules/auth/auth.router.js"
import userRouter from "./modules/user/user.router.js"
import brandRouter from "./modules/brand/brand.router.js"
import cartRouter from "./modules/cart/cart.router.js"
import categoryRouter from "./modules/category/category.router.js"
import couponRouter from "./modules/coupon/coupon.router.js"
import reviewsRouter from "./modules/reviews/reviews.router.js"
import orderRouter from "./modules/order/order.router.js"
import productRouter from './modules/product/product.router.js'
import morgan from "morgan"
import cors from "cors"






const initApp = (app, express) => {


    var whitelist = ['http://localhost:5000', 'http://example2.com']
    // var corsOptions = {
    //     origin: function (origin, callback) {
    //         if (whitelist.indexOf(origin) !== -1) {
    //             callback(null, true)
    //         } else {
    //             callback(new Error('Not allowed by CORS'))
    //         }
    //     }
    // }

    app.use(cors())

    // app.use(async (req, res, next) => {
    //     console.log(req.header('origin'));
    //     if (!whitelist.includes(req.header('origin'))) {
    //         return next(new Error("Not Allowed By Cors", { cause: 403 }))
    //     }
    //     for (const origin of whitelist) {
    //         if (req.header('origin') == origin) {
    //             await res.header('Access-Controls-Allow-Origin', origin)
    //             break;
    //         }
    //     }
    //     await res.header('Access-Controls-Allow-Headers', "*")
    //     await res.header('Access-Controls-Allow-Provate-Network', "true")
    //     await res.header('Access-Controls-Allow-Methods', "*")
    //     console.log('Origin work');
    //     next()
    // })
    app.use(express.json())

    if (process.env.MOOD == "DEV") {
        // app.use(morgan("combined"))
    } else {
        // app.use(morgan("dev"))
    }

    app.use("/auth", authRouter)
    app.use("/user", userRouter)
    app.use("/product", productRouter)
    app.use("/category", categoryRouter)
    app.use("/reviews", reviewsRouter)
    app.use("/coupon", couponRouter)
    app.use("/cart", cartRouter)
    app.use("/order", orderRouter)
    app.use("/brand", brandRouter)



    app.use("*", (req, res, next) => {
        return res.send({ message: "In-valid Routing" });
    })

    // *app.use(globalError)
    connectDB()

}

export default initApp;
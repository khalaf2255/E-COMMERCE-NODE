import jwt from "jsonwebtoken"
import userModel from "../../DB/model/auth.model.js"

export const auth = async (req, res, next) => {
    // check the front-end the token to check the user is logged in?
    const { authorization } = req.headers
    if (!authorization?.startsWith(process.env.TOKEN_BEARER)) return next(new Error("Token is required"))
    const token = authorization.split("__")[1]
    if (!token) return next(new Error("Token doesn't exist"))
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE)
    // if user delete the account while the token is valid
    if (!decoded?.id) return next(new Error("In-valid token"))
    const user = await userModel.findById(decoded?.id)
    if (!user) return next(new Error("Opps! You need to register again"))
    req.user = user
   return next()

}
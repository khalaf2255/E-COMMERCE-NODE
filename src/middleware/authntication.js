import jwt from "jsonwebtoken"
import userModel from "../../DB/model/User.model.js"
import { asyncHandler } from "../uitls/errorHandling.js"

export const roles = {
    admin: "admin",
    user: "user",
    HR: "HR"
}
export const authFun = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {

        // *check the front-end the token to check the user is logged in?
        const { authorization } = req.headers
        if (!authorization?.startsWith(process.env.TOKEN_BEARER)) return next(new Error("Token is required"))

        const token = authorization.split("__")[1]
        if (!token) return next(new Error("In-valid Beare-Key"))

        const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE)
        // *if user delete the account while the token is valid
        if (!decoded?.id) return next(new Error("In-valid token", { cause: 400 }))

        const user = await userModel.findById(decoded?.id)
        if (!user) return next(new Error("Opps! You need to register again", { cause: 400 }))


        if (parseInt(user?.changePasswordTime?.getTime() / 1000) > decoded.iat) {
            return next(new Error("Expired token", { cause: 400 }))
        }

        if (parseInt(user?.changeEmailTime?.getTime() / 1000) > decoded.iat) {
            return next(new Error("Expired token", { cause: 400 }))
        }
        
        if (!accessRoles.includes(user.role)) {
            return next(new Error('Not authorized user', { cause: 403 }))
        }
        
        req.user = user
        return next()


    })
}
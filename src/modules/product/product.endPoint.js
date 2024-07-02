import { roles } from "../../middleware/authntication.js";

export const endPoint = {
    create: [roles.admin],
    update: [roles.admin],
    delete: [roles.admin],
    addToWishlist: [roles.user],
    removefromWishlist: [roles.user],
}
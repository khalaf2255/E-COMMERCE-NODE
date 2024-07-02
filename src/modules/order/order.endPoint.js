import { roles } from "../../middleware/authntication.js";

export const endPoint = {
    createOrder: [roles.user],
    cancelOrder: [roles.user],
    changeOrderStatus: [roles.admin],
    rejectedOrder: [roles.user],
}
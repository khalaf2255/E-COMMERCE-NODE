import { roles } from "../../middleware/authntication.js";

export const endPoint = {
    create: [roles.user],
    remove: [roles.user],
}

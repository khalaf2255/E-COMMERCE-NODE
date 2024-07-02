import { roles } from "../../middleware/authntication.js";


export const endPoint = {
    createReview: [roles.user],
    updateReview: [roles.user],
}

 
import mongoose, { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: false }
    // }, { timestamps: true})
}, { timestamps: true, allowUnknown: true })

const categoryModel = mongoose.models.Category || model("Category", categorySchema)
export default categoryModel
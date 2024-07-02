import mongoose, { Schema, model, Types } from "mongoose";

const subcategorySchema = new Schema({
    name: { type: String, required: true, unique: true,lowercase: true, trim: true },
    slug: { type: String, required: true, trim: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: false },
    customId: { type: String, required: true, unique: true },
    categoryId: { type: String, required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", required: false }


}, { timestamps: true })

const subcategoryModel = mongoose.models.Subcategory || model("Subcategory", subcategorySchema)
export default subcategoryModel
import mongoose, { Schema, model, Types } from "mongoose";

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true,lowercase: true, trim: true },
    slug: { type: String, required: true, trim: true },
    image: { type: Object, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", required: false }
}, {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}, 
    timestamps: true})

categorySchema.virtual('subcategoryItem', {
    ref: 'Subcategory',            // *الموديل الهدف
    localField: '_id',      // *الحقل المحلي في userSchema
    foreignField: 'categoryId', // *الحقل الأجنبي في postSchema
 });


const categoryModel = mongoose.models.Category || model("Category", categorySchema)
export default categoryModel
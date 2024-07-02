 import { Schema, Types, model } from "mongoose";

const productSchema = new Schema({
  name: {
    type: String, required: true, trim: true
  },
  slug: {
    type: String, required: true, trim: true
  },
  description: String,
  stock: { type: Number, default: 1, required: true },
  price: { type: Number, default: 1, required: true },
  discount: { type: Number, default: 0 },
  finalPrice: { type: Number, default: 1, required: true },
  colors: [String],
  size: {
    type: [String],
    enum: ['s', 'm', 'lg', 'xl']
  },
  mainImage: { type: Object, required: true },
  subImages: { type: [Object] },
  categoryId: { type: Types.ObjectId, ref: "Category", required: true },
  subCategoryId: { type: Types.ObjectId, ref: "SubcategoryId", required: true },
  brandId: { type: Types.ObjectId, ref: "Brandry", required: true },
  createdBy: { type: Types.ObjectId, ref: "User", required: true },
  updatedBy: { type: Types.ObjectId, ref: "User" },
  wishUserList: [{ type: Types.ObjectId, ref: "User" }],
  isDeleted: { type: Boolean, default: false },
  customId: String


},
  {
    toObject: {virtuals: true},
    toJSON: {virtuals: true}, 
    timestamps: true})

    productSchema.virtual('review', {
    ref: 'Review',            // *الموديل الهدف
    localField: '_id',      // *الحقل المحلي في userSchema
    foreignField: 'productId', // *الحقل الأجنبي في postSchema
 });

const productModel = model("Product", productSchema);

export default productModel;

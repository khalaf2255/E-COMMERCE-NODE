import mongoose, { Schema, model, Types } from "mongoose";

const reviewSchema = new Schema({
    
    comment: { type: String, required: true },
    rate: { type: Number, required: true },
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    productId: { type: Types.ObjectId, ref: "Product", required: false },
    orederId: { type: Types.ObjectId, ref: "Oreder", required: false }

},   {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
    timestamps: true
  })

  reviewSchema.virtual('user', {
  ref: 'User',
  localField: 'createdBy',
  foreignField: '_id',
});


reviewSchema.virtual('product', {
    ref: 'Product',
    localField: 'productId',
    foreignField: '_id',
  });
  


const reviewModel = mongoose.models.Review || model("Review", reviewSchema)
export default reviewModel
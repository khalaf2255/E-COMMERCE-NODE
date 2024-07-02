import mongoose, { Schema, model, Types } from "mongoose";

const couponSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: Object },
    amount: { type: Number, default: 1 },
    expireDate: { type: Date, required: true },
    usedBy: [{ type: Types.ObjectId, ref: "User" }],
    createdBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", required: false }


}, {
    timestamps: true
})




const couponModel = mongoose.models.Coupon || model("Coupon", couponSchema)
export default couponModel
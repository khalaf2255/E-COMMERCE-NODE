import mongoose, { Schema, model, Types } from "mongoose";

const cartSchema = new Schema({
    userId: { type: Types.ObjectId, ref: "User", required: true, unique: true },
    updatedBy: { type: Types.ObjectId, ref: "User"},
    address: { type: String, required: true },
    phone: [{ type: String, required: true }],
    note: { type: String },

    products: [{
        name: { type: String, required: true },
        productId: { type: Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, required: true },
        unitPrice: { type: Number, default: 1, required: true },
        finalPrice: { type: Number, default: 1, required: true },
    }],
    couponId: { type: Types.ObjectId, ref: "Coupon" },
    subTotal: { type: Number, default: 1, required: true },
    finalPrice: { type: Number, default: 1, required: true },
    paymentType: {
        type: String,
        default: 'cash',
        enum: ['cash', 'card']
    },
    status: {
        type: String,
        default: 'placed',
        enum: ['waitPaymen', 'placed', 'canceled', 'rejected', 'onWay', 'delivered']
    },

    reason: String


}, { timestamps: true })

const orderModel = mongoose.models.Order || model("Order", cartSchema)
export default orderModel
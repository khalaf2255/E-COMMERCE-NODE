 import { Schema, Types, model } from "mongoose";

const productsSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },

    type: {
      type: String,
      required: true,
    },
    discount: Number,
    user: Object,
    copun: Number,
    profileImage: { public_id: String, secure_url: String },
    userId: {
      type: Types.ObjectId, ref: 'Auth', required: true
    }
  },
  { 
    timestamps: true,
  }
);

const productModel = model("Products", productsSchema);

export default productModel;

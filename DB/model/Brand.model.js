import mongoose, { Schema, model, Types } from "mongoose";

const brandSchema = new Schema({
    name: { type: String, required: true, unique: true, lowercase: true },
    // *categoryName: { type: String, required: true, unique: true },
    logo: { type: Object, required: true },
    addedBy: { type: Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Types.ObjectId, ref: "User", required: false }

}, { timestamps: true})

 

const brandModel = mongoose.models.Brand || model("Brand", brandSchema)
export default brandModel
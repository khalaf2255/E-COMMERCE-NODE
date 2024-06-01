import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    firstname: String,
    lastname: String,
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    confirmEmail: { type: Boolean, default: false },
    // phone: { type: String, default:"123"},

    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
    },
    age: Number,
    profileImage: { public_id: String, secure_url: String },
    coverImages: [],
    // profileImage: { public_id: String, secure_url: String },
    // coverImages: [{ public_id: String, secure_url: String }],
    triesConfirmation: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true,
  }
);

const userModel = model("Auth", userSchema);

export default userModel;

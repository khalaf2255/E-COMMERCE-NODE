import { Schema, model, Types } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      min: [2, "Minimum length is 2 char"],
      max: [20, "Maximum length is 20 char"],
      lowercase: true,
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Email must be required'],
      unique: [true, 'Email must be unique'],
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, 'Password must be required'],

    },
    phone: { type: String, unique: false },
    adress: { type: String, trim: true },
    gender: {
      type: String,
      default: "male",
      enum: ["male", "female"],
      lowercase: true,
      trim: true
    },

    DOB: String,
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
      lowercase: true,
      trim: true
    },
    status: {
      type: String,
      default: 'offline',
      emun: ['offline', 'online', 'block'],
      trim: true
    },
    confirmEmail: { type: Boolean, default: false },
    image: Object,
    forgetCode: {
      type: Number,
      default: null
    },
    changePasswordTime: {
      type: Date
    },
    changeEmailTime: {
      type: Date
    },
    wishlist: {
      type: [{ type: Types.ObjectId, ref: "Product" }]
    }

  },
  {
    timestamps: true,
  }
);

const userModel = model("User", userSchema);

export default userModel;

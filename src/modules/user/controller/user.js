import { customAlphabet } from "nanoid/non-secure";
import userModel from "../../../../DB/model/User.model.js";
import { asyncHandler } from "../../../uitls/errorHandling.js";

 




export const getUser = asyncHandler(async (req, res, next) => {
    const user = await userModel.find();
    return res.status(201).send({ message: "Done", user })

})

















// *export const profileImage = asyncHandler(async (req, res, next) => {
// *    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { profileImage: req.file.finalDest }, { new: true })
// *    return res.send({ message: "Done", file: req.file, user })
// *})


// *export const coverImage = asyncHandler(async (req, res, next) => {
// *    const images = []
// *    for (const file of req.files) {
// *        images.push(file.finalDest)
// *    }
// *    console.log(images);
// *    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { coverImages: images }, { new: true })
// *    return res.send({ message: "Done", file: req.files, user })
// *})
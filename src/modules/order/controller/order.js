import userModel from "../../../../DB/model/auth.model.js"
import { asyncHendler } from "../../../uitls/errorHandling.js";

export const getUsers = asyncHendler(async (req, res, next) => {
    const user = await userModel.find({})

    return res.send({ message: "Done", user })
})
export const getUser = asyncHendler(async (req, res, next) => {
    const { id } = req.body;
    const user = await userModel.findById(id)
    console.log(user);
    return res.send({ message: "Done", user })
})


export const profileImage = asyncHendler(async (req, res, next) => {
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { profileImage: req.file.finalDest }, { new: true })
    return res.send({ message: "Done", file: req.file, user })
})


export const coverImage = asyncHendler(async (req, res, next) => {
    const images = []
    for (const file of req.files) {
        images.push(file.finalDest)
    }
    console.log(images);
    const user = await userModel.findByIdAndUpdate({ _id: req.user._id }, { coverImages: images }, { new: true })
    return res.send({ message: "Done", file: req.files, user })
})
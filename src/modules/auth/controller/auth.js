import jwt from "jsonwebtoken"
import userModel from "../../../../DB/model/User.model.js"
import { asyncHandler } from '../../../uitls/errorHandling.js'
import sendEmail from "./../../../uitls/email.js"
import { customAlphabet } from "nanoid/non-secure";
import cloudinary from "cloudinary"
import bcrypt from "bcrypt"

export const getUsers = async (req, res, next) => {
    const user = await userModel.find({})
    return res.send({ message: "Done", user })
}

export const signup = asyncHandler(async (req, res, next) => {

    const { username, email, password, cPassword, role } = req.body
    if (password != cPassword) next(new Error(`Sorry! Passwords didn't matched.`, { cause: 400 }))

    const checkEmail = await userModel.findOne({ email })
    if (checkEmail) next(new Error(`Sorry! This email is already exist, plz try again.`, { cause: 400 }))

    const hashPassword = bcrypt.hashSync(password, +process.env.SALT_ROUND)
    const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `users` })

    const user = await userModel.create({
        username, email: email, password: hashPassword, role, image: { secure_url, public_id, folder }
    })

    const token = jwt.sign({ id: user._id, username, email, role }, process.env.TOKEN_SIGNTURE)
    const newConfirmToken = jwt.sign({ id: user._id, username, email, role }, process.env.TOKEN_SIGNTURE)

    const html = `
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}">confirm Email</a> <br>
    <a href="${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${newConfirmToken}">new Confirm email</a>
    `
    await sendEmail({ to: user.email, subject: "Comfirm Email", html })
    // *if (!await sendEmail({ to: user.email, subject: "Comfirm Email", html })) {
    // *    return next(new Error(`Sorry! Email rejected.`, { cause: 400 }))
    // *}


    return res.status(201).send({ message: "Done", user })
})


export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE)
    console.log(decoded);
    if (!decoded.id) return next(new Error(`In-valid token id`, { cause: 404 }))

    const user = await userModel.findByIdAndUpdate(decoded.id, { confirmEmail: true })
    return user ?
        res.redirect("http://localhost:5500/login.html") :
        res.send(`<a href="http://localhost:5500/signup.html">Opps, somethins is wrong, plza signup again</a>`)
})


export const newConfirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const decoded = jwt.verify(token, process.env.TOKEN_SIGNTURE)

    const user = await userModel.findById(decoded.id)
    if (!user) return res.send(`<a href="http://localhost:5500/signup.html">Opps, somethins is wrong, plza signup again</a>`)
    if (user.confirmEmail) return res.redirect("http://127.0.0.1:5500/login.html");

    const newToken = jwt.sign({ id: user._id, username: user.username, email: user.email, role: user.role }, process.env.TOKEN_SIGNTURE)
    const html = `
    <a href="${req.protocol}://${req.headers.host}/auth/confirmEmail/${newToken}">Re Comfirm Email</a> <br>
     `
    await sendEmail({ to: user.email, subject: "Re Comfirm Email", html })

    return res.status(201).send(`<h2>Check Your box now!</h2>`)

})

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body

    const user = await userModel.findOne({ email })
    if (!user) return next(new Error('In-valid l ogin data', { cause: 404 }))
    if (!user.confirmEmail) return next(new Error('You should active your account now.', { cause: 404 }))

    const match = bcrypt.compareSync(password, user.password)
    if (!match) return next(new Error('Usernamme or Password is Incorrect', { cause: 404 }))

    const token = process.env.TOKEN_BEARER + jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.TOKEN_SIGNTURE, { expiresIn: 60 * 2000000000000000000000000000000000000 * 24 })
    const refreshToken = process.env.TOKEN_BEARER + jwt.sign({ id: user._id, username: user.username, email: user.email }, process.env.TOKEN_SIGNTURE, { expiresIn: 60 * 60 * 24 * 365 })


    user.forgetCode = null
    user.status = 'online'
    await user.save()
    return res.status(202).send({ message: "Done", token, refreshToken, user })

})



export const upadteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const { username, email, password, role, gender } = req.body
    const user = await userModel.findById(userId)

    if (!user) next(new Error('User not found', { cause: 404 }))
    if (username) {
        if (user.username == username) return next(new Error(`Sorry~ Can not update with the same name`, { cause: 400 }))
        user.username = username
    }
    if (gender) user.gender = gender

    if (email) {
        if (user.email == email) return next(new Error(`Sorry~ Can not update with the same email`, { cause: 400 }))

        const checkEmail = await userModel.findOne({ email })
        if (checkEmail) { next(new Error(`Sorry! This email is already exist`), { cause: 400 }) } else { user.email = email }
    console.log(user.changeEmailTime);
         user.changeEmailTime = Date.now()

    }

    if (role) user.role = role
    if (password) user.password = password

    if (req.file) {
        const { secure_url, public_id, folder } = await cloudinary.uploader.upload(req.file.path, { folder: `category` })
        await cloudinary.uploader.destroy(user.image.public_id)
        user.image = { secure_url, public_id, folder }
    }
    user.save()
    return res.status(201).send({ message: "Done", user })

})
// *SEND-CODE FORGET PASSWORD ---------------------------------------->

export const deleteUser = asyncHandler(async (req, res, next) => {
    const { email } = req.params
    const user = await userModel.findOneAndDelete({ email }, { new: true })
    if (!user) next(new Error(`Sorry! This user dosen't exist yet.`, { cause: 404 }))
    return res.status(201).send({ message: "Done", user })

})

// *SEND-CODE FORGET PASSWORD ---------------------------------------->
export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body
    const nanoId = customAlphabet("12345678", 4)
    const forgetCode = nanoId()
    // *const secretCode = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000) 
    const user = await userModel.findOneAndUpdate({ email }, { forgetCode }, { new: true })
    if (!user) return next(new Error("Not register account", { cause: 404 }))
    if (!user.confirmEmail) return next(new Error("Sorry! You need to active your account now, plz check email inbox!", { cause: 404 }))



    const html = `<!DOCTYPE html>
    <html>
    <head>
        <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
    <style type="text/css">
    body{background-color: #88BDBF;margin: 0px;}
    </style>
    <body style="margin:0px;"> 
    <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
    <tr>
    <td>
    <table border="0" width="100%">
    <tr>
    <td>
    <h1>
        <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
    </h1>
    </td>
    <td>
    <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
    <tr>
    <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
    <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
    </td>
    </tr>
    <tr>
    <td>
    <h1 style="padding-top:25px; color:#630E2B">Forget password</h1>
    </td>
    </tr>
    <tr>
    <td>
    <p style="padding:0px 100px;">
    </p>
    </td>
    </tr>
    <tr>
    <td>
    <p  style="    border-radius: 4px;
    padding: 10px 40px;
    letter-spacing: 14px;
    border: 0;
    color: #fff;
    background-color: #630E2B;
    width: fit-content;
    margin: 0 auto;
    font-size: 2rem; "> ${forgetCode}</p>
    </td>
    </tr>
    <br>
    <br>
    <br>
    <tr>
    <td>
 <br>
<br>   
</td>
    </tr>
    </table>
    </td>
    </tr>
    <tr>
    <td>
    <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
    <tr>
    <td>
    <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
    </td>
    </tr>
    <tr>
    <td>
    <div style="margin-top:20px;">

    <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
    
    <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
    </a>
    
    <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
    <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
    </a>

    </div>
    </td>
    </tr>
    </table>
    </td>
    </tr>
    </table>
    </body>
    </html>`;


    await sendEmail({ to: user.email, subject: "Reset Password", html })
    return user ? res.status(200).send({ message: "Done", user }) : next(new Error("User not register", { cause: 404 }))
})

// *CHANGE-PASSWORD FORGET PASSWORD ---------------------------------------->
export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { email, password, forgetCode } = req.body

    const user = await userModel.findOne({ email })
    if (!user) return next(new Error("Not register account", { cause: 404 }))
    if (!user.confirmEmail) return next(new Error("Sorry! You need to active your account now, plz check your inbox!", { cause: 400 }))

    if (user.forgetCode != forgetCode) return next(new Error("In-valid reset code", { cause: 400 }))

    user.password = bcrypt.hashSync(password, +process.env.SALT_ROUND)
    user.forgetCode = null
    user.changePasswordTime = Date.now()

    await user.save()
    return res.status(200).send({ message: "Done", user })
})


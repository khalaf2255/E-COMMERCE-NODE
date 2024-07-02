import joi from 'joi'

export const generalFields = {
    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid("application/pdf", "application/msword, image/jpeg", "image/png", "image/gif").required(), // *Only allow JPEG and PNG
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().max(5000000).required()
    }),
    id: joi.string().min(24).max(24).required(),
    optionalId: joi.string().min(24).max(24),
    email: joi.string().email(
        { minDomainSegments: 2, maxDomainSegments: 4, tlds: { allow: ['com', 'net', 'edu', 'eg', 'in', 'pro'] } }
    ).required(),
    password: joi.string().pattern(new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)).required(),
    cPassword: joi.string().valid(joi.ref("password")).required(),

    headers: joi.string().required()
}

export const validation = (JoiSchema, considerHeaders = false) => {
    return (req, res, next) => {

        // *GET THE ALL REQUESTS FROM USERS
        let inputData = { ...req.body, ...req.params, ...req.query }

        if (req.file || req.files) inputData.file = req.file || req.files

        // *MAKE IF TO GET THE HEADERS'S KEY TO MAKE A VALIDATION
        if (req.headers.authorization && considerHeaders) {
            inputData = { authorization: req.headers.authorization }
        }
         // *CHECK THE DATA FROM USERS WITH THE VALIDATION
        const validationResult = JoiSchema.validate(inputData, { abortEarly: false })

        // *IF ERROR 
        if (validationResult.error) {
            return res.json({ message: "validation Error", validationErr: validationResult.error.details })
        }
        return next()
    }
}  
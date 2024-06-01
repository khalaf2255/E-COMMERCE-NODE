import joi from 'joi'

export const generalFields = {
    file: joi.object({
        fieldname: joi.string().required(),
        originalname: joi.string().required(),
        encoding: joi.string().required(),
        mimetype: joi.string().valid('image/jpeg', 'image/png').required(), // Only allow JPEG and PNG
        destination: joi.string().required(),
        filename: joi.string().required(),
        path: joi.string().required(),
        size: joi.number().max(5000000).required() // Maximum file size of 5MB
    })
}

export const validation = (JoiSchema) => {
    return (req, res, next) => {
        const inputData = { ...req.body, ...req.params, ...req.query }
        if (req.file || req.files) inputData.file = req.file || req.files
        const validationResult = JoiSchema.validate(inputData, { abortEarly: false })
        if (validationResult.error) {
            return res.json({ message: "validation Error", validationErr: validationResult.error.details })
        }
        return next()
    }
}
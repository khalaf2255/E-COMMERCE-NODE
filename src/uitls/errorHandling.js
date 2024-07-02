export const asyncHandler = (fu) => {
    return (req, res, next) =>
        fu(req, res, next).catch(error => {
            return next(new Error(error, { cause: 500 }))
        })
}

export const globalError = (error, req, res, next) => {
    if (error) {
        if (process.env.MOOD == "DEV") {
            return res.status(error.cause || 500).send({
                message: "Global error",
                msgError: error.message,
                // *stack: error.stack
            })
        } else {
            return res.status(error.cause || 500).send({
                message: error.message,
            })
        }
    }

} 
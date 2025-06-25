class ErrorHandler extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode
    }

}

export const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || 'Internal Server Error';
    err.statusCode = err.statusCode || 500;

    console.log(err);

    if (err.code === 11000) {
        err.statusCode = 400;
        err.message = `Duplicate Field Value Entered`;
        err = new ErrorHandler(message, statusCode);
    }

    if (err.name === "jsonTokenError") {
        err.statusCode = 400;
        err.message = `json Token Is Invalid.Try Again`;
        err = new ErrorHandler(message, statusCode);
    }

    if (err.name === "TokenExpiredError") {
        err.statusCode = 400;
        err.message = `Json Token is Expired`;
        err = new ErrorHandler(message, statusCode);
    }
    if (err.name === "CastError") {
        err.statusCode = 400;
        err.message = `Resource not found`;
        err = new ErrorHandler(message, statusCode);
    }

    const errorMessage = err.errors ? Object.values(err.errors).map(error => error.message).join(" ") : err.message;


    return res.status(err.statusCode).json({
        success: false,
        message: errorMessage,
    });
}
export default ErrorHandler

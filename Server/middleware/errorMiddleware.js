class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || 'Internal Server Error';
  err.statusCode = err.statusCode || 500;

  console.log("ERROR:", err);

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    err = new ErrorHandler("Duplicate field value entered.", 400);
  }

  // Handle invalid JWT
  if (err.name === "JsonWebTokenError") {
    err = new ErrorHandler("JWT is invalid. Try again.", 400);
  }

  // Handle expired JWT
  if (err.name === "TokenExpiredError") {
    err = new ErrorHandler("JWT has expired. Please login again.", 400);
  }

  // Handle invalid ObjectId
  if (err.name === "CastError") {
    err = new ErrorHandler("Resource not found. Invalid ID.", 400);
  }

  // Extract Mongoose validation errors (optional)
  const errorMessage = err.errors
    ? Object.values(err.errors).map(e => e.message).join(" ")
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;

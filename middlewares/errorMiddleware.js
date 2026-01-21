// src/middlewares/errorMiddleware.js

/**
 * Global error handling middleware for Express.
 * This catches all errors thrown in the application,
 * formats them consistently, and sends appropriate responses.
 *
 * @param {Error} err - The error object
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @param {NextFunction} next - Express next function (unused here)
 */

const errorMiddleware = (err, req, res, next) => {
  // Log the error for debugging (use a logger like Winston in production)
  console.error(err.stack || err.message);

  // Set default status and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errors = err.errors || undefined;

  // In production, hide stack traces for security
  const isProduction = process.env.NODE_ENV === "production";
  const response = {
    success: false,
    message,
    errors,
    ...(isProduction ? {} : { stack: err.message }), // Only include stack in dev
  };

  // Send JSON response
  res.status(statusCode).json(response);
};

module.exports = errorMiddleware;

/** Use of it async:
 * const getUserByIdAsync = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err; // Caught by middleware
    }
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    next(err); // Explicit pass for async clarity
  }
};
 *  user of it sync:
 * const getUserByIdSync = (req, res, next) => {
  const protectedRoute = (req, res, next) => {
  const isAuthenticated = false; // Simulate auth check
  if (!isAuthenticated) {
    const err = new Error('Authentication required');
    err.statusCode = 401; // Custom status
    throw err;
  }
  res.status(200).json({ success: true, message: 'Access granted' });
};
 */

const multer = require("multer");
const path = require("path");

// Configure storage (disk for local saves)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images"); // Folder to save files (create it in project root)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Unique name to avoid overwrites
  },
});

// File filter for security (e.g., only images)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images are allowed!"), false);
  }
};

// Create upload instance with limits
const multerInstance = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter,
});

// Wrapped middleware for single file upload with error handling
const uploadSingle = (req, res, next) => {
  const singleUpload = multerInstance.single("image"); // 'file' is the field name

  singleUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Handle Multer-specific errors (e.g., file too large)
      err.statusCode = 400; // Set custom status
      err.message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 5MB)"
          : err.message;
      return next(err); // Pass to global errorMiddleware for consistent response
    } else if (err) {
      // Custom errors (e.g., from fileFilter)
      err.statusCode = 400;
      return next(err);
    }
    // No error, proceed to controller
    next();
  });
};

// Similarly for multiple (optional)
const uploadMultiple = (req, res, next) => {
  const multiUpload = multerInstance.array("images", 5);

  multiUpload(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      err.statusCode = 400;
      err.message =
        err.code === "LIMIT_FILE_SIZE"
          ? "File too large (max 5MB)"
          : err.message;
      return next(err);
    } else if (err) {
      err.statusCode = 400;
      return next(err);
    }
    next();
  });
};

// Export for single or multiple files
module.exports = { uploadSingle, uploadMultiple };

/**
 * use of multer:
 * const { uploadSingle } = require('../middlewares/uploadMiddleware');
 * router.post('/upload-avatar', uploadSingle, handleAvatarUpload);
 */

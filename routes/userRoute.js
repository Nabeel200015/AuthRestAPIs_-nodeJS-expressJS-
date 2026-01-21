const express = require("express");
const router = express();
const { uploadSingle } = require("../middlewares/uploadMiddleware");
const userController = require("../controllers/userController");
const { registerValidator } = require("../helpers/validations");

router.post(
  "/register",
  uploadSingle,
  registerValidator,
  userController.userRegister,
);

module.exports = router;

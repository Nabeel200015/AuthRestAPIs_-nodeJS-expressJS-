const { validationResult } = require("express-validator");
const User = require("../models/userModal");
const bcrypt = require("bcrypt");

const userRegister = async (req, res, next) => {
  const errors = validationResult(req);
  try {
    if (!errors.isEmpty()) {
      const err = new Error("Validation failed!");
      err.statusCode = 400;
      err.errors = errors.array();
      throw err; // Caught by middleware
    }

    const { name, email, password, phone, address } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const err = new Error("User already exists!");
      err.statusCode = 400;
      throw err; // Caught by middleware
      return;
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashPassword,
      phone,
      address,
      profileImage: `images/${req.file.filename}`,
    });

    const userData = await user.save();

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: userData,
    });
  } catch (error) {
    console.error("Register API Error:", error);

    next(error);
  }
};

module.exports = {
  userRegister,
};

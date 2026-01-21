//Imports
const express = require("express");
const mongoose = require("mongoose");
const errorMiddleware = require("./middlewares/errorMiddleware");
require("dotenv").config();
const userRoute = require("./routes/userRoute");

const app = express();

// Middleware setup
app.use(express.json()); // Parse JSON bodies

// Database connection
const db = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/restapi-auth";
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Global error handler (last middleware)

//Routes
app.use("/api/user", userRoute);

app.use(errorMiddleware);

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

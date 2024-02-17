const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const errorMiddleware = require("./middleware/error");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use(cookieParser()); // Fix: Invoke cookieParser as a function

// Route Imports
const product = require("../Backend/routes/productRoutes");
const user = require("./routes/userRoutes");
app.use("/api/v1", product);
app.use("/api/v1", user);

module.exports = app;

// Middleware for error
app.use(errorMiddleware);

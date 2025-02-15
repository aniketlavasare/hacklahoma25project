const express = require("express");
const connectDB = require("./db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

const StudySource = require("./models/StudySource");


app.use(express.json());  // Middleware to handle JSON requests

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

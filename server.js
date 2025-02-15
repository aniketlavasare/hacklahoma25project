const express = require("express");
const connectDB = require("./db");
require("dotenv").config();
const multer = require("multer");
const path = require("path");
const StudySource = require("./models/StudySource");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware to handle JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");  // Set upload destination folder
  },
  filename: (req, file, cb) => {
    // Generate a unique filename using the timestamp and file extension
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route for uploading study sources
app.post("/api/upload-source", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Create a new document with metadata of the uploaded file
    const newStudySource = new StudySource({
      university: req.body.university,
      classCode: req.body.classCode,
      className: req.body.className,
      materialType: req.body.materialType,
      uploader: req.body.uploader,
      fileName: req.file.filename,
      fileUrl: `/uploads/${req.file.filename}`,
    });

    // Save the document to MongoDB
    await newStudySource.save();

    return res.status(200).json({
      message: "File uploaded successfully",
      file: newStudySource,
    });
  } catch (error) {
    console.error("Error uploading file:", error);
    return res.status(500).json({ message: "Error uploading file" });
  }
});

// Route to serve uploaded files
app.use("/uploads", express.static("uploads"));

// Basic route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

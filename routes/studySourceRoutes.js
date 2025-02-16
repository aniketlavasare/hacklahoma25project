const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
const StudySource = require("../models/StudySource");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Store files in 'uploads/' directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

// File filter to accept only PDFs and text files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf" || file.mimetype === "text/plain") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF and text files are allowed"), false);
  }
};

// Multer upload middleware
const upload = multer({ storage, fileFilter });

// @route   POST /api/study-sources
// @desc    Upload study source file and store details in MongoDB
// @access  Public (for now)
router.post("/", upload.single("file"), async (req, res) => {
  try {
    const { title, university, courseCode, description } = req.body;

    if (!title || !university || !courseCode || !req.file) {
      return res.status(400).json({ message: "Please provide all required fields and upload a file" });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    const newStudySource = new StudySource({
      title,
      university,
      courseCode,
      description,
      fileUrl,
    });

    await newStudySource.save();

    res.status(201).json({ message: "Study source uploaded successfully", studySource: newStudySource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;

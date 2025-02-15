const express = require("express");
const multer = require("multer");
const StudySource = require("../models/StudySource");

const router = express.Router();

// Set up storage options for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the folder where files will be stored
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Generate a unique file name for each upload
    cb(null, Date.now() + "-" + file.originalname);
  },
});

// Initialize multer with the storage settings
const upload = multer({ storage });

// POST request to upload a study source with a file
router.post("/upload-source", upload.single("file"), async (req, res) => {
  try {
    // Extract data from the request body and the uploaded file
    const { university, classCode, className, materialType, uploader } = req.body;
    const fileURL = req.file.path; // The file's path will be saved

    // Create a new StudySource document
    const newSource = new StudySource({
      university,
      class: {
        code: classCode,
        name: className,
      },
      fileType: req.file.mimetype,  // The MIME type of the file
      materialType,
      uploader,
      fileURL,  // Store the file path
    });

    // Save the new source to the database
    await newSource.save();

    // Respond with a success message
    res.json({ message: "File uploaded successfully!", source: newSource });
  } catch (error) {
    // Handle any errors (e.g., database issues, Multer errors)
    res.status(500).json({ error: error.message });
  }
});

// GET request to retrieve all study sources
router.get("/get-sources", async (req, res) => {
  try {
    const sources = await StudySource.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Export the router
module.exports = router;

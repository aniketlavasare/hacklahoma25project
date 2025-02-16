const express = require("express");
require("dotenv").config();
const connectDB = require("./db");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const StudySource = require("./models/StudySource");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Set up storage for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // save files in 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // unique filename with extension
  }
});

// Multer file upload middleware
const upload = multer({ storage: storage });

// Route to upload study source
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Extracting data from req.body and req.file
    const { university, classCode, className, fileType, materialType, uploader } = req.body;
    const fileURL = req.file.path; // path where file is stored on the server

    // Create a new StudySource document with the metadata
    const studySource = new StudySource({
      university: university,
      class: {
        code: classCode,
        name: className
      },
      fileType: fileType,
      materialType: materialType,
      uploader: uploader,
      fileURL: fileURL
    });

    // Save to database
    await studySource.save();

    res.json({ message: "File uploaded successfully", studySource });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error uploading file" });
  }
});


app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to get the list of files in the 'uploads' folder
app.get("/files", (req, res) => {
  const folderPath = path.join(__dirname, "uploads");

  // Read the directory to get file names
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read files" });
    }
    res.json({ files });
  });
});

// Basic route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

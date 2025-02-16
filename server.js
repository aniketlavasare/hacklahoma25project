const express = require("express");
require("dotenv").config();
const connectDB = require("./db");
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const StudySource = require("./models/StudySource");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const { processStudyMaterial } = require("./openai");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

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
const upload = multer({ storage });

// Utility function to handle errors
const handleError = (res, message, error = null) => {
  console.error(message, error || "");
  res.status(500).json({ error: message });
};

// Route to upload study source
app.post("/upload", upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const { university, classCode, className, fileType, materialType, uploader } = req.body;

  // Validation for required fields
  if (!university || !classCode || !className || !fileType || !materialType || !uploader) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Create a formatted file name based on the parameters
  const originalFileName = req.file.originalname;
  const formattedFileName = `${university}_${classCode}_${className}_${originalFileName}`;

  const oldPath = req.file.path;
  const newPath = path.join(__dirname, "uploads", formattedFileName);

  try {
    // Rename file
    await fs.promises.rename(oldPath, newPath);

    // Create a new StudySource document with metadata
    const fileURL = `/uploads/${formattedFileName}`;
    const studySource = new StudySource({
      university,
      class: { code: classCode, name: className },
      fileType,
      materialType,
      uploader,
      fileURL,
    });

    // Save study source to database
    await studySource.save();

    // Send success response
    res.json({ message: "File uploaded successfully", studySource });
  } catch (error) {
    handleError(res, "Error processing file upload", error);
  }
});

// Route to fetch unique universities
app.get("/universities", async (req, res) => {
  try {
    const universities = await StudySource.distinct("university");
    res.json(universities);
  } catch (error) {
    handleError(res, "Error fetching universities", error);
  }
});

// Route to fetch unique class codes based on university
app.get("/classcodes", async (req, res) => {
  const { university } = req.query;
  if (!university) {
    return res.status(400).json({ message: "University is required" });
  }

  try {
    const classCodes = await StudySource.distinct("class.code", { university });
    res.json(classCodes);
  } catch (error) {
    handleError(res, "Error fetching class codes", error);
  }
});

// Route to fetch unique class names based on university and class code
app.get("/classnames", async (req, res) => {
  const { university, classCode } = req.query;
  if (!university || !classCode) {
    return res.status(400).json({ message: "University and classCode are required" });
  }

  try {
    const classNames = await StudySource.distinct("class.name", { university, "class.code": classCode });
    res.json(classNames);
  } catch (error) {
    handleError(res, "Error fetching class names", error);
  }
});

// Route to fetch study sources based on university, class code, and class name
app.get("/sources", async (req, res) => {
  const { university, classCode, className } = req.query;
  if (!university || !classCode || !className) {
    return res.status(400).json({ message: "University, classCode, and className are required" });
  }

  try {
    const studySources = await StudySource.find({
      university,
      "class.code": classCode,
      "class.name": className,
    });
    res.json({ studySources });
  } catch (error) {
    handleError(res, "Error fetching study sources", error);
  }
});

// Route to serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Endpoint to get the list of files in the 'uploads' folder
app.get("/files", (req, res) => {
  const folderPath = path.join(__dirname, "uploads");

  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read files" });
    }
    res.json({ files });
  });
});

app.post("/process", async (req, res) => {
  try {
    const { action, studySource, userQuestion } = req.body;
    const result = await processStudyMaterial(action, studySource, userQuestion);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User routes
app.post("/signup", userRoutes.signup);
app.post("/login", userRoutes.login);
app.get("/logout", userRoutes.logout);

// Basic route (index page)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

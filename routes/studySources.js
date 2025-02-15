const express = require("express");
const StudySource = require("../models/StudySource");

const router = express.Router();

// Test route to insert a study source
router.post("/add-source", async (req, res) => {
  try {
    const { university, classCode, className, fileType, materialType, uploader, fileURL } = req.body;

    const newSource = new StudySource({
      university,
      class: {
        code: classCode,
        name: className,
      },
      fileType,
      materialType,
      uploader,
      fileURL,
    });

    await newSource.save();
    res.json({ message: "Study source added successfully!", source: newSource });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Route to fetch all study sources
router.get("/get-sources", async (req, res) => {
  try {
    const sources = await StudySource.find();
    res.json(sources);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

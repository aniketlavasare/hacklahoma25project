const mongoose = require("mongoose");

const StudySourceSchema = new mongoose.Schema({
  university: {
    type: String,
    required: true,
  },
  class: {
    code: { type: String, required: true },
    name: { type: String, required: true },
  },
  fileType: {
    type: String,
    enum: ["pdf", "text"],
    required: true,
  },
  materialType: {
    type: String,
    enum: ["notes", "summary", "quiz", "exam"],
    required: true,
  },
  uploader: {
    type: String, // This can be an email or user ID if you implement authentication later
    required: true,
  },
  uploadDate: {
    type: Date,
    default: Date.now,
  },
  fileURL: {
    type: String,
    required: true, // This will store the URL of the file in your storage
  },
});

module.exports = mongoose.model("StudySource", StudySourceSchema);

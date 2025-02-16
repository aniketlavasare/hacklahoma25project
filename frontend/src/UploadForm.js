import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Container,
  Typography,
  Box,
} from "@mui/material";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [university, setUniversity] = useState("");
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [uploader, setUploader] = useState("");
  const [fileType, setFileType] = useState("pdf");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setFile(null);
    setUniversity("");
    setClassCode("");
    setClassName("");
    setMaterialType("");
    setUploader("");
    setFileType("pdf");
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file type
      const validTypes = fileType === "pdf" ? ["application/pdf"] : ["text/plain"];
      if (!validTypes.includes(selectedFile.type)) {
        setStatus(`Please upload a ${fileType.toUpperCase()} file`);
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
      setStatus("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    if (!file) {
      setStatus("Please select a file.");
      setLoading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("university", university);
    formData.append("classCode", classCode);
    formData.append("className", className);
    formData.append("fileType", fileType);
    formData.append("materialType", materialType);
    formData.append("uploader", uploader);

    try {
      const response = await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setStatus("File uploaded successfully!");
      resetForm();
    } catch (error) {
      setStatus(error.response?.data?.error || "Error uploading file.");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 3,
          backgroundColor: "#f4f6f8",
          borderRadius: "10px",
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Upload Study Source
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="University"
                variant="outlined"
                fullWidth
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Class Code"
                variant="outlined"
                fullWidth
                value={classCode}
                onChange={(e) => setClassCode(e.target.value)}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Class Name"
                variant="outlined"
                fullWidth
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                required
                disabled={loading}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Material Type</InputLabel>
                <Select
                  label="Material Type"
                  value={materialType}
                  onChange={(e) => setMaterialType(e.target.value)}
                  required
                  disabled={loading}
                >
                  <MenuItem value="notes">Notes</MenuItem>
                  <MenuItem value="summary">Summary</MenuItem>
                  <MenuItem value="quiz">Quiz</MenuItem>
                  <MenuItem value="exam">Exam</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Uploader (Email or ID)"
                variant="outlined"
                fullWidth
                value={uploader}
                onChange={(e) => setUploader(e.target.value)}
                required
                disabled={loading}
                type="email"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>File Type</InputLabel>
                <Select
                  label="File Type"
                  value={fileType}
                  onChange={(e) => {
                    setFileType(e.target.value);
                    setFile(null);
                    const fileInput = document.querySelector('input[type="file"]');
                    if (fileInput) {
                      fileInput.value = "";
                    }
                  }}
                  required
                  disabled={loading}
                >
                  <MenuItem value="pdf">PDF</MenuItem>
                  <MenuItem value="text">Text</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
                sx={{ mt: 2 }}
                disabled={loading}
              >
                {file ? file.name : "Choose File"}
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                  accept={fileType === "pdf" ? ".pdf" : ".txt"}
                  required
                />
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
                disabled={loading}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </Grid>
          </Grid>
        </form>

        {status && (
          <Typography
            variant="body2"
            color={status.includes("success") ? "success.main" : "error.main"}
            sx={{ mt: 2, textAlign: "center" }}
          >
            {status}
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default UploadForm;
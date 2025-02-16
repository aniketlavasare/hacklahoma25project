// src/LandingPage.js
import React from "react";
import { Button, Typography, Box, Container } from "@mui/material";
import { CloudUpload, Search, HelpOutline } from "@mui/icons-material"; // Importing Material-UI icons

const LandingPage = () => {
  return (
    <Container component="main" maxWidth="xs" sx={{ paddingTop: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          background: "linear-gradient(145deg, #f0f0f0, #d1d1d1)", // Subtle background gradient
          borderRadius: "16px",
          padding: "30px",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h3" sx={{ mb: 2, color: "#3f51b5" }}>
          ColRAG
        </Typography>
        <Typography variant="body1" sx={{ mb: 4, textAlign: "center", color: "#555" }}>
          Your one-stop solution for uploading, browsing, and studying educational material.
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button
            variant="contained"
            color="primary"
            href="/upload-file"
            startIcon={<CloudUpload />}
          >
            Upload Study Material
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href="/browse"
            startIcon={<Search />}
          >
            Browse Sources
          </Button>
          <Button
            variant="outlined"
            color="primary"
            href="/study-plan"
            startIcon={<HelpOutline />}
          >
            Get Study Help
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;

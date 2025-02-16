// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Container, CssBaseline } from "@mui/material";
import UploadForm from "./UploadForm";
import BrowseSources from "./BrowseSources";
import StudyHelper from "./StudyHelper"; // Import StudyPlan component
import LandingPage from "./LandingPage"; // Import LandingPage component

const App = () => {
  return (
    <Router>
      <CssBaseline />
      <AppBar position="sticky" sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            ColRAG
          </Typography>
          <Button color="inherit" sx={{ mr: 2 }} href="/upload-file">
            Upload
          </Button>
          <Button color="inherit" href="/browse">
            Browse
          </Button>
          <Button color="inherit" href="/study-plan">
            Study Helper
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main">
        <Routes>
          <Route path="/" element={<LandingPage />} /> {/* Add landing page as the default route */}
          <Route path="/upload-file" element={<UploadForm />} />
          <Route path="/browse" element={<BrowseSources />} />
          <Route path="/study-plan" element={<StudyHelper />} /> {/* Add Study Plan route */}
        </Routes>
      </Container>
    </Router>
  );
};

export default App;

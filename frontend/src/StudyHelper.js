import React, { useState } from "react";
import axios from "axios";
import { useLocation } from 'react-router-dom';
import { Button, TextField, Box, Typography, CircularProgress, Paper, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const StudyHelper = () => {
  const location = useLocation(); // Get the location object
  const { sourceText } = location.state || {}; // Access the state that was passed
  console.log(sourceText?.fileURL); // Log the sourceText to the console

  const [action, setAction] = useState(""); // To store the selected action
  const [studySource, setStudySource] = useState(""); // To store the study material
  const [userQuestion, setUserQuestion] = useState(""); // To store the user's question
  const [response, setResponse] = useState(""); // To store the API response
  const [loading, setLoading] = useState(false); // To show loading state
  const [selectedModel, setSelectedModel] = useState("gpt-3.5-turbo"); // To store the selected model
  
  // Function to handle button clicks
  const handleActionClick = (actionType) => {
    setAction(actionType);
    setResponse(""); // Clear previous response
  };

  // Function to send the request to the backend
  const handleRequest = async () => {
    if (!studySource) {
      alert("Please provide study material.");
      return;
    }

    setLoading(true);
    try {
      const body = {
        action,
        studySource,
        userQuestion: action === "ask" ? userQuestion : undefined, // Only include userQuestion for 'ask' action
        model: selectedModel, // Pass selected model
        fileURL: sourceText?.fileURL // Pass the fileURL
      };

      // Send request to backend API
      const result = await axios.post("http://localhost:5000/process", body);
      const formattedResponse = formatLinks(result.data.result); // Format links in the response
      setResponse(formattedResponse);
    } catch (error) {
      setResponse("Error processing your request.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the response to make links clickable
  const formatLinks = (text) => {
    // Regular expression to match YouTube URLs
    const youtubeRegex = /(https?:\/\/(?:www\.)?youtube\.com\/(?:[^\s]+))/g;
    
    return text.replace(youtubeRegex, (match) => {
      // Wrap the match (URL) with anchor tag
      return `<a href="${match}" target="_blank" rel="noopener noreferrer">${match}</a>`;
    });
  };

  return (
    <Box sx={styles.container}>
      <Paper sx={styles.paper}>
        <Typography variant="h5" sx={styles.title}>
          Study Helper
        </Typography>

        {/* Dropdown for selecting model */}
        <FormControl fullWidth sx={styles.selectBox}>
          <InputLabel id="model-select-label">Select Model</InputLabel>
          <Select
            labelId="model-select-label"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            label="Select Model"
          >
            <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
            <MenuItem value="gpt-4">GPT-4</MenuItem>
            <MenuItem value="gemini-2">Gemini 2.0</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Enter extra study material..."
          multiline
          rows={4}
          fullWidth
          value={studySource}
          onChange={(e) => setStudySource(e.target.value)}
          sx={styles.textArea}
        />

        <Box sx={styles.buttonGroup}>
          <Button
            variant={action === "summary" ? "contained" : "outlined"}
            onClick={() => handleActionClick("summary")}
            sx={styles.button}
          >
            Generate Summary
          </Button>
          <Button
            variant={action === "quiz" ? "contained" : "outlined"}
            onClick={() => handleActionClick("quiz")}
            sx={styles.button}
          >
            Generate Quiz
          </Button>
          <Button
            variant={action === "youtube" ? "contained" : "outlined"}
            onClick={() => handleActionClick("youtube")}
            sx={styles.button}
          >
            Recommend YouTube Videos
          </Button>
          <Button
            variant={action === "ask" ? "contained" : "outlined"}
            onClick={() => handleActionClick("ask")}
            sx={styles.button}
          >
            Ask a Question
          </Button>
        </Box>

        {action === "ask" && (
          <TextField
            label="Ask your question here..."
            fullWidth
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
            sx={styles.inputBox}
          />
        )}

        <Button
          variant="contained"
          onClick={handleRequest}
          sx={styles.submitButton}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>

        {response && (
          <Box sx={styles.responseContainer}>
            <Typography variant="h6">Response:</Typography>
            <Typography
              sx={styles.response}
              dangerouslySetInnerHTML={{ __html: response }} // Render formatted response
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  paper: {
    padding: "20px",
    width: "100%",
    maxWidth: "600px",
    boxShadow: 3,
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  selectBox: {
    marginBottom: "20px",
  },
  textArea: {
    marginBottom: "20px",
    fontSize: "16px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    fontSize: "16px",
    padding: "10px",
    width: "100%",
    borderRadius: "5px",
  },
  inputBox: {
    marginBottom: "20px",
    fontSize: "16px",
  },
  submitButton: {
    fontSize: "16px",
    padding: "10px 20px",
    width: "100%",
    borderRadius: "5px",
  },
  responseContainer: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
  },
  response: {
    whiteSpace: "pre-wrap",
    fontSize: "16px",
    wordWrap: "break-word",
  },
};

export default StudyHelper;

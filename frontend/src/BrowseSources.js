import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Button,
  Grid,
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirecting

const BrowseSources = () => {
  const [university, setUniversity] = useState("");
  const [classCode, setClassCode] = useState("");
  const [className, setClassName] = useState("");
  const [sources, setSources] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [classCodes, setClassCodes] = useState([]);
  const [classNames, setClassNames] = useState([]);
  const [status, setStatus] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("http://localhost:5000/universities");
        if (Array.isArray(response.data)) {
          setUniversities(response.data);
        } else {
          setStatus("Error: Invalid universities data format");
        }
      } catch (error) {
        setStatus(`Error fetching universities: ${error.message}`);
      }
    };
    fetchUniversities();
  }, []);

  useEffect(() => {
    if (university) {
      const fetchClassCodes = async () => {
        try {
          const response = await axios.get("http://localhost:5000/classcodes", {
            params: { university: encodeURIComponent(university) },
          });
          if (Array.isArray(response.data)) {
            setClassCodes(response.data);
          } else {
            setStatus("Error: Invalid class codes data format");
          }
        } catch (error) {
          setStatus(`Error fetching class codes: ${error.message}`);
        }
      };
      fetchClassCodes();
    }
  }, [university]);

  useEffect(() => {
    if (university && classCode) {
      const fetchClassNames = async () => {
        try {
          const response = await axios.get("http://localhost:5000/classnames", {
            params: {
              university: encodeURIComponent(university),
              classCode: encodeURIComponent(classCode),
            },
          });
          if (Array.isArray(response.data)) {
            setClassNames(response.data);
          } else {
            setStatus("Error: Invalid class names data format");
          }
        } catch (error) {
          setStatus(`Error fetching class names: ${error.message}`);
        }
      };
      fetchClassNames();
    }
  }, [university, classCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!university || !classCode || !className) {
      setStatus("Please fill out all fields.");
      return;
    }

    try {
      const response = await axios.get("http://localhost:5000/sources", {
        params: {
          university: encodeURIComponent(university),
          classCode: encodeURIComponent(classCode),
          className: encodeURIComponent(className),
        },
      });
      setSources(response.data.studySources);
      setStatus("");
    } catch (error) {
      setStatus(`Error fetching study sources: ${error.message}`);
    }
  };

  // Redirect button click handler with source info
  const handleRedirectToStudyHelper = (source) => {
    navigate("/study-plan", {
      state: {
        sourceText: source, // Passing the selected source to StudyHelper
      },
    });
  };

  return (
    <Container component="main" maxWidth="md" sx={{ mt: 8 }}>
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
          Browse Study Sources
        </Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>University</InputLabel>
                <Select
                  label="University"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                  required
                >
                  {universities?.map((uni) => (
                    <MenuItem key={uni} value={uni}>
                      {uni}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Class Code</InputLabel>
                <Select
                  label="Class Code"
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value)}
                  required
                  disabled={!classCodes.length}
                >
                  {classCodes?.map((code) => (
                    <MenuItem key={code} value={code}>
                      {code}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Class Name</InputLabel>
                <Select
                  label="Class Name"
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  required
                  disabled={!classNames.length}
                >
                  {classNames?.map((name) => (
                    <MenuItem key={name} value={name}>
                      {name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 3 }}
              >
                Search Sources
              </Button>
            </Grid>
          </Grid>
        </form>

        {status && (
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            {status}
          </Typography>
        )}

        {sources.length > 0 && (
          <Box sx={{ width: "100%", mt: 3 }}>
            <Typography variant="h6">Study Sources:</Typography>
            <List>
              {sources.map((source) => (
                <ListItem key={source._id}>
                  <ListItemText
                    primary={source.fileURL}
                    secondary={`Uploader: ${source.uploader}`}
                  />
                  {/* Button to study individual source */}
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleRedirectToStudyHelper(source)} // Pass the source here
                    sx={{ ml: 2 }}
                  >
                    Study this source
                  </Button>
                </ListItem>
              ))}
            </List>

            {/* Button to study all sources */}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              sx={{ mt: 3 }}
              onClick={() => handleRedirectToStudyHelper(sources)} // Pass all sources here
            >
              Study all sources
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default BrowseSources;

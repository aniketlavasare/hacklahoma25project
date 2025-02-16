import React, { useState } from "react";
import axios from "axios";

const StudyHelper = () => {
  const [action, setAction] = useState(""); // To store the selected action
  const [studySource, setStudySource] = useState(""); // To store the study material
  const [userQuestion, setUserQuestion] = useState(""); // To store the user's question
  const [response, setResponse] = useState(""); // To store the API response
  const [loading, setLoading] = useState(false); // To show loading state

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
      };

      // Send request to backend API
      const result = await axios.post("http://localhost:5000/process", body);
      setResponse(result.data.result);
    } catch (error) {
      setResponse("Error processing your request.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Study Helper</h1>
      <textarea
        style={styles.textArea}
        placeholder="Enter study material here..."
        value={studySource}
        onChange={(e) => setStudySource(e.target.value)}
      ></textarea>

      <div style={styles.buttonsContainer}>
        <button onClick={() => handleActionClick("summary")} style={styles.button}>
          Generate Summary
        </button>
        <button onClick={() => handleActionClick("quiz")} style={styles.button}>
          Generate Quiz
        </button>
        <button onClick={() => handleActionClick("youtube")} style={styles.button}>
          Recommend YouTube Videos
        </button>
        <button onClick={() => handleActionClick("ask")} style={styles.button}>
          Ask a Question
        </button>
      </div>

      {action === "ask" && (
        <div style={styles.inputContainer}>
          <input
            style={styles.inputBox}
            type="text"
            placeholder="Ask your question here..."
            value={userQuestion}
            onChange={(e) => setUserQuestion(e.target.value)}
          />
        </div>
      )}

      <button onClick={handleRequest} style={styles.submitButton} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>

      <div style={styles.responseContainer}>
        <h3>Response:</h3>
        <div style={styles.response}>{response}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  textArea: {
    width: "80%",
    height: "150px",
    marginBottom: "20px",
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  buttonsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#4CAF50",
    color: "white",
  },
  inputContainer: {
    marginBottom: "20px",
  },
  inputBox: {
    padding: "10px",
    fontSize: "16px",
    width: "300px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  submitButton: {
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "5px",
    border: "1px solid #ccc",
    backgroundColor: "#2196F3",
    color: "white",
  },
  responseContainer: {
    marginTop: "20px",
    width: "80%",
    padding: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  response: {
    whiteSpace: "pre-wrap",
    fontSize: "16px",
  },
};

export default StudyHelper;

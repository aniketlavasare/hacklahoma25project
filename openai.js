import { OpenAI } from "langchain/llms/openai";
import dotenv from "dotenv";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const llm = new OpenAI({
  openAIApiKey: openaiApiKey,
  modelName: "gpt-3.5-turbo",
});

/**
 * Process study material or handle user questions
 * @param {string} action - "quiz", "youtube", "summary", or "ask"
 * @param {string} studySource - The text content of the study material (if applicable)
 * @param {string} userQuestion - The user's question (only for "ask" action)
 * @returns {Promise<string>} - The generated response from the LLM
 */
const processStudyMaterial = async (action, studySource = "", userQuestion = "") => {
  let prompt = "";

  switch (action) {
    case "quiz":
      prompt = `Generate a short quiz with multiple-choice questions based on the following study material:\n\n${studySource}`;
      break;
    case "youtube":
      prompt = `Suggest a list of YouTube video topics related to this study material to help the user understand better:\n\n${studySource}`;
      break;
    case "summary":
      prompt = `Summarize the following study material in a clear and concise way:\n\n${studySource}`;
      break;
    case "ask":
      prompt = `Answer the following question based on the given study material (if provided):\n\nStudy Material: ${studySource}\n\nQuestion: ${userQuestion}`;
      break;
    default:
      throw new Error("Invalid action.");
  }

  try {
    const response = await llm.call(prompt);
    return response.text;
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Error generating response.");
  }
};

// Properly export the function
export { processStudyMaterial };

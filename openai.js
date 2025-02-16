const { OpenAI } = require("openai");
const dotenv = require("dotenv");

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

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
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error processing request:", error);
    throw new Error("Error generating response.");
  }
};

module.exports = { processStudyMaterial };

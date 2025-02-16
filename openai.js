const { OpenAI } = require("openai");
const dotenv = require("dotenv");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const { google } = require("googleapis");

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const youtube = google.youtube({ version: "v3", auth: YOUTUBE_API_KEY });

async function extractTextFromPdf(pdfPath) {
    const dataBuffer = await fs.promises.readFile(pdfPath); // fs.promises.readFile for async
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
}

async function searchYouTube(topic) {
    try {
        const response = await youtube.search.list({
            part: "snippet",
            q: topic, // Search query from user input
            maxResults: 5,
            type: "video",
        });

        // Corrected URL interpolation and return response
        return response.data.items.map((item) => ({
            title: item.snippet.title,
            url: `https://www.youtube.com/watch?v=${item.id.videoId}`, // Use template literal with backticks
        }));
    } catch (error) {
        console.error("Error fetching YouTube videos:", error);
        return [];
    }
}

const openai = new OpenAI({
  apiKey: openaiApiKey,
});

const processStudyMaterial = async (action, studySource = "", userQuestion = "", fileURL) => {
    
    let prompt = "";
    let flag = false;

    switch (action) {
        case "quiz":
            prompt = `Generate a short quiz with multiple-choice questions based on the following study material:\n\n${studySource}`;
            break;
        case "youtube":
            flag = true;
            prompt = `Suggest one keyword or sentence that I can use to search relevant videos on YouTube. The suggestion should be based on the following Study Material: ${studySource}`;
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

        if (flag) {
            // Await the searchYouTube function
            const videos = await searchYouTube(response.choices[0].message.content);
            const txt = videos.map((video, index) => {
                // Use template literals inside map
                return `${index + 1}. ${video.title} - ${video.url}`;
            }).join("\n");

            // Return the formatted string
            return txt;
        }

        return response.choices[0].message.content;
    } catch (error) {
        console.error("Error processing request:", error);
        throw new Error("Error generating response.");
    }
};

module.exports = { processStudyMaterial };

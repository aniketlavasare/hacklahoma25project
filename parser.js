const fs = require("fs-extra");
const path = require("path");
const pdfParse = require("pdf-parse");

async function extractTextFromPdf(pdfPath) {
    const dataBuffer = await fs.readFile(pdfPath);
    const pdfData = await pdfParse(dataBuffer);
    return pdfData.text;
}

/**
 * Process all PDF files in the input folder, save extracted text, and return it.
 * @param {string} inputFolder - Folder containing PDFs.
 * @param {string} outputFolder - Folder to store extracted text files.
 * @returns {Promise<Object>} - Dictionary of extracted text {filename: text}.
 */
async function processPdfs(inputFolder, outputFolder) {
    await fs.ensureDir(outputFolder); // Ensure output folder exists
    const extractedTexts = {}; // Object to store extracted text for each PDF

    const files = await fs.readdir(inputFolder);
    
    for (const filename of files) {
        if (filename.toLowerCase().endsWith(".pdf")) {
            const pdfPath = path.join(inputFolder, filename);
            const text = await extractTextFromPdf(pdfPath);

            // Save extracted text to a .txt file
            const outputPath = path.join(outputFolder, `${path.parse(filename).name}.txt`);
            await fs.writeFile(outputPath, text, "utf-8");

            // Store extracted text in the object
            extractedTexts[filename] = text;
            
            console.log(`Processed: ${filename} -> ${outputPath}`);
        }
    }

    return extractedTexts; // Return extracted text from all PDFs
}

// Export the extractTextFromPdf function
module.exports = {
    extractTextFromPdf,
    processPdfs
};

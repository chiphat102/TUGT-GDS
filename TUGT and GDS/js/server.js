const express = require("express"); // Import the Express framework
const fs = require("fs"); // Import file system module to interact with files
const cors = require("cors"); // Import CORS middleware to enable cross-origin requests
const { createObjectCsvWriter } = require("csv-writer"); // Import CSV writer to output CSV files

const app = express(); // Create an Express application
const PORT = 3000; // Define the port number for the server

// Enable JSON body parsing for incoming requests
app.use(express.json());

// Enable CORS for all origins
app.use(cors({
  origin: "*", // Allow any origin to access the API
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

// Define the CSV file path and header for saving assessment results
const csvFilePath = "elder_assessment_results.csv";
const csvWriter = createObjectCsvWriter({
  path: csvFilePath,
  header: [
    { id: "timestamp", title: "Timestamp" },           // Record timestamp
    { id: "assessmentType", title: "AssessmentType" },   // Assessment type label
    { id: "tugtTime", title: "TUGT_Time" },              // TUGT time measurement
    { id: "gdsResponses", title: "GDS_Responses" },      // Qualitative responses (stored as string)
    { id: "comments", title: "Comments" }                // Additional comments
  ],
  append: true // Append new data to the CSV file rather than overwriting it
});

// API Endpoint to save the assessment result
app.post("/save-assessment", async (req, res) => {
  try {
    const assessment = req.body; // Get the JSON payload from the request body
    if (!assessment.timestamp || !assessment.assessmentType) {
      return res.status(400).json({ error: "Invalid assessment data." });
    }
    // Convert the gdsResponses object into a JSON string so it can be saved in the CSV
    assessment.gdsResponses = JSON.stringify(assessment.gdsResponses);
    
    // Write the assessment record into the CSV file
    await csvWriter.writeRecords([assessment]);
    console.log("Assessment saved:", assessment);
    res.json({ message: "Assessment saved successfully." }); // Send a success response
  } catch (error) {
    console.error("Error saving assessment:", error);
    res.status(500).json({ error: "Failed to save assessment." }); // Send an error response in case of failure
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});

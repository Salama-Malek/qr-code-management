require("dotenv").config(); // Load environment variables before anything else

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const qrRoutes = require("./routes/qrRoutes.js");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();

// Connect to MongoDB
const PORT = process.env.PORT || 3000; // Provide a default port
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/qr_codes"; // Fallback URI

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/../client"))); // Serve static files

// Routes
app.use("/api/qr", qrRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html")); // Serve the main HTML file
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

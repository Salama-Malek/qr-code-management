const express = require("express");
const mongoose = require("mongoose");
const path = require("path"); // Add this line
const qrRoutes = require("./routes/qrRoutes.js");
const bodyParser = require("body-parser");

// Initialize Express app
const app = express();

// Connect to MongoDB
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/qr_codes";

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "/../client"))); // Use path.join

// Routes
app.use("/api/qr", qrRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html")); // Use path.join
});

// Start the server
// const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

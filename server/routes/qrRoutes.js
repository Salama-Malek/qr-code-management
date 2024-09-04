const express = require("express");
const path = require("path");
const router = express.Router();
const qrController = require("../controllers/qrController");
const QRCodeModel = require("../models/qrCode");

// Route to generate QR code
router.post("/generate", qrController.generateQRCode);

// Route to register user data
router.post("/register", async (req, res) => {
  const { qrCodeId, name, email, phone } = req.body;
  try {
    const qrCode = await QRCodeModel.findOne({ code: qrCodeId });
    if (!qrCode) {
      return res.status(404).json({ message: "QR Code not found" });
    }
    qrCode.userData = { name, email, phone };
    await qrCode.save();
    res.status(200).json({ message: "Registration successful" });
  } catch (error) {
    console.error("Error registering QR code:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to get all QR codes
router.get("/list", qrController.getAllQRCodes);

// Route to get user data for a QR code
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const qrCode = await QRCodeModel.findOne({ code: id });
    if (qrCode) {
      res.status(200).json(qrCode.userData || {});
    } else {
      res.status(404).json({ message: "QR Code not found" });
    }
  } catch (error) {
    console.error("Error fetching QR code:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Route to delete a QR code by ID
router.delete("/:id", qrController.deleteQRCode);

// Route to serve the user data page
router.get("/user-data", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/userData.html"));
});

module.exports = router;

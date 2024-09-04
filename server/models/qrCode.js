// server/models/qrCode.js

const mongoose = require("mongoose");

const qrCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  qrCodeData: { type: String, required: true },
  url: { type: String, required: true },
  userData: {
    name: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
});

module.exports = mongoose.model("QRCode", qrCodeSchema);

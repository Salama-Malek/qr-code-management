const QRCode = require("qrcode");

async function createQR(uniqueId) {
  try {
    // Generate QR code as a data URL
    const qrCodeData = await QRCode.toDataURL(uniqueId);
    return qrCodeData;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
}

module.exports = { createQR };

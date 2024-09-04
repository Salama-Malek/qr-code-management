const QRCode = require("qrcode");
const QRCodeModel = require("../models/qrCode");
const { v4: uuidv4 } = require("uuid");

// // Function to generate QR code
// async function createQR(uniqueId) {
//   try {
//     // URL where the QR code will direct to
//     const url = `http://localhost:3000/api/qr/${uniqueId}`;

//     // Generate a QR code as a data URL
//     const qrCodeData = await QRCode.toDataURL(url);
//     return qrCodeData;
//   } catch (error) {
//     console.error("Error generating QR code:", error);
//     throw new Error("Failed to generate QR code");
//   }
// }

// // Controller to handle QR code generation
// exports.generateQRCode = async (req, res) => {
//   try {
//     const uniqueId = uuidv4(); // Generate a unique ID
//     const qrCodeData = await createQR(uniqueId); // Generate QR code data URL

//     // Save to database
//     const qrCode = new QRCodeModel({
//       code: uniqueId,
//       qrCodeData,
//       url: `http://localhost:3000/api/qr/${uniqueId}`, // Store the URL
//     });
//     await qrCode.save();

//     res.json({ qrCodeData, uniqueId });
//   } catch (error) {
//     console.error("Error generating or saving QR code:", error);
//     res.status(500).send("Server Error");
//   }
// };


// Function to generate a QR code
async function createQR(uniqueId) {
  try {
    const url = `http://localhost:3000/api/qr/${uniqueId}`;
    const qrCodeData = await QRCode.toDataURL(url);
    return qrCodeData;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("Failed to generate QR code");
  }
}

// Controller to handle QR code generation
exports.generateQRCode = async (req, res) => {
  try {
    const { count } = req.body; // Number of QR codes to generate
    let qrCodes = [];

    if (!count || count <= 0) {
      const uniqueId = uuidv4(); // Generate a unique ID for single QR code
      const qrCodeData = await createQR(uniqueId); // Generate QR code data URL

      // Save to database
      const qrCode = new QRCodeModel({
        code: uniqueId,
        qrCodeData,
        url: `http://localhost:3000/api/qr/${uniqueId}`,
      });
      await qrCode.save();

      qrCodes.push({ qrCodeData, uniqueId });
    } else {
      // Generate multiple QR codes
      for (let i = 0; i < count; i++) {
        const uniqueId = uuidv4(); // Generate a unique ID
        const qrCodeData = await createQR(uniqueId); // Generate QR code data URL

        // Save to database
        const qrCode = new QRCodeModel({
          code: uniqueId,
          qrCodeData,
          url: `http://localhost:3000/api/qr/${uniqueId}`,
        });
        await qrCode.save();

        qrCodes.push({ qrCodeData, uniqueId });
      }
    }

    res.json({ qrCodes });
  } catch (error) {
    console.error("Error generating or saving QR codes:", error);
    res.status(500).send("Server Error");
  }
};







// Function to register user data
exports.registerQRCodeData = async (req, res) => {
  try {
    const { qrCodeId, name, email, phone } = req.body;
    const qrCode = await QRCodeModel.findOne({ code: qrCodeId });

    if (!qrCode) {
      return res.status(404).send("QR code not found");
    }

    // Update or add user data to the QR code
    qrCode.userData = { name, email, phone };
    await qrCode.save();

    res.status(200).send("Data registered successfully");
  } catch (error) {
    console.error("Error registering QR code data:", error);
    res.status(500).send("Server Error");
  }
};

// Function to handle QR code access
exports.getQRCode = async (req, res) => {
  try {
    const qrCode = await QRCodeModel.findOne({ code: req.params.id });

    if (!qrCode) {
      // If QR code is not found, redirect to register.html
      return res.redirect("/register.html");
    }

    if (
      !qrCode.userData.name ||
      !qrCode.userData.email ||
      !qrCode.userData.phone
    ) {
      // If QR code is found but user data is empty, redirect to register.html
      return res.redirect("/register.html");
    }

    // If QR code is found and user data is not empty, return the QR code data
    res.json(qrCode);
  } catch (error) {
    console.error("Error fetching QR code:", error);
    res.status(500).send("Server Error");
  }
};

// Function to fetch all QR codes
exports.getAllQRCodes = async (req, res) => {
  try {
    const qrCodes = await QRCodeModel.find({});
    res.json(qrCodes);
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).send("Server Error");
  }
};

// Function to delete a QR code by ID
exports.deleteQRCode = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await QRCodeModel.findByIdAndDelete(id);
    if (!result) {
      return res.status(404).send("QR code not found");
    }
    res.status(200).send("QR code deleted successfully");
  } catch (error) {
    console.error("Error deleting QR code:", error);
    res.status(500).send("Server Error");
  }
};




// Controller to get QR code count
exports.getQRCodeCount = async (req, res) => {
  try {
    const count = await QRCodeModel.countDocuments({});
    res.json({ count });
  } catch (error) {
    console.error("Error fetching QR code count:", error);
    res.status(500).send("Server Error");
  }
};



// Function to fetch paginated QR codes
exports.getPaginatedQRCodes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const [qrCodes, total] = await Promise.all([
      QRCodeModel.find().skip(skip).limit(limit).exec(),
      QRCodeModel.countDocuments()
    ]);

    res.json({ qrCodes, total });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    res.status(500).send("Server Error");
  }
};

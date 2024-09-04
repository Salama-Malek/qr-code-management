document.addEventListener("DOMContentLoaded", function () {
  // Handle QR code generation
  document
    .getElementById("generate-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      try {
        const response = await fetch("/api/qr/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();

        if (response.ok) {
          if (data.qrCodeData) {
            displayQRCode(data.qrCodeData, data.uniqueId);
            loadQRCodes();
          } else {
            console.error("QR code data is undefined");
          }
        } else {
          console.error("Failed to generate QR code:", data.message);
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
      }
    });

  // Function to display the QR code
  function displayQRCode(qrCodeData, uniqueId) {
    const qrCodeImg = document.getElementById("qr-code-img");
    if (qrCodeImg) {
      qrCodeImg.src = qrCodeData;
      qrCodeImg.alt = `QR Code for ID: ${uniqueId}`;
      qrCodeImg.style.display = "block"; // Make sure it's visible
    } else {
      console.error("QR code image element not found");
    }
  }

  // Load and display all QR codes
  async function loadQRCodes() {
    try {
      const response = await fetch("/api/qr/list");
      const qrCodes = await response.json();

      if (response.ok) {
        const qrCodesList = document.getElementById("qr-codes-list");
        qrCodesList.innerHTML = "";
        qrCodes.forEach((qrCode) => {
          const qrCodeElement = document.createElement("div");
          qrCodeElement.innerHTML = `
            <img src="${qrCode.qrCodeData}" alt="QR Code">
            <button onclick="deleteQRCode('${qrCode._id}')">Delete</button>
          `;
          qrCodesList.appendChild(qrCodeElement);
        });
      } else {
        console.error("Failed to load QR codes:", qrCodes.message);
      }
    } catch (error) {
      console.error("Error loading QR codes:", error);
    }
  }

  // Delete a QR code
  window.deleteQRCode = async function (id) {
    try {
      const response = await fetch(`/api/qr/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        loadQRCodes();
      } else {
        console.error(
          "Failed to delete QR code:",
          (await response.json()).message
        );
      }
    } catch (error) {
      console.error("Error deleting QR code:", error);
    }
  };

  // Handle QR code scan
  window.handleQRCodeScan = async function (uniqueId) {
    try {
      const response = await fetch(`/api/qr/${uniqueId}`);
      const data = await response.json();

      if (response.ok) {
        // Check if user data fields are empty or undefined
        if (!data.name?.trim() || !data.email?.trim() || !data.phone?.trim()) {
          // Redirect to the registration page if user data is empty
          window.location.href = `/register?qrCodeId=${uniqueId}`;
        } else {
          // Redirect to the user data page if user data exists
          window.location.href = `/user-data?qrCodeId=${uniqueId}`;
        }
      } else {
        // Handle cases where the API request fails
        console.error("Error fetching QR code data:", data.message);
        window.location.href = "/error.html"; // Redirect to an error page or handle the error appropriately
      }
    } catch (error) {
      console.error("Error:", error);
      window.location.href = "/error.html"; // Redirect to an error page or handle the error appropriately
    }
  };

  // Initial load
  loadQRCodes();
});

import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";
import "./QRCodeGenerator.css";

function QRCodeGenerator() {
  const [ndcCode, setNdcCode] = useState("");
  const [manufacturerId, setManufacturerId] = useState("");
  const [qrSize, setQrSize] = useState("150");

  const generateQRData = () => {
    if (!ndcCode.trim() || !manufacturerId.trim()) return "";
    return `${ndcCode}|${manufacturerId}`; // Combining both inputs with a separator
  };

  const handleSaveQR = async () => {
    const qrData = generateQRData();

    if (!qrData) {
      alert("Please enter both NDC Code and Manufacturer ID.");
      return;
    }

    try {
      // Convert the QR code to a data URL
      const canvas = document.getElementById("qrCanvas");
      const qrImageUrl = canvas.toDataURL("image/png");

      // Send the QR code data to the backend
      await axios.post("http://localhost:5000/save-qr", {
        qrData,
        qrImageUrl,
      });

      alert("QR Code saved successfully!");
    } catch (error) {
      console.error("Error saving QR code:", error);
      alert("Failed to save QR code.");
    }
  };

  return (
    <div className="app-container">
      <h1>QR Code Generator</h1>

      <label htmlFor="ndcCode" className="input-label">
        Enter NDC Code:
      </label>
      <input
        type="text"
        id="ndcCode"
        value={ndcCode}
        placeholder="Enter NDC Code"
        onChange={(e) => setNdcCode(e.target.value)}
      />

      <label htmlFor="manufacturerId" className="input-label">
        Enter Manufacturer ID:
      </label>
      <input
        type="text"
        id="manufacturerId"
        value={manufacturerId}
        placeholder="Enter Manufacturer ID"
        onChange={(e) => setManufacturerId(e.target.value)}
      />

      {ndcCode && manufacturerId && (
        <div className="qr-code-container">
          <QRCodeCanvas
            id="qrCanvas"
            value={generateQRData()}
            size={parseInt(qrSize) || 150}
          />
        </div>
      )}

      <button
        className="generate-button"
        onClick={handleSaveQR}
        disabled={!ndcCode.trim() || !manufacturerId.trim()}
      >
        Save QR Code
      </button>
    </div>
  );
}

export default QRCodeGenerator;


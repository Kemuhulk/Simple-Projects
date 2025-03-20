const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/med_db")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Define a schema and model for the "medicines" collection
const medicineSchema = new mongoose.Schema({
  name: String,
  ndcCode: String,
  manufacturerId: String,
  qrImageUrl: String,
});

const Medicine = mongoose.model("Medicine", medicineSchema);

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

// API Routes

// Save QR code data to MongoDB
app.post("/save-qr", async (req, res) => {
  const { qrData, qrImageUrl } = req.body;

  // Split qrData into NDC code and manufacturer ID
  const [ndcCode, manufacturerId] = qrData.split("|"); // Example format: "NDC123|MAN456"

  // Create a new medicine document
  const medicine = new Medicine({
    name: `Medicine with NDC: ${ndcCode}`,
    ndcCode,
    manufacturerId,
    qrImageUrl,
  });

  try {
    // Save the document to MongoDB
    const savedMedicine = await medicine.save();
    res.status(201).json(savedMedicine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Fetch all medicines from MongoDB
app.get("/api/medicines", async (req, res) => {
  try {
    const medicines = await Medicine.find();
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle React routing, return all requests to React app
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require("express");
const cors = require("cors");

const app = express();

// ✅ Simple CORS (no strict config for now)
app.use(cors());

// ✅ Body parser
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Main API
app.post("/bfhl", (req, res) => {
  try {
    const data = req.body?.data;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        error: "Invalid input. Send { data: [] }"
      });
    }

    res.json({
      user_id: "jaditya_27082005",
      email_id: "ja6645@srmist.edu.in",
      college_roll_number: "RA2311003010280",
      received: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server crashed" });
  }
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
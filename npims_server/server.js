const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
// Setup CORS properly — allow frontend origin and credentials
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // allow all needed methods
  allowedHeaders: ["Content-Type", "Authorization"],    // allow needed headers
}));

app.use(express.json());

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// MongoDB connection
const uri = process.env.ATLAS_URI;
if (!uri) {
  console.error("Missing ATLAS_URI in environment variables.");
  process.exit(1);
}

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1); // Prevent server from running without DB
  });

// Routes
const propertiesRouter = require("./routes/properties");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

app.use("/properties", propertiesRouter);
app.use("/users", usersRouter);
app.use("/login", authRouter);

// Test route
app.get("/", (req, res) => {
  res.send("✅ Server is alive");
});

// Start the server
app.listen(port, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port: ${port}`);
});

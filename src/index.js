require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// Default route
app.get("/", (req, res) => {
  res.send("Crime Management System API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

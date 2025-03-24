require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { PrismaClient } = require("@prisma/client");

const app = express();
const prisma = new PrismaClient(); // Initialize Prisma

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(compression());

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: "error",
    message: "Something went wrong!",
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("Crime Management System API is running...");
});

// Handle undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful Shutdown
const shutdown = async () => {
  console.log("\nShutting down server...");

  try {
    await prisma.$disconnect(); // Close Prisma connection
    console.log("✅ Database connection closed.");
  } catch (error) {
    console.error("❌ Error closing database connection:", error);
  }

  server.close(() => {
    console.log("✅ HTTP server closed.");
    process.exit(0);
  });

  // Force exit after 5 seconds if not closed
  setTimeout(() => {
    console.error("❌ Forcefully shutting down...");
    process.exit(1);
  }, 5000);
};

// Handle termination signals
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

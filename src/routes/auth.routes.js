const express = require("express");
const {
  register,
  login,
  getAuthenticatedUser,
  refreshToken,
} = require("../controllers/auth.controller.js");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validation.middleware.js");
const { authenticate } = require("../middleware/auth.middleware.js");
const { loginLimiter } = require("../middleware/rate-limiter.middleware.js");

const authRouter = express.Router();

// Register a new user
authRouter.post("/register", validateRegister, register);

// User login
authRouter.post("/login", loginLimiter, validateLogin, login);

// Get authenticated user details (Protected route)
authRouter.get("/me", authenticate, getAuthenticatedUser);

// New route for refreshing access tokens
authRouter.post("/refresh-token", refreshToken);

module.exports = authRouter;

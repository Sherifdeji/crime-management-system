const AuthService = require("../services/auth.service.js");

// Handles user registration
exports.register = async (req, res) => {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Handles user login
exports.login = async (req, res) => {
  try {
    const {
      token: accessToken,
      refreshToken,
      user,
    } = await AuthService.login(req.body);
    res
      .status(200)
      .json({ message: "Login successful", accessToken, refreshToken, user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Get authenticated user's details
exports.getAuthenticatedUser = async (req, res) => {
  try {
    const user = await AuthService.getUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

// Handle token refresh: issues a new access token using a valid refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token)
      return res.status(401).json({ error: "Refresh token is required" });

    const newAccessToken = await AuthService.refreshAccessToken(token);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

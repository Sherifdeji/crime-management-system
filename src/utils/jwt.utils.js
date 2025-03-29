const jwt = require("jsonwebtoken");
require("dotenv").config();

const jwtUtils = {
  // Generate JWT with essential claims
  generateToken: (user) => {
    return jwt.sign(
      {
        id: user.id, // Standard subject claim
        role: user.role, // Authorization role
        iat: Math.floor(Date.now() / 1000), // Issued at timestamp
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h", // Shorter expiry for security
        issuer: process.env.JWT_ISSUER || "crime-management-api",
        audience: [process.env.JWT_AUDIENCE || "web-app"], // Specific client apps
      }
    );
  },

  // Generate Refresh Token
  generateRefreshToken: (user) => {
    return jwt.sign(
      {
        id: user.id,
        type: "refresh",
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d", // Longer expiration
        issuer: process.env.JWT_ISSUER || "crime-management-api",
        audience: [process.env.JWT_AUDIENCE || "web-app"],
      }
    );
  },

  // Verify Access Token
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER || "crime-management-api",
        audience: [process.env.JWT_AUDIENCE || "web-app"],
      });
    } catch (error) {
      // Differentiate error types
      if (error.name === "TokenExpiredError") {
        throw new Error("Token expired, please log in again");
      }
      throw new Error("Invalid token");
    }
  },

  // Verify Refresh Token
  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_REFRESH_SECRET, {
        issuer: process.env.JWT_ISSUER || "crime-management-api",
        audience: [process.env.JWT_AUDIENCE || "web-app"],
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token expired");
      }
      throw new Error("Invalid refresh token");
    }
  },
};

module.exports = jwtUtils;

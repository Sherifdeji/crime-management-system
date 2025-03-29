const jwtUtils = require("../utils/jwt.utils.js");

exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwtUtils.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const message =
      error.message === "Token expired"
        ? "Session expired. Please log in again"
        : "Invalid token";

    res.status(401).json({ error: message });
  }
};

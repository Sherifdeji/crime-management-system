const bcrypt = require("bcryptjs");
const jwtUtils = require("../utils/jwt.utils.js");
// const prisma = require("../config/prisma.config.js");

const AuthService = (prisma) => {
  return {
    //Registers a new user
    async register({ name, email, password, role }) {
      email = email.toLowerCase();
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) throw new Error("Email already in use");

      // Hash the password before storing it
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save user to database
      const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role },
      });

      delete user.password; // Ensure password is not exposed
      return user;
    },

    // Logs in a user and returns a JWT
    async login({ email, password }) {
      email = email.toLowerCase();
      // Find user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) throw new Error("Invalid email or password");

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) throw new Error("Invalid email or password");

      // Generate JWT token
      const accessToken = jwtUtils.generateToken(user);
      const refreshToken = jwtUtils.generateRefreshToken(user);

      return { accessToken, refreshToken, user };
    },

    // Uses a refresh token to generate a new access token
    async refreshAccessToken(token) {
      try {
        const decoded = jwtUtils.verifyRefreshToken(token);
        // verify the user exists:
        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });
        if (!user) throw new Error("User not found");

        const newAccessToken = jwtUtils.generateToken(user);
        return newAccessToken;
      } catch (error) {
        throw new Error("Invalid refresh token");
      }
    },

    // Fetch user details by ID
    async getUserById(userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      return user;
    },

    async refreshToken(refreshToken) {
      try {
        // Verify the refresh token
        const decoded = jwtUtils.verifyRefreshToken(refreshToken);

        // Find the user
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        });

        if (!user) {
          throw new Error("User not found");
        }

        // Generate new access and refresh tokens
        const newAccessToken = jwtUtils.generateToken(user);
        const newRefreshToken = jwtUtils.generateRefreshToken(user);

        return {
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          user,
        };
      } catch (error) {
        throw new Error("Invalid refresh token");
      }
    },
  };
};

module.exports = AuthService;

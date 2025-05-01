const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");
const User = require("../models/User");
const Session = require("../models/Session");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const getClientIp = async (req) => {
  const forwarded = req.headers["x-forwarded-for"];
  let ip = forwarded ? forwarded.split(",")[0].trim() : req.ip;

  console.log("Raw IP:", ip);

  if (ip === "::1" || ip === "127.0.0.1") {
    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      ip = response.data.ip;
      console.log("Public IP from ipify:", ip);
    } catch (error) {
      console.error("Failed to fetch public IP:", error.message);
      ip = "unknown";
    }
  }

  return ip;
};

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Name, email, and password are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Register error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ error: `Validation failed: ${messages}` });
    }
    res
      .status(500)
      .json({ error: "Failed to register user. Please try again later." });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "User not find!!" });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials!!" });
    }

    await Session.updateMany(
      { userId: user._id, isActive: true },
      { isActive: false }
    );

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    const refreshToken = uuidv4();

    const ipAddress = await getClientIp(req);

    const session = new Session({
      userId: user._id,
      jwtToken: token,
      refreshToken,
      ipAddress,
      userAgent: req.get("User-Agent"),
    });

    await session.save();

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "strict",
      path: "/",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production" || false,
      sameSite: "strict",
      path: "/",
    });

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ error: "Failed to log in. Please try again later." });
  }
});

router.post("/refresh", async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "No refresh token provided" });
    }

    const session = await Session.findOne({ refreshToken, isActive: true });
    if (!session) {
      return res
        .status(401)
        .json({ error: "Invalid or expired refresh token" });
    }

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    const newToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    session.jwtToken = newToken;
    session.lastActiveAt = new Date();
    await session.save();

    res.cookie("token", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.json({ message: "Token refreshed" });
  } catch (error) {
    console.error("Refresh error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
});

router.post("/logout", authMiddleware, async (req, res) => {
  try {
    const sessionId = req.body ? req.body.sessionId : null;
    if (sessionId) {
      console.log("Logging out session:", sessionId);
      await Session.updateOne(
        { _id: sessionId, userId: req.userId },
        { isActive: false }
      );
    } else {
      console.log("Logging out current session:", req.session._id);
      await Session.updateOne({ _id: req.session._id }, { isActive: false });

      res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(400).json({ error: "Failed to log out. Please try again." });
  }
});

module.exports = router;

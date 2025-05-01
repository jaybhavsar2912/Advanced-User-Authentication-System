const express = require("express");
const authMiddleware = require("../middleware/auth");
const roleMiddleware = require("../middleware/role");
const Session = require("../models/Session");

const router = express.Router();

router.get("/sessions/active", authMiddleware, async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.userId, isActive: true });
    res.json(sessions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get(
  "/admin/dashboard",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => {
    res.json({ message: "Welcome to admin dashboard" });
  }
);

router.get(
  "/user/profile",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  (req, res) => {
    res.json({ user: req.user });
  }
);

module.exports = router;

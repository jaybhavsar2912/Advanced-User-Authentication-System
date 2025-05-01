const jwt = require("jsonwebtoken");
const Session = require("../models/Session");

module.exports = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({
      jwtToken: token,
      userId: decoded.userId,
      isActive: true,
    });

    if (!session) {
      return res.status(401).json({ error: "Invalid or expired session" });
    }

    req.userId = decoded.userId;
    req.session = session;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

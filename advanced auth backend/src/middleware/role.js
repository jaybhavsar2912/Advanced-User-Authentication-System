const User = require("../models/User");

const roleMiddleware = (roles) => async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ error: "Forbidden" });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = roleMiddleware;

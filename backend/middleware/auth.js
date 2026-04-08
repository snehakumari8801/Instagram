const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.authMiddleware = (req, res, next) => {
  try {
    const tokenFromHeader = req.header("Authorization")?.replace("Bearer ", "").trim();
    const token = req.cookies?.token || tokenFromHeader;

    // console.log("Token received:", token);  // Debug

    if (!token) {
      return res.status(401).json({ success: false, message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("JWT Error:", err);
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

const jwt = require("jsonwebtoken");
require("dotenv").config();
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "UNAUTHORIZED",
      message: "Akses ditolak"
    });
  }
  
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error: "INVALID_TOKEN",
      message: "Session telah habis, silahkan login kembali"
    });
  }
};

module.exports = verifyToken;

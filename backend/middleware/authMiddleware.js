const jwt = require("jsonwebtoken");

require("dotenv").config();

const verifyToken = (req, res, next) => {
  // GET TOKEN FROM HEADER
  const authHeader = req.headers.authorization;

  // CHECK TOKEN EXISTS
  if (!authHeader) {
    return res.status(401).json({
      message: "Access denied. No token provided",
    });
  }

  try {
    // REMOVE "Bearer "
    const token = authHeader.split(" ")[1];

    // VERIFY TOKEN
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    // STORE USER DATA
    req.user = verified;

    next();
  } catch (error) {
    res.status(400).json({
      message: "Invalid token",
    });
  }
};

module.exports = verifyToken;

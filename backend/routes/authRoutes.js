const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();

const bcrypt = require("bcrypt");

const db = require("../config/db");

// REGISTER USER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // SQL QUERY
    const sql = `
            INSERT INTO users
            (name, email, password, role)
            VALUES (?, ?, ?, ?)
        `;

    db.query(sql, [name, email, hashedPassword, role], (err, result) => {
      if (err) {
        return res.status(500).json(err);
      }

      res.json({
        message: "User registered successfully",
      });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

// LOGIN USER
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  // FIND USER
  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    // USER NOT FOUND
    if (result.length === 0) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    const user = result[0];

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(password, user.password);

    // WRONG PASSWORD
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user.user_id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "1d",
      },
    );

    // SUCCESS
    res.json({
      message: "Login successful",

      token,
    });
  });
});

module.exports = router;

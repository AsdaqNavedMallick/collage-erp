const express = require("express");
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

module.exports = router;

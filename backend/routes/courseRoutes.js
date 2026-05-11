const express = require("express");

const router = express.Router();

const db = require("../config/db");

const verifyToken = require("../middleware/authMiddleware");

const adminOnly = require("../middleware/adminMiddleware");

// GET ALL COURSES
router.get("/", verifyToken, (req, res) => {
  const sql = `
        SELECT

            course.course_id,
            course.course_name,
            course.course_code,
            course.credits,

            department.dept_name

        FROM course

        INNER JOIN department

        ON course.dept_id = department.dept_id
    `;

  db.query(sql, (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json(result);
  });
});

// ADD COURSE
router.post("/", verifyToken, adminOnly, (req, res) => {
  const { course_name, course_code, credits, dept_id } = req.body;

  const sql = `
            INSERT INTO course
            (course_name, course_code, credits, dept_id)
            VALUES (?, ?, ?, ?)
        `;

  db.query(sql, [course_name, course_code, credits, dept_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Course added successfully",
    });
  });
});

// UPDATE COURSE
router.put("/:id", verifyToken, adminOnly, (req, res) => {
  const { id } = req.params;

  const { course_name, course_code, credits } = req.body;

  const sql = `
            UPDATE course
            SET
                course_name = ?,
                course_code = ?,
                credits = ?
            WHERE course_id = ?
        `;

  db.query(sql, [course_name, course_code, credits, id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Course updated successfully",
    });
  });
});

// DELETE COURSE
router.delete("/:id", verifyToken, adminOnly, (req, res) => {
  const { id } = req.params;

  const sql = `
            DELETE FROM course
            WHERE course_id = ?
        `;

  db.query(sql, [id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "Course deleted successfully",
    });
  });
});

module.exports = router;

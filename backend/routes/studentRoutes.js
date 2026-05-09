const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL STUDENTS
router.get('/', (req, res) => {

    const sql = 'SELECT * FROM student';

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// GET SINGLE STUDENT
router.get('/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'SELECT * FROM student WHERE student_id = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);
    });
});

// ADD STUDENT
router.post('/', (req, res) => {

    const {
        student_name,
        email,
        phone,
        semester,
        dept_id
    } = req.body;

    const sql = `
        INSERT INTO student
        (student_name, email, phone, semester, dept_id)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [student_name, email, phone, semester, dept_id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Student added successfully'
            });
        }
    );
});

// UPDATE STUDENT
router.put('/:id', (req, res) => {

    const { id } = req.params;

    const {
        student_name,
        email,
        phone,
        semester
    } = req.body;

    const sql = `
        UPDATE student
        SET
        student_name = ?,
        email = ?,
        phone = ?,
        semester = ?
        WHERE student_id = ?
    `;

    db.query(
        sql,
        [student_name, email, phone, semester, id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: 'Student updated successfully'
            });
        }
    );
});

// DELETE STUDENT
router.delete('/:id', (req, res) => {

    const { id } = req.params;

    const sql = 'DELETE FROM student WHERE student_id = ?';

    db.query(sql, [id], (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json({
            message: 'Student deleted successfully'
        });
    });
});

module.exports = router;

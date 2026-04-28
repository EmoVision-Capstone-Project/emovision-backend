const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/', async (req, res) => {
  try {
    const allJournals = await pool.query('SELECT * FROM journals ORDER BY created_at DESC');
    res.status(200).json({
      success: true,
      message: "Berhasil mengambil data jurnal",
      data: allJournals.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, content, mood_result, ai_accuracy_score, ai_feedback } = req.body;

    const newJournal = await pool.query(
      `INSERT INTO journals (user_id, content, mood_result, ai_accuracy_score, ai_feedback) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING *`,
      [user_id, content, mood_result, ai_accuracy_score, ai_feedback]
    );

    res.status(201).json({
      success: true,
      message: "Jurnal berhasil disimpan ke database!",
      data: newJournal.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Gagal menyimpan jurnal" });
  }
});

module.exports = router;
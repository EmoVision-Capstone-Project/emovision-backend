const express = require('express');
const crypto = require('crypto'); 
const router = express.Router();

let journals = [
  {
    journal_id: crypto.randomUUID(), 
    user_id: "123e4567-e89b-12d3-a456-426614174000", 
    content: "Hari ini aku merasa cukup tertekan karena banyak deadline proyek yang menumpuk.", 
    mood_result: "Sad", 
    ai_accuracy_score: 0.88, 
    ai_feedback: "Terdeteksi sedikit ketegangan pada otot wajah. Jangan lupa ambil napas dalam dan istirahat sejenak ya.", 
    created_at: new Date().toISOString() 
  }
];

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "Berhasil mengambil data jurnal",
    data: journals
  });
});

router.post('/', (req, res) => {
  const { user_id, content, mood_result, ai_accuracy_score, ai_feedback } = req.body;

  if (!content || !mood_result) {
    return res.status(400).json({ 
      success: false, 
      message: "Konten jurnal dan hasil mood tidak boleh kosong!" 
    });
  }

  const newJournal = {
    journal_id: crypto.randomUUID(),
    user_id: user_id || "123e4567-e89b-12d3-a456-426614174000",
    content: content,
    mood_result: mood_result,
    ai_accuracy_score: ai_accuracy_score || null, 
    ai_feedback: ai_feedback || null,
    created_at: new Date().toISOString()
  };

  journals.push(newJournal);

  res.status(201).json({
    success: true,
    message: "Jurnal berhasil disimpan!",
    data: newJournal
  });
});

module.exports = router;
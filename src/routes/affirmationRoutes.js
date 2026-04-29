const express = require('express');
const router = express.Router();
const pool = require('../db'); 

router.get('/', async (req, res) => {
  try {
    const allAffirmations = await pool.query('SELECT * FROM affirmations ORDER BY created_at DESC');
    res.status(200).json({ success: true, data: allAffirmations.rows });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

router.post('/', async (req, res) => {
  try {
    const { user_id, content } = req.body;

    const newAffirmation = await pool.query(
      `INSERT INTO affirmations (user_id, content) VALUES ($1, $2) RETURNING *`,
      [user_id, content]
    );

    const d = new Date();
    const wibTime = new Date(d.toLocaleString("en-US", { timeZone: "Asia/Jakarta" }));
    const todayStr = `${wibTime.getFullYear()}-${String(wibTime.getMonth() + 1).padStart(2, '0')}-${String(wibTime.getDate()).padStart(2, '0')}`;
    
    const userStats = await pool.query(
      "SELECT current_streak, TO_CHAR(last_journal_date, 'YYYY-MM-DD') as last_date_str FROM user_stats WHERE user_id = $1", 
      [user_id]
    );
    
    let isStreakUpdated = false; 
    let newStreak = 0;

    if (userStats.rows.length > 0) {
      const stats = userStats.rows[0];
      const lastDateStr = stats.last_date_str; 

      newStreak = stats.current_streak;

      if (lastDateStr === todayStr) {
        isStreakUpdated = false; 
      } else if (lastDateStr) {
        const diffTime = new Date(todayStr + 'T00:00:00Z') - new Date(lastDateStr + 'T00:00:00Z');
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          newStreak += 1;
          isStreakUpdated = true; 
        } else {
          newStreak = 1;
          isStreakUpdated = true; 
        }
      } else {
         newStreak = 1;
         isStreakUpdated = true;
      }

      await pool.query(
        'UPDATE user_stats SET current_streak = $1, last_journal_date = $2 WHERE user_id = $3',
        [newStreak, todayStr, user_id]
      );
    }

    res.status(201).json({
      success: true,
      message: "Afirmasi berhasil disimpan!",
      data: newAffirmation.rows[0],
      isStreakUpdated: isStreakUpdated, 
      currentStreak: newStreak          
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Gagal menyimpan afirmasi" });
  }
});

module.exports = router;
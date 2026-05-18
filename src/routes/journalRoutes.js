const express = require('express');
const router = express.Router();
const pool = require('../db'); 

const getWeeklyStats = async (req, res) => {
  const { user_id } = req.params;
  const { month, year } = req.query;

  try {
    const query = `
      SELECT 
        CASE 
          WHEN EXTRACT(DAY FROM created_at) BETWEEN 1 AND 7 THEN 'Week 1'
          WHEN EXTRACT(DAY FROM created_at) BETWEEN 8 AND 14 THEN 'Week 2'
          WHEN EXTRACT(DAY FROM created_at) BETWEEN 15 AND 21 THEN 'Week 3'
          ELSE 'Week 4'
        END as week_name,
        LOWER(mood_result) as mood
      FROM journals
      WHERE user_id = $1 
        AND EXTRACT(MONTH FROM created_at) = $2
        AND EXTRACT(YEAR FROM created_at) = $3
    `;

    const result = await pool.query(query, [user_id, month, year]);

    const moodToValue = {
      'happy': 7, 'surprised': 6, 'neutral': 5, 'sad': 4,
      'fear': 3, 'disgust': 2, 'angry': 1
    };

    const weeklyScores = { 'Week 1': [], 'Week 2': [], 'Week 3': [], 'Week 4': [] };

    result.rows.forEach(row => {
      const value = moodToValue[row.mood] || 5;
      weeklyScores[row.week_name].push(value);
    });

    const finalChartData = ['Week 1', 'Week 2', 'Week 3', 'Week 4'].map(week => {
      const scores = weeklyScores[week];
      const avg = scores.length > 0 
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
        : 5;
      
      return { name: week, moodValue: avg };
    });

    res.status(200).json({
      status: 'success',
      data: finalChartData
    });

  } catch (error) {
    console.error("Gagal menghitung statistik mingguan:", error);
    res.status(500).json({ status: 'error', message: 'Internal Server Error' });
  }
};

router.get('/stats/weekly/:user_id', getWeeklyStats);

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
      message: "Jurnal berhasil disimpan!",
      data: newJournal.rows[0],
      isStreakUpdated: isStreakUpdated, 
      currentStreak: newStreak          
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Gagal menyimpan jurnal" });
  }
});

router.get('/stats/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const stats = await pool.query('SELECT current_streak FROM user_stats WHERE user_id = $1', [userId]);
    
    if(stats.rows.length === 0){
        return res.status(200).json({ success: true, data: { current_streak: 0 } });
    }

    res.status(200).json({
      success: true,
      data: stats.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Gagal mengambil data stat" });
  }
});

module.exports = router;
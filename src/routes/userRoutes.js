const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await pool.query(
      'SELECT user_id, full_name, username FROM users WHERE user_id = $1', 
      [id]
    );
    
    if (user.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }
    
    res.status(200).json({ success: true, data: user.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan server" });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, username, password } = req.body;

    let updateUser;

    if (password && password.trim() !== '') {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      
      updateUser = await pool.query(
        'UPDATE users SET full_name = $1, username = $2, password = $3 WHERE user_id = $4 RETURNING user_id, full_name, username',
        [full_name, username, hashedPassword, id]
      );
    } else {
      updateUser = await pool.query(
        'UPDATE users SET full_name = $1, username = $2 WHERE user_id = $3 RETURNING user_id, full_name, username',
        [full_name, username, id]
      );
    }

    res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui!",
      data: updateUser.rows[0]
    });

  } catch (err) {
    console.error(err.message);
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: "Username sudah digunakan!" });
    }
    res.status(500).json({ success: false, message: "Gagal memperbarui profil" });
  }
});

module.exports = router;
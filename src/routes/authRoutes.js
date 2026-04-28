const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db');
const router = express.Router();

// ==========================================
// 1. ENDPOINT SIGN UP (REGISTER)
// ==========================================
router.post('/register', async (req, res) => {
  try {
    const { full_name, username, password } = req.body;

    // Cek apakah username sudah dipakai
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ success: false, message: "Username sudah digunakan!" });
    }

    // Enkripsi (Hash) Password menggunakan bcrypt
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Simpan ke database
    const newUser = await pool.query(
      `INSERT INTO users (full_name, username, password) 
       VALUES ($1, $2, $3) RETURNING user_id, full_name, username`,
      [full_name, username, hashedPassword]
    );

    const userId = newUser.rows[0].user_id;

    // Otomatis buatkan baris di tabel user_stats untuk user baru ini
    await pool.query('INSERT INTO user_stats (user_id) VALUES ($1)', [userId]);

    res.status(201).json({
      success: true,
      message: "Registrasi berhasil!",
      data: newUser.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

// ==========================================
// 2. ENDPOINT LOGIN
// ==========================================
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    
    // Jika user tidak ditemukan
    if (user.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Username atau password salah!" });
    }

    // Bandingkan password yang diketik dengan password HASH di database
    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, message: "Username atau password salah!" });
    }

    // Jika berhasil login, kembalikan data user (kecuali password)
    res.status(200).json({
      success: true,
      message: "Login berhasil!",
      data: {
        user_id: user.rows[0].user_id,
        full_name: user.rows[0].full_name,
        username: user.rows[0].username
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Terjadi kesalahan pada server" });
  }
});

module.exports = router;
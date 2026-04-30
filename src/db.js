const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Gagal terhubung ke database cloud', err.stack);
  }
  console.log('Berhasil terhubung ke database EmoVision di Supabase!');
  release();
});

module.exports = pool;
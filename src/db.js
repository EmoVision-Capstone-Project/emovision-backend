const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres', 
  host: 'localhost',
  database: 'emovision_db',
  password: '123', 
  port: 5432, 
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Gagal terhubung ke database', err.stack);
  }
  console.log('Berhasil terhubung ke database emovision_db!');
  release();
});

module.exports = pool;
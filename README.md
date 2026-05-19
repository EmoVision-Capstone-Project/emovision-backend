# Emovision Backend

Backend service untuk proyek **Emovision**, sebuah platform *journaling* yang menyediakan RESTful API untuk mengelola autentikasi pengguna, menyimpan riwayat jurnal, kalkulasi *streak*, serta menyimpan hasil deteksi emosi dari AI.

## Fitur Utama

* **Manajemen Jurnal & Mood:** Endpoint untuk menyimpan teks jurnal pengguna beserta hasil deteksi emosinya.
* **Otentikasi Pengguna:** Sistem registrasi dan login aman menggunakan enkripsi *password* (bcrypt).
* **Kalkulasi Statistik:** Menghitung *streak* harian dan merangkum statistik rata-rata emosi mingguan.
* **Afirmasi Harian:** Menyimpan dan mengambil data afirmasi positif pengguna.

## Teknologi yang Digunakan

* **Runtime/Framework:** Node.js / Express.js
* **Database:** PostgreSQL (Driver `pg`) & Supabase
* **Security:** bcrypt (Password Hashing), CORS
* **Development:** nodemon, dotenv

## Persyaratan Sistem

Sebelum memulai, pastikan kamu sudah menginstal:
* [Node.js](https://nodejs.org/) (versi 18.x atau lebih baru)
* [Git](https://git-scm.com/)
* Database PostgreSQL berjalan di lokal atau koneksi remote (Supabase).

## Cara Instalasi

**1. Clone repositori**
```bash
git clone [https://github.com/](https://github.com/)[EmoVision-Capstone-Project]/emovision-backend.git
cd emovision-backend
```

**2. Instal Depedensi**
```bash
npm install
```

**3. Konfigurasi Environment Variables**

Buat file .env di root direktori dan tambahkan kredensial database Supabase/PostgreSQL Anda:

```bash
PORT=3000
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]?sslmode=require
```

**4. Jalankan Aplikasi**

Untuk mode pengembangan (dengan auto-reload):

```bash
npm run dev
```

Untuk mode produksi:
```bash
npm start
```

Server akan berjalan di http://localhost:3000.

## API Endpoints Referensi

Berikut adalah daftar endpoint utama yang tersedia:

**Autentikasi (/api/auth)**
- POST /register - Mendaftarkan pengguna baru (Body: full_name, username, password).
- POST /login - Autentikasi pengguna dan mengembalikan data user (Body: username, password).

**Jurnal & Mood (/api/journals)**
- GET / - Mengambil seluruh data riwayat jurnal.
- POST / - Menyimpan entri jurnal baru beserta hasil deteksi AI (Body: user_id, content, mood_result, ai_accuracy_score, ai_feedback). Endpoint ini juga otomatis memperbarui streak harian pengguna.
- GET /stats/weekly/:user_id?month={mm}&year={yyyy} - Mendapatkan data statistik rata-rata nilai mood per minggu untuk visualisasi grafik.
- GET /stats/:userId - Mendapatkan informasi current streak pengguna.

**Afirmasi (/api/affirmations)**
- GET / - Mengambil semua afirmasi yang tersimpan.
- POST / - Menyimpan afirmasi harian pengguna dan memperbarui streak (Body: user_id, content).

**Pengguna (/api/users)**
- GET /:id - Mengambil data profil spesifik pengguna berdasarkan ID.
- PUT /:id - Memperbarui nama lengkap, username, atau password pengguna.


## Struktur Proyek

```
emovision-backend/
├── node_modules/          # (Otomatis dibuat saat npm install dijalankan)
├── src/
│   ├── routes/
│   │   ├── affirmationRoutes.js 
│   │   ├── authRoutes.js        
│   │   ├── journalRoutes.js     
│   │   └── userRoutes.js        
│   ├── db.js                    
│   └── index.js                 
├── .env                   # (Direferensikan di .gitignore dan kode index.js/db.js)
├── .gitignore            
├── package-lock.json     
├── package.json          
└── README.md
```

## Kontribusi & Pengembangan Lanjutan

Backend ini dirancang khusus untuk mendukung kebutuhan frontend dan machine learning (deteksi wajah/teks) pada proyek capstone EmoVision. Jika ingin menambahkan skema database atau endpoint baru, silakan buat branch baru dan ajukan Pull Request.
# Emovision Backend

Backend service untuk proyek **Emovision**, menyediakan RESTful API untuk memproses data [gambar/video/suara] dan melakukan analisis emosi menggunakan model Machine Learning.

## Fitur Utama

*   **Analisis Emosi:** Endpoint untuk menerima input media dan mengembalikan hasil prediksi emosi.
*   **Otentikasi Pengguna:** Sistem login dan register berbasis JWT (JSON Web Tokens).
*   **Manajemen Riwayat:** Menyimpan riwayat analisis ke dalam database.
*   **Dokumentasi API Otomatis:** Dilengkapi dengan Swagger UI / ReDoc.

## Teknologi yang Digunakan

*   **Bahasa/Framework:** [Python 3.10+ / FastAPI / Node.js / Express]
*   **Database:** [PostgreSQL / MySQL / MongoDB]
*   **Machine Learning:** [TensorFlow / PyTorch / OpenCV]
*   **Deployment:** [Docker / AWS / Heroku]

## Persyaratan Sistem

Sebelum memulai, pastikan kamu sudah menginstal:
*   [Python 3.x](https://www.python.org/) atau [Node.js](https://nodejs.org/)
*   [Git](https://git-scm.com/)
*   Database server berjalan di lokal atau remote.

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

## Kontribusi & Pengembangan Lanjutan

Backend ini dirancang khusus untuk mendukung kebutuhan frontend dan machine learning (deteksi wajah/teks) pada proyek capstone EmoVision. Jika ingin menambahkan skema database atau endpoint baru, silakan buat branch baru dan ajukan Pull Request.

```json
with open("README.md", "w", encoding="utf-8") as f:
f.write(readme_content)

print("README.md generated successfully.")
```

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
# BikePath2 - Sistem Informasi Jalur Sepeda

Proyek ini terdiri dari dua bagian: **Backend** (menggunakan CodeIgniter 3) dan **Frontend** (menggunakan React + Vite).

---

## Prasyarat
Sebelum memulai, pastikan Anda sudah menginstal:
- **XAMPP** (untuk PHP dan MySQL)
- **Node.js** (untuk menjalankan React)

---

## 1. Persiapan Database
1. Buka **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Buat database baru dengan nama `bikepath`.
3. Import file `.sql` yang telah disediakan ke dalam database `bikepath`.

---

## 2. Pengaturan Backend (PHP)
1. Pastikan folder proyek berada di dalam folder `htdocs` XAMPP dengan struktur:
   `C:\xampp\htdocs\BikePath2\`
2. Konfigurasi Database:
   - Buka file `bikepath-backend/application/config/database.php`.
   - Sesuaikan `username` dan `password` database Anda jika berbeda.
3. Pastikan ekstensi PHP `mysqli` dan `json` aktif di XAMPP Anda.

---

## 3. Pengaturan Frontend (React)
1. Buka terminal atau Command Prompt.
2. Masuk ke direktori frontend:
   ```bash
   cd bikepath-frontend
   ```
3. Instal semua library yang dibutuhkan:
   ```bash
   npm install
   ```
4. Buat file `.env` (jika belum ada) dan pastikan isinya adalah:
   ```env
   VITE_API_URL=http://localhost/BikePath2/bikepath-backend/index.php
   ```

---

## 4. Cara Menjalankan Aplikasi
1. **Jalankan Backend:**
   - Aktifkan modul **Apache** dan **MySQL** di XAMPP Control Panel.
   - Backend dapat diakses (API) melalui: `http://localhost/BikePath2/bikepath-backend/`

2. **Jalankan Frontend:**
   - Di terminal (dalam folder `bikepath-frontend`), jalankan perintah:
     ```bash
     npm run dev
     ```
   - Klik link yang muncul di terminal (biasanya `http://localhost:5173`) untuk membuka aplikasi di browser.

---

## Catatan Penting
- Jika Anda mengganti nama folder `BikePath2` menjadi nama lain, Anda harus menyesuaikan isi file `.env` di bagian frontend agar API tetap terhubung.

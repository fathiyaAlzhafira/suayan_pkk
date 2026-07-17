const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ==========================================
// ====== DATABASE INITIALIZATION SCRIPT ====
// ==========================================
async function initDatabase() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || ''
  };

  let connection;
  try {
    // 1. Hubungkan ke MySQL Server
    connection = await mysql.createConnection(connectionConfig);
    console.log('Terhubung ke server MySQL...');

    // 2. Buat Database jika belum ada
    const dbName = process.env.DB_NAME || 'db_pkk_suayan';
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`Database \`${dbName}\` terverifikasi/dibuat.`);

    // 3. Masuk ke database
    await connection.query(`USE \`${dbName}\``);

    // 4. Baca database.sql untuk membuat tabel bawaan
    const sqlFilePath = path.join(__dirname, 'database.sql');
    if (fs.existsSync(sqlFilePath)) {
      console.log('Membaca file skema database.sql...');
      const sqlContent = fs.readFileSync(sqlFilePath, 'utf8');
      
      // Bersihkan komentar model -- dan /* */ agar query tidak terpotong/salah parse
      const cleanSql = sqlContent
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/--.*$/gm, '');
      
      const queries = cleanSql
        .split(';')
        .map(q => q.trim())
        .filter(q => q.length > 0);

      for (const query of queries) {
        try {
          await connection.query(query);
        } catch (queryErr) {
          // Abaikan warning/pemberitahuan jika database sudah ada
          if (!queryErr.message.includes('database exists')) {
            console.warn('Pemberitahuan Query:', queryErr.message);
          }
        }
      }
      console.log('Tabel bawaan database.sql berhasil diproses.');
    }

    // 5. [NEW TABLE] Buat tabel buku_posyandu
    await connection.query(`
      CREATE TABLE IF NOT EXISTS buku_posyandu (
        id INT AUTO_INCREMENT PRIMARY KEY,
        jorong VARCHAR(100) NOT NULL,
        posyandu VARCHAR(150) NOT NULL,
        pengunjung INT DEFAULT 0,
        petugas INT DEFAULT 0,
        bayi_lahir INT DEFAULT 0,
        meninggal INT DEFAULT 0,
        s INT DEFAULT 0,
        k INT DEFAULT 0,
        d INT DEFAULT 0,
        n INT DEFAULT 0,
        bcg INT DEFAULT 0,
        dpt INT DEFAULT 0,
        polio INT DEFAULT 0,
        campak INT DEFAULT 0,
        hepb INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabel buku_posyandu terverifikasi.');

    // 6. Seed Data Awal untuk Posyandu
    const [posyanduCount] = await connection.query('SELECT COUNT(*) as count FROM buku_posyandu');
    if (posyanduCount[0].count === 0) {
      console.log('Melakukan seeding data awal Posyandu...');
      await connection.query(`
        INSERT INTO buku_posyandu (id, jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb) VALUES 
        (1, 'Suayan Tinggi', 'Posyandu Mawar', 47, 5, 2, 0, 47, 45, 43, 38, 2, 5, 5, 3, 2),
        (2, 'Suayan Sabar', 'Posyandu Melati', 52, 5, 3, 0, 52, 50, 48, 42, 3, 6, 6, 4, 3),
        (3, 'Suayan Randah', 'Posyandu Anggrek', 35, 4, 1, 0, 35, 34, 32, 28, 1, 3, 3, 2, 1)
      `);
    }

    // Seed jorong
    const [jorongCount] = await connection.query('SELECT COUNT(*) as count FROM jorong');
    if (jorongCount[0].count === 0) {
      console.log('Melakukan seeding data awal jorong...');
      await connection.query(`
        INSERT INTO jorong (id_jorong, nama_jorong) VALUES 
        (1, 'Suayan Sabar'),
        (2, 'Suayan Tinggi'),
        (3, 'Suayan Randah'),
        (4, 'Suayan Soriak')
      `);
    }

    // Seed user_admin
    const [userCount] = await connection.query('SELECT COUNT(*) as count FROM user_admin');
    if (userCount[0].count === 0) {
      console.log('Melakukan seeding data awal user_admin...');
      await connection.query(`
        INSERT INTO user_admin (id_user, username, password, role, id_jorong) VALUES 
        (1, 'admin_suayan', 'admin123', 'Super Admin', 1)
      `);
    }

    // Seed program_kerja
    const [prokerCount] = await connection.query('SELECT COUNT(*) as count FROM program_kerja');
    if (prokerCount[0].count === 0) {
      console.log('Melakukan seeding data awal program_kerja...');
      await connection.query(`
        INSERT INTO program_kerja (pokja, nama_program, deskripsi, status_progres) VALUES 
        ('Pokja 1', 'Simulasi PKBN', 'Pembinaan Kesadaran Bela Negara', 'Sedang Berjalan'),
        ('Pokja 1', 'Sosialisasi PKDRT', 'Pencegahan Kekerasan Dalam Rumah Tangga', 'Direncanakan'),
        ('Pokja 2', 'Taman Bacaan Masyarakat', 'Penyediaan sarana membaca bagi anak-anak', 'Selesai'),
        ('Pokja 2', 'Pelatihan UP2K', 'Usaha Peningkatan Pendapatan Keluarga', 'Sedang Berjalan'),
        ('Pokja 3', 'Pemanfaatan Pekarangan (Hatinya PKK)', 'Gerakan menanam sayur dan toga di halaman rumah', 'Sedang Berjalan'),
        ('Pokja 4', 'Posyandu Terintegrasi', 'Pelayanan imunisasi dan timbang balita bulanan', 'Sedang Berjalan')
      `);
    }

    // Seed keluarga
    const [kkCount] = await connection.query('SELECT COUNT(*) as count FROM keluarga');
    if (kkCount[0].count === 0) {
      console.log('Melakukan seeding data awal keluarga...');
      await connection.query(`
        INSERT INTO keluarga (no_kk, id_jorong, dasawisma, makanan_pokok, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah) VALUES 
        ('1307010101010001', 1, 'Melati 1', 'Beras', 1, 1, 'PDAM', 1, 1, 1, 'Sehat'),
        ('1307010101010002', 2, 'Mawar 2', 'Beras', 1, 1, 'Sumur', 1, 1, 1, 'Sehat'),
        ('1307010101010003', 3, 'Anggrek 3', 'Beras', 0, 0, 'PDAM', 0, 0, 0, 'Kurang Sehat'),
        ('1307010101010004', 4, 'Kenanga 4', 'Beras', 1, 2, 'PDAM', 1, 1, 1, 'Sehat')
      `);
    }

    // Seed warga
    const [wargaCount] = await connection.query('SELECT COUNT(*) as count FROM warga');
    if (wargaCount[0].count === 0) {
      console.log('Melakukan seeding data awal warga...');
      await connection.query(`
        INSERT INTO warga (nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, status_perkawinan, status_keluarga, pekerjaan, akseptor_kb, aktif_posyandu, ikut_koperasi) VALUES 
        ('1307010101011001', '1307010101010001', 'REG001', 'Ahmad Sudirman', 'Pembina', 'L', 'Payakumbuh', '1980-04-12', 'Menikah', 'Kepala Keluarga', 'PNS', 0, 0, 1),
        ('1307010101011002', '1307010101010001', 'REG002', 'Siti Rahma', 'Ketua Pokja I', 'P', 'Suayan', '1984-08-22', 'Menikah', 'Istri', 'IRT', 1, 1, 1),
        ('1307010101011003', '1307010101010002', 'REG003', 'Budi Hermawan', 'Anggota', 'L', 'Suayan', '1978-02-15', 'Menikah', 'Kepala Keluarga', 'Petani', 0, 0, 0),
        ('1307010101011004', '1307010101010002', 'REG004', 'Dewi Lestari', 'Kader Posyandu', 'P', 'Bukittinggi', '1982-11-30', 'Menikah', 'Istri', 'IRT', 1, 1, 1),
        ('1307010101011005', '1307010101010003', 'REG005', 'Roni Saputra', 'Umum', 'L', 'Suayan', '1990-09-05', 'Lajang', 'Kepala Keluarga', 'Wiraswasta', 0, 0, 0),
        ('1307010101011006', '1307010101010004', 'REG006', 'Hendra Wijaya', 'Umum', 'L', 'Suayan', '1975-06-18', 'Menikah', 'Kepala Keluarga', 'Wiraswasta', 0, 0, 1),
        ('1307010101011007', '1307010101010004', 'REG007', 'Yanti Sartika', 'Sekretaris', 'P', 'Padang', '1980-12-25', 'Menikah', 'Istri', 'Guru', 1, 1, 1)
      `);
      
      // Seed aktivitas_warga
      await connection.query(`
        INSERT INTO aktivitas_warga (nik, penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan) VALUES 
        ('1307010101011001', 1, 1, 1, 1, 1, 0),
        ('1307010101011002', 1, 1, 1, 1, 1, 1),
        ('1307010101011003', 1, 1, 1, 1, 0, 0),
        ('1307010101011004', 1, 1, 1, 1, 1, 1),
        ('1307010101011005', 0, 1, 1, 1, 0, 0),
        ('1307010101011006', 1, 1, 1, 1, 1, 0),
        ('1307010101011007', 1, 1, 1, 1, 1, 1)
      `);
    }

    // Seed struktur_organisasi
    const [pengurusCount] = await connection.query('SELECT COUNT(*) as count FROM struktur_organisasi');
    if (pengurusCount[0].count === 0) {
      console.log('Melakukan seeding data awal struktur_organisasi...');
      await connection.query(`
        INSERT INTO struktur_organisasi (nama_pengurus, jabatan, level_hirarki, periode_mulai, periode_selesai, status_aktif) VALUES 
        ('Ny. Rosmawati', 'Ketua TP-PKK Nagari Suayan', 1, 2026, 2031, 1),
        ('Ny. Fitriani', 'Sekretaris', 2, 2026, 2031, 1),
        ('Ny. Marlina', 'Bendahara', 2, 2026, 2031, 1)
      `);
    }

    console.log('Database & Tabel PKK Nagari Suayan Berhasil Diinisialisasi!');
  } catch (error) {
    console.error('KONEKSI DB GAGAL:');
    console.error('Penyebab:', error.message);
    console.warn('\nCatatan: Silakan sesuaikan kata sandi MySQL di file backend/.env jika diperlukan.\n');
  } finally {
    if (connection) await connection.end();
  }
}

// Jalankan inisialisasi database sebelum server di-listen
initDatabase().then(() => {
  // Mount Router API
  const apiRouter = require('./routes/api');
  app.use('/api', apiRouter);

  // Tes Route Utama
  app.get('/', (req, res) => {
    res.send('Server Backend PKK Nagari Suayan Berjalan Aman dan Terkoneksi Database!');
  });

  // Jalankan Server
  app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
  });
});
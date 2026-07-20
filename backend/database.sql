-- 1. Buat Database jika belum ada
CREATE DATABASE IF NOT EXISTS db_pkk_suayan;
USE db_pkk_suayan;

-- === 1. MODUL WILAYAH & PENGGUNA ===

CREATE TABLE IF NOT EXISTS jorong (
    id_jorong INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_admin (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL, -- Super Admin, Kader Pokja, Kader Dasawisma
    id_jorong INT NULL,
    FOREIGN KEY (id_jorong) REFERENCES jorong(id_jorong) ON DELETE SET NULL
);

-- === 2. MANAJEMEN KONTEN DINAMIS ===

CREATE TABLE IF NOT EXISTS struktur_organisasi (
    id_pengurus INT AUTO_INCREMENT PRIMARY KEY,
    nama_pengurus VARCHAR(150) NOT NULL,
    jabatan VARCHAR(100) NOT NULL,
    level_hirarki INT DEFAULT 1,
    parent_id INT NULL, -- Self-referencing
    foto VARCHAR(255) NULL,
    periode_mulai YEAR NOT NULL,
    periode_selesai YEAR NOT NULL,
    status_aktif BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (parent_id) REFERENCES struktur_organisasi(id_pengurus) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS program_kerja (
    id_proker INT AUTO_INCREMENT PRIMARY KEY,
    pokja VARCHAR(20) NOT NULL, -- Pokja 1, Pokja 2, Pokja 3, Pokja 4
    nama_program VARCHAR(255) NOT NULL,
    deskripsi TEXT NULL,
    status_progres VARCHAR(50) DEFAULT 'Direncanakan' -- Direncanakan, Sedang Berjalan, Selesai
);

-- === 3. DATA WARGA & KELUARGA ===

CREATE TABLE IF NOT EXISTS keluarga (
    no_kk VARCHAR(16) PRIMARY KEY,
    id_jorong INT NOT NULL,
    dasawisma VARCHAR(100) NOT NULL,
    rt VARCHAR(10) NULL,
    rw VARCHAR(10) NULL,
    dusun VARCHAR(100) NULL,
    makanan_pokok VARCHAR(50) DEFAULT 'Beras', -- Beras, Non Beras
    makanan_pokok_lain VARCHAR(100) NULL,
    jamban_keluarga BOOLEAN DEFAULT FALSE,
    jumlah_jamban INT DEFAULT 0,
    sumber_air VARCHAR(50) DEFAULT 'PDAM', -- PDAM, Sumur, Sungai, Lainnya
    tempat_sampah BOOLEAN DEFAULT FALSE,
    spal BOOLEAN DEFAULT FALSE, -- Saluran Pembuangan Air Limbah
    stiker_p4k BOOLEAN DEFAULT FALSE,
    kriteria_rumah VARCHAR(50) DEFAULT 'Sehat', -- Sehat, Kurang Sehat
    up2k_aktif BOOLEAN DEFAULT FALSE,
    up2k_jenis VARCHAR(150) NULL,
    kesling_aktif BOOLEAN DEFAULT FALSE,
    status_verifikasi VARCHAR(50) DEFAULT 'Approved', -- Pending, Approved, Rejected
    FOREIGN KEY (id_jorong) REFERENCES jorong(id_jorong) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS warga (
    nik VARCHAR(16) PRIMARY KEY,
    no_kk VARCHAR(16) NOT NULL,
    no_registrasi VARCHAR(50) NULL,
    nama VARCHAR(150) NOT NULL,
    jabatan_pkk VARCHAR(100) NULL,
    jenis_kelamin ENUM('L', 'P') NOT NULL,
    tempat_lahir VARCHAR(100) NULL,
    tanggal_lahir DATE NULL,
    status_perkawinan VARCHAR(50) DEFAULT 'Lajang', -- Lajang, Menikah, Janda, Duda
    status_keluarga VARCHAR(50) DEFAULT 'Anak', -- Kepala Keluarga, Istri, Anak, dll
    agama VARCHAR(30) DEFAULT 'Islam',
    pendidikan VARCHAR(50) NULL,
    pekerjaan VARCHAR(100) NULL,
    akseptor_kb BOOLEAN DEFAULT FALSE,
    jenis_kb VARCHAR(50) NULL,
    aktif_posyandu BOOLEAN DEFAULT FALSE,
    frekuensi_posyandu INT DEFAULT 0,
    bina_keluarga BOOLEAN DEFAULT FALSE,
    memiliki_tabungan BOOLEAN DEFAULT FALSE,
    kelompok_belajar VARCHAR(50) DEFAULT 'Tidak', -- Tidak, Paket A, Paket B, Paket C, KF
    paud BOOLEAN DEFAULT FALSE,
    ikut_koperasi BOOLEAN DEFAULT FALSE,
    jenis_koperasi VARCHAR(100) NULL,
    berkebutuhan_khusus BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (no_kk) REFERENCES keluarga(no_kk) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS aktivitas_warga (
    id_aktivitas INT AUTO_INCREMENT PRIMARY KEY,
    nik VARCHAR(16) NOT NULL UNIQUE,
    penghayatan_pancasila BOOLEAN DEFAULT FALSE,
    kerja_bakti BOOLEAN DEFAULT FALSE,
    rukun_kematian BOOLEAN DEFAULT FALSE,
    kegiatan_keagamaan BOOLEAN DEFAULT FALSE,
    jimpitan BOOLEAN DEFAULT FALSE,
    arisan BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (nik) REFERENCES warga(nik) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS pekarangan_keluarga (
    id_pekarangan INT AUTO_INCREMENT PRIMARY KEY,
    no_kk VARCHAR(16) NOT NULL,
    kategori VARCHAR(50) NOT NULL, -- Peternakan, Perikanan, Warung Hidup, TOGA, Tanaman Keras
    komoditi VARCHAR(100) NOT NULL,
    jumlah INT DEFAULT 0,
    FOREIGN KEY (no_kk) REFERENCES keluarga(no_kk) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS industri_keluarga (
    id_industri INT AUTO_INCREMENT PRIMARY KEY,
    no_kk VARCHAR(16) NOT NULL,
    kategori VARCHAR(50) NOT NULL, -- Pangan, Sandang, Konveksi, Jasa, Lain-lain
    komoditi VARCHAR(100) NOT NULL,
    jumlah INT DEFAULT 0,
    status_up2k BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (no_kk) REFERENCES keluarga(no_kk) ON DELETE CASCADE
);

-- === 4. BUKU ADMINISTRASI & LOGISTIK ===

CREATE TABLE IF NOT EXISTS buku_kegiatan (
    id_kegiatan INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NULL,
    id_proker INT NULL,
    tanggal DATE NOT NULL,
    tempat VARCHAR(255) NOT NULL,
    uraian_kegiatan TEXT NOT NULL,
    nama VARCHAR(150) NULL, -- Fallback jika id_user null
    jabatan VARCHAR(100) NULL, -- Fallback jika id_user null
    kategori VARCHAR(50) DEFAULT 'Rapat',
    FOREIGN KEY (id_user) REFERENCES user_admin(id_user) ON DELETE SET NULL,
    FOREIGN KEY (id_proker) REFERENCES program_kerja(id_proker) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS buku_keuangan (
    id_transaksi INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    sumber_dana VARCHAR(100) NOT NULL,
    uraian TEXT NOT NULL,
    no_bukti_kas VARCHAR(50) NULL,
    jenis_transaksi VARCHAR(20) NOT NULL, -- Penerimaan, Pengeluaran
    nominal DECIMAL(12,2) NOT NULL DEFAULT 0.00
);

CREATE TABLE IF NOT EXISTS buku_inventaris (
    id_barang INT AUTO_INCREMENT PRIMARY KEY,
    nama_barang VARCHAR(150) NOT NULL,
    asal_barang VARCHAR(100) NOT NULL,
    tanggal_penerimaan DATE NULL,
    jumlah INT NOT NULL DEFAULT 1,
    tempat_penyimpanan VARCHAR(150) NOT NULL,
    kondisi VARCHAR(50) DEFAULT 'Baik', -- Baik, Rusak Kurang Sehat, Rusak Berat
    keterangan TEXT NULL
);

CREATE TABLE IF NOT EXISTS buku_ekspedisi (
    id_surat INT AUTO_INCREMENT PRIMARY KEY,
    tanggal DATE NOT NULL,
    nomor_surat VARCHAR(100) NOT NULL,
    alamat_tujuan_pengirim VARCHAR(255) NOT NULL,
    perihal TEXT NOT NULL,
    jenis_surat VARCHAR(20) DEFAULT 'Keluar' -- Masuk, Keluar
);

CREATE TABLE IF NOT EXISTS buku_anggota_pkk (
    id_anggota INT AUTO_INCREMENT PRIMARY KEY,
    no_registrasi VARCHAR(50) NULL,
    nama VARCHAR(150) NOT NULL,
    jenis_kelamin ENUM('L', 'P') DEFAULT 'P',
    kedudukan_anggota VARCHAR(100) DEFAULT 'Angg Pkj',
    kader_umum BOOLEAN DEFAULT FALSE,
    kader_khusus BOOLEAN DEFAULT FALSE,
    tanggal_lahir DATE NULL,
    status_perkawinan VARCHAR(10) DEFAULT 'k',
    alamat VARCHAR(150) NOT NULL,
    pendidikan VARCHAR(50) NULL,
    pekerjaan VARCHAR(100) NULL,
    keterangan TEXT NULL
);

CREATE TABLE IF NOT EXISTS pokja_1 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL,
    kader_pkbn INT DEFAULT 0,
    kader_pkdrt INT DEFAULT 0,
    kader_pola_asuh INT DEFAULT 0,
    kader_lansia INT DEFAULT 0,
    simulasi_pkbn_jml_kelompok INT DEFAULT 0,
    simulasi_pkbn_jml_anggota INT DEFAULT 0,
    simulasi_pkdrt_jml_kelompok INT DEFAULT 0,
    simulasi_pkdrt_jml_anggota INT DEFAULT 0,
    simulasi_pola_asuh_jml_kelompok INT DEFAULT 0,
    simulasi_pola_asuh_jml_anggota INT DEFAULT 0,
    gotong_royong_kerja_bakti_jml_anggota INT DEFAULT 0,
    gotong_royong_rukun_kematian_jml_kelompok INT DEFAULT 0,
    gotong_royong_keagamaan_jml_anggota INT DEFAULT 0,
    gotong_royong_jimpitan INT DEFAULT 0,
    gotong_royong_arisan INT DEFAULT 0,
    keterangan TEXT NULL
);

CREATE TABLE IF NOT EXISTS pokja_2 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL,
    paket_a_kelompok INT DEFAULT 0,
    paket_a_warga_belajar INT DEFAULT 0,
    paket_b_kelompok INT DEFAULT 0,
    paket_b_warga_belajar INT DEFAULT 0,
    paket_c_kelompok INT DEFAULT 0,
    paket_c_warga_belajar INT DEFAULT 0,
    taman_bacaan_perpustakaan_kelompok_pembaca INT DEFAULT 0,
    rumah_dilan INT DEFAULT 0,
    kampung_mandiri INT DEFAULT 0,
    kader_khusus_keterampilan INT DEFAULT 0,
    kader_khusus_koperasi INT DEFAULT 0,
    up2k_pemula_kelompok INT DEFAULT 0,
    up2k_pemula_peserta INT DEFAULT 0,
    up2k_madya_kelompok INT DEFAULT 0,
    up2k_madya_peserta INT DEFAULT 0,
    up2k_utama_kelompok INT DEFAULT 0,
    up2k_utama_peserta INT DEFAULT 0,
    up2k_mandiri_kelompok INT DEFAULT 0,
    up2k_mandiri_peserta INT DEFAULT 0,
    usaha_mikro INT DEFAULT 0,
    toko_pkk INT DEFAULT 0,
    pra_koperasi_jumlah INT DEFAULT 0,
    pra_koperasi_anggota INT DEFAULT 0,
    koperasi_berbadan_hukum_jumlah INT DEFAULT 0,
    koperasi_berbadan_hukum_anggota INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS pokja_3 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL,
    kader_pangan INT DEFAULT 0,
    kader_sandang INT DEFAULT 0,
    kader_tata_laksana_rt INT DEFAULT 0,
    makanan_pokok_beras INT DEFAULT 0,
    makanan_pokok_non_beras INT DEFAULT 0,
    pekarangan_hatinya_pkk_peternakan INT DEFAULT 0,
    pekarangan_hatinya_pkk_perikanan INT DEFAULT 0,
    pekarangan_hatinya_pkk_warung_hidup INT DEFAULT 0,
    pekarangan_hatinya_pkk_lumbung_hidup INT DEFAULT 0,
    pekarangan_hatinya_pkk_toga INT DEFAULT 0,
    pekarangan_hatinya_pkk_tanaman_keras INT DEFAULT 0,
    industri_rt_sandang INT DEFAULT 0,
    industri_rt_pangan INT DEFAULT 0,
    industri_rt_jasa INT DEFAULT 0,
    rumah_sehat INT DEFAULT 0,
    rumah_kurang_sehat INT DEFAULT 0,
    keterangan TEXT NULL
);

CREATE TABLE IF NOT EXISTS pokja_4 (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL,
    posyandu_total INT DEFAULT 0,
    posyandu_terintegrasi INT DEFAULT 0,
    lansia_kelompok INT DEFAULT 0,
    lansia_anggota INT DEFAULT 0,
    kader_kesehatan INT DEFAULT 0,
    kader_kesling INT DEFAULT 0,
    kader_phbs INT DEFAULT 0,
    kader_narkoba INT DEFAULT 0,
    kader_kb INT DEFAULT 0,
    jamban INT DEFAULT 0,
    tempat_sampah INT DEFAULT 0,
    spal INT DEFAULT 0,
    air_pdam INT DEFAULT 0,
    air_sumur INT DEFAULT 0,
    air_sungai INT DEFAULT 0,
    air_lain INT DEFAULT 0,
    pus INT DEFAULT 0,
    wus INT DEFAULT 0,
    kk_tabungan INT DEFAULT 0,
    warga_gratis INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS data_umum_pkk (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama_jorong VARCHAR(100) NOT NULL,
    jumlah_kelompok_jorong INT DEFAULT 1,
    jumlah_dasawisma INT DEFAULT 0,
    jumlah_krt INT DEFAULT 0,
    jumlah_kk INT DEFAULT 0,
    jiwa_l INT DEFAULT 0,
    jiwa_p INT DEFAULT 0,
    anggota_l INT DEFAULT 0,
    anggota_p INT DEFAULT 0,
    kader_umum_l INT DEFAULT 0,
    kader_umum_p INT DEFAULT 0,
    kader_khusus_l INT DEFAULT 0,
    kader_khusus_p INT DEFAULT 0,
    tenaga_honorer_l INT DEFAULT 0,
    tenaga_honorer_p INT DEFAULT 0,
    tenaga_bantuan_l INT DEFAULT 0,
    tenaga_bantuan_p INT DEFAULT 0,
    keterangan TEXT NULL
);
const db = require('../config/db');

exports.getUmum = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        j.nama_jorong AS jorong,
        2026 AS tahun,
        COUNT(DISTINCT k.no_kk) AS jumlah_kk,
        COUNT(DISTINCT CASE WHEN w.status_keluarga = 'Kepala Keluarga' THEN k.no_kk END) AS jumlah_krt,
        COUNT(DISTINCT k.dasawisma) AS jumlah_dasawisma,
        SUM(CASE WHEN w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS jiwa_l,
        SUM(CASE WHEN w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS jiwa_p,
        SUM(CASE WHEN w.jabatan_pkk IS NOT NULL AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS anggota_l,
        SUM(CASE WHEN w.jabatan_pkk IS NOT NULL AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS anggota_p,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Umum' AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS kader_umum_l,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Umum' AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS kader_umum_p,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Khusus' AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS kader_khusus_l,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Khusus' AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS kader_khusus_p,
        0 AS tenaga_honorer_l,
        0 AS tenaga_honorer_p,
        0 AS tenaga_bantuan_l,
        0 AS tenaga_bantuan_p,
        '' AS keterangan
      FROM jorong j
      LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
      LEFT JOIN warga w ON k.no_kk = w.no_kk
      GROUP BY j.id_jorong, j.nama_jorong
      ORDER BY j.nama_jorong ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPokja = async (req, res) => {
  const { id } = req.params;
  try {
    let queryStr = '';
    
    if (id == 1) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          COUNT(DISTINCT CASE WHEN aw.penghayatan_pancasila = 1 THEN k.no_kk END) AS pkbn_kel,
          SUM(CASE WHEN aw.penghayatan_pancasila = 1 THEN 1 ELSE 0 END) AS pkbn_ang,
          COUNT(DISTINCT CASE WHEN aw.rukun_kematian = 1 THEN k.no_kk END) AS pkdrt_kel,
          SUM(CASE WHEN aw.jimpitan = 1 THEN 1 ELSE 0 END) AS pola_kel,
          SUM(CASE WHEN w.tanggal_lahir <= DATE_SUB(CURDATE(), INTERVAL 60 YEAR) THEN 1 ELSE 0 END) AS lansia_kel,
          SUM(CASE WHEN aw.kerja_bakti = 1 THEN 1 ELSE 0 END) AS gotong,
          SUM(CASE WHEN aw.arisan = 1 THEN 1 ELSE 0 END) AS arisan
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN aktivitas_warga aw ON w.nik = aw.nik
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else if (id == 2) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.kelompok_belajar != 'Tidak' THEN 1 ELSE 0 END) AS baca,
          COUNT(DISTINCT ik.id_industri) AS up2k_kel,
          SUM(CASE WHEN w.ikut_koperasi = 1 THEN 1 ELSE 0 END) AS up2k_pes,
          SUM(CASE WHEN ik.kategori = 'Pangan' THEN 1 ELSE 0 END) AS mikro,
          SUM(CASE WHEN ik.status_up2k = 1 THEN 1 ELSE 0 END) AS toko,
          SUM(CASE WHEN w.ikut_koperasi = 1 THEN 1 ELSE 0 END) AS koperasi
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN industri_keluarga ik ON k.no_kk = ik.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else if (id == 3) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.jabatan_pkk = 'Kader Pangan' THEN 1 ELSE 0 END) AS kp,
          SUM(CASE WHEN w.jabatan_pkk = 'Kader Sandang' THEN 1 ELSE 0 END) AS ks,
          SUM(CASE WHEN pk.kategori = 'Peternakan' THEN pk.jumlah ELSE 0 END) AS ternak,
          SUM(CASE WHEN pk.kategori = 'Perikanan' THEN pk.jumlah ELSE 0 END) AS ikan,
          SUM(CASE WHEN pk.kategori = 'Warung Hidup' THEN pk.jumlah ELSE 0 END) AS warung,
          SUM(CASE WHEN pk.kategori = 'TOGA' THEN pk.jumlah ELSE 0 END) AS toga,
          SUM(CASE WHEN k.kriteria_rumah = 'Sehat' THEN 1 ELSE 0 END) AS r_sehat,
          SUM(CASE WHEN k.kriteria_rumah = 'Kurang Sehat' THEN 1 ELSE 0 END) AS r_kurang
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN pekarangan_keluarga pk ON k.no_kk = pk.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.aktif_posyandu = 1 THEN 1 ELSE 0 END) AS k_pos,
          SUM(CASE WHEN k.tempat_sampah = 1 AND k.spal = 1 THEN 1 ELSE 0 END) AS k_phbs,
          SUM(CASE WHEN w.akseptor_kb = 1 THEN 1 ELSE 0 END) AS k_kb,
          SUM(CASE WHEN w.aktif_posyandu = 1 THEN 1 ELSE 0 END) AS pos,
          SUM(CASE WHEN k.jamban_keluarga = 1 THEN 1 ELSE 0 END) AS jamban,
          SUM(k.jumlah_jamban) AS mck,
          SUM(CASE WHEN w.akseptor_kb = 1 THEN 1 ELSE 0 END) AS kb_asep
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    }

    const [rows] = await db.query(queryStr);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePokja = async (req, res) => {
  res.json({ success: true, message: 'Data Pokja dihitung otomatis dari data keluarga/warga' });
};

exports.updateUmum = async (req, res) => {
  res.json({ success: true, message: 'Data Umum dihitung otomatis dari data keluarga/warga' });
};

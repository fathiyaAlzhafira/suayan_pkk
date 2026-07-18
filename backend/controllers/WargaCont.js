const db = require('../config/db');

// --- JORONG ---
exports.getJorong = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jorong ORDER BY id_jorong ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- WARGA ---
exports.getWarga = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT w.*, k.id_jorong, j.nama_jorong, k.dasawisma,
              a.penghayatan_pancasila, a.kerja_bakti, a.rukun_kematian, a.kegiatan_keagamaan, a.jimpitan, a.arisan
       FROM warga w 
       JOIN keluarga k ON w.no_kk = k.no_kk 
       JOIN jorong j ON k.id_jorong = j.id_jorong 
       LEFT JOIN aktivitas_warga a ON w.nik = a.nik
       ORDER BY w.nama ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addWarga = async (req, res) => {
  const { 
    nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, 
    status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, 
    aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, 
    paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus,
    penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    
    await conn.query(
      `INSERT INTO warga (nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nik, no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0]
    );

    await conn.query(
      `INSERT INTO aktivitas_warga (nik, penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nik, penghayatan_pancasila ? 1 : 0, kerja_bakti ? 1 : 0, rukun_kematian ? 1 : 0, kegiatan_keagamaan ? 1 : 0, jimpitan ? 1 : 0, arisan ? 1 : 0]
    );

    await conn.commit();
    res.status(201).json({ success: true, ...req.body });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

exports.updateWarga = async (req, res) => {
  const { nik } = req.params;
  const { 
    no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, 
    status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, 
    aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, 
    paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus,
    penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE warga 
       SET no_kk=?, no_registrasi=?, nama=?, jabatan_pkk=?, jenis_kelamin=?, tempat_lahir=?, tanggal_lahir=?, status_perkawinan=?, status_keluarga=?, agama=?, pendidikan=?, pekerjaan=?, akseptor_kb=?, jenis_kb=?, aktif_posyandu=?, frekuensi_posyandu=?, bina_keluarga=?, memiliki_tabungan=?, kelompok_belajar=?, paud=?, ikut_koperasi=?, jenis_koperasi=?, berkebutuhan_khusus=? 
       WHERE nik=?`,
      [no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0, nik]
    );

    await conn.query(
      `INSERT INTO aktivitas_warga (nik, penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan) 
       VALUES (?, ?, ?, ?, ?, ?, ?) 
       ON DUPLICATE KEY UPDATE 
       penghayatan_pancasila=?, kerja_bakti=?, rukun_kematian=?, kegiatan_keagamaan=?, jimpitan=?, arisan=?`,
      [nik, penghayatan_pancasila ? 1 : 0, kerja_bakti ? 1 : 0, rukun_kematian ? 1 : 0, kegiatan_keagamaan ? 1 : 0, jimpitan ? 1 : 0, arisan ? 1 : 0,
       penghayatan_pancasila ? 1 : 0, kerja_bakti ? 1 : 0, rukun_kematian ? 1 : 0, kegiatan_keagamaan ? 1 : 0, jimpitan ? 1 : 0, arisan ? 1 : 0]
    );

    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

exports.deleteWarga = async (req, res) => {
  const { nik } = req.params;
  try {
    await db.query('DELETE FROM warga WHERE nik = ?', [nik]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

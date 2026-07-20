const db = require('../config/db');

exports.getAnggota = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buku_anggota_pkk ORDER BY id_anggota ASC');
    const mapped = rows.map(r => ({
      id: r.id_anggota,
      no_registrasi: r.no_registrasi,
      nama: r.nama,
      jenis_kelamin: r.jenis_kelamin || 'P',
      kedudukan_anggota: r.kedudukan_anggota || 'Angg Pkj',
      kader_umum: !!r.kader_umum,
      kader_khusus: !!r.kader_khusus,
      tanggal_lahir: r.tanggal_lahir,
      status_perkawinan: r.status_perkawinan || 'k',
      alamat: r.alamat || 'Suayan Sabar',
      pendidikan: r.pendidikan,
      pekerjaan: r.pekerjaan,
      keterangan: r.keterangan
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addAnggota = async (req, res) => {
  const {
    no_registrasi, nama, jenis_kelamin, kedudukan_anggota, kader_umum,
    kader_khusus, tanggal_lahir, status_perkawinan, alamat, pendidikan, pekerjaan, keterangan
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO buku_anggota_pkk 
       (no_registrasi, nama, jenis_kelamin, kedudukan_anggota, kader_umum, kader_khusus, tanggal_lahir, status_perkawinan, alamat, pendidikan, pekerjaan, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        no_registrasi || null,
        nama,
        jenis_kelamin || 'P',
        kedudukan_anggota || 'Angg Pkj',
        kader_umum ? 1 : 0,
        kader_khusus ? 1 : 0,
        tanggal_lahir || null,
        status_perkawinan || 'k',
        alamat || 'Suayan Sabar',
        pendidikan || null,
        pekerjaan || null,
        keterangan || null
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateAnggota = async (req, res) => {
  const { id } = req.params;
  const {
    no_registrasi, nama, jenis_kelamin, kedudukan_anggota, kader_umum,
    kader_khusus, tanggal_lahir, status_perkawinan, alamat, pendidikan, pekerjaan, keterangan
  } = req.body;

  try {
    await db.query(
      `UPDATE buku_anggota_pkk SET 
       no_registrasi=?, nama=?, jenis_kelamin=?, kedudukan_anggota=?, kader_umum=?, kader_khusus=?, tanggal_lahir=?, status_perkawinan=?, alamat=?, pendidikan=?, pekerjaan=?, keterangan=?
       WHERE id_anggota=?`,
      [
        no_registrasi || null,
        nama,
        jenis_kelamin || 'P',
        kedudukan_anggota || 'Angg Pkj',
        kader_umum ? 1 : 0,
        kader_khusus ? 1 : 0,
        tanggal_lahir || null,
        status_perkawinan || 'k',
        alamat || 'Suayan Sabar',
        pendidikan || null,
        pekerjaan || null,
        keterangan || null,
        id
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteAnggota = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_anggota_pkk WHERE id_anggota = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

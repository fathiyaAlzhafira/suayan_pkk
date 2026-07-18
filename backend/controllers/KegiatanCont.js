const db = require('../config/db');

exports.getKegiatan = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT k.*, u.username, p.nama_program 
       FROM buku_kegiatan k 
       LEFT JOIN user_admin u ON k.id_user = u.id_user 
       LEFT JOIN program_kerja p ON k.id_proker = p.id_proker 
       ORDER BY k.tanggal DESC`
    );
    const mapped = rows.map(r => ({
      id: r.id_kegiatan,
      nama: r.nama || r.username || 'Admin PKK',
      jabatan: r.jabatan || 'Pengurus',
      tanggal: r.tanggal,
      tempat: r.tempat,
      uraian_kegiatan: r.uraian_kegiatan,
      kategori: r.kategori || 'Rapat',
      foto: "https://images.unsplash.com/photo-1531538606174-0f90ff5dce83?auto=format&fit=crop&q=80&w=400"
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addKegiatan = async (req, res) => {
  const { id_user, id_proker, tanggal, tempat, uraian_kegiatan, nama, jabatan, kategori } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO buku_kegiatan (id_user, id_proker, tanggal, tempat, uraian_kegiatan, nama, jabatan, kategori) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id_user || null, id_proker || null, tanggal, tempat, uraian_kegiatan, nama || null, jabatan || null, kategori || 'Rapat']
    );
    res.status(201).json({ id_kegiatan: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateKegiatan = async (req, res) => {
  const { id } = req.params;
  const { id_user, id_proker, tanggal, tempat, uraian_kegiatan, nama, jabatan, kategori } = req.body;
  try {
    await db.query(
      `UPDATE buku_kegiatan SET id_user=?, id_proker=?, tanggal=?, tempat=?, uraian_kegiatan=?, nama=?, jabatan=?, kategori=? WHERE id_kegiatan=?`,
      [id_user || null, id_proker || null, tanggal, tempat, uraian_kegiatan, nama || null, jabatan || null, kategori || 'Rapat', id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteKegiatan = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_kegiatan WHERE id_kegiatan = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

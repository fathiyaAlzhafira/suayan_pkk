const db = require('../config/db');

exports.getOrganisasi = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM struktur_organisasi ORDER BY level_hirarki ASC, id_pengurus ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addOrganisasi = async (req, res) => {
  const { nama_pengurus, jabatan, level_hirarki, parent_id, foto, periode_mulai, periode_selesai, status_aktif } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO struktur_organisasi (nama_pengurus, jabatan, level_hirarki, parent_id, foto, periode_mulai, periode_selesai, status_aktif) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [nama_pengurus, jabatan, level_hirarki || 1, parent_id || null, foto || null, periode_mulai || 2026, periode_selesai || 2031, status_aktif ? 1 : 0]
    );
    res.status(201).json({ id_pengurus: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOrganisasi = async (req, res) => {
  const { id } = req.params;
  const { nama_pengurus, jabatan, level_hirarki, parent_id, foto, periode_mulai, periode_selesai, status_aktif } = req.body;
  try {
    await db.query(
      `UPDATE struktur_organisasi SET nama_pengurus=?, jabatan=?, level_hirarki=?, parent_id=?, foto=?, periode_mulai=?, periode_selesai=?, status_aktif=? 
       WHERE id_pengurus=?`,
      [nama_pengurus, jabatan, level_hirarki || 1, parent_id || null, foto || null, periode_mulai || 2026, periode_selesai || 2031, status_aktif ? 1 : 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteOrganisasi = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM struktur_organisasi WHERE id_pengurus = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

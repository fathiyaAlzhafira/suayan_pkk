const db = require('../config/db');

exports.getProker = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM program_kerja ORDER BY pokja ASC, id_proker ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProker = async (req, res) => {
  const { pokja, nama_program, deskripsi, status_progres } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO program_kerja (pokja, nama_program, deskripsi, status_progres) VALUES (?, ?, ?, ?)`,
      [pokja, nama_program, deskripsi || null, status_progres || 'Direncanakan']
    );
    res.status(201).json({ id_proker: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProker = async (req, res) => {
  const { id } = req.params;
  const { pokja, nama_program, deskripsi, status_progres } = req.body;
  try {
    await db.query(
      `UPDATE program_kerja SET pokja=?, nama_program=?, deskripsi=?, status_progres=? WHERE id_proker=?`,
      [pokja, nama_program, deskripsi || null, status_progres || 'Direncanakan', id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProker = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM program_kerja WHERE id_proker = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

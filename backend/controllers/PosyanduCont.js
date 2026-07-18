const db = require('../config/db');

exports.getPosyandu = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buku_posyandu ORDER BY jorong ASC, id ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPosyandu = async (req, res) => {
  const { jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO buku_posyandu (jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [jorong, posyandu, pengunjung || 0, petugas || 0, bayi_lahir || 0, meninggal || 0, s || 0, k || 0, d || 0, n || 0, bcg || 0, dpt || 0, polio || 0, campak || 0, hepb || 0]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePosyandu = async (req, res) => {
  const { id } = req.params;
  const { jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb } = req.body;
  try {
    await db.query(
      `UPDATE buku_posyandu SET jorong=?, posyandu=?, pengunjung=?, petugas=?, bayi_lahir=?, meninggal=?, s=?, k=?, d=?, n=?, bcg=?, dpt=?, polio=?, campak=?, hepb=? 
       WHERE id=?`,
      [jorong, posyandu, pengunjung || 0, petugas || 0, bayi_lahir || 0, meninggal || 0, s || 0, k || 0, d || 0, n || 0, bcg || 0, dpt || 0, polio || 0, campak || 0, hepb || 0, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePosyandu = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_posyandu WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const db = require('../config/db');

exports.getKeluarga = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT k.*, j.nama_jorong 
       FROM keluarga k 
       JOIN jorong j ON k.id_jorong = j.id_jorong 
       ORDER BY k.no_kk ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addKeluarga = async (req, res) => {
  const { no_kk, id_jorong, dasawisma, makanan_pokok, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah, status_verifikasi } = req.body;
  try {
    await db.query(
      `INSERT INTO keluarga (no_kk, id_jorong, dasawisma, makanan_pokok, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah, status_verifikasi) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [no_kk, id_jorong, dasawisma, makanan_pokok || 'Beras', jamban_keluarga ? 1 : 0, jumlah_jamban || 0, sumber_air || 'PDAM', tempat_sampah ? 1 : 0, spal ? 1 : 0, stiker_p4k ? 1 : 0, kriteria_rumah || 'Sehat', status_verifikasi || 'Approved']
    );
    res.status(201).json({ success: true, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateKeluarga = async (req, res) => {
  const { no_kk } = req.params;
  const { id_jorong, dasawisma, makanan_pokok, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah, status_verifikasi } = req.body;
  try {
    await db.query(
      `UPDATE keluarga 
       SET id_jorong=?, dasawisma=?, makanan_pokok=?, jamban_keluarga=?, jumlah_jamban=?, sumber_air=?, tempat_sampah=?, spal=?, stiker_p4k=?, kriteria_rumah=?, status_verifikasi=? 
       WHERE no_kk=?`,
      [id_jorong, dasawisma, makanan_pokok || 'Beras', jamban_keluarga ? 1 : 0, jumlah_jamban || 0, sumber_air || 'PDAM', tempat_sampah ? 1 : 0, spal ? 1 : 0, stiker_p4k ? 1 : 0, kriteria_rumah || 'Sehat', status_verifikasi || 'Approved', no_kk]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteKeluarga = async (req, res) => {
  const { no_kk } = req.params;
  try {
    await db.query('DELETE FROM keluarga WHERE no_kk = ?', [no_kk]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const db = require('../config/db');

exports.getEkspedisi = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buku_ekspedisi ORDER BY tanggal DESC');
    const mapped = rows.map(r => ({
      id: r.id_surat,
      tanggal: r.tanggal,
      nomor_surat: r.nomor_surat,
      alamat_tujuan: r.alamat_tujuan_pengirim,
      perihal: r.perihal,
      jenis_surat: r.jenis_surat || 'Keluar'
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addEkspedisi = async (req, res) => {
  const { tanggal, nomor_surat, alamat_tujuan, perihal } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO buku_ekspedisi (tanggal, nomor_surat, alamat_tujuan_pengirim, perihal, jenis_surat) VALUES (?, ?, ?, ?, 'Keluar')`,
      [tanggal, nomor_surat, alamat_tujuan, perihal]
    );
    res.status(201).json({ id_surat: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEkspedisi = async (req, res) => {
  const { id } = req.params;
  const { tanggal, nomor_surat, alamat_tujuan, perihal } = req.body;
  try {
    await db.query(
      `UPDATE buku_ekspedisi SET tanggal=?, nomor_surat=?, alamat_tujuan_pengirim=?, perihal=? WHERE id_surat=?`,
      [tanggal, nomor_surat, alamat_tujuan, perihal, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEkspedisi = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_ekspedisi WHERE id_surat = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

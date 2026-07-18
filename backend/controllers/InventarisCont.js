const db = require('../config/db');

exports.getInventaris = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buku_inventaris ORDER BY id_barang ASC');
    const mapped = rows.map(r => ({
      id: r.id_barang,
      nama_barang: r.nama_barang,
      asal_barang: r.asal_barang,
      tanggal_penerimaan: r.tanggal_penerimaan,
      jumlah: r.jumlah,
      tempat_penyimpanan: r.tempat_penyimpanan,
      kondisi_barang: r.kondisi || 'Baik',
      keterangan: r.keterangan
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addInventaris = async (req, res) => {
  const { nama_barang, asal_barang, tanggal_penerimaan, jumlah, tempat_penyimpanan, kondisi_barang, keterangan } = req.body;
  try {
    const [result] = await db.query(
      `INSERT INTO buku_inventaris (nama_barang, asal_barang, tanggal_penerimaan, jumlah, tempat_penyimpanan, kondisi, keterangan) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nama_barang, asal_barang, tanggal_penerimaan || null, jumlah || 1, tempat_penyimpanan, kondisi_barang || 'Baik', keterangan || null]
    );
    res.status(201).json({ id_barang: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateInventaris = async (req, res) => {
  const { id } = req.params;
  const { nama_barang, asal_barang, tanggal_penerimaan, jumlah, tempat_penyimpanan, kondisi_barang, keterangan } = req.body;
  try {
    await db.query(
      `UPDATE buku_inventaris SET nama_barang=?, asal_barang=?, tanggal_penerimaan=?, jumlah=?, tempat_penyimpanan=?, kondisi=?, keterangan=? 
       WHERE id_barang=?`,
      [nama_barang, asal_barang, tanggal_penerimaan || null, jumlah || 1, tempat_penyimpanan, kondisi_barang || 'Baik', keterangan || null, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteInventaris = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_inventaris WHERE id_barang = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

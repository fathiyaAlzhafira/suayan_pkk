const db = require('../config/db');

exports.getKeuangan = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM buku_keuangan ORDER BY tanggal DESC, id_transaksi DESC');
    const mapped = rows.map(r => ({
      id: r.id_transaksi,
      tanggal: r.tanggal,
      sumber_dana: r.sumber_dana,
      uraian: r.uraian,
      nomor_bukti_kas: r.no_bukti_kas,
      nominal_penerimaan: r.jenis_transaksi === 'Penerimaan' ? r.nominal : 0.00,
      nominal_pengeluaran: r.jenis_transaksi === 'Pengeluaran' ? r.nominal : 0.00
    }));
    res.json(mapped);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addKeuangan = async (req, res) => {
  const { tanggal, sumber_dana, uraian, nomor_bukti_kas, nominal_penerimaan, nominal_pengeluaran } = req.body;
  const jenis = nominal_penerimaan > 0 ? 'Penerimaan' : 'Pengeluaran';
  const nominal = nominal_penerimaan > 0 ? nominal_penerimaan : nominal_pengeluaran;
  try {
    const [result] = await db.query(
      `INSERT INTO buku_keuangan (tanggal, sumber_dana, uraian, no_bukti_kas, jenis_transaksi, nominal) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [tanggal, sumber_dana, uraian, nomor_bukti_kas || null, jenis, nominal]
    );
    res.status(201).json({ id_transaksi: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateKeuangan = async (req, res) => {
  const { id } = req.params;
  const { tanggal, sumber_dana, uraian, nomor_bukti_kas, nominal_penerimaan, nominal_pengeluaran } = req.body;
  const jenis = nominal_penerimaan > 0 ? 'Penerimaan' : 'Pengeluaran';
  const nominal = nominal_penerimaan > 0 ? nominal_penerimaan : nominal_pengeluaran;
  try {
    await db.query(
      `UPDATE buku_keuangan SET tanggal=?, sumber_dana=?, uraian=?, no_bukti_kas=?, jenis_transaksi=?, nominal=? 
       WHERE id_transaksi=?`,
      [tanggal, sumber_dana, uraian, nomor_bukti_kas || null, jenis, nominal, id]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteKeuangan = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM buku_keuangan WHERE id_transaksi = ?', [id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

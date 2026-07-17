const db = require('../config/db');

// ==========================================
// ============= AUTHENTICATION =============
// ==========================================
exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await db.query(
      `SELECT u.*, j.nama_jorong 
       FROM user_admin u 
       LEFT JOIN jorong j ON u.id_jorong = j.id_jorong 
       WHERE u.username = ?`, 
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Username tidak terdaftar.' });
    }
    const user = rows[0];
    
    // Perbandingan password langsung
    if (user.password === password) {
      return res.json({
        success: true,
        user: { 
          id_user: user.id_user,
          username: user.username, 
          role: user.role,
          nama_jorong: user.nama_jorong || 'Semua Jorong'
        }
      });
    } else {
      return res.status(401).json({ success: false, message: 'Password salah.' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

// ==========================================
// ============= KELUARGA (KK) ==============
// ==========================================
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

// ==========================================
// ============= WARGA (INDIVIDU) ===========
// ==========================================
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
    
    // Insert warga
    await conn.query(
      `INSERT INTO warga (nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nik, no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0]
    );

    // Insert aktivitas_warga
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

    // Update warga
    await conn.query(
      `UPDATE warga 
       SET no_kk=?, no_registrasi=?, nama=?, jabatan_pkk=?, jenis_kelamin=?, tempat_lahir=?, tanggal_lahir=?, status_perkawinan=?, status_keluarga=?, agama=?, pendidikan=?, pekerjaan=?, akseptor_kb=?, jenis_kb=?, aktif_posyandu=?, frekuensi_posyandu=?, bina_keluarga=?, memiliki_tabungan=?, kelompok_belajar=?, paud=?, ikut_koperasi=?, jenis_koperasi=?, berkebutuhan_khusus=? 
       WHERE nik=?`,
      [no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0, nik]
    );

    // Update aktivitas_warga
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

// ==========================================
// ============= JORONG =====================
// ==========================================
exports.getJorong = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jorong ORDER BY id_jorong ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ==========================================
// ============= PROGRAM KERJA ==============
// ==========================================
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

// ==========================================
// ============= STRUKTUR ORGANISASI ========
// ==========================================
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

// ==========================================
// ============= BUKU KEGIATAN ==============
// ==========================================
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

// ==========================================
// ============= BUKU KEUANGAN =============
// ==========================================
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

// ==========================================
// ============= BUKU EKSPEDISI =============
// ==========================================
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

// ==========================================
// ============= BUKU INVENTARIS ============
// ==========================================
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

// ==========================================
// ============= BUKU POSYANDU ==============
// ==========================================
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

// ==========================================================
// ====== DYNAMIC AGGREGATIONS FOR CHARTS & STATS ===========
// ==========================================================

// GET /api/umum - Aggregated from Warga & Keluarga tables
exports.getUmum = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        j.nama_jorong AS jorong,
        2026 AS tahun,
        COUNT(DISTINCT k.no_kk) AS jumlah_kk,
        COUNT(DISTINCT CASE WHEN w.status_keluarga = 'Kepala Keluarga' THEN k.no_kk END) AS jumlah_krt,
        COUNT(DISTINCT k.dasawisma) AS jumlah_dasawisma,
        SUM(CASE WHEN w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS jiwa_l,
        SUM(CASE WHEN w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS jiwa_p,
        SUM(CASE WHEN w.jabatan_pkk IS NOT NULL AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS anggota_l,
        SUM(CASE WHEN w.jabatan_pkk IS NOT NULL AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS anggota_p,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Umum' AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS kader_umum_l,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Umum' AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS kader_umum_p,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Khusus' AND w.jenis_kelamin = 'L' THEN 1 ELSE 0 END) AS kader_khusus_l,
        SUM(CASE WHEN w.jabatan_pkk = 'Kader Khusus' AND w.jenis_kelamin = 'P' THEN 1 ELSE 0 END) AS kader_khusus_p,
        0 AS tenaga_honorer_l,
        0 AS tenaga_honorer_p,
        0 AS tenaga_bantuan_l,
        0 AS tenaga_bantuan_p,
        '' AS keterangan
      FROM jorong j
      LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
      LEFT JOIN warga w ON k.no_kk = w.no_kk
      GROUP BY j.id_jorong, j.nama_jorong
      ORDER BY j.nama_jorong ASC
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/pokja/:id - Aggregated from Warga, Keluarga, and Aktivitas tables
exports.getPokja = async (req, res) => {
  const { id } = req.params;
  try {
    let queryStr = '';
    
    if (id == 1) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          COUNT(DISTINCT CASE WHEN aw.penghayatan_pancasila = 1 THEN k.no_kk END) AS pkbn_kel,
          SUM(CASE WHEN aw.penghayatan_pancasila = 1 THEN 1 ELSE 0 END) AS pkbn_ang,
          COUNT(DISTINCT CASE WHEN aw.rukun_kematian = 1 THEN k.no_kk END) AS pkdrt_kel,
          SUM(CASE WHEN aw.jimpitan = 1 THEN 1 ELSE 0 END) AS pola_kel,
          SUM(CASE WHEN w.tanggal_lahir <= DATE_SUB(CURDATE(), INTERVAL 60 YEAR) THEN 1 ELSE 0 END) AS lansia_kel,
          SUM(CASE WHEN aw.kerja_bakti = 1 THEN 1 ELSE 0 END) AS gotong,
          SUM(CASE WHEN aw.arisan = 1 THEN 1 ELSE 0 END) AS arisan
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN aktivitas_warga aw ON w.nik = aw.nik
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else if (id == 2) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.kelompok_belajar != 'Tidak' THEN 1 ELSE 0 END) AS baca,
          COUNT(DISTINCT ik.id_industri) AS up2k_kel,
          SUM(CASE WHEN w.ikut_koperasi = 1 THEN 1 ELSE 0 END) AS up2k_pes,
          SUM(CASE WHEN ik.kategori = 'Pangan' THEN 1 ELSE 0 END) AS mikro,
          SUM(CASE WHEN ik.status_up2k = 1 THEN 1 ELSE 0 END) AS toko,
          SUM(CASE WHEN w.ikut_koperasi = 1 THEN 1 ELSE 0 END) AS koperasi
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN industri_keluarga ik ON k.no_kk = ik.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else if (id == 3) {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.jabatan_pkk = 'Kader Pangan' THEN 1 ELSE 0 END) AS kp,
          SUM(CASE WHEN w.jabatan_pkk = 'Kader Sandang' THEN 1 ELSE 0 END) AS ks,
          SUM(CASE WHEN pk.kategori = 'Peternakan' THEN pk.jumlah ELSE 0 END) AS ternak,
          SUM(CASE WHEN pk.kategori = 'Perikanan' THEN pk.jumlah ELSE 0 END) AS ikan,
          SUM(CASE WHEN pk.kategori = 'Warung Hidup' THEN pk.jumlah ELSE 0 END) AS warung,
          SUM(CASE WHEN pk.kategori = 'TOGA' THEN pk.jumlah ELSE 0 END) AS toga,
          SUM(CASE WHEN k.kriteria_rumah = 'Sehat' THEN 1 ELSE 0 END) AS r_sehat,
          SUM(CASE WHEN k.kriteria_rumah = 'Kurang Sehat' THEN 1 ELSE 0 END) AS r_kurang
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        LEFT JOIN pekarangan_keluarga pk ON k.no_kk = pk.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    } else {
      queryStr = `
        SELECT 
          j.nama_jorong AS jorong,
          SUM(CASE WHEN w.aktif_posyandu = 1 THEN 1 ELSE 0 END) AS k_pos,
          SUM(CASE WHEN k.tempat_sampah = 1 AND k.spal = 1 THEN 1 ELSE 0 END) AS k_phbs,
          SUM(CASE WHEN w.akseptor_kb = 1 THEN 1 ELSE 0 END) AS k_kb,
          SUM(CASE WHEN w.aktif_posyandu = 1 THEN 1 ELSE 0 END) AS pos,
          SUM(CASE WHEN k.jamban_keluarga = 1 THEN 1 ELSE 0 END) AS jamban,
          SUM(k.jumlah_jamban) AS mck,
          SUM(CASE WHEN w.akseptor_kb = 1 THEN 1 ELSE 0 END) AS kb_asep
        FROM jorong j
        LEFT JOIN keluarga k ON j.id_jorong = k.id_jorong
        LEFT JOIN warga w ON k.no_kk = w.no_kk
        GROUP BY j.id_jorong, j.nama_jorong
        ORDER BY j.nama_jorong ASC`;
    }

    const [rows] = await db.query(queryStr);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// No-op edit karena data Pokja dihitung secara otomatis (real-time) dari data warga/keluarga
exports.updatePokja = async (req, res) => {
  res.json({ success: true, message: 'Data Pokja dihitung otomatis dari data keluarga/warga' });
};
exports.updateUmum = async (req, res) => {
  res.json({ success: true, message: 'Data Umum dihitung otomatis dari data keluarga/warga' });
};

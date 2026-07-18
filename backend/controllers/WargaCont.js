const db = require('../config/db');

// --- JORONG ---
exports.getJorong = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM jorong ORDER BY id_jorong ASC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- WARGA ---
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
    
    await conn.query(
      `INSERT INTO warga (nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [nik, no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0]
    );

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

    await conn.query(
      `UPDATE warga 
       SET no_kk=?, no_registrasi=?, nama=?, jabatan_pkk=?, jenis_kelamin=?, tempat_lahir=?, tanggal_lahir=?, status_perkawinan=?, status_keluarga=?, agama=?, pendidikan=?, pekerjaan=?, akseptor_kb=?, jenis_kb=?, aktif_posyandu=?, frekuensi_posyandu=?, bina_keluarga=?, memiliki_tabungan=?, kelompok_belajar=?, paud=?, ikut_koperasi=?, jenis_koperasi=?, berkebutuhan_khusus=? 
       WHERE nik=?`,
      [no_kk, no_registrasi || null, nama, jabatan_pkk || null, jenis_kelamin, tempat_lahir || null, tanggal_lahir || null, status_perkawinan || 'Lajang', status_keluarga || 'Anak', agama || 'Islam', pendidikan || null, pekerjaan || null, akseptor_kb ? 1 : 0, jenis_kb || null, aktif_posyandu ? 1 : 0, frekuensi_posyandu || 0, bina_keluarga ? 1 : 0, memiliki_tabungan ? 1 : 0, kelompok_belajar || 'Tidak', paud ? 1 : 0, ikut_koperasi ? 1 : 0, jenis_koperasi || null, berkebutuhan_khusus ? 1 : 0, nik]
    );

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

exports.verifyKeluarga = async (req, res) => {
  const { no_kk, nik } = req.body;
  try {
    const [rows] = await db.query(
      `SELECT * FROM warga 
       WHERE no_kk = ? AND nik = ? AND status_keluarga = 'Kepala Keluarga'`,
      [no_kk, nik]
    );

    if (rows.length === 0) {
      const [kkCheck] = await db.query('SELECT * FROM keluarga WHERE no_kk = ?', [no_kk]);
      if (kkCheck.length > 0) {
        return res.status(400).json({ 
          success: false, 
          message: 'Kombinasi KK dan NIK Kepala Keluarga tidak valid. Data keluarga ini sudah terdaftar.' 
        });
      } else {
        return res.json({ success: true, isNew: true, message: 'KK Baru terdeteksi. Silakan isi form kosong.' });
      }
    }

    const [keluargaRows] = await db.query('SELECT * FROM keluarga WHERE no_kk = ?', [no_kk]);
    const [wargaRows] = await db.query(
      `SELECT w.*, a.penghayatan_pancasila, a.kerja_bakti, a.rukun_kematian, a.kegiatan_keagamaan, a.jimpitan, a.arisan
       FROM warga w
       LEFT JOIN aktivitas_warga a ON w.nik = a.nik
       WHERE w.no_kk = ?`,
      [no_kk]
    );
    const [pekaranganRows] = await db.query('SELECT * FROM pekarangan_keluarga WHERE no_kk = ?', [no_kk]);
    const [industriRows] = await db.query('SELECT * FROM industri_keluarga WHERE no_kk = ?', [no_kk]);

    return res.json({
      success: true,
      isNew: false,
      keluarga: keluargaRows[0],
      warga: wargaRows,
      pekarangan: pekaranganRows,
      industri: industriRows
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Terjadi kesalahan pada server.' });
  }
};

exports.submitMandiriKeluargaWarga = async (req, res) => {
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const { keluarga, warga, pekarangan, industri } = req.body;
    const { no_kk } = keluarga;

    const [keluargaCheck] = await conn.query('SELECT * FROM keluarga WHERE no_kk = ?', [no_kk]);
    if (keluargaCheck.length > 0) {
      await conn.query(
        `UPDATE keluarga 
         SET id_jorong=?, dasawisma=?, rt=?, rw=?, dusun=?, makanan_pokok=?, makanan_pokok_lain=?, jamban_keluarga=?, jumlah_jamban=?, sumber_air=?, tempat_sampah=?, spal=?, stiker_p4k=?, kriteria_rumah=?, up2k_aktif=?, up2k_jenis=?, kesling_aktif=?, status_verifikasi='Pending' 
         WHERE no_kk=?`,
        [
          keluarga.id_jorong, keluarga.dasawisma, keluarga.rt || '', keluarga.rw || '', keluarga.dusun || '',
          keluarga.makanan_pokok || 'Beras', keluarga.makanan_pokok_lain || '',
          keluarga.jamban_keluarga ? 1 : 0, keluarga.jumlah_jamban || 0, keluarga.sumber_air || 'PDAM',
          keluarga.tempat_sampah ? 1 : 0, keluarga.spal ? 1 : 0, keluarga.stiker_p4k ? 1 : 0,
          keluarga.kriteria_rumah || 'Sehat', keluarga.up2k_aktif ? 1 : 0, keluarga.up2k_jenis || '',
          keluarga.kesling_aktif ? 1 : 0, no_kk
        ]
      );
      
      await conn.query(
        `DELETE FROM aktivitas_warga WHERE nik IN (SELECT nik FROM warga WHERE no_kk = ?)`,
        [no_kk]
      );
      await conn.query(`DELETE FROM warga WHERE no_kk = ?`, [no_kk]);
      await conn.query(`DELETE FROM pekarangan_keluarga WHERE no_kk = ?`, [no_kk]);
      await conn.query(`DELETE FROM industri_keluarga WHERE no_kk = ?`, [no_kk]);
    } else {
      await conn.query(
        `INSERT INTO keluarga (no_kk, id_jorong, dasawisma, rt, rw, dusun, makanan_pokok, makanan_pokok_lain, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah, up2k_aktif, up2k_jenis, kesling_aktif, status_verifikasi) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')`,
        [
          no_kk, keluarga.id_jorong, keluarga.dasawisma, keluarga.rt || '', keluarga.rw || '', keluarga.dusun || '',
          keluarga.makanan_pokok || 'Beras', keluarga.makanan_pokok_lain || '',
          keluarga.jamban_keluarga ? 1 : 0, keluarga.jumlah_jamban || 0, keluarga.sumber_air || 'PDAM',
          keluarga.tempat_sampah ? 1 : 0, keluarga.spal ? 1 : 0, keluarga.stiker_p4k ? 1 : 0,
          keluarga.kriteria_rumah || 'Sehat', keluarga.up2k_aktif ? 1 : 0, keluarga.up2k_jenis || '',
          keluarga.kesling_aktif ? 1 : 0
        ]
      );
    }

    for (const w of warga) {
      await conn.query(
        `INSERT INTO warga (nik, no_kk, no_registrasi, nama, jabatan_pkk, jenis_kelamin, tempat_lahir, tanggal_lahir, status_perkawinan, status_keluarga, agama, pendidikan, pekerjaan, akseptor_kb, jenis_kb, aktif_posyandu, frekuensi_posyandu, bina_keluarga, memiliki_tabungan, kelompok_belajar, paud, ikut_koperasi, jenis_koperasi, berkebutuhan_khusus) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          w.nik, no_kk, w.no_registrasi || null, w.nama, w.jabatan_pkk || null, w.jenis_kelamin,
          w.tempat_lahir || null, w.tanggal_lahir ? w.tanggal_lahir.substring(0, 10) : null,
          w.status_perkawinan || 'Lajang', w.status_keluarga || 'Anak', w.agama || 'Islam',
          w.pendidikan || null, w.pekerjaan || null, w.akseptor_kb ? 1 : 0, w.jenis_kb || null,
          w.aktif_posyandu ? 1 : 0, w.frekuensi_posyandu || 0, w.bina_keluarga ? 1 : 0,
          w.memiliki_tabungan ? 1 : 0, w.kelompok_belajar || 'Tidak', w.paud ? 1 : 0,
          w.ikut_koperasi ? 1 : 0, w.jenis_koperasi || null, w.berkebutuhan_khusus ? 1 : 0
        ]
      );

      await conn.query(
        `INSERT INTO aktivitas_warga (nik, penghayatan_pancasila, kerja_bakti, rukun_kematian, kegiatan_keagamaan, jimpitan, arisan) 
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          w.nik, w.penghayatan_pancasila ? 1 : 0, w.kerja_bakti ? 1 : 0, w.rukun_kematian ? 1 : 0,
          w.kegiatan_keagamaan ? 1 : 0, w.jimpitan ? 1 : 0, w.arisan ? 1 : 0
        ]
      );
    }

    for (const p of pekarangan) {
      if (p.komoditi && p.kategori) {
        await conn.query(
          `INSERT INTO pekarangan_keluarga (no_kk, kategori, komoditi, jumlah) VALUES (?, ?, ?, ?)`,
          [no_kk, p.kategori, p.komoditi, p.jumlah || 0]
        );
      }
    }

    for (const ind of industri) {
      if (ind.komoditi && ind.kategori) {
        await conn.query(
          `INSERT INTO industri_keluarga (no_kk, kategori, komoditi, jumlah, status_up2k) VALUES (?, ?, ?, ?, ?)`,
          [no_kk, ind.kategori, ind.komoditi, ind.jumlah || 0, ind.status_up2k ? 1 : 0]
        );
      }
    }

    await conn.commit();
    res.json({ success: true, message: 'Data berhasil dikirim secara mandiri dan menunggu persetujuan Admin.' });
  } catch (error) {
    await conn.rollback();
    console.error(error);
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};


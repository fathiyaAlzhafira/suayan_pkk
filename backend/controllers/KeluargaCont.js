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
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      no_kk, id_jorong, dasawisma, rt, rw, dusun,
      makanan_pokok, makanan_pokok_lain, jamban_keluarga, jumlah_jamban,
      sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah,
      up2k_aktif, up2k_jenis, kesling_aktif, status_verifikasi,
      warga, pekarangan, industri
    } = req.body;

    // 1. Insert keluarga
    await conn.query(
      `INSERT INTO keluarga (no_kk, id_jorong, dasawisma, rt, rw, dusun, makanan_pokok, makanan_pokok_lain, jamban_keluarga, jumlah_jamban, sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah, up2k_aktif, up2k_jenis, kesling_aktif, status_verifikasi) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        no_kk, id_jorong, dasawisma, rt || '', rw || '', dusun || '',
        makanan_pokok || 'Beras', makanan_pokok_lain || '',
        jamban_keluarga ? 1 : 0, jumlah_jamban || 0, sumber_air || 'PDAM',
        tempat_sampah ? 1 : 0, spal ? 1 : 0, stiker_p4k ? 1 : 0, kriteria_rumah || 'Sehat',
        up2k_aktif ? 1 : 0, up2k_jenis || '', kesling_aktif ? 1 : 0, status_verifikasi || 'Approved'
      ]
    );

    // 2. Insert warga & aktivitas_warga
    if (Array.isArray(warga)) {
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
    }

    // 3. Insert pekarangan
    if (Array.isArray(pekarangan)) {
      for (const p of pekarangan) {
        if (p.komoditi && p.kategori) {
          await conn.query(
            `INSERT INTO pekarangan_keluarga (no_kk, kategori, komoditi, jumlah) VALUES (?, ?, ?, ?)`,
            [no_kk, p.kategori, p.komoditi, p.jumlah || 0]
          );
        }
      }
    }

    // 4. Insert industri
    if (Array.isArray(industri)) {
      for (const ind of industri) {
        if (ind.komoditi && ind.kategori) {
          await conn.query(
            `INSERT INTO industri_keluarga (no_kk, kategori, komoditi, jumlah, status_up2k) VALUES (?, ?, ?, ?, ?)`,
            [no_kk, ind.kategori, ind.komoditi, ind.jumlah || 0, ind.status_up2k ? 1 : 0]
          );
        }
      }
    }

    await conn.commit();
    res.status(201).json({ success: true, ...req.body });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
  }
};

exports.updateKeluarga = async (req, res) => {
  const { no_kk } = req.params;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const {
      id_jorong, dasawisma, rt, rw, dusun,
      makanan_pokok, makanan_pokok_lain, jamban_keluarga, jumlah_jamban,
      sumber_air, tempat_sampah, spal, stiker_p4k, kriteria_rumah,
      up2k_aktif, up2k_jenis, kesling_aktif, status_verifikasi,
      warga, pekarangan, industri
    } = req.body;

    // 1. Update keluarga
    await conn.query(
      `UPDATE keluarga 
       SET id_jorong=?, dasawisma=?, rt=?, rw=?, dusun=?, makanan_pokok=?, makanan_pokok_lain=?, jamban_keluarga=?, jumlah_jamban=?, sumber_air=?, tempat_sampah=?, spal=?, stiker_p4k=?, kriteria_rumah=?, up2k_aktif=?, up2k_jenis=?, kesling_aktif=?, status_verifikasi=? 
       WHERE no_kk=?`,
      [
        id_jorong, dasawisma, rt || '', rw || '', dusun || '',
        makanan_pokok || 'Beras', makanan_pokok_lain || '',
        jamban_keluarga ? 1 : 0, jumlah_jamban || 0, sumber_air || 'PDAM',
        tempat_sampah ? 1 : 0, spal ? 1 : 0, stiker_p4k ? 1 : 0, kriteria_rumah || 'Sehat',
        up2k_aktif ? 1 : 0, up2k_jenis || '', kesling_aktif ? 1 : 0, status_verifikasi || 'Approved', no_kk
      ]
    );

    // 2. Update warga & aktivitas_warga
    if (warga !== undefined) {
      await conn.query(
        `DELETE FROM aktivitas_warga WHERE nik IN (SELECT nik FROM warga WHERE no_kk = ?)`,
        [no_kk]
      );
      await conn.query(`DELETE FROM warga WHERE no_kk = ?`, [no_kk]);

      if (Array.isArray(warga)) {
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
      }
    }

    // 3. Update pekarangan
    if (pekarangan !== undefined) {
      await conn.query(`DELETE FROM pekarangan_keluarga WHERE no_kk = ?`, [no_kk]);
      if (Array.isArray(pekarangan)) {
        for (const p of pekarangan) {
          if (p.komoditi && p.kategori) {
            await conn.query(
              `INSERT INTO pekarangan_keluarga (no_kk, kategori, komoditi, jumlah) VALUES (?, ?, ?, ?)`,
              [no_kk, p.kategori, p.komoditi, p.jumlah || 0]
            );
          }
        }
      }
    }

    // 4. Update industri
    if (industri !== undefined) {
      await conn.query(`DELETE FROM industri_keluarga WHERE no_kk = ?`, [no_kk]);
      if (Array.isArray(industri)) {
        for (const ind of industri) {
          if (ind.komoditi && ind.kategori) {
            await conn.query(
              `INSERT INTO industri_keluarga (no_kk, kategori, komoditi, jumlah, status_up2k) VALUES (?, ?, ?, ?, ?)`,
              [no_kk, ind.kategori, ind.komoditi, ind.jumlah || 0, ind.status_up2k ? 1 : 0]
            );
          }
        }
      }
    }

    await conn.commit();
    res.json({ success: true });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ message: error.message });
  } finally {
    conn.release();
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

exports.getPekaranganByKK = async (req, res) => {
  const { no_kk } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM pekarangan_keluarga WHERE no_kk = ?', [no_kk]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getIndustriByKK = async (req, res) => {
  const { no_kk } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM industri_keluarga WHERE no_kk = ?', [no_kk]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getWargaByKK = async (req, res) => {
  const { no_kk } = req.params;
  try {
    const [rows] = await db.query(
      `SELECT w.*, a.penghayatan_pancasila, a.kerja_bakti, a.rukun_kematian, a.kegiatan_keagamaan, a.jimpitan, a.arisan
       FROM warga w
       LEFT JOIN aktivitas_warga a ON w.nik = a.nik
       WHERE w.no_kk = ?`,
      [no_kk]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

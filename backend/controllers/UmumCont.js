const db = require('../config/db');

exports.getUmum = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT 
        id,
        nama_jorong AS jorong,
        jumlah_dasawisma,
        jumlah_krt,
        jumlah_kk,
        jiwa_l,
        jiwa_p,
        anggota_l,
        anggota_p,
        kader_umum_l,
        kader_umum_p,
        kader_khusus_l,
        kader_khusus_p,
        tenaga_honorer_l,
        tenaga_honorer_p,
        tenaga_bantuan_l,
        tenaga_bantuan_p,
        keterangan
       FROM data_umum_pkk
       ORDER BY nama_jorong ASC`
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUmum = async (req, res) => {
  const {
    jorong, jumlah_dasawisma, jumlah_krt, jumlah_kk, jiwa_l, jiwa_p,
    anggota_l, anggota_p, kader_umum_l, kader_umum_p, kader_khusus_l, kader_khusus_p,
    tenaga_honorer_l, tenaga_honorer_p, tenaga_bantuan_l, tenaga_bantuan_p, keterangan
  } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM data_umum_pkk WHERE nama_jorong = ?', [jorong]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Data Umum untuk Jorong ${jorong} sudah ada.` });
    }

    const [result] = await db.query(
      `INSERT INTO data_umum_pkk 
       (nama_jorong, jumlah_dasawisma, jumlah_krt, jumlah_kk, jiwa_l, jiwa_p, anggota_l, anggota_p, kader_umum_l, kader_umum_p, kader_khusus_l, kader_khusus_p, tenaga_honorer_l, tenaga_honorer_p, tenaga_bantuan_l, tenaga_bantuan_p, keterangan)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jorong,
        jumlah_dasawisma || 0, jumlah_krt || 0, jumlah_kk || 0, jiwa_l || 0, jiwa_p || 0,
        anggota_l || 0, anggota_p || 0, kader_umum_l || 0, kader_umum_p || 0,
        kader_khusus_l || 0, kader_khusus_p || 0, tenaga_honorer_l || 0, tenaga_honorer_p || 0,
        tenaga_bantuan_l || 0, tenaga_bantuan_p || 0, keterangan || null
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getPokja = async (req, res) => {
  const { id } = req.params;
  try {
    let queryStr = '';
    if (id == 1) {
      queryStr = `
        SELECT 
          id, nama_jorong AS jorong,
          kader_pkbn, kader_pkdrt, kader_pola_asuh,
          simulasi_pkbn_jml_kelompok, simulasi_pkbn_jml_anggota,
          simulasi_pkdrt_jml_kelompok, simulasi_pkdrt_jml_anggota,
          simulasi_pola_asuh_jml_kelompok, simulasi_pola_asuh_jml_anggota,
          simulasi_lansia_jml_kelompok, simulasi_lansia_jml_anggota,
          gotong_royong_kerja_bakti_jml_anggota, gotong_royong_rukun_kematian_jml_kelompok,
          gotong_royong_keagamaan_jml_anggota, gotong_royong_jimpitan, gotong_royong_arisan,
          keterangan
        FROM pokja_1 ORDER BY nama_jorong ASC`;
    } else if (id == 2) {
      queryStr = `
        SELECT 
          id, nama_jorong AS jorong,
          paket_a_kelompok, paket_a_warga_belajar_a, paket_a_warga_belajar_b,
          paket_b_kelompok, paket_b_warga_belajar_a, paket_b_warga_belajar_b,
          paket_c_kelompok, paket_c_warga_belajar_a, paket_c_warga_belajar_b,
          taman_bacaan, kelompok_pembaca, rumah_dilan, kampung_mandiri,
          kader_khusus_keterampilan, kader_khusus_koperasi,
          up2k_pemula_kelompok, up2k_pemula_peserta,
          up2k_madya_kelompok, up2k_madya_peserta,
          up2k_utama_kelompok, up2k_utama_peserta,
          up2k_mandiri_kelompok, up2k_mandiri_peserta,
          usaha_mikro, toko_pkk,
          pra_koperasi_jumlah, pra_koperasi_anggota,
          koperasi_berbadan_hukum_jumlah, koperasi_berbadan_hukum_anggota
        FROM pokja_2 ORDER BY nama_jorong ASC`;
    } else if (id == 3) {
      queryStr = `
        SELECT 
          id, nama_jorong AS jorong,
          kader_pangan, kader_sandang, kader_tata_laksana_rt,
          makanan_pokok_beras, makanan_pokok_non_beras,
          pekarangan_hatinya_pkk_peternakan, pekarangan_hatinya_pkk_perikanan,
          pekarangan_hatinya_pkk_warung_hidup, pekarangan_hatinya_pkk_lumbung_hidup,
          pekarangan_hatinya_pkk_toga, pekarangan_hatinya_pkk_tanaman_keras,
          industri_rt_sandang, industri_rt_pangan, industri_rt_jasa,
          rumah_sehat, rumah_kurang_sehat, keterangan
        FROM pokja_3 ORDER BY nama_jorong ASC`;
    } else {
      queryStr = `
        SELECT 
          id, nama_jorong AS jorong,
          posyandu_total AS jumlah_posyandu,
          posyandu_terintegrasi, lansia_kelompok, lansia_anggota,
          kader_kesehatan AS kader_posyandu,
          kader_kesling, kader_phbs, kader_narkoba, kader_kb,
          jamban AS memiliki_kartu_jamban,
          tempat_sampah AS memiliki_tempat_sampah,
          spal AS memiliki_spal,
          air_pdam, air_sumur, air_sungai, air_lain,
          pus, wus, kk_tabungan,
          warga_gratis AS aseptor_kb_p
        FROM pokja_4 ORDER BY nama_jorong ASC`;
    }

    const [rows] = await db.query(queryStr);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePokja = async (req, res) => {
  const { id, jorong } = req.params; // jorong is the nama_jorong
  try {
    if (id == 1) {
      const {
        kader_pkbn, kader_pkdrt, kader_pola_asuh,
        simulasi_pkbn_jml_kelompok, simulasi_pkbn_jml_anggota,
        simulasi_pkdrt_jml_kelompok, simulasi_pkdrt_jml_anggota,
        simulasi_pola_asuh_jml_kelompok, simulasi_pola_asuh_jml_anggota,
        simulasi_lansia_jml_kelompok, simulasi_lansia_jml_anggota,
        gotong_royong_kerja_bakti_jml_anggota, gotong_royong_rukun_kematian_jml_kelompok,
        gotong_royong_keagamaan_jml_anggota, gotong_royong_jimpitan, gotong_royong_arisan,
        keterangan
      } = req.body;

      await db.query(
        `UPDATE pokja_1 SET 
          kader_pkbn=?, kader_pkdrt=?, kader_pola_asuh=?,
          simulasi_pkbn_jml_kelompok=?, simulasi_pkbn_jml_anggota=?,
          simulasi_pkdrt_jml_kelompok=?, simulasi_pkdrt_jml_anggota=?,
          simulasi_pola_asuh_jml_kelompok=?, simulasi_pola_asuh_jml_anggota=?,
          simulasi_lansia_jml_kelompok=?, simulasi_lansia_jml_anggota=?,
          gotong_royong_kerja_bakti_jml_anggota=?, gotong_royong_rukun_kematian_jml_kelompok=?,
          gotong_royong_keagamaan_jml_anggota=?, gotong_royong_jimpitan=?, gotong_royong_arisan=?,
          keterangan=?
         WHERE nama_jorong=?`,
        [
          kader_pkbn || 0, kader_pkdrt || 0, kader_pola_asuh || 0,
          simulasi_pkbn_jml_kelompok || 0, simulasi_pkbn_jml_anggota || 0,
          simulasi_pkdrt_jml_kelompok || 0, simulasi_pkdrt_jml_anggota || 0,
          simulasi_pola_asuh_jml_kelompok || 0, simulasi_pola_asuh_jml_anggota || 0,
          simulasi_lansia_jml_kelompok || 0, simulasi_lansia_jml_anggota || 0,
          gotong_royong_kerja_bakti_jml_anggota || 0, gotong_royong_rukun_kematian_jml_kelompok || 0,
          gotong_royong_keagamaan_jml_anggota || 0, gotong_royong_jimpitan || 0, gotong_royong_arisan || 0,
          keterangan || null, jorong
        ]
      );
    } else if (id == 2) {
      const {
        paket_a_kelompok, paket_a_warga_belajar_a, paket_a_warga_belajar_b,
        paket_b_kelompok, paket_b_warga_belajar_a, paket_b_warga_belajar_b,
        paket_c_kelompok, paket_c_warga_belajar_a, paket_c_warga_belajar_b,
        taman_bacaan, kelompok_pembaca, rumah_dilan, kampung_mandiri,
        kader_khusus_keterampilan, kader_khusus_koperasi,
        up2k_pemula_kelompok, up2k_pemula_peserta,
        up2k_madya_kelompok, up2k_madya_peserta,
        up2k_utama_kelompok, up2k_utama_peserta,
        up2k_mandiri_kelompok, up2k_mandiri_peserta,
        usaha_mikro, toko_pkk,
        pra_koperasi_jumlah, pra_koperasi_anggota,
        koperasi_berbadan_hukum_jumlah, koperasi_berbadan_hukum_anggota
      } = req.body;

      await db.query(
        `UPDATE pokja_2 SET 
          paket_a_kelompok=?, paket_a_warga_belajar_a=?, paket_a_warga_belajar_b=?,
          paket_b_kelompok=?, paket_b_warga_belajar_a=?, paket_b_warga_belajar_b=?,
          paket_c_kelompok=?, paket_c_warga_belajar_a=?, paket_c_warga_belajar_b=?,
          taman_bacaan=?, kelompok_pembaca=?, rumah_dilan=?, kampung_mandiri=?,
          kader_khusus_keterampilan=?, kader_khusus_koperasi=?,
          up2k_pemula_kelompok=?, up2k_pemula_peserta=?,
          up2k_madya_kelompok=?, up2k_madya_peserta=?,
          up2k_utama_kelompok=?, up2k_utama_peserta=?,
          up2k_mandiri_kelompok=?, up2k_mandiri_peserta=?,
          usaha_mikro=?, toko_pkk=?,
          pra_koperasi_jumlah=?, pra_koperasi_anggota=?,
          koperasi_berbadan_hukum_jumlah=?, koperasi_berbadan_hukum_anggota=?
         WHERE nama_jorong=?`,
        [
          paket_a_kelompok || 0, paket_a_warga_belajar_a || 0, paket_a_warga_belajar_b || 0,
          paket_b_kelompok || 0, paket_b_warga_belajar_a || 0, paket_b_warga_belajar_b || 0,
          paket_c_kelompok || 0, paket_c_warga_belajar_a || 0, paket_c_warga_belajar_b || 0,
          taman_bacaan || 0, kelompok_pembaca || 0, rumah_dilan || 0, kampung_mandiri || 0,
          kader_khusus_keterampilan || 0, kader_khusus_koperasi || 0,
          up2k_pemula_kelompok || 0, up2k_pemula_peserta || 0,
          up2k_madya_kelompok || 0, up2k_madya_peserta || 0,
          up2k_utama_kelompok || 0, up2k_utama_peserta || 0,
          up2k_mandiri_kelompok || 0, up2k_mandiri_peserta || 0,
          usaha_mikro || 0, toko_pkk || 0,
          pra_koperasi_jumlah || 0, pra_koperasi_anggota || 0,
          koperasi_berbadan_hukum_jumlah || 0, koperasi_berbadan_hukum_anggota || 0,
          jorong
        ]
      );
    } else if (id == 3) {
      const {
        kader_pangan, kader_sandang, kader_tata_laksana_rt,
        makanan_pokok_beras, makanan_pokok_non_beras,
        pekarangan_hatinya_pkk_peternakan, pekarangan_hatinya_pkk_perikanan,
        pekarangan_hatinya_pkk_warung_hidup, pekarangan_hatinya_pkk_lumbung_hidup,
        pekarangan_hatinya_pkk_toga, pekarangan_hatinya_pkk_tanaman_keras,
        industri_rt_sandang, industri_rt_pangan, industri_rt_jasa,
        rumah_sehat, rumah_kurang_sehat, keterangan
      } = req.body;

      await db.query(
        `UPDATE pokja_3 SET 
          kader_pangan=?, kader_sandang=?, kader_tata_laksana_rt=?,
          makanan_pokok_beras=?, makanan_pokok_non_beras=?,
          pekarangan_hatinya_pkk_peternakan=?, pekarangan_hatinya_pkk_perikanan=?,
          pekarangan_hatinya_pkk_warung_hidup=?, pekarangan_hatinya_pkk_lumbung_hidup=?,
          pekarangan_hatinya_pkk_toga=?, pekarangan_hatinya_pkk_tanaman_keras=?,
          industri_rt_sandang=?, industri_rt_pangan=?, industri_rt_jasa=?,
          rumah_sehat=?, rumah_kurang_sehat=?, keterangan=?
         WHERE nama_jorong=?`,
        [
          kader_pangan || 0, kader_sandang || 0, kader_tata_laksana_rt || 0,
          makanan_pokok_beras || 0, makanan_pokok_non_beras || 0,
          pekarangan_hatinya_pkk_peternakan || 0, pekarangan_hatinya_pkk_perikanan || 0,
          pekarangan_hatinya_pkk_warung_hidup || 0, pekarangan_hatinya_pkk_lumbung_hidup || 0,
          pekarangan_hatinya_pkk_toga || 0, pekarangan_hatinya_pkk_tanaman_keras || 0,
          industri_rt_sandang || 0, industri_rt_pangan || 0, industri_rt_jasa || 0,
          rumah_sehat || 0, rumah_kurang_sehat || 0, keterangan || null,
          jorong
        ]
      );
    } else {
      const {
        jumlah_posyandu, posyandu_terintegrasi, lansia_kelompok, lansia_anggota,
        kader_posyandu, kader_kesling, kader_phbs, kader_narkoba, kader_kb,
        memiliki_kartu_jamban, memiliki_tempat_sampah, memiliki_spal,
        air_pdam, air_sumur, air_sungai, air_lain,
        pus, wus, kk_tabungan, aseptor_kb_p
      } = req.body;

      await db.query(
        `UPDATE pokja_4 SET 
          posyandu_total=?, posyandu_terintegrasi=?, lansia_kelompok=?, lansia_anggota=?,
          kader_kesehatan=?, kader_kesling=?, kader_phbs=?, kader_narkoba=?, kader_kb=?,
          jamban=?, tempat_sampah=?, spal=?,
          air_pdam=?, air_sumur=?, air_sungai=?, air_lain=?,
          pus=?, wus=?, kk_tabungan=?, warga_gratis=?
         WHERE nama_jorong=?`,
        [
          jumlah_posyandu || 0, posyandu_terintegrasi || 0, lansia_kelompok || 0, lansia_anggota || 0,
          kader_posyandu || 0, kader_kesling || 0, kader_phbs || 0, kader_narkoba || 0, kader_kb || 0,
          memiliki_kartu_jamban || 0, memiliki_tempat_sampah || 0, memiliki_spal || 0,
          air_pdam || 0, air_sumur || 0, air_sungai || 0, air_lain || 0,
          pus || 0, wus || 0, kk_tabungan || 0, aseptor_kb_p || 0,
          jorong
        ]
      );
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUmum = async (req, res) => {
  const { id } = req.params;
  const {
    jorong, jumlah_dasawisma, jumlah_krt, jumlah_kk, jiwa_l, jiwa_p,
    anggota_l, anggota_p, kader_umum_l, kader_umum_p, kader_khusus_l, kader_khusus_p,
    tenaga_honorer_l, tenaga_honorer_p, tenaga_bantuan_l, tenaga_bantuan_p, keterangan
  } = req.body;

  try {
    await db.query(
      `UPDATE data_umum_pkk SET 
        nama_jorong=?, jumlah_dasawisma=?, jumlah_krt=?, jumlah_kk=?, jiwa_l=?, jiwa_p=?,
        anggota_l=?, anggota_p=?, kader_umum_l=?, kader_umum_p=?, kader_khusus_l=?, kader_khusus_p=?,
        tenaga_honorer_l=?, tenaga_honorer_p=?, tenaga_bantuan_l=?, tenaga_bantuan_p=?, keterangan=?
       WHERE id=? OR nama_jorong=?`,
      [
        jorong,
        jumlah_dasawisma || 0, jumlah_krt || 0, jumlah_kk || 0, jiwa_l || 0, jiwa_p || 0,
        anggota_l || 0, anggota_p || 0, kader_umum_l || 0, kader_umum_p || 0,
        kader_khusus_l || 0, kader_khusus_p || 0, tenaga_honorer_l || 0, tenaga_honorer_p || 0,
        tenaga_bantuan_l || 0, tenaga_bantuan_p || 0, keterangan || null,
        id, jorong
      ]
    );
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUmum = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM data_umum_pkk WHERE id = ? OR nama_jorong = ?', [id, id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addPokja = async (req, res) => {
  const { id } = req.params;
  const { jorong } = req.body;
  try {
    let tableName = '';
    let jorongField = 'nama_jorong';
    if (id == 1) tableName = 'pokja_1';
    else if (id == 2) tableName = 'pokja_2';
    else if (id == 3) tableName = 'pokja_3';
    else if (id == 4) tableName = 'pokja_4';

    if (!tableName) return res.status(400).json({ message: 'Invalid Pokja ID' });

    // Check if jorong already exists
    const [existing] = await db.query(`SELECT * FROM ${tableName} WHERE ${jorongField} = ?`, [jorong]);
    if (existing.length > 0) {
      return res.status(400).json({ message: `Data Pokja untuk Jorong ${jorong} sudah ada.` });
    }

    const [result] = await db.query(
      `INSERT INTO ${tableName} (${jorongField}) VALUES (?)`,
      [jorong]
    );

    res.status(201).json({ id: result.insertId, jorong, nama_jorong: jorong });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deletePokja = async (req, res) => {
  const { id, record_id } = req.params;
  try {
    let tableName = '';
    if (id == 1) tableName = 'pokja_1';
    else if (id == 2) tableName = 'pokja_2';
    else if (id == 3) tableName = 'pokja_3';
    else if (id == 4) tableName = 'pokja_4';

    if (!tableName) return res.status(400).json({ message: 'Invalid Pokja ID' });

    await db.query(`DELETE FROM ${tableName} WHERE id = ?`, [record_id]);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

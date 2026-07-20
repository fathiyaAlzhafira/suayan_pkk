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
  const {
    jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb,
    balita_0_12_l_baru, balita_0_12_l_lama, balita_0_12_p_baru, balita_0_12_p_lama,
    balita_1_5_l_baru, balita_1_5_l_lama, balita_1_5_p_baru, balita_1_5_p_lama,
    wus_hadir, pus_hadir, bumil_hadir, busui_hadir,
    petugas_kader_l, petugas_kader_p, petugas_plkb_l, petugas_plkb_p, petugas_medis_l, petugas_medis_p,
    bayi_lahir_l, bayi_lahir_p, bayi_meninggal_l, bayi_meninggal_p, balita_meninggal,
    vit_a, pmt, bumil_tt, dpt_1, dpt_2, dpt_3, polio_1, polio_2, polio_3, polio_4, diare_oralit
  } = req.body;

  try {
    const [result] = await db.query(
      `INSERT INTO buku_posyandu (
        jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb,
        balita_0_12_l_baru, balita_0_12_l_lama, balita_0_12_p_baru, balita_0_12_p_lama,
        balita_1_5_l_baru, balita_1_5_l_lama, balita_1_5_p_baru, balita_1_5_p_lama,
        wus_hadir, pus_hadir, bumil_hadir, busui_hadir,
        petugas_kader_l, petugas_kader_p, petugas_plkb_l, petugas_plkb_p, petugas_medis_l, petugas_medis_p,
        bayi_lahir_l, bayi_lahir_p, bayi_meninggal_l, bayi_meninggal_p, balita_meninggal,
        vit_a, pmt, bumil_tt, dpt_1, dpt_2, dpt_3, polio_1, polio_2, polio_3, polio_4, diare_oralit
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        jorong, posyandu, pengunjung || 0, petugas || 0, bayi_lahir || 0, meninggal || 0, s || 0, k || 0, d || 0, n || 0, bcg || 0, dpt || 0, polio || 0, campak || 0, hepb || 0,
        balita_0_12_l_baru || 0, balita_0_12_l_lama || 0, balita_0_12_p_baru || 0, balita_0_12_p_lama || 0,
        balita_1_5_l_baru || 0, balita_1_5_l_lama || 0, balita_1_5_p_baru || 0, balita_1_5_p_lama || 0,
        wus_hadir || 0, pus_hadir || 0, bumil_hadir || 0, busui_hadir || 0,
        petugas_kader_l || 0, petugas_kader_p || 0, petugas_plkb_l || 0, petugas_plkb_p || 0, petugas_medis_l || 0, petugas_medis_p || 0,
        bayi_lahir_l || 0, bayi_lahir_p || 0, bayi_meninggal_l || 0, bayi_meninggal_p || 0, balita_meninggal || 0,
        vit_a || 0, pmt || 0, bumil_tt || 0, dpt_1 || 0, dpt_2 || 0, dpt_3 || 0, polio_1 || 0, polio_2 || 0, polio_3 || 0, polio_4 || 0, diare_oralit || 0
      ]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updatePosyandu = async (req, res) => {
  const { id } = req.params;
  const {
    jorong, posyandu, pengunjung, petugas, bayi_lahir, meninggal, s, k, d, n, bcg, dpt, polio, campak, hepb,
    balita_0_12_l_baru, balita_0_12_l_lama, balita_0_12_p_baru, balita_0_12_p_lama,
    balita_1_5_l_baru, balita_1_5_l_lama, balita_1_5_p_baru, balita_1_5_p_lama,
    wus_hadir, pus_hadir, bumil_hadir, busui_hadir,
    petugas_kader_l, petugas_kader_p, petugas_plkb_l, petugas_plkb_p, petugas_medis_l, petugas_medis_p,
    bayi_lahir_l, bayi_lahir_p, bayi_meninggal_l, bayi_meninggal_p, balita_meninggal,
    vit_a, pmt, bumil_tt, dpt_1, dpt_2, dpt_3, polio_1, polio_2, polio_3, polio_4, diare_oralit
  } = req.body;

  try {
    await db.query(
      `UPDATE buku_posyandu SET 
        jorong=?, posyandu=?, pengunjung=?, petugas=?, bayi_lahir=?, meninggal=?, s=?, k=?, d=?, n=?, bcg=?, dpt=?, polio=?, campak=?, hepb=?,
        balita_0_12_l_baru=?, balita_0_12_l_lama=?, balita_0_12_p_baru=?, balita_0_12_p_lama=?,
        balita_1_5_l_baru=?, balita_1_5_l_lama=?, balita_1_5_p_baru=?, balita_1_5_p_lama=?,
        wus_hadir=?, pus_hadir=?, bumil_hadir=?, busui_hadir=?,
        petugas_kader_l=?, petugas_kader_p=?, petugas_plkb_l=?, petugas_plkb_p=?, petugas_medis_l=?, petugas_medis_p=?,
        bayi_lahir_l=?, bayi_lahir_p=?, bayi_meninggal_l=?, bayi_meninggal_p=?, balita_meninggal=?,
        vit_a=?, pmt=?, bumil_tt=?, dpt_1=?, dpt_2=?, dpt_3=?, polio_1=?, polio_2=?, polio_3=?, polio_4=?, diare_oralit=?
       WHERE id=?`,
      [
        jorong, posyandu, pengunjung || 0, petugas || 0, bayi_lahir || 0, meninggal || 0, s || 0, k || 0, d || 0, n || 0, bcg || 0, dpt || 0, polio || 0, campak || 0, hepb || 0,
        balita_0_12_l_baru || 0, balita_0_12_l_lama || 0, balita_0_12_p_baru || 0, balita_0_12_p_lama || 0,
        balita_1_5_l_baru || 0, balita_1_5_l_lama || 0, balita_1_5_p_baru || 0, balita_1_5_p_lama || 0,
        wus_hadir || 0, pus_hadir || 0, bumil_hadir || 0, busui_hadir || 0,
        petugas_kader_l || 0, petugas_kader_p || 0, petugas_plkb_l || 0, petugas_plkb_p || 0, petugas_medis_l || 0, petugas_medis_p || 0,
        bayi_lahir_l || 0, bayi_lahir_p || 0, bayi_meninggal_l || 0, bayi_meninggal_p || 0, balita_meninggal || 0,
        vit_a || 0, pmt || 0, bumil_tt || 0, dpt_1 || 0, dpt_2 || 0, dpt_3 || 0, polio_1 || 0, polio_2 || 0, polio_3 || 0, polio_4 || 0, diare_oralit || 0,
        id
      ]
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

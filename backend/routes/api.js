const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');

// Auth routes
router.post('/auth/login', apiController.login);

// Jorong routes
router.get('/jorong', apiController.getJorong);

// Keluarga routes
router.get('/keluarga', apiController.getKeluarga);
router.post('/keluarga', apiController.addKeluarga);
router.put('/keluarga/:no_kk', apiController.updateKeluarga);
router.delete('/keluarga/:no_kk', apiController.deleteKeluarga);

// Warga routes (Mapped also to anggota for backward compatibility)
router.get('/warga', apiController.getWarga);
router.post('/warga', apiController.addWarga);
router.put('/warga/:nik', apiController.updateWarga);
router.delete('/warga/:nik', apiController.deleteWarga);

router.get('/anggota', apiController.getWarga);
router.post('/anggota', apiController.addWarga);
router.put('/anggota/:nik', apiController.updateWarga);
router.delete('/anggota/:nik', apiController.deleteWarga);

// Program Kerja routes
router.get('/proker', apiController.getProker);
router.post('/proker', apiController.addProker);
router.put('/proker/:id', apiController.updateProker);
router.delete('/proker/:id', apiController.deleteProker);

// Struktur Organisasi routes
router.get('/organisasi', apiController.getOrganisasi);
router.post('/organisasi', apiController.addOrganisasi);
router.put('/organisasi/:id', apiController.updateOrganisasi);
router.delete('/organisasi/:id', apiController.deleteOrganisasi);

// Kegiatan routes
router.get('/kegiatan', apiController.getKegiatan);
router.post('/kegiatan', apiController.addKegiatan);
router.put('/kegiatan/:id', apiController.updateKegiatan);
router.delete('/kegiatan/:id', apiController.deleteKegiatan);

// Keuangan routes
router.get('/keuangan', apiController.getKeuangan);
router.post('/keuangan', apiController.addKeuangan);
router.put('/keuangan/:id', apiController.updateKeuangan);
router.delete('/keuangan/:id', apiController.deleteKeuangan);

// Ekspedisi routes
router.get('/ekspedisi', apiController.getEkspedisi);
router.post('/ekspedisi', apiController.addEkspedisi);
router.put('/ekspedisi/:id', apiController.updateEkspedisi);
router.delete('/ekspedisi/:id', apiController.deleteEkspedisi);

// Inventaris routes
router.get('/inventaris', apiController.getInventaris);
router.post('/inventaris', apiController.addInventaris);
router.put('/inventaris/:id', apiController.updateInventaris);
router.delete('/inventaris/:id', apiController.deleteInventaris);

// Posyandu routes
router.get('/posyandu', apiController.getPosyandu);
router.post('/posyandu', apiController.addPosyandu);
router.put('/posyandu/:id', apiController.updatePosyandu);
router.delete('/posyandu/:id', apiController.deletePosyandu);

// Pokja & Umum stats (Aggregated dynamically on backend)
router.get('/pokja/:id', apiController.getPokja);
router.put('/pokja/:id/:jorong', apiController.updatePokja);
router.get('/umum', apiController.getUmum);
router.put('/umum/:jorong', apiController.updateUmum);

module.exports = router;

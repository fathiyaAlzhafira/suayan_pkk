const express = require('express');
const router = express.Router();
const keluargaCont = require('../controllers/KeluargaCont');

router.get('/keluarga', keluargaCont.getKeluarga);
router.post('/keluarga', keluargaCont.addKeluarga);
router.put('/keluarga/:no_kk', keluargaCont.updateKeluarga);
router.get('/keluarga/:no_kk/pekarangan', keluargaCont.getPekaranganByKK);
router.get('/keluarga/:no_kk/industri', keluargaCont.getIndustriByKK);
router.get('/keluarga/:no_kk/warga', keluargaCont.getWargaByKK);

module.exports = router;

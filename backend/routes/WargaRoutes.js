const express = require('express');
const router = express.Router();
const wargaCont = require('../controllers/WargaCont');

router.get('/jorong', wargaCont.getJorong);
router.get('/warga', wargaCont.getWarga);
router.post('/warga', wargaCont.addWarga);
router.put('/warga/:nik', wargaCont.updateWarga);
router.delete('/warga/:nik', wargaCont.deleteWarga);

router.get('/anggota', wargaCont.getWarga);
router.post('/anggota', wargaCont.addWarga);
router.put('/anggota/:nik', wargaCont.updateWarga);
router.post('/warga/verify', wargaCont.verifyKeluarga);
router.post('/warga/submit-mandiri', wargaCont.submitMandiriKeluargaWarga);

module.exports = router;

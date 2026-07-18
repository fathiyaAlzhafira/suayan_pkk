const express = require('express');
const router = express.Router();
const keluargaCont = require('../controllers/KeluargaCont');

router.get('/keluarga', keluargaCont.getKeluarga);
router.post('/keluarga', keluargaCont.addKeluarga);
router.put('/keluarga/:no_kk', keluargaCont.updateKeluarga);
router.delete('/keluarga/:no_kk', keluargaCont.deleteKeluarga);

module.exports = router;

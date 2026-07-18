const express = require('express');
const router = express.Router();
const kegiatanCont = require('../controllers/KegiatanCont');

router.get('/kegiatan', kegiatanCont.getKegiatan);
router.post('/kegiatan', kegiatanCont.addKegiatan);
router.put('/kegiatan/:id', kegiatanCont.updateKegiatan);
router.delete('/kegiatan/:id', kegiatanCont.deleteKegiatan);

module.exports = router;

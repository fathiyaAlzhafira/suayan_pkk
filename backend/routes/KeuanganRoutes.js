const express = require('express');
const router = express.Router();
const keuanganCont = require('../controllers/KeuanganCont');

router.get('/keuangan', keuanganCont.getKeuangan);
router.post('/keuangan', keuanganCont.addKeuangan);
router.put('/keuangan/:id', keuanganCont.updateKeuangan);
router.delete('/keuangan/:id', keuanganCont.deleteKeuangan);

module.exports = router;

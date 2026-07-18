const express = require('express');
const router = express.Router();
const ekspedisiCont = require('../controllers/EkspedisiCont');

router.get('/ekspedisi', ekspedisiCont.getEkspedisi);
router.post('/ekspedisi', ekspedisiCont.addEkspedisi);
router.put('/ekspedisi/:id', ekspedisiCont.updateEkspedisi);
router.delete('/ekspedisi/:id', ekspedisiCont.deleteEkspedisi);

module.exports = router;

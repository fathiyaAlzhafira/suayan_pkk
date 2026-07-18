const express = require('express');
const router = express.Router();
const posyanduCont = require('../controllers/PosyanduCont');

router.get('/posyandu', posyanduCont.getPosyandu);
router.post('/posyandu', posyanduCont.addPosyandu);
router.put('/posyandu/:id', posyanduCont.updatePosyandu);
router.delete('/posyandu/:id', posyanduCont.deletePosyandu);

module.exports = router;

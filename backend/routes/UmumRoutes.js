const express = require('express');
const router = express.Router();
const umumCont = require('../controllers/UmumCont');

router.get('/pokja/:id', umumCont.getPokja);
router.put('/pokja/:id/:jorong', umumCont.updatePokja);
router.get('/umum', umumCont.getUmum);
router.put('/umum/:jorong', umumCont.updateUmum);

module.exports = router;

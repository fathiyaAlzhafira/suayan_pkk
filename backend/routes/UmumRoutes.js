const express = require('express');
const router = express.Router();
const umumCont = require('../controllers/UmumCont');

router.get('/pokja/:id', umumCont.getPokja);
router.post('/pokja/:id', umumCont.addPokja);
router.put('/pokja/:id/:jorong', umumCont.updatePokja);
router.delete('/pokja/:id/:record_id', umumCont.deletePokja);
router.get('/umum', umumCont.getUmum);
router.post('/umum', umumCont.addUmum);
router.put('/umum/:id', umumCont.updateUmum);
router.delete('/umum/:id', umumCont.deleteUmum);

module.exports = router;

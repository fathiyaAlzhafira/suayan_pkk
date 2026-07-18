const express = require('express');
const router = express.Router();
const pokjaCont = require('../controllers/PokjaCont');

router.get('/proker', pokjaCont.getProker);
router.post('/proker', pokjaCont.addProker);
router.put('/proker/:id', pokjaCont.updateProker);
router.delete('/proker/:id', pokjaCont.deleteProker);

module.exports = router;

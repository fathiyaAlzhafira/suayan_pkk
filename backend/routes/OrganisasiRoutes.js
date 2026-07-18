const express = require('express');
const router = express.Router();
const organisasiCont = require('../controllers/OrganisasiCont');

router.get('/organisasi', organisasiCont.getOrganisasi);
router.post('/organisasi', organisasiCont.addOrganisasi);
router.put('/organisasi/:id', organisasiCont.updateOrganisasi);
router.delete('/organisasi/:id', organisasiCont.deleteOrganisasi);

module.exports = router;

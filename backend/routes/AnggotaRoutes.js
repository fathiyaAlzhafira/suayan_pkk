const express = require('express');
const router = express.Router();
const anggotaCont = require('../controllers/AnggotaCont');

router.get('/buku-anggota', anggotaCont.getAnggota);
router.post('/buku-anggota', anggotaCont.addAnggota);
router.put('/buku-anggota/:id', anggotaCont.updateAnggota);
router.delete('/buku-anggota/:id', anggotaCont.deleteAnggota);

// Alias routes
router.get('/anggota', anggotaCont.getAnggota);
router.post('/anggota', anggotaCont.addAnggota);
router.put('/anggota/:id', anggotaCont.updateAnggota);
router.delete('/anggota/:id', anggotaCont.deleteAnggota);

module.exports = router;

const express = require('express');
const router = express.Router();

const authRoutes = require('./AuthRoutes');
const wargaRoutes = require('./WargaRoutes');
const keluargaRoutes = require('./KeluargaRoutes');
const posyanduRoutes = require('./PosyanduRoutes');
const pokjaRoutes = require('./PokjaRoutes');
const organisasiRoutes = require('./OrganisasiRoutes');
const keuanganRoutes = require('./KeuanganRoutes');
const kegiatanRoutes = require('./KegiatanRoutes');
const inventarisRoutes = require('./InventarisRoutes');
const ekspedisiRoutes = require('./EkspedisiRoutes');
const anggotaRoutes = require('./AnggotaRoutes');
const umumRoutes = require('./UmumRoutes');

router.use('/auth', authRoutes);
router.use('/', wargaRoutes);
router.use('/', keluargaRoutes);
router.use('/', posyanduRoutes);
router.use('/', pokjaRoutes);
router.use('/', organisasiRoutes);
router.use('/', keuanganRoutes);
router.use('/', kegiatanRoutes);
router.use('/', inventarisRoutes);
router.use('/', ekspedisiRoutes);
router.use('/', anggotaRoutes);
router.use('/', umumRoutes);

module.exports = router;

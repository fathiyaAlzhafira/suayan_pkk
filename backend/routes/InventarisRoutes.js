const express = require('express');
const router = express.Router();
const inventarisCont = require('../controllers/InventarisCont');

router.get('/inventaris', inventarisCont.getInventaris);
router.post('/inventaris', inventarisCont.addInventaris);
router.put('/inventaris/:id', inventarisCont.updateInventaris);
router.delete('/inventaris/:id', inventarisCont.deleteInventaris);

module.exports = router;

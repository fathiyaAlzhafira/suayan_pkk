const express = require('express');
const router = express.Router();
const authCont = require('../controllers/AuthCont');

router.post('/login', authCont.login);

module.exports = router;

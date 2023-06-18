const express = require('express');
const router = express.Router();
const forgotC = require('../controllers/forgotC')

router.post('/forgotPassword',forgotC.forgotPassword);

module.exports = router;
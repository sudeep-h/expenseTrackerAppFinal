const express = require('express');
const router = express.Router();
const forgotC = require('../controllers/forgotC')

router.post('/forgotPassword',forgotC.forgotPassword);
router.get('/reset-password/:id',forgotC.resetPassword);
router.get('/update-password/:id',forgotC.updatePassword);

module.exports = router;
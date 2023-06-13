const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authorisation');
const purchaseController = require('../controllers/purchaseC');
const premiumController = require('../controllers/premiumC')

router.get('/premiumMembership',userAuth.authenticate,purchaseController.purchasePremium);
router.post('/transactionStatus',userAuth.authenticate,purchaseController.updateTransactionStatus);
router.get('/leaderboard',userAuth.authenticate,premiumController.getPremiumUsers)

module.exports = router;

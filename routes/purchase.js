const express = require('express');
const router = express.Router();
const userAuth = require('../middleware/authorisation');
const purchaseController = require('../controllers/purchaseC');

router.get('/premiumMembership',userAuth.authenticate,purchaseController.purchasePremium);
router.post('/transactionStatus',userAuth.authenticate,purchaseController.updateTransactionStatus);

module.exports = router;

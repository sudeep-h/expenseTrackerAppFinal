const express = require('express');
const router = express.Router();
const expenseController =require('../controllers/expenseC');
const userAuth = require('../middleware/authorisation');

router.post('/postExpense',userAuth.authenticate, expenseController.addExpense)
router.get('/getExpense', userAuth.authenticate,expenseController.getExpense)
router.delete('/deleteExpense/:id', userAuth.authenticate, expenseController.deleteExpense)

module.exports = router;
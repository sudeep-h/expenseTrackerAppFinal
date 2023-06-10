const express = require('express');
const router = express.Router();
const expenseC =require('../controllers/expenseC');


router.get('/getExpense', expenseC.getExpense)
router.post('/postExpense', expenseC.insertExpense)
router.delete('/deleteExpense/:id', expenseC.deleteExpense)

module.exports = router;
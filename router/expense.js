

const expenseController=require('../controllers/expense');
const Expense=require('../models/expense');
const authenticate=require('../middleware/auth')
const express=require('express');
const router=express.Router();



router.get(`/getAllExpense`,authenticate,expenseController.getAllExpense)

router.post('/postexpense',authenticate,expenseController.postExpense);

router.post('/deleteExpense',authenticate,expenseController.deleteExpense)
module.exports=router;
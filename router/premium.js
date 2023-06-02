const express=require('express');
const router=express.Router();

const premiumController=require('../controllers/premium');
const authenticate=require('../middleware/auth');


router.get('/downloadexpense',authenticate,premiumController.downloadExpense)
router.get('/showLeaderBoard',premiumController.showLeaderBoard);

module.exports=router;

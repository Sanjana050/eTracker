const jwt=require('jsonwebtoken');
const User=require('../models/user');
const mongodb=require('mongodb')
const { getdb } = require('../util/database');

const securityKey='secret'

const authenticate=async(req,res,next)=>{
    try{
        // const db = getdb();
        // const email=req.body.email;
        
 console.log("In authenticate")
 console.log("REQUEST",req.body,"REQUEST ENDS")
console.log(req.headers.token);
const token=req.headers.token;

if (!token) {
    return res.status(401).json({ success: false, message: 'Authentication token missing' });
  }
  else
console.log(token,"TOKEN");

const user=jwt.verify(token,securityKey);
console.log(user,'line 25');
const ouruser=await User.findById(user.id);

if(ouruser){
    console.log(ouruser,"22")

}
else{
    console.log('error in line 27')
}


console.log('user>>>',ouruser._id,'NEHA');
req.user=ouruser;
   // req.expenseId=req.body.expenseId;



    console.log("NEHA")
    console.log(user)
   // console.log("user id",req.user.id)
    console.log("NEHA")
    // console.log(req.user.dataValues.isPremiumUser,"premiumUser from Data")
    // console.log(req.user.dataValues.email,"email now")
     next();


    }
    catch(err)
    {
console.log(err);
return res.status(400).json({success:"false"})
    }
}

module.exports=authenticate;
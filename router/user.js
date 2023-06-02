const express=require('express');
const router=express.Router();
const path=require('path');
const userController=require('../controllers/user')
const User=require('../models/user');
const  authenticate  = require('../middleware/auth');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken');
const securityKey='secret';
const razorpay = require('razorpay');
const Order=require('../models/orders')


function generateAccessKeytoken(id,isPremiumUser){
  const token=jwt.sign({id:id,isPremiumUser},securityKey);
  const verifyT=jwt.verify(token,securityKey);
  console.log('in line 15',token,verifyT)
    return jwt.sign({id:id,isPremiumUser},securityKey)
    }


router.get('/getsignup',userController.getSignUp);

router.post('/postsignup',userController.postSignUp);

router.get('/getlogin',userController.getLogin);

router.post('/postlogin',async(req,res,next)=>{
    console.log(req.body,'line24');
    const email=req.body.email;
    const password=req.body.password;
    console.log('line 27')
   const user=await User.findOne(email)
   if(user)
   {
console.log(user,"nehaa",user._id,'line 29');
bcrypt.compare(password, user.password, async(err, result) => {
            if (err) {
              console.log(err,"neha");
             res.status(401).json({ message: "User not found" });
              
            } else {
              console.log('line 38')
              console.log(user._id.toString(),user.isPremiumUser)
               res.status(200).json({ message: "Login successful",userId:generateAccessKeytoken(user._id.toString(),user.isPremiumUser)});
              
            }
          });
        } 

        else{
       
          console.log("neha",'line 47');
           res.status(500).json({ message: "Internal server error" ,err:err});
        }
        
      
    // console.log(result,'line 29')
    // console.log('line 31')
    
   })

   router.get('/postlogintoken',(req,res,next)=>{
    console.log(req.headers.token,'in line65');
    const user1=jwt.verify(req.headers.token,securityKey);
    res.status(200).json({"isPremiumUser":user1.isPremiumUser});
  })
  

//  router.get('/postpremium',authenticate,userController.postPremiumMembership);


router.get('/postpremium',async(req,res,next)=>{
  try{
  console.log(req.headers.token)

  console.log('before error')
const token=req.headers.token;
      const decodedToken = jwt.verify(token, securityKey);
      
      console.log(decodedToken,"decoded")
      const userId = decodedToken.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
    console.log('before error 2')
    console.log(user,'in line 85')
let order_id;
    const order2=new Order(decodedToken.id.toString(),null,"pending")
await order2.save().then((res)=>{
  console.log(res,'int line 92')
  order_id=res.insertedId.toString();;
  console.log('order created,line 91');
}).catch(err=>{
  console.log(err)
})
var rzp=new razorpay({
  key_id:'rzp_test_eRZn0TsQicWQW2',
  key_secret:'9PcDrIS3yCjdSTbYWJg5JUq3'
})
console.log(rzp);

console.log('after rzp')
const amount=1000;
let order1;
const order= await new Promise((resolve, reject) => {
  rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
    if (err) {
      console.log(err);
      reject(err);
    } else {
      console.log(order, 'line 101');
      resolve(order);
     
    }
  });
});

if(order)
{
  res.status(200).json({order,key_id:rzp.key_id,userId,orderid:order_id})

}
else
{
  res.status(500).json({success:"false",message:"payment failed"})
}

console.log(order,'int line 107')

    }



    catch(err){
console.log(err);
res.status(400).json({message:'error occured',err:err})
    }
  

}); 








router.post('/updatetransactionstatus',authenticate,async(req,res,next)=>{
  try{
    const {orderid,payment_id,order_id}=req.body;
    
    console.log(req.body,'---->this is req.body from user.js post Tranx')
    console.log(req.user,req.user._id,"in 156")
    // const order=await Order.findOne({where:{orderId:order_id}})
  
     
          const promise1=  await   Order.updateOne(orderid,payment_id,"successfull",order_id).then((response)=>{//neha here
            console.log("neha in 116",response)
            
          }).catch((err)=>{
            console.log('before error 3')
            console.log(err);
          })

       const promise2= User.updateOnePremium(req.user._id.toString()).then((user)=>{
        console.log(user)
       }).catch(err=>{
        console.log(err)
       })
Promise.all([promise1,promise2]).then(()=>{
res.status(200).json({success:"true",message:"transaction status updated"});
}).catch((err)=>{
console.log(err);
res.json({message:'error occured',err:err})
})
          
}
  catch( err)
  {
    console.log(err);
     postFailedStatus(req.body.payment_id, req.body.order_id);
    res.status(401).json({message:'something went wrong',err:err})
  }
})
//router.post('/postFailedStatus',userController.postFailedStatus)


router.get('/isPremiumUser',authenticate,userController.isPremiumUser)
router.get('/',(req,res,next)=>{
 res.sendFile(path.join(__dirname,'../','views','welcomepage.html'));
})


module.exports=router;

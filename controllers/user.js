const path=require('path');
const User=require('../models/user')
const bcrypt=require('bcrypt')
const saltRounds=10;
const jwt=require('jsonwebtoken')
const razorpay=require('razorpay')
 const  Order=require('../models/orders')





const secret ='securityKey';

function generateAccessKeytoken(id,isPremiumUser){
return jwt.sign({userId:id,isPremiumUser},'securityKey')
}

exports.getSignUp=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','signuppage.html'))
}

exports.getLogin=(req,res,next)=>{
    res.sendFile(path.join(__dirname,'../','views','loginpage.html'));

}


exports.isPremiumUser=async (req,res,next)=>{
  const id=req.user._id;
  console.log("line 31 in user.js")
await User.findById(id).then((response)=>{
    console.log(response,"in 33")
   if(response.isPremiumUser===true)
   {
    console.log("line 34","premium",response)
    res.status(200).json({message:"premium user",response:response})
   }
   else{
    console.log("line 38","not pre")
    res.status(500).json({message:"not a premium user",response:response})
   }
}).catch(err=>{
  console.log(err)
  res.status(500).json({success:false,err:err})
})
}
exports.postSignUp = async(req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phone = req.body.phone;
  
    console.log(name,email,password,phone)
    console.log('in 33 postSignup')
    
  
    const user=await User.findOne(email);
    if(user){
      console.log(result);
      res.status(401).json({message:"user already exists"})

    }
    else{
      bcrypt.hash(password, saltRounds, async (err, hash) => {
        try {
          const user = new User(name, email, hash, phone);
         await user.save()
            .then(result => {
              console.log(result);
              console.log('user added');
      
              res.status(200).json({ message: "user added successfully", userId: result.insertedId });
            })
            .catch(err => {
              console.log(err);
              res.status(500).json({ message: "user cannot be added, error occurred", error: err });
            });
        } catch (err) {
          console.log(err);
          res.status(500).json({ message: "user cannot be added, error occurred", error: err });
        }
      });

    
    }
        
          
         

          
          
        
      
  
      
  

exports.postLoginToken=(req,res,next)=>{
 
console.log(req.user.isPremiumUser,"from exports .post loginToken");
 res.json({"isPremiumUser":req.user.isPremiumUser});


}
exports.postPremiumMembership = async (req, res, next) => {
  try {
    const token = req.headers.token;
    console.log("token:", token);
    if (!token) {
      throw new Error('Authentication failed. No token provided.');
    }

    console.log('before error');
    const decodedToken = jwt.verify(token, secret);
    console.log(decodedToken, "decoded");
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

  const ordercreate=await Order.save(decoded.id,null,"pending");

    console.log('before rzp');



    const rzp = new razorpay({
      key_id: 'rzp_test_eRZn0TsQicWQW2',
      key_secret: '9PcDrIS3yCjdSTbYWJg5JUq3'
    });
    console.log(rzp);

    console.log('after rzp');
    const amount = 1000;
    const order = await new Promise((resolve, reject) => {
      rzp.orders.create({ amount, currency: 'INR' }, (err, order) => {
        if (err) {
          console.log(err);
          reject(err);
        } else {
          console.log('Order created:', order.id);
          resolve(order);
        }
      });
    });

    console.log(user, 'after rzp');
    
    console.log('in line 124');
    return res.status(200).json({ order, key_id: rzp.key_id, userId });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: 'Error occurred', error: err });
  }
};

  

  exports.postTransactionStatus= async (req,res,next)=>{
    try{
      const {payment_id,order_id}=req.body;
      
      console.log(req.body,'---->this is req.body from user.js post Tranx')
      // const order=await Order.findOne({where:{orderId:order_id}})
    
       
     const promise1= await Order.updateOne(order_id,payment_id,"Successful").then((res)=>{
      console.log("promise 1 done")
     }).catch(err=>{
      console.log("error in 151 promise 1",err)
     });

       const promise2= await User.updateOnePremium(req.user.id).then((user)=>{
        console.log("Neha in 151")
        console.log(user)
       }).catch(err=>{
        console.log("err in 158",err)
       })

Promise.all([promise1,promise2]).then(async()=>{
  await User.updateOnePremium(req.user.id).then((user)=>{
    console.log("user updated in 156")
  }).catch(err=>{
    console.log(err)
  })
  res.status(200).json({success:"true",message:"transaction status updated"});
}).catch((err)=>{
  console.log(err,"in line 160");
  res.json({message:'error occured',err:err})
})
            
}
    catch(err)
    {
      console.log(err);
      await postFailedStatus(req.body.payment_id, req.body.order_id);
      res.status(401).json({message:'something went wrong',err:err})
    }
  }


exports.postFailedStatus=async (req,res,next)=>{
try{
const {payment_id,order_id}=req.body;
console.log('this is from post payment status failed');
const order=await Order.findByPk(order_id);
if(!order)
{
  console.log(order);
  return res.status(400).json({message:"order not found"})
}
const updatedOrder=await order.update({
  paymentId:payment_id,
  status:"Failed"
  

})
res.status(200).json({ success: true, message: "transaction status updated" });

}
catch{
  console.log(err);
    res.status(401).json({ message: 'something went wrong', err: err })

}
  }
}


  
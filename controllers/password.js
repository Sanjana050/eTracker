const Sib = require('sib-api-v3-sdk');
require('dotenv').config();
const bcrypt=require('bcrypt');
const saltRounds=100;
const path=require('path')

const API_K = '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';
const User=require('../models/user')
const forgotPass=require('../models/forgotpass')

const uuid=require('uuid')



exports.forgotpassword = async (req, res, next) => {
  try {

    const client = Sib.ApiClient.instance;
const apiKey = client.authentications['api-key'];
apiKey.apiKey = API_K;
console.log(apiKey.apiKey)

    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const email_id = req.body.email_id;
    let id;
    console.log("NEHAAAA in id")
    const user= await User.findEmail(email_id)
    if(user){
   console.log("inside i")
     id=uuid.v4();
     let uid;
      const userId= await User.findEmail(email_id).then((res)=>{
        console.log(res);
        uid=res._id;
        console.log(res._id,"in 33");
      })

    console.log(uid,"in 38");
     const forgotPas=new forgotPass("true",uid,email_id,id);
     
   await  forgotPas.save().then((res)=>{
    console.log(res,"done")
   }).catch(err=>{
    console.log(err)
   })
   console.log("in 33")
   
    // user.createForgotPassword({id,active:true}).catch((err)=>{
      console.log(email_id);


    const sender = {
      email: 'sanjanamondal711@gmail.com',
      name: 'Sanjana',
    };

    const receivers = [
      {
        email: email_id,
      },
    ];

    const response = await tranEmailApi.sendTransacEmail({
      sender,
      to: receivers,
      subject: 'Password reset mail',
      textContent: `
          Please reset your password.`,

      htmlContent: `
          <h1>Expense Tracker</h1>
          <a href="http://localhost:3000/resetpassword/${id}">Reset password</a>
      `,

    });
   if(response){
    console.log(sender, "NEHA", receivers);
    res.status(200).json({ message: 'Email sent successfully' });
   }
   else{
    console.log("NEHAAAA cannot send")
   }
  } 
  else
  {
    console.log("USER NOT FOUND")
  }
}
catch (err) {
    console.log(err);
    console.log("NEHAAA")
    res.status(500).json({ error: 'Internal server error' });
  }
}




exports.resetPassword=async (req,res,next)=>{
  const id=req.params.id;
  console.log("101 in",id)
  const user=await forgotPass.findByPassId(id);
  if(user)
  {
    
res.status(200).send(`<html>
<form action='/updatePass/${id}' method="GET">
<label for="newPass">Enter your new Password
<input type="password" name="newPass" id="newPass" required>
<button type="submit">Reset Password</button>
</form>
</html>`)
  }
  else{
      res.status(200).json({"message":"no request send for resetting password"})
  }
}
exports.updatePass = async (req, res, next) => {
  try {
    console.log('in updatePass');
    const pass = req.query.newPass;
    let id = req.params.id;

    console.log(id, "id in update");
    console.log(pass, id, "NEHAAAA in updatePsass");

    id = req.params.id.replace(/\\+$/, '');
    console.log(id,"in 128")
    let userId;
    const forPass = await forgotPass.findByPassId(id);
    userId = forPass.userId;

    console.log(userId, "forPass");
    const user = await User.findById(userId.toString())
    console.log("NEHAAA user", user);

    if (user) {
      const saltRounds = 10;
      bcrypt.genSalt(saltRounds, function(err, salt) {
          if(err){
              console.log(err);
              throw new Error(err);
          }
          bcrypt.hash(pass, salt, function(err, hash) {
              // Store hash in your password DB.
              if(err){
                  console.log(err);
                  throw new Error(err);
              }
              User.updateOnePass(hash,userId).then(() => {
                 // res.status(201).json({message: 'Successfuly update the new password'})
                 res.status(201).sendFile(path.join(__dirname,'../','views','loginpage.html'))
              })
          });
      });
} else{
  return res.status(404).json({ error: 'No user Exists', success: false})
}


  }
  catch (err) {
    console.log(err);
  }
}

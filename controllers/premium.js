const User=require('../models/user');
const Expense=require('../models/expense');


const fs=require('fs');
const AWS=require('aws-sdk')

exports.showLeaderBoard= async(req,res,next)=>{
try{
console.log('before leaderboard>>>>>>>>>>>>>>>>');
let resarray;
const leaderBoardArray = await User.find().then(async(res)=>{

  
  res = await  res.sort((a, b) => b.totalExpense - a.totalExpense);


    

    resarray=res;
    console.log("before res",res,"after res")


  
 
  
}).catch(err=>{
  console.log(err)
})

  

console.log('after leaderboard<<<<<<<<<<<<<<<<<<<<<<<<<<')

console.log("users neha",resarray)


res.status(200).json(resarray)
}
catch(err){
console.log(err);
}
}

 function uploadToS3(data,fileName){
  const BUCKET_NAME='expensetrackerapp12345';
  const IAM_USER_KEY='AKIA6AZI7BT3BSFZU66E';
  const IAM_USER_SECRET='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';
  
let s3bucket=new AWS.S3({
  accessKeyId:IAM_USER_KEY,
  secretAccessKey:IAM_USER_SECRET,
  
})

var params={
  Bucket:BUCKET_NAME,
  Key:`${fileName}`,
  Body:data,
  ACL:'public-read'
}
return new Promise((resolve,reject)=>{
  s3bucket.upload(params,(err,s3response)=>{
    if(err)
    {
      console.log("NJjjdnw",err);
      reject(err);
    }
    else{
      console.log('success',s3response)
      resolve(s3response.Location);
      }
  });
  
})
 

}
exports.downloadExpense=async(req,res,next)=>{
  try{
  if(req.user.isPremiumUser===false)
  {
    res.status(500).json({"message":"not a premium user"});
  }
  console.log("NeHA",req.user);
  
  console.log(req.user.id,"in 87",req.user)
  const expenses=await Expense.findAll(req.user._id.toString());
  
    
  console.log(expenses);
  const stringexpense=JSON.stringify(expenses);
  const userId=req.user.id;
  const fileName=`Expense${userId}/${new Date()}.txt`;
  const fileUrl=await uploadToS3(stringexpense,fileName);
  res.status(200).json({fileUrl,'success':true})
}
catch(err){
  console.log(err);
  res.status(500).json({fileUrl:'',success:false,'err':err})
}

    
   

}

    
 
  



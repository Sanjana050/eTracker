const Sequelize=require('sequelize');
const sequelize=require('../util/database');
const Expense=require('../models/expense');

const jwt = require('jsonwebtoken');
const User=require('../models/user')
const mongodb=require('mongodb')




const secret='secret'


// decode the token to get the encrypted id

exports.getAllExpense=(req,res,next)=>{
console.log("line 18 in expense load")
  const page=req.query.page || 1;
  const itemsperpage=10;
  const offset=(page-1)*itemsperpage
console.log(req.user,'in line 16');
const id=req.user._id.toString();
Expense.count(id).then((total)=>{
  const total_itmes=total;
  return Expense.find().skip(offset).limit(10).then((expenses) => {
    res.json({
      expenses:expenses,
      currpage:page,
      hasnextpage:itemsperpage*page<total_itmes,
      nextpage:page+1,
      haspreviouspage:page>1,
      prebiouspage:page-1,
      lastPage:Math.ceil(total_itmes.itemsperpage)
    })

  }).catch((error) => {
    console.log(error);
  });
  
    
}).catch((err)=>{
    res.json('cannot get expense')
})

    
}




exports.postExpense = async (req, res, next) => {
  
  
    try {

      console.log('in postExpense');
      console.log(req.user,'in line 29')
      //const t = await sequelize.transaction();
      const userId=new mongodb.ObjectId(req.user._id);
      console.log(userId)
      const token = req.headers.token;
      const decoded = jwt.verify(token, secret);
      console.log(decoded,'line 36')
      const amount = req.body.amount;
      const description = req.body.description;
      const category = req.body.category;
      const email=req.body.email;
      console.log(email);
    let expenseId;
    
      console.log(amount, description, category, userId, 'jchjefcj');
    
      console.log('SANJANANANAN');
      const expense = new Expense(amount,description,category, decoded.id)
      console.log('neha in line 53')

    await expense.save().then((response)=>{
console.log(response)
expenseId=response.insertedId.toString();
console.log(expenseId,'this is expense id in 58');
      }).catch((err)=>{
console.log(err)
      });
      


console.log('in line 61')
      const totalExpense = Number(amount) + Number(req.user.totalExpense);

      console.log(expenseId,totalExpense)
      await User.updateOne(totalExpense,userId.toString()).then((user)=>{
        console.log(user)
      }).catch(err=>{
          console.log(err)
        })
      
     
     
        console.log('in line 73')
     
      
      res.status(200).json({
        message: 'expense added',
        id: expenseId,
        token: token,
        decoded: decoded
      });
  
    } catch (error) {
      // await t.rollback();
      console.log(error);
      res.status(500).json({
        message: "expense could not be added",
        error: error
      });
      console.log(error)
    }
  };
  

exports.getAllExpense=(req,res,next)=>{
    const token = req.headers.token;
const id=req.user._id;
    console.log('in getAllExpense backend',token)
    const decoded = jwt.verify(token, secret);
    
    console.log('\n',decoded.id,'decoded',id)
    Expense.findAll(decoded.id).then(expense=>{
    console.log(expense,'107')
        res.json({expense:expense,id:decoded.userId})
    }).catch((err)=>{
        res.json('cannot get expense')
    })
}

exports.deleteExpense=async(req,res,next)=>{
  try{
  
   console.log(req.body,'117');
    const userid=req.user._id;
    const expenseId=req.body.expenseId;

    console.log(userid.toString(),expenseId,'in 121')
    //const t=await sequelize.transaction();
   await Expense.findById(expenseId.toString()).then(async(expense)=>{
         console.log("HII REQ@ ",expense)
        const totalExpense=req.user.totalExpense-expense.amount;
        await User.updateOne(totalExpense,req.user.id).then(()=>{
           Expense.deleteOne(expenseId).then((response)=>{
            console.log(response,'line 128');
            res.status(200).json({message:"expense deleted successfully"});

           }).catch(err=>{
            console.log('could not be deleted');
            res.status(500).json({message:err})
           })
        
      }).catch((err)=>{
        res.status(500).json({message:"error",err:err})
      });
          //  await expense.destroy();
          //  await t.commit();
            
        // }).catch(async(err)=>{
           // await t.rollback();

        })
       
      }
    catch(err){
      // await t.rollback();
        res.status(500).json({message:"expense not found",err:err});
    }
  }
  


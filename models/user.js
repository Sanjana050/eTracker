// const Sequelize=require('sequelize');
// const sequelize=require('../util/database');

const mongodb=require('mongodb');
const getdb=require('../util/database').getdb;

const Order=require('../models/orders')
module.exports=class User{
    constructor(name,email,password,phone){
        this.name=name;
        this.email=email;
        this.password=password;
        this.phone=phone;
        this.isPremiumUser=false;
        this.totalExpense=0
        
    }
    save(){
        const db=getdb();
        return db.collection('User').insertOne(this).then(result=>{
            console.log(result);
            return result;
        }).catch(err=>{
            console.log(err)
        });
    }
    static findOne(email) {
      const db=getdb();
      console.log(db.collection('User'));

      console.log(email)
      return db.collection('User').findOne({email:email}).then((result)=>{
        console.log('email found in database line 30')
        console.log(result,'in line 31')
        return result;
      }).catch(err=>{
        console.log('in line 35')
        console.log(err)
      })
    }
    static findById(id)
    {
      console.log(id,"in line 43")
      const db=getdb();
      return db.collection('User').findOne({_id:new mongodb.ObjectId(id)}).then((result)=>{
       
        console.log('id found in database line 30')
        console.log(result,"in 46")
        return result;
      }).catch(err=>{
        console.log(err)
      })

    }

    static findEmail(email)
    {
      const db=getdb();
    return db.collection('User').findOne({email:email}).then((res)=>{
      console.log(res,"in 60 user.js models");
      return res;
    }).catch(err=>{
      console.log(err);
      return "user not found"
    })
      
    }
    static async find()
    {
      const db=getdb();
      const res=await db.collection('User').find().toArray()
console.log(res)
        return res;
      
    }
    static isPremiumUser(id)

    {
      const db=getdb();
      return db.collection('User').findOne({_id:new mongodb.ObjectId(id)}).then((res)=>{
if(res.isPremiumUser===true)
{
  return "premium user"
}
else{
  return "not a premium user"
}
      }).catch(err=>{
        console.log(err)
      })
    }
    
    static updateOne(totalExpense,userId){
      const db=getdb();
      console.log(new mongodb.ObjectId(userId))
      
      return db.collection('User').updateOne({_id:new mongodb.ObjectId(userId)},{$set:{totalExpense:totalExpense}}).then((result)=>{
        console.log(result,'in line 56');
        return "updated"

      }).catch(err=>{
        console.log(err)
      })
    }

    static updateOnePass(pass,userId){
      const db=getdb();
      console.log(new mongodb.ObjectId(userId))
      
      return db.collection('User').updateOne({_id:new mongodb.ObjectId(userId)},{$set:{password:pass}}).then((result)=>{
        console.log(result,'in line 56');
        return "updated password"

      }).catch(err=>{
        console.log(err)
      })
    }

    static updateOnePremium(userId){
      const db=getdb();
      return db.collection('User').updateOne({_id:new mongodb.ObjectId(userId)},{$set:{isPremiumUser:true}}).then(async(user)=>{
      await  User.findById(userId).then(res=>{
          console.log(res,"in line 68")
        }).catch(err=>{
          console.log(err)
        })
        return "updated is premium user"
      }).catch(err=>{
        console.log(err)
      })
    }
    

      
}

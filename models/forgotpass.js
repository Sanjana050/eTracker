const getdb=require('../util/database').getdb;
const mongodb=require('mongodb')
 module.exports=class ForgotPassword{
    constructor(active,userId,email,passid){
        this.active=active;
        this.userId=userId.toString();
        this.email=email;
        this.passid=passid
    }
    static findByPassId(id)
    {
        const db=getdb();
        return db.collection('forgotpass').findOne({passid:id}).then((res)=>{
            console.log(res,"in 13 res");
            return res;
        }).catch(err=>{
            console.log(err)
        })
    }
    static findById(id)
    {
        const db=getdb();
        return db.findOne({_id:new mongodb.ObjectId(id)}).then(res=>{
            return res;
        }).catch(err=>{
            console.log(err)
        })
    }
    save(){
        const db=getdb();
       return db.collection('forgotpass').insertOne(this).then((result)=>{
            console.log(result);
        }).catch(err=>{
            console.log(err)
        })
    }
 }

// const ForgotPassword=sequelize.define('forgotpass',{
//     id:{type:Sequelize.UUID,
//         allowNull:false,
//         primaryKey:true
//     },
//     active:Sequelize.BOOLEAN,
//     userId: {
//         type: Sequelize.INTEGER,
//         allowNull: false,
//         defaultValue: 0 // Set the default value to 0 or any other value you prefer
//       }
  
// })

// module.exports=ForgotPassword;
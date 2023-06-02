const mongodb=require('mongodb');
const getdb=require('../util/database').getdb;


module.exports=class Expense{
    constructor(amount,description,category,userid)
    {
        this.amount=amount;
        this.description=description;
        this.category=category;
        this.userid=userid;
    }
    save(){
        const db=getdb();

     console.log('expense');
       console.log('expense added')
       return db.collection('Expense').insertOne(this).then((expense)=>{
console.log(Expense);
return expense;
        }).catch(err=>{
            console.log(err)
        })
    }
    static findById(id)
    {
      const db=getdb();
      console.log(new mongodb.ObjectId(id));
      return db.collection('Expense').findOne({_id:new mongodb.ObjectId(id)}).then((result)=>{
        console.log(result);
        console.log('id found in database line 30')
        return result;
      }).catch(err=>{
        console.log(err)
      })

    }
static getAll()
{
    const db=getdb;
   return Expense.find().then((expenses)=>{
        console.log(expenses,'42')
        return expenses;
    })
}
    static findAll(id)
    {
        const db=getdb();
        return db.collection('Expense').find({userid:id}).toArray();
    }

    static count(id){
const db=getdb();
return db.collection('Expense').findAll({userid:id}).toArray().then((arr)=>{
    console.log(arr.length)
    return arr.length;
}).catch(err=>{
    console.log(err)
})
    }
    static deleteOne(id)
    {
        const db=getdb();
        return db.collection('Expense').deleteOne({_id:new mongodb.ObjectId(id)}).then((response)=>{
            console.log('entry deleted');
            return response
        }).catch(err=>{
            console.log(err)
        })
    }
}
// const Expense=sequelize.define('expense',{
//     id:{
//         type:Sequelize.INTEGER,
//         autoIncrement:true,
//         allowNull:false,
//         primaryKey:true
//     },

//     amount:{
//         type:Sequelize.INTEGER,
//         allowNull:false
//     },
//     description:{
//         type:Sequelize.STRING,
//         allowNull:false
//     },
   
        
    

//     category:
//     {
//         type:Sequelize.STRING,
//         allowNull:false

//     }
// })

// module.exports=Expense;
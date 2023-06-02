
// const Sequelize=require('sequelize');
// const sequelize=new Sequelize('expenseapp','root','Neha@5678',{dialect:'mysql',host:'localhost'});
// module.exports=sequelize;
const dotenv=require('dotenv');
dotenv.config();
console.log(process.env,"in line 45")
const mongodb=require('mongodb');
const MongoClient=mongodb.MongoClient;
let _db;
const mongoConnect=(cb)=>{
    MongoClient.connect(process.env.networkname).then(client=>{
        console.log('connected');
        _db=client.db('expenseapp');
        cb();
    }).catch(err=>{
        console.log(err,"in 17 util")
    })
}
const getdb=()=>{
    if(_db){
        return _db;
    }else{
        throw  'no database found'
    }
}
module.exports={
    mongoConnect,
    getdb
}
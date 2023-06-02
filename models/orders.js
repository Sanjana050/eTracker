const getdb=require('../util/database').getdb;
const mongodb=require('mongodb')

module.exports=class Order{
    constructor(userId,paymentId,status,orderId)
    {
        this.userId=userId;
        this.status=status;
        this.paymentId=paymentId;
        this.orderId=orderId;
    }

    save()
    {
        const db=getdb();
        return db.collection('order').insertOne(this).then(order=>{

            console.log(order);
return order;
        }).catch(err=>{
            console.log(err);
        })
    }

    static createOrder(id,status)
    {

const db=getdb();
const order=new Order(id,status);
return db.collection('Orders').insertOne(this).then((response)=>{
    console.log('order created')
}).catch(err=>{
    console.log(err)
})



    }
    
    static updateOne(id,paymentid,status,orderId){
        const db=getdb();
        return db.collection('order').updateOne({_id:new mongodb.ObjectId(id)},{$set:{paymentId:paymentid,status:status,orderId:orderId}}).then((res)=>{
            console.log("updated order")
        }).catch((err)=>{
            console.log(err)
        })
    }
}
// const Order=sequelize.define('order',{
//     id:{type:Sequelize.INTEGER,
//     autoIncrement:true,
//     allowNull:false,
//     primaryKey:true
// }
// ,
// orderId:Sequelize.STRING,
// paymentId:Sequelize.STRING,
// status:Sequelize.STRING


// })

// module.exports=Order;
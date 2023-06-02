const express=require('express');
const app=express();
const axios = require('axios');
const cors = require('cors');
// const Order=require('./models/orders')
// const Forgotpass=require('./models/forgotpass')
const bodyParser=require('body-parser');
const helmet=require('helmet')
const compression=require('compression')
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
const morgan=require('morgan');
const fs=require('fs')
const mongoConnect=require('./util/database').mongoConnect;

const dotenv=require('dotenv');
dotenv.config();

const path=require('path')

app.use(cors({
    origin: ['https://razorpay.com', 'http://localhost:3000','https://nodemailer.com/about/']
  }));
  

// const Sequelize=require('sequelize');
// const sequelize=require('./util/database')

const User=require('./models/user')
const Expense=require('./models/expense');

const expenseRoute=require('./router/expense');
const userRoute=require('./router/user');
 const premiumRoute=require('./router/premium')
const forgotPassRouter=require('./router/password');


app.use(express.static(path.join(__dirname,'views')))

 app.use(forgotPassRouter);
app.use(premiumRoute);
 app.use(expenseRoute);
 app.use(userRoute);
// app.use(helmet());
// app.use(compression);

const accessLogStream=fs.createWriteStream(path.join(__dirname,'accessLogs'),{'flags':'a'})

app.use(morgan('combined',{'stream':accessLogStream}));


// User.hasMany(Expense);
// Expense.belongsTo(User);


// User.hasMany(Order);
// Order.belongsTo(User);


// User.hasMany(Forgotpass);
// Forgotpass.belongsTo(User);


mongoConnect(()=>{

    app.listen(3000);
    
})


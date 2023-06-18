const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
var cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const controller = require('./controllers/loginC');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/order');
const Password = require('./models/password');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cors());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
}); 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

const userRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses');
const purchaseRouter = require('./routes/purchase');
const passwordRouter = require('./routes/forgotpassword');

app.use('/user', userRouter);
app.use('/expense',expenseRouter);
app.use('/purchase',purchaseRouter);
app.use('/password',passwordRouter);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(Password);
Password.belongsTo(User);

sequelize.sync({force:false})
    .then(()=>{
        console.log("Models synchronised with database")
    })
    .catch((err)=>{
        console.log(err.message);
        console.log("Failed to sync models with database",err);
    });

app.listen(3100);
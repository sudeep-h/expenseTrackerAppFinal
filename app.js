const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
const controller = require('./controllers/loginC');
const sequelize = require('./util/database');

const User = require('./models/user');
const Expense = require('./models/expense');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname,'public')));
// app.use(cors());

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
}); 

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

const userRouter = require('./routes/users');
const expenseRouter = require('./routes/expenses');

app.use('/user', userRouter);
app.use('/expense',expenseRouter);

sequelize.sync()
    .then(()=>{
        console.log("Models synchronised with database")
    })
    .catch((err)=>{
        console.log(err.message);
        console.log("Failed to sync models with database",err);
    });

app.listen(3100);
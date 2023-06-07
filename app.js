const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express();
const controller = require('./controllers/loginC');
const sequelize = require('./util/database');

const User = require('./models/user');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'public','signup.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
  });

const userRouter = require('./routes/users');

app.use('/user', userRouter);

sequelize.sync()
    .then(()=>{
        console.log("Details synchronised with database")
    })
    .catch((err)=>{
        console.log(err.message);
        console.log("Failed to sync data with database");
    })


// app.post('/signupform', controller.signUp);

app.listen(3100);
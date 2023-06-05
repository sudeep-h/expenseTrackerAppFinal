const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const sequelize = require('./util/database');
const Expense = require('./models/User');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'form.html'));
});

app.listen(3100);
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const controller = require('./controllers/user');
const sequelize = require('./util/database');
const axios = require('axios');

const User = require('./models/user');


const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

sequelize.sync()
    .then(()=>{
        console.log("Details synchronised with database")
    })
    .catch((err)=>{
        console.log(err.message);
        console.log("Failed to sync data with database");
    })


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname,'routes','user','signup.html'));
});

app.post('/submit-form', controller.insertData);

app.listen(3100);
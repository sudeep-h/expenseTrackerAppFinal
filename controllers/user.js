const bodyParser = require('body-parser');
const User = require('../models/user');

async function insertData(req,res){
    console.log(req.body, "data posting");
    if (!req.body.username || !req.body.email || !req.body.password){
        console.log("error");
        return res.status(400).send({
            message:"please fill all the details"
        })
    }
    const obj = {
        username : req.body.username,
        email : req.body.email,
        password : req.body.password
    }
    try{
        const data = await User.create(obj)
            res.redirect('/');
        }catch(error){
        res.status(500).send(error);
        console.log("could not send the data");
        };
}

module.exports={insertData}
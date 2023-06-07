
const User = require('../models/user');

async function signUp(req,res){
    console.log(req.body, "data posting");
    const {email,name, password } = req.body;
    
    console.log("recieved data: ", email, name, password);

    try{
        const existingUser = await User.findOne({where : {email}});

        if(existingUser){
            console.log("User already Exists");
            return res.status(409).send({message : "User already exists" });
        }

        const user = await User.create({email,name,password });
        console.log("new user Created : ", user);

        return res.status(201).send({
            message:"User created successfully",
            alert : "User has been created"
        });
    }catch(err){
        console.log("error:", err);
        return res.status(500).send({message:"Internal server Error, check for the error"});
    }
}

module.exports={signUp}
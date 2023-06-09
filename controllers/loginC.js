
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

async function login(req,res){
    const {email} = req.body;
    console.log("recieved login data: ",email);
    try{
        const user = await User.findOne({where:{email}});

        if(!user){
            console.log("User does not exist");
            return res.status(401).send({message:"Invalid email or password"});
        }

        console.log("Login Successfull");
        return res.status(200).send({message:"Login Successfull"});
    }catch(error){
        console.log("error : ", error);
        return res.status(500).send({message:"Internal Server Error"});
    }
}

module.exports={signUp,login}
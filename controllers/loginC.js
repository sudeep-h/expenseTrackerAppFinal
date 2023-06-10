
const User = require('../models/user');
const bcrypt = require('bcrypt');

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
        const saltrounds = 10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            const user = await User.create({email,name,password:hash});
            console.log("new user Created : ", user);
            return res.status(201).send({
            message:"User created successfully",
            alert : "User has been created"
        });
        })
        
    }catch(err){
        console.log("error:", err);
        return res.status(500).send({message:"Internal server Error, check for the error"});
    }
}

async function login(req,res){
    const {email,password} = req.body;
    console.log("recieved login data: ",email);
    try{    
        const user = await User.findAll({where:{email}});

        if(user.length>0){
            bcrypt.compare(password,user[0].password,(err,result)=>{
                if(err){
                    throw new Error("Something went wrong")
                }
                    if(result===true){
                        res.status(200).json({success : true, message:"User Logged in successfully"})
                    }else{
                        return res.status(400).json({success:false,message:"Incorrect password"})
                    }
            })
        }else{
            return res.status(404).send({success:false,message:"User doesnot exist"})
        }
    }catch(error){
        console.log("error : ", error);
        return res.status(500).send({message:"Internal Server Error"});
    }
}

module.exports={signUp,login}
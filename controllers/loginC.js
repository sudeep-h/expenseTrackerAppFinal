const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function generateToken(id,ispremiumuser){
    return jwt.sign({userId:id,ispremiumuser},'secretkey')
}


async function signUp(req,res){
    try{
        const {name,email,password } = req.body;
        console.log("recieved data: ",name ,email, password);
        const existingUser = await User.findOne({where : {email}});

        if(existingUser){
            console.log("User already Exists");
            return res.status(409).send({message : "User already exists" });
        }

        const saltrounds = 10;
        bcrypt.hash(password,saltrounds,async(err,hash)=>{
            const user = await User.create({name,email,password:hash});
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
        const user = await User.findOne({where:{email}});

        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(err){
                    throw new Error("Something went wrong")
                }
                    if(result===true){
                        res.status(200).json({success : true, message:"User Logged in successfully",token: generateToken(user.id,user.ispremiumuser)});
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

module.exports={signUp,login,generateToken};     
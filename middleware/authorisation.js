const jwt = require('jsonwebtoken');
const User = require('../models/user');
exports.authenticate=async(req,res,next)=>{ 
    try{
        const token = req.header("Authorization");
        console.log("token value : ",token);
        if(!token){
            return res.status(401).json({message:"Unauthorised: Token not provided"})
        }

        const secretKey = "secretkey"
        const decoded = jwt.verify(token,secretKey);
        console.log("decoded: ",decoded);
        const userId = decoded.userId;
        console.log('userId >>>>>>', userId)
        const user = await User.findByPk(userId);
        if(!user){
            return res.status(401).json({message:"Unauthorised: User does not exist"});
        }
        
        req.user = user;
        next();
    }catch(err){
        console.log("Error occured while authenticating user : ",err.message);
        return res.status(401).json({message:"Unauthorised"});
    }
};


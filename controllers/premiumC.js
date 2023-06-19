const User = require('../models/user.js');

async function getPremiumUsers(req,res,next){
    try{
        const data = await User.findAll({
            attributes:['name','totalexpense'],
            order:[['totalexpense',"DESC"]]
        });
        res.status(200).json({data});
    }catch(err){
        console.log(err);
        res.status(500).json({message:"Error retrieving premium users. "});
    }
}

module.exports = {getPremiumUsers};
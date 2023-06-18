
const sendinblue= require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');

const User = require('../models/user');

exports.forgotPassword = async(req,res,next)=>{
    try{
        const email = req.body.email;
        console.log("Printing email : ", email);
        const user = await User.findOne({where:{email}});

        if(!user){
            throw new Error("User not exist");
        }else{

            const client = sendinblue.ApiClient.instance;
            const apiKey = client.authentications['api-key'];
            apiKey.apiKey = process.env.sendinblue_key
            console.log("Check the API Key", apiKey.apiKey);
            
            const tranEmailApi = new sendinblue.TransactionalEmailsApi();

            const sender = {
                email:'sudeephipparge@gmail.com'
            };
            const receivers=[
                {
                    email:email
                }
            ];
            console.log(`http://localhost:3100/password/reset-password/${id}`)
            const reset = await tranEmailApi.sendTransacEmail({
                sender,
                to:receivers,
                subject:"reset password",
                textContent : "Reset your Password here",
                htmlContent : `<a href="http://localhost:3100/password/reset-password/${id}">Reset Password</a>`
            });

            console.log('Email sent Successfully');

            res.status(200).json({message:"Email sent successfully"});

        }
    } catch(err){
        console.log(err.message);
        res.status(400).json({error:err})
    };
}


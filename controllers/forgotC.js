const uuid = require('uuid');
const sendinblue= require('sib-api-v3-sdk');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/user');
const Password = require('../models/password');

User.hasMany(Password);
Password.belongsTo(User);

exports.forgotPassword = async(req,res,next)=>{
    try{
        const email = req.body.email;
        console.log("Printing email : ", email);
        const user = await User.findOne({where:{email}});

        if(!user){
            throw new Error("User not exist");
        }else{
            const id = uuid.v4();
            const resetPassword= {id:id,isactive:true};
            const resetpassword = await user.createPassword(resetPassword);
            
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
                to : receivers,
                subject:"reset password",
                textContent : "Reset your Password here",
                htmlContent : `<a href="http://localhost:3100/password/reset-password/${id}">Reset Password</a>`
            });

            console.log('Email sent Successfully');

            res.status(200).json({message:"Email sent successfully"});

        }
    } catch(err){
        console.log("Error message in FPC",err.message);
        res.status(400).json({error:err})
    };
}   

exports.resetPassword = async(req,res,next)=>{
    try{
        const id = req.params.id;
        const resetpassword = await Password.findOne({where:{id}});

        if (resetpassword){
            await resetpassword.update({isactive:false});
            console.log("reset password from rendered");

            res.status(200).send(`
            <html>
                <script>
                    function formsubmitted(event){
                        event.preventDefault();
                        console.log("called");
                    }    
                </script>
                <form action="/password/update-password/${id}" method="get">
                    <label for="newpassword">Enter New password</label>
                    <input name="newpassword" type="password" required></input>
                    <button>reset password</button>
                </form>
            </html>    
        `);
        }
    }catch(err){
        console.log("Error message in RPC",err.message);
        res.status(400).json({error:err});
    }
};

exports.updatePassword = async(req,res,next) =>{
    try{
        const newpassword = req.query.newpassword;
        const id = req.params.id;
        const updatepassword = await Password.findOne({where:{id}});
        const user = await User.findByPk(updatepassword.userId);

        if (user){
            saltrounds= 10;
            bcrypt.hash(newpassword, saltrounds, async function(err,hash){
                if(err){
                    console.log(err);
                    throw new Error(err);
                }
                await user.update({password:hash});

                console.log('Password Update Successfully');
                res.status(201).json({message:"Successfully updated the new password"});
            });
        }else{
            throw new Error('User not found');
        }
    }catch(err){
        console.log("Error message in UPC",err.message);
        res.status(404).json({error:err});
    }
}
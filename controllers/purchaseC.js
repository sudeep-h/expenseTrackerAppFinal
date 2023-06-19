const Razorpay = require('razorpay');
const Order = require('../models/order');
const userController = require('../controllers/loginC');

const purchasePremium = async (req,res,next)=>{
    try{
        const razor = new Razorpay({
            key_id: "rzp_test_2Z8AChmXggn6FY",
            key_secret : "4drfp3zRFgJ2DjeXKeyZ5nhu"
        });

        const amount = 2000;

        razor.orders.create({amount, currency:"INR"},async(err,order)=>{
            if(err){
                throw new Error(JSON.stringify(err));
            }

            await req.user.createOrder({orderId:order.id,status:"PENDING"});
            return res.status(201).json({order,key_id:razor.key_id});
        });
    }catch(err){
        console.log(err);
        return res.status(500).json({success:false,message:"Internal Server Error"})
    }
};

const updateTransactionStatus = async (req,res)=>{
    const userId=req.user.id                                                //////
    try{
        const { paymentId,order_id,status} = req.body;         
        console.log("Requested body : ", req.body);
        const order = await Order.findOne({where:{orderId:order_id}});       
        console.log(order,"Prints the Order here");
        if (status === "failed") {
            await Promise.all([
              order.update({ paymentId: req.body.payment_id, status: "FAILED" }),
              req.user.update({ ispremiumuser: false }) 
            ]);
        }else{
            await Promise.all([
                order.update({paymentId: req.body.payment_id,status:"SUCCESSFUL"}),      
                req.user.update({ispremiumuser:true})
            ]);
        }
        return res.status(202).json({success:true, message:"Transaction Successful",token:userController.generateToken(userId,undefined,true)});
    }catch(err){
        console.log(err.message);
        return res.status(500).json({success:false,message:"Internal Server Error"});    
    }
};

module.exports={purchasePremium, updateTransactionStatus};
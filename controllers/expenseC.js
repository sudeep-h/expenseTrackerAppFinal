const Expense = require('../models/expense');
const User = require('../models/user');

async function insertExpense(req,res){
    try{
        const {amount,description,category} = req.body;
        const expense = await Expense.create({
            amount:amount,
            description:description,
            category:category
        });
        const userId = req.user.id;
        const totalExpense = await Expense.sum('amount',{where:{userId}});
        await User.update({totalexpense : totalExpense},{where:{id:userId}});
        res.status(200).json({message:"Expense created successfully",expense});
    }catch(error){
        res.status(500).json({message:"Failed to Create Expense",error:error});
    }
}

const getExpense=(req,res)=>{
    Expense.findAll({where:{userId:req.user.id}}).then(expenses=>{
        return res.status(200).json({expenses,success:true})
    })
    .catch(err=>{
        console.log(err)
        return res.status(500).json({error:err,success:false});
    })
}

const deleteExpense = (req,res)=>{
    const expenseId = req.params.expenseId;
    Expense.destroy({where:{id:expenseId,userId:req.user.id}})
    .then(expenses=>{
        return res.status(200).json({success:true,message:"Expense Deleted Successfully"})
    })
    .catch(error=>{
        console.log(error);
        return res.status(500).json({success:false,message:"Failed"})
    });
}

module.exports={
    insertExpense,
    getExpense,
    deleteExpense
}
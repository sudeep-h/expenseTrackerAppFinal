const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit',addExpense);

async function addExpense(event){
    event.preventDefault();

    const expense = {
        amount:event.target.amount.value,
        description:event.target.description.value,
        category:event.target.category.value,
        userId:1
    };

    console.log(expense);

    try{
        const response = await axios.post('http://localhost:3100/expense/postExpense',expense);
        console.log("Expense data sent to the server",response.data.expense);
        showOnScreen(response.data.expense);
        // expenseForm.reset();
    }catch(error){
        console.log("Error sending expenses data",error) 
    }
}

// function showOnScreen(expense){
//     const expenseList = document.getElementById('expenses');
//     const expenseId = `expense-${expense.id}`;
//     const li = document.createElement('li');
//     li.textContent=`${expense.id} - ${expense.amount} - ${expense.description} - ${expense.category}`;
//     expenseList.appendChild(li);

//     const delb = document.createElement('input');
//     delb.type="button";
//     delb.value = "delete";
//     delb.onclick=async ()=>{
//         try{
//             const response = axios.delete(`http://localhost:3100/expense/deleteExpense/${expense.id}`);
//             console.log("Deleting Expense");
//         }catch(err){
//             console.log("Error deleting the expense",err);
//         }
//     }

//     li.appendChild(delb);
//     expenseList.appendChild(li);
// }

function showOnScreen(expense) {
    const expensesList = document.getElementById('expenses');
    const expenseId = `expense-${expense.id}`;
    const li = document.createElement('li');
    li.textContent = `Amount: ${expense.amount} - Description: ${expense.description} - Category: ${expense.category}`;
    expensesList.appendChild(li);

    const deleteBtn = document.createElement('input');
    deleteBtn.type = 'button';
    deleteBtn.value = 'delete';
    deleteBtn.onclick = () => {
        console.log('Deleting expense with ID:', expense.id);
        fetch(`/Expense/delete-expense/${expense.id}`, {
        method: 'DELETE'
    })
    .then(response=>response.json())
    .then(data=>{
        console.log(data.message);
        const formData = document.getElementById('expenses');
        const deletedExpense = formData.querySelector(`li[id="${expenseId}"]`);
        deletedExpense.remove();
    })
    .catch(err=>{
        console.log(err.message);
    })
    }

    li.appendChild(deleteBtn);
    expensesList.appendChild(li);
}
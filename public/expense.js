const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit',addExpense);

window.onload = async function()
{
    await getExpenses()
}

async function addExpense(event) {
    event.preventDefault();
  
    const expense = {
      amount: event.target.amount.value,
      description: event.target.description.value,
      category: event.target.category.value
    };
  
    console.log("Added Expense : ",expense);
    const token = localStorage.getItem('token');
  
    try {
      const response = await axios.post('http://localhost:3100/expense/postExpense', expense, {headers: { 'Authorization': token }});
      console.log(response.headers);
      console.log("Expense data sent to the server:", response.data.expense);
      showOnScreen(response.data.expense);
      expenseForm.reset();
    } catch (error) {
      console.log("Error sending expense data:", error);
    }
}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');
const decodeToken = parseJwt(token);
console.log("decodeToken : ",decodeToken);

window.onload = function(){
    getExpenses();
};

async function getExpenses(){
    try{
        const response = await axios.get("http://localhost:3100/expense/getExpense",{
            headers : {"Authorization" : token }
        });
        console.log("CHECKING RESPONSE",response);
        const data = response.data;
        console.log("data printing : ",data);
        data.forEach(expense=>{
            showOnScreen(expense);
        });
    }catch(err){
        console.log("Error Loading Expenses : ",err.message);
    }
}

function showOnScreen(expense){
    const expenseList = document.getElementById('expenses');
    const expenseId = `expense-${expense.id}`;
    const li = document.createElement('li');
    li.textContent=`${expense.id} - ${expense.amount} - ${expense.description} - ${expense.category}`;
    expenseList.appendChild(li);

    const delb = document.createElement('input');
    delb.type="button";
    delb.value = "delete";
    delb.onclick= async ()=>{
        const token = localStorage.getItem('token');
        li.remove();
        try{
            const response = await axios.delete(`http://localhost:3100/expense/deleteExpense/${expense.id}`,{
                headers:{'Authorization': token }
            });
            console.log("Deleting Expense",response);
        }catch(err){
            console.log("Error deleting the expense",err.message);
        }
    }

    li.appendChild(delb);
    expenseList.appendChild(li);
}





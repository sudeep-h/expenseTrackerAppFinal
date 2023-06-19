const expenseForm = document.getElementById('expense-form');
expenseForm.addEventListener('submit',addExpense);

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
}

const token = localStorage.getItem('token');
const decodeToken = parseJwt(token);
console.log("decodeToken : ",decodeToken);
const isAdmin = decodeToken.ispremiumuser;


window.onload = async function()
{
    await getExpenses()
    if(isAdmin){
        premiumFeatures();
    }
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
      //
      const ispremiumuser = response.data.ispremiumuser;
      if (ispremiumuser){
        isAdmin = true;
        premiumFeatures();
      }
      //
    } catch (error) {
      console.log("Error sending expense data:", error);
    }
}

async function getExpenses(){
    try{                                                                   
        const response = await axios.get("http://localhost:3100/expense/getExpense",{
            headers : {"Authorization" : token }
        });
        console.log("CHECKING RESPONSE",response);
        const data = response.data;
        console.log("data printing : ",data);
        data.allExpense.forEach(expense=>{
            showOnScreen(expense);
        });
        if (isAdmin){
            premiumFeatures();
        }
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
        const userId = localStorage.getItem('userId');
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


document.getElementById('razorpay').onclick = async function(e){
    // const token = localStorage.getItem('token');
    // console.log("old token: ", token)

    try{
        const response = await axios.get('http://localhost:3100/purchase/premiumMembership',{
            headers:{"Authorization":token}
        });
        console.log(response);
        var options = {
            "key":response.data.key_id,
            "order_id" : response.data.order.id,
            "handler" : async function(response){
                await axios.post(`http://localhost:3100/purchase/transactionStatus`,
                {order_id:options.order_id,payment_id:response.razorpay_payment_id},{         
                    headers:{"Authorization":token}
                });
                console.log("payment-id : ",response.razorpay_payment_id);
                alert("Congratulations!!! You are a premium User Now");
                premiumFeatures();
                document.getElementById('razorpay').style.visibility="hidden";
                document.getElementById('message1').innerHTML="You are a premium user";                           
                localStorage.setItem('token',response.token);
                console.log("new token ; ", token)
                
            }
        };

        const razor =  new Razorpay(options);
        razor.open();
        e.preventDefault();

        razor.on('payment.failed',async function(response){
            await axios.post('http://localhost:3100/purchase/transactionStatus',{
                status:"failed",
                order_id : options.order_id,
                payment_id:response.razorpay_payment_id
            },{headers:{"Authorization":token}});
        });
    }catch(err){
        console.log(err.message);
    }
}

function premiumFeatures(){
    document.getElementById('razorpay').style.visibility="hidden";          
    document.getElementById('message1').innerHTML='You are a premium user';                             
    const leaderButton = document.createElement('button');           //const leaderButton = document.getElementById('razorpay')
    leaderButton.innerHTML = 'Show Leaderboard';
    leaderButton.onclick = async () =>{
        const token = localStorage.getItem('token');

        try{
            const response = await axios.get('http://localhost:3100/purchase/leaderboard',{
                headers:{'Authorization':token}
            });

            const leaderboardData = response.data.data;
            console.log("LEADERBOARD DATA : ",leaderboardData);

            document.getElementById('message').innerHTML='';
            leaderboardData.forEach(item=>{
                const li = document.createElement('li');
                li.className='listLeaders';
                li.textContent = `Name: ${item.name} - Total Expense : ${item.totalexpense}`;
                document.getElementById('message').appendChild(li);
            });
        }catch(err){
            console.log(err.message);
        };
    };
    //
    const downloadReportBtn = document.createElement('button');
    downloadReportBtn.innerHTML = "Download Report";
    downloadReportBtn.onclick = async function(){
        downloadReport();
    }
    const premiumFeaturesSection = document.getElementById('premium-features');
    premiumFeaturesSection.innerHTML = '';
    premiumFeaturesSection.appendChild(leaderButton);
    premiumFeaturesSection.appendChild(downloadReportBtn);
}

async function downloadReport(){
    try{
        const token = localStorage.getItem('token');
        const response = await axios.get("http://localhost:3100/expense/download-report",{headers:{"Authorization":token}});
        console.log("Printing the response : ", response);
        if (response.status ===200){
            const fileUrl = response.data.fileURL;
            console.log("FILEURL: ", fileUrl);
            const a = document.createElement('a');
            a.href=response.data.fileURL;
            a.download = `Expense.txt`;
            a.click();
        }else{
            console.log("Error in downloading")
            throw new Error(response.data.message);
        }
    }catch(err){
        console.log("ERROR CHECK IN DOWNLOADING : ",err.message);
    }
}
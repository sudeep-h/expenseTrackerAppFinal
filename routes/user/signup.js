async function signup(e){
    try{
        e.preventDefault();
        console.log(e.target.email.value);

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const signupDetails = {
            username: username,
            email: email,
            password: password
        }

        console.log(signupDetails)
        const response = await axios.post('/submit-form',signupDetails)
        if(response.status===201){
            window.location.href = "../Login/login.html"
        }else{
            throw new Error('Sign up Failed');
        }
    }catch(err){
        document.body.innerHTML+=`<div style="color:red;">${err} <div>`
    }
}
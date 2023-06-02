

 
    const urlParams = new URLSearchParams(window.location.search);
    const message = urlParams.get('message');
    
    


    // display the message on the page
    const messageElement = document.getElementById('message');
    if (message) {
      const div = document.createElement('div');
      div.textContent = message;
      div.style.color = 'green';

      messageElement.appendChild(div);
    } 


async function login(e)
{
    try{
    e.preventDefault();
    const email=document.querySelector('#email').value;
    const password=document.querySelector('#password').value;
    

    const response= await axios.post('http://localhost:3000/postlogin',{email,password});
    

    if(response.status===200){
        console.log(response)
        
        localStorage.setItem('signupId',response.data.userId)
        console.log(response.data.userId)
        
         location.href=`./expense.html?message:logged in succesfully&token=${response.data.userId}`
    }
    else{
        console.log(response.data.message)
    }
    }


    catch(err)
    {
const messageElement1 = document.getElementById('message');
messageElement1.innerHTML="";
    const messageElement = document.getElementById('message1');
    // const errorMessage = err.data.message;
    console.log(err)
    const div=document.createElement('div');
    div.style.color="red";
    // div.appendChild(document.createTextNode(`${errorMessage}!!!   signup instead`));
    

const link = document.createElement('a');
link.href = "./signuppage.html";
link.appendChild(document.createTextNode('Signup'));
    link.className="btn"


    div.appendChild(link);
    messageElement.append(div);

    }
}



















async function forgotemail(e){
    try{
e.preventDefault();
        const email_id=document.querySelector('#emailf').value;
        console.log(email_id);
const forgotEmail=await axios.post('http://localhost:3000/forgotPassword',{email_id})
if(forgotEmail.status==200)
{
    document.body.innerHTML += '<div style="color:green;">Mail Successfuly sent <div>'
} else {
    throw new Error('Something went wrong!!!')
}
    }
    catch(err) {
        
document.body.innerHTML += `<div style="color:red;">${err} <div>`;

}

}




document.querySelector('#forgotpassbtn').addEventListener('click',()=>{
    document.querySelector('#forgotpassbtn').style.visibility="hidden"
    document.querySelector('.forgot_pass').style.visibility="visible"
})

document.querySelector('.formcontrol').addEventListener('submit',login)

document.querySelector('.emailfbtn').addEventListener('click',
    forgotemail
  );
  





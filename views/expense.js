

const expenselist=document.querySelector('.expenselist')
const expenseform=document.querySelector('.expense-form')
const urlParams = new URLSearchParams(window.location.search);
const token = urlParams.get('token');

let status1="";

async function expense(e){

    try{
e.preventDefault();

const amount=document.querySelector('#amount').value;
const description=document.querySelector('#description').value;
const category=document.querySelector('#category').value;





const response=await axios.post('http://localhost:3000/postexpense',{amount,description,category},{headers:{"token":token}});
if(response.status===200)
{
  console.log('expense added in db')
  const userId=response.data.decoded.id
  const expenseId=response.data.id;
  console.log('in line 27','userId->',userId,'expenseId->',expenseId)
const div=document.createElement('div');
div.className="expenseListItem"
div.setAttribute("id", `expense-${expenseId}`);
div.appendChild(document.createTextNode(`amount:  ${amount}     description:  ${description}     category:  ${category}`));
div.style.backgroundColor="lightgrey";

div.style.color="black";
div.style.width="50rem"


const button=document.createElement('button');
button.classList.add('delbtnexpense')
button.className="btn";


button.style.backgroundColor="red"
button.appendChild(document.createTextNode("Delete"));

button.style.float="right"
div.appendChild(button);

expenselist.appendChild(div);
console.log(expenseId,'line 52')
 button.addEventListener('click', async(event)=>{
  await deleteElement(expenseId,event)
 loadexpense()
 })



}
else{
    const div=document.createElement('div');
    div.appendChild(document.createTextNode(`response.data.message`));
    div.style.backgroundColor="lightgrey";
    div.style.color="black";
    div.style.width="50rem";
    div.style.padding="2rem";
    expenselist.appendChild(div);
    console.log('expense failed')
    
    }

    document.querySelector('#amount').value = '';
    document.querySelector('#description').value = '';
    document.querySelector('#category').value = '';
    document.querySelector('.expense-form').reset();


}

catch(err)
{
    console.log(err)
    console.log('error')
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






async function deleteElement(id,button)
{
    try{

      console.log("Hey babay")
    const div=button.target.parentElement;
    
console.log(id,"neha id");
console.log(id);
    const response=await axios.post(`http://localhost:3000/deleteExpense`,{expenseId:id},{headers:{"token":token}})
    if(response.status===200)
    {
       
        div.remove();
    }
    
    }
    catch(err){
       
            console.log(err)
        
    }


}
async function loadexpense(e) {
    try {
      e.preventDefault();
      const page=1;
    console.log("ho from 139")

    // await premiumuserfunction();

        let res=await  axios.get('http://localhost:3000/postlogintoken',{headers:{"token":token}})

        console.log(res,"response is axis");
        const check=res.data.isPremiumUser;
        console.log(check,"line 147")
          if(check){

          console.log(res,"res");
           document.querySelector('#premium-btn').style.visibility="hidden";
           document.querySelector('#message').innerHTML="you are a premium user now"
           document.querySelector('.premiumleaderbtn').style.visibility="visible"
           console.log("hii")
          }



       const signUpId=localStorage.getItem('signupId')
       const decodedToken=parseJwt(signUpId);
       
       

      const response = await axios.get(`http://localhost:3000/getAllExpense?page=${page}`,{headers:{"token":token}});
      console.log(response,"in line 165")
      if (response.status === 200) {
        expenselist.innerHTML = '';
        const expenses = response.data.expense;
console.log('in rxpense for xhecking')
        for (let expense of expenses) {
          const amount = expense.amount;
          const description = expense.description;
          const category = expense.category;
          const id = expense.id;
  
          const div = document.createElement('div');
          div.id = `expense-${id}`;
          div.appendChild(document.createTextNode(`amount: ${amount} description: ${description} category: ${category}`));
          div.style.backgroundColor = "lightgrey";
          div.style.color = "black";
          div.style.width = "50rem";
  
          const button = document.createElement('button');
          button.className = "btn";
          button.style.backgroundColor = "red";
          button.appendChild(document.createTextNode("Delete"));
          button.style.float = "right";
          div.appendChild(button);
  
          expenselist.appendChild(div);
  
          button.addEventListener('click', (e) => deleteElement(id, e));

          
          
         
        }
        console.log(token,"138")
        
      await axios.get('/isPremiumUser',{headers:{"token":token}});
      console.log(isp,'in 141');

        
      } else {
        const div = document.createElement('div');
        div.appendChild(document.createTextNode(response.data.message));
        div.style.backgroundColor = "lightgrey";
        div.style.color = "black";
        div.style.width = "50rem";
        div.style.padding = "2rem";
        expenselist.appendChild(div);
      }
    } catch (err) {
      console.log(err);
    }

  }
  
  async function premium(e){
    try{

        const token=localStorage.getItem('signupId');
        console.log('from local storage',token)
        let response=await axios.get('http://localhost:3000/postpremium',{headers:{"token":token}})
        const orderid=response.data.orderid;
        console.log(response,"from postpremium",response.data.userId);


        console.log('in 219',orderid)
        
        var options={
            "key":response.data.key_id,
            "orderId":response.data.order.id,
            "handler":async function(response){
                await axios.post('http://localhost:3000/updatetransactionstatus',{
                    orderid:orderid,
                    order_id:options.orderId,
                    payment_id:response.razorpay_payment_id,
            },{headers:{"token":token}})
            alert('you are a premium user now')
            console.log('preimum user')
            document.querySelector('#premium-btn').style.visibility="hidden";
            document.querySelector('#message').innerHTML="you are a premium user now"
document.querySelector('#premiumleaderbtn').style.visibility="visible"
document.getElementById('downloadExpense').style.display = "block";


           
            
       
     
     }
    }
                console.log("after var options",options.handler)
                const rzp1= new Razorpay(options);
                rzp1.open();
                e.preventDefault();

          const failed=   await   rzp1.on('payment failed', async function(response){
            
            console.log(response);
            try{
              status1="failed";
await axios.post('http://localhost:3000/postFailedStatus',{ order_id:options.orderId,
payment_id:response.razorpay_payment_id,

},{headers:{"token":token}})
            }
            catch(err)
            {
console.log(err)
            }
                   
                   
                })
         
              
    }
    catch(err)
    {
        console.log(err)
    }
}

async function loadleaders(){

  document.querySelector('.premiumleaderbtn').style.visibility="hidden";
  document.querySelector('.leaders').style.visibility="visible";
  console.log("in leaderborad button")
const token=localStorage.getItem("signUpId");
const leaderBoardArray=await axios.get('http://localhost:3000/showLeaderBoard',{headers:{"token":token}});

console.log(leaderBoardArray,"in 291")
var leaderBoardElem=document.querySelector('.premium_users');

leaderBoardArray.data.forEach((element)=>{
  
  const id = element.id;
  const name=element.name;
  const totalExpense=element.totalExpense;
  
  const expense = totalExpense !== null ? totalExpense : 0;
    leaderBoardElem.innerHTML += `<li><span class="name">Name:</span><span class="username">${name}</span><span class="expense">total_expense:</span><span class="expenseamount">${expense}</span></li>`;
  
  
})
document.querySelector('.premium_users').style.visibility="visible"

}
 function downloadexpense(){
  
      axios.get('http://localhost:3000/downloadexpense', {headers:{"token":token}})
        .then(response =>  {
          if(response.status===200) {
          var a=document.createElement('a');
          a.href=response.data.fileUrl;
          a.download= 'myexpense.csv';
          a.click();
        } 
        else if(response.status===500){
      const p=document.createElement('p');
      p.appendChild(document.ctrateTextNode('not a premium user'));
      document.querySelector('#notpre').appendChild(p)
        }
        else {
          console.log('could not download the file');
         
          throw new Error();
        
          
        }
      }) .catch(err => 
      {
        console.log("response received")
        console.log(err);
      })
    }
    
  

  
  


// async function premiumuserfunction()
// {
//   try{
  
//   console.log("Neha from premiumuserfunction line 342")
//   axios.get('http://localhost:3000/isPremiumUser', {headers:{"token":token}})
//   .then((response) =>  {
//     console.log(response,"hii from 350");
//    console.log(response.data.message,response.status)
//   if(response.status===200)
//   {
//     console.log(response.isPremiumUser,response.status,"hii stat")
//   }
//   else{
//     console.log(response)
//   }
// }).catch(err=>{
//     console.log(err)
//   }) 
   
//   }
//   catch(err)
//   {
//     console.log(err)
//   }
// }

document.querySelector('#premium-btn').addEventListener('click',premium);
window.addEventListener("DOMContentLoaded",loadexpense)




expenseform.addEventListener('submit',expense);
document.querySelector('.premiumleaderbtn').addEventListener('click',loadleaders)


const downloadbtn=document.querySelector('#downloadExpense');
downloadbtn.addEventListener('click',downloadexpense);
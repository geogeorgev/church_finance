function showPage(page){

const content = document.getElementById("content");

if(page === "members"){
content.innerHTML = `
<h2>Members</h2>
<input placeholder="Member Name" id="memberName">
<button onclick="addMember()">Add Member</button>
<div id="memberList"></div>
`;
}

if(page === "income"){
content.innerHTML = `
<h2>Income</h2>

<select id="incomeSource">
<option>Cash</option>
<option>Check</option>
</select>

<input placeholder="Amount" id="incomeAmount">

<button onclick="addIncome()">Add Income</button>
`;
}

if(page === "expense"){
content.innerHTML = `
<h2>Expense</h2>

<input placeholder="Member or Vendor Name" id="expenseName">

<input placeholder="Amount" id="expenseAmount">

<button onclick="addExpense()">Add Expense</button>
`;
}

}

function loadMembers(){

document.getElementById("content").innerHTML = `

<h2>Add Member</h2>

<input id="name" placeholder="Name">
<input id="address1" placeholder="Address1">
<input id="phone" placeholder="Phone">
<input id="email" placeholder="Email">

<button onclick="addMember()">Save</button>

`;
}

function addMember(){

let name=document.getElementById("name").value;

db.collection("members").add({

Name:name,
Address1:"",
Address2:"",
Address3:"",
Phone:"",
Email:"",
TotalContribution:0

});

alert("Member added");

}

function loadBudget(){

document.getElementById("content").innerHTML = `

<h2>Add Budget</h2>

<input id="category" placeholder="Category">
<input id="subcategory" placeholder="SubCategory">
<input id="amount" placeholder="Budget Amount">

<button onclick="addBudget()">Save</button>

`;
}

function addBudget(){

db.collection("budget").add({

Category:document.getElementById("category").value,
SubCategory:document.getElementById("subcategory").value,
BudgetAmount:Number(document.getElementById("amount").value),
Spent:0,
Balance:Number(document.getElementById("amount").value)

});

alert("Budget added");

}

function loadIncome(){

document.getElementById("content").innerHTML = `

<h2>Add Collection</h2>

<select id="type">
<option>Cash</option>
<option>Check</option>
</select>

<input id="memberName" placeholder="Member Name">

<input id="amount" placeholder="Amount">

<input id="checkNumber" placeholder="Check Number">

<button onclick="addIncome()">Save</button>

`;
}

function addIncome(){

let type=document.getElementById("type").value;

db.collection("income").add({

Type:type,
CollectionDate:new Date(),
MemberName:document.getElementById("memberName").value,
CheckNumber:document.getElementById("checkNumber").value,
CashTotal:type==="Cash"?Number(document.getElementById("amount").value):0,
CheckAmount:type==="Check"?Number(document.getElementById("amount").value):0

});

alert("Income saved");

}

function loadExpense(){

document.getElementById("content").innerHTML = `

<h2>Add Expense</h2>

<input id="payee" placeholder="Payee Name">

<select id="isMember">
<option>No</option>
<option>Yes</option>
</select>

<input id="category" placeholder="Category">
<input id="subcategory" placeholder="SubCategory">

<input id="amount" placeholder="Amount">

<button onclick="addExpense()">Save</button>

`;
}

function addExpense(){

db.collection("expense").add({

PaymentDate:new Date(),
PayeeName:document.getElementById("payee").value,
IsMember:document.getElementById("isMember").value,
Category:document.getElementById("category").value,
SubCategory:document.getElementById("subcategory").value,
Amount:Number(document.getElementById("amount").value)

});

alert("Expense saved");

}

async function loadMemberDropdown(){

let snapshot = await db.collection("members").get()

let html = `<select id="memberSelect">`

snapshot.forEach(doc => {

let m = doc.data()

html += `<option value="${doc.id}">
${m.Name}
</option>`

})

html += `</select>`

return html

}

async function loadIncome(){

let memberDropdown = await loadMemberDropdown()

document.getElementById("content").innerHTML = `

<h2>Record Collection</h2>

Type
<select id="type">
<option>Cash</option>
<option>Check</option>
</select>

Member
${memberDropdown}

Purpose
<input id="purpose">

Amount
<input id="amount">

Check Number
<input id="check">

<button onclick="addIncome()">Save</button>

`
}
async function addIncome(){

let memberId = document.getElementById("memberSelect").value
let amount = Number(document.getElementById("amount").value)

let date = new Date()

await db.collection("income").add({

MemberID:memberId,
Type:document.getElementById("type").value,
Purpose:document.getElementById("purpose").value,
CheckNumber:document.getElementById("check").value,
Amount:amount,
Month:date.getMonth()+1,
Year:date.getFullYear(),
CollectionDate:date

})

let memberRef = db.collection("members").doc(memberId)

let memberDoc = await memberRef.get()

let current = memberDoc.data().TotalContribution || 0

memberRef.update({
TotalContribution: current + amount
})

alert("Income Recorded")

}
async function loadBudgetDropdown(){

let snapshot = await db.collection("budget").get()

let html=`<select id="budgetSelect">`

snapshot.forEach(doc =>{

let b=doc.data()

html+=`<option value="${doc.id}">
${b.Category} - ${b.SubCategory}
</option>`

})

html+=`</select>`

return html

}
async function loadExpense(){

let members = await loadMemberDropdown()
let budgets = await loadBudgetDropdown()

document.getElementById("content").innerHTML = `

<h2>Record Expense</h2>

Payee
<input id="payee">

Is Member
<select id="isMember">
<option>No</option>
<option>Yes</option>
</select>

Member
${members}

Budget
${budgets}

Amount
<input id="amount">

Purpose
<input id="purpose">

<button onclick="addExpense()">Save</button>

`
}
async function addExpense(){

let budgetId=document.getElementById("budgetSelect").value
let amount=Number(document.getElementById("amount").value)

let date=new Date()

await db.collection("expense").add({

BudgetID:budgetId,
Amount:amount,
Purpose:document.getElementById("purpose").value,
PaymentDate:date,
Month:date.getMonth()+1,
Year:date.getFullYear()

})

let budgetRef=db.collection("budget").doc(budgetId)

let doc=await budgetRef.get()

let spent=doc.data().Spent || 0
let budgetAmount=doc.data().BudgetAmount

let newSpent=spent+amount

budgetRef.update({

Spent:newSpent,
Balance:budgetAmount-newSpent

})

alert("Expense Saved")

}
async function collectionReport(){

let snapshot = await db.collection("income").get()

let total=0
let html="<h2>Collection Report</h2><table border=1>"

snapshot.forEach(doc=>{

let d=doc.data()

total+=d.Amount

html+=`<tr>
<td>${d.MemberName}</td>
<td>${d.Amount}</td>
<td>${d.Purpose}</td>
</tr>`

})

html+=`</table><h3>Total: ${total}</h3>`

document.getElementById("content").innerHTML=html

}
async function dashboard(){

let month=new Date().getMonth()+1
let year=new Date().getFullYear()

let incomeSnap=await db.collection("income")
.where("Month","==",month)
.where("Year","==",year)
.get()

let expenseSnap=await db.collection("expense")
.where("Month","==",month)
.where("Year","==",year)
.get()

let incomeTotal=0
let expenseTotal=0

incomeSnap.forEach(d=>incomeTotal+=d.data().Amount)
expenseSnap.forEach(d=>expenseTotal+=d.data().Amount)

document.getElementById("content").innerHTML=`

<h2>Monthly Dashboard</h2>

Total Income: ${incomeTotal} <br><br>

Total Expense: ${expenseTotal} <br><br>

Balance: ${incomeTotal-expenseTotal}

`

}

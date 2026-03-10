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

// ---------------- DASHBOARD ----------------

async function dashboard(){

let snap = await db.collection("budget").get()

let html = "<h2>Budget Dashboard</h2>"
html += "<table><tr><th>Category</th><th>SubCategory</th><th>Budget</th><th>Spent</th><th>Balance</th></tr>"

snap.forEach(doc=>{
let b = doc.data()

html += `<tr>
<td>${b.Category}</td>
<td>${b.SubCategory}</td>
<td>${b.BudgetAmount}</td>
<td>${b.Spent || 0}</td>
<td>${b.Balance || b.BudgetAmount}</td>
</tr>`
})

html += "</table>"

document.getElementById("content").innerHTML = html
}



// ---------------- MEMBERS ----------------

async function loadMembers(){

let html = `<h2>Members</h2>

<h3>Add Member</h3>

<input id="mname" placeholder="Name">
<input id="mphone" placeholder="Phone">
<input id="memail" placeholder="Email">

<button onclick="addMember()">Add Member</button>

<h3>Member List</h3>

<table id="memberTable">
<tr>
<th>Name</th>
<th>Phone</th>
<th>Email</th>
<th>Total Contribution</th>
</tr>
`

let snap = await db.collection("members").get()

snap.forEach(doc=>{
let m = doc.data()

html += `<tr>
<td>${m.Name}</td>
<td>${m.Phone || ""}</td>
<td>${m.Email || ""}</td>
<td>${m.TotalContribution || 0}</td>
</tr>`
})

html += "</table>"

document.getElementById("content").innerHTML = html
}



async function addMember(){

let name = document.getElementById("mname").value
let phone = document.getElementById("mphone").value
let email = document.getElementById("memail").value

await db.collection("members").add({

Name:name,
Phone:phone,
Email:email,
TotalContribution:0

})

alert("Member added")

loadMembers()

}



// ---------------- MEMBER DROPDOWN ----------------

async function memberDropdown(){

let snap = await db.collection("members").get()

let html = `<select id="memberSelect">`

snap.forEach(doc=>{
let m = doc.data()
html += `<option value="${doc.id}">${m.Name}</option>`
})

html += "</select>"

return html
}



// ---------------- BUDGET ----------------

async function loadBudget(){

let html = `<h2>Budget</h2>

<h3>Add Budget</h3>

<input id="cat" placeholder="Category">
<input id="subcat" placeholder="SubCategory">
<input id="amount" placeholder="Budget Amount">

<button onclick="addBudget()">Add Budget</button>

<h3>Budget List</h3>

<table>
<tr>
<th>Category</th>
<th>SubCategory</th>
<th>Budget</th>
<th>Spent</th>
<th>Balance</th>
</tr>
`

let snap = await db.collection("budget").get()

snap.forEach(doc=>{
let b = doc.data()

html += `<tr>
<td>${b.Category}</td>
<td>${b.SubCategory}</td>
<td>${b.BudgetAmount}</td>
<td>${b.Spent || 0}</td>
<td>${b.Balance || b.BudgetAmount}</td>
</tr>`
})

html += "</table>"

document.getElementById("content").innerHTML = html
}



async function addBudget(){

let cat = document.getElementById("cat").value
let sub = document.getElementById("subcat").value
let amount = Number(document.getElementById("amount").value)

await db.collection("budget").add({

Category:cat,
SubCategory:sub,
BudgetAmount:amount,
Spent:0,
Balance:amount

})

alert("Budget added")

loadBudget()

}



// ---------------- INCOME ----------------

async function loadIncome(){

let members = await memberDropdown()

document.getElementById("content").innerHTML = `

<h2>Collection Entry</h2>

Type
<select id="type">
<option>Cash</option>
<option>Check</option>
</select>

Member
${members}

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

let memberDoc = await db.collection("members").doc(memberId).get()

let memberName = memberDoc.data().Name

await db.collection("income").add({

MemberID:memberId,
MemberName:memberName,
Amount:amount,
Type:document.getElementById("type").value,
Purpose:document.getElementById("purpose").value,
CheckNumber:document.getElementById("check").value,
Date:new Date()

})

let total = memberDoc.data().TotalContribution || 0

db.collection("members").doc(memberId).update({

TotalContribution: total + amount

})

alert("Collection saved")

}



// ---------------- EXPENSE ----------------

async function loadExpense(){

let snap = await db.collection("budget").get()

let budgetSelect = `<select id="budgetSelect">`

snap.forEach(doc=>{
let b = doc.data()
budgetSelect += `<option value="${doc.id}">
${b.Category} - ${b.SubCategory}
</option>`
})

budgetSelect += "</select>"

document.getElementById("content").innerHTML = `

<h2>Expense Entry</h2>

Payee
<input id="payee">

Purpose
<input id="purpose">

Budget
${budgetSelect}

Amount
<input id="amount">

<button onclick="addExpense()">Save</button>

`
}



async function addExpense(){

let budgetId = document.getElementById("budgetSelect").value
let amount = Number(document.getElementById("amount").value)

await db.collection("expense").add({

BudgetID:budgetId,
Amount:amount,
Purpose:document.getElementById("purpose").value,
Date:new Date()

})

let ref = db.collection("budget").doc(budgetId)

let doc = await ref.get()

let spent = doc.data().Spent || 0
let total = doc.data().BudgetAmount

let newSpent = spent + amount

ref.update({

Spent:newSpent,
Balance: total - newSpent

})

alert("Expense saved")

}



// ---------------- REPORTS ----------------

function loadReports(){

document.getElementById("content").innerHTML = `

<h2>Reports</h2>

<button onclick="collectionReport('month')">Monthly Collections</button>

<button onclick="collectionReport('quarter')">Quarterly Collections</button>

<button onclick="collectionReport('ytd')">Year To Date Collections</button>

<br><br>

<button onclick="expenseReport('month')">Monthly Expenses</button>

<button onclick="expenseReport('quarter')">Quarterly Expenses</button>

<button onclick="expenseReport('ytd')">Year To Date Expenses</button>

`
}



async function collectionReport(){

let snap = await db.collection("income").get()

let total = 0

let html = "<h2>Collection Report</h2>"
html += "<table><tr><th>Member</th><th>Purpose</th><th>Amount</th></tr>"

snap.forEach(doc=>{

let d = doc.data()

total += d.Amount

html += `<tr>
<td>${d.MemberName}</td>
<td>${d.Purpose}</td>
<td>${d.Amount}</td>
</tr>`

})

html += `</table><h3>Total ${total}</h3>`

document.getElementById("content").innerHTML = html

}



async function expenseReport(){

let snap = await db.collection("expense").get()

let total = 0

let html = "<h2>Expense Report</h2>"
html += "<table><tr><th>Purpose</th><th>Amount</th></tr>"

snap.forEach(doc=>{

let d = doc.data()

total += d.Amount

html += `<tr>
<td>${d.Purpose}</td>
<td>${d.Amount}</td>
</tr>`

})

html += `</table><h3>Total ${total}</h3>`

document.getElementById("content").innerHTML = html

}
```

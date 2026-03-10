console.log("app.js loaded")

// DASHBOARD
async function dashboard(){

const snap = await db.collection("budget").get()

let html = "<h2>Budget Dashboard</h2>"

snap.forEach(doc => {

const b = doc.data()

html += `
<div class="card">

<b>${b.Category}</b><br>
SubCategory: ${b.SubCategory}<br>
Budget: $${b.BudgetAmount}<br>
Spent: $${b.Spent || 0}<br>
Balance: $${b.Balance || b.BudgetAmount}

</div>
`
})

document.getElementById("content").innerHTML = html

}



// MEMBERS
async function loadMembers(){

let html = "<h2>Members</h2>"

html += `
<h3>Add Member</h3>

<input id="mname" placeholder="Name">
<input id="madd1" placeholder="Address1">
<input id="madd2" placeholder="Address2">
<input id="madd3" placeholder="Address3">
<input id="mphone" placeholder="Phone">
<input id="memail" placeholder="Email">

<button onclick="addMember()">Add Member</button>

<h3>Member List</h3>

`

let snap = await db.collection("members").get()

snap.forEach(doc=>{

let m = doc.data()

html += `
<div class="card">

<div class="card-title">${m.Name}</div>

<div class="card-row">Phone: ${m.Phone || ""}</div>

<div class="card-row">Email: ${m.Email || ""}</div>

<div class="card-row">Total Contribution: $${m.TotalContribution || 0}</div>

</div>
`

})

document.getElementById("content").innerHTML = html

}


async function addMember(){

const name = document.getElementById("mname").value
const address1 = document.getElementById("madd1").value
const address2 = document.getElementById("madd2").value
const address3 = document.getElementById("madd3").value
const phone = document.getElementById("mphone").value
const email = document.getElementById("memail").value

/*await db.collection("members").add({

Name:name,
Address1:address1,
Address2:address2,
Address3:address3,
Phone:phone,
Email:email,
TotalContribution:0

}) */

const ref = db.collection("members").doc()
await ref.set({
MemberID: ref.id,
Name:name,
Address1:address1,
Address2:address2,
Address3:address3,
Phone:phone,
Email:email,
TotalContribution:0

})


alert("Member added")

loadMembers()

}



// MEMBER DROPDOWN
async function memberDropdown(){

const snap = await db.collection("members").get()

let html = `<select id="memberSelect">`

snap.forEach(doc => {

const m = doc.data()

html += `<option value="${m.MemberID}">
${m.MemberID} - ${m.Name}
</option>`

})

html += `</select>`

return html
}



// BUDGET
async function loadBudget(){

let html = `
<h2>Budget</h2>

<h3>Add Budget</h3>

<input id="cat" placeholder="Category">
<input id="subcat" placeholder="SubCategory">
<input id="amount" placeholder="Budget Amount">

<button onclick="addBudget()">Add Budget</button>

<h3>Budget List</h3>
`

const snap = await db.collection("budget").get()

snap.forEach(doc => {

const b = doc.data()

html += `
<div class="card">

<b>${b.Category}</b><br>
SubCategory: ${b.SubCategory}<br>
Budget: $${b.BudgetAmount}<br>
Spent: $${b.Spent || 0}<br>
Balance: $${b.Balance || b.BudgetAmount}

</div>
`
})

document.getElementById("content").innerHTML = html
}



async function addBudget(){

const cat = document.getElementById("cat").value
const sub = document.getElementById("subcat").value
const amount = Number(document.getElementById("amount").value)

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



// INCOME
async function loadIncome(){

const members = await memberDropdown()

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

const memberId = document.getElementById("memberSelect").value
const amount = Number(document.getElementById("amount").value)

const memberDoc = await db.collection("members").doc(memberId).get()

const memberName = memberDoc.data().Name

await db.collection("income").add({

MemberID:memberId,
MemberName:memberName,
Amount:amount,
Type:document.getElementById("type").value,
Purpose:document.getElementById("purpose").value,
CheckNumber:document.getElementById("check").value,
Date:new Date()

})

const total = memberDoc.data().TotalContribution || 0

await db.collection("members").doc(memberId).update({

TotalContribution: total + amount

})

alert("Collection saved")

}



/*// EXPENSE
async function loadExpense(){

const snap = await db.collection("budget").get()

let budgetSelect = `<select id="budgetSelect">`

snap.forEach(doc => {

const b = doc.data()

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

const budgetId = document.getElementById("budgetSelect").value
const amount = Number(document.getElementById("amount").value)

await db.collection("expense").add({

BudgetID:budgetId,
Amount:amount,
Purpose:document.getElementById("purpose").value,
Date:new Date()

})

const ref = db.collection("budget").doc(budgetId)

const doc = await ref.get()

const spent = doc.data().Spent || 0
const total = doc.data().BudgetAmount

const newSpent = spent + amount

await ref.update({

Spent:newSpent,
Balance: total - newSpent

})

alert("Expense saved")

}
*/

// EXPENSE
async function loadExpense(){

const snap = await db.collection("budget").get()

let budgetSelect = `<select id="budgetSelect">`

snap.forEach(doc => {

const b = doc.data()

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
//added
const members = await memberDropdown()

document.getElementById("content").innerHTML = `

<h2>Expense Entry</h2>

Payee Type
<select id="payeeType" onchange="togglePayee()">
<option value="member">Member</option>
<option value="other">Other</option>
</select>

<div id="memberPayee">
${members}
</div>

<div id="otherPayee" style="display:none">
<input id="payeeName" placeholder="Contractor/Plumber Name">
</div>

Purpose
<input id="purpose">

Amount
<input id="amount">

<button onclick="addExpense()">Save</button>
`


}



async function addExpense(){

const budgetId = document.getElementById("budgetSelect").value
const amount = Number(document.getElementById("amount").value)

await db.collection("expense").add({

BudgetID:budgetId,
Amount:amount,
Purpose:document.getElementById("purpose").value,
Date:new Date()

})

const ref = db.collection("budget").doc(budgetId)

const doc = await ref.get()

const spent = doc.data().Spent || 0
const total = doc.data().BudgetAmount

const newSpent = spent + amount

await ref.update({

Spent:newSpent,
Balance: total - newSpent

})

alert("Expense saved")

}



// REPORT MENU
function loadReports(){

document.getElementById("content").innerHTML = `

<h2>Reports</h2>

<button onclick="collectionReport()">Collection Report</button>

<button onclick="expenseReport()">Expense Report</button>

`
}



// COLLECTION REPORT
async function collectionReport(){

const snap = await db.collection("income").get()

let total = 0

let html = "<h2>Collection Report</h2>"

snap.forEach(doc => {

const d = doc.data()

total += d.Amount

html += `
<div class="card">

Member: ${d.MemberName}<br>
Purpose: ${d.Purpose}<br>
Amount: $${d.Amount}

</div>
`
})

html += `<h3>Total: $${total}</h3>`

document.getElementById("content").innerHTML = html

}

function togglePayee(){

const type = document.getElementById("payeeType").value

document.getElementById("memberPayee").style.display =
type==="member" ? "block" : "none"

document.getElementById("otherPayee").style.display =
type==="other" ? "block" : "none"
}

// EXPENSE REPORT
async function expenseReport(){

const snap = await db.collection("expense").get()

let total = 0

let html = "<h2>Expense Report</h2>"

snap.forEach(doc => {

const d = doc.data()

total += d.Amount

html += `
<div class="card">

Purpose: ${d.Purpose}<br>
Amount: $${d.Amount}

</div>
`
})

html += `<h3>Total: $${total}</h3>`

document.getElementById("content").innerHTML = html

}


//Dashboard chart:
async function loadFinanceChart(){

const incomeSnap = await db.collection("income").get()
const expenseSnap = await db.collection("expense").get()

let incomeTotal = 0
let expenseTotal = 0

incomeSnap.forEach(doc=>{
incomeTotal += doc.data().Amount
})

expenseSnap.forEach(doc=>{
expenseTotal += doc.data().Amount
})

document.getElementById("content").innerHTML = `
<h2>Finance Dashboard</h2>

<canvas id="financeChart"></canvas>
`

const ctx = document.getElementById("financeChart")

new Chart(ctx,{
type:"bar",
data:{
labels:["Income","Expense"],
datasets:[{
label:"Church Finance",
data:[incomeTotal,expenseTotal],
backgroundColor:["green","red"]
}]
}
})
}

//This shows total contribution by each person.
async function memberContributionReport(){

const snap = await db.collection("income").get()

let totals = {}

snap.forEach(doc=>{

const d = doc.data()

if(!totals[d.MemberID]){
totals[d.MemberID] = {
name:d.MemberName,
total:0
}
}

totals[d.MemberID].total += d.Amount
})

let html = "<h2>Member Contributions</h2>"

Object.keys(totals).forEach(id=>{

html += `
<div class="card">

${totals[id].name}<br>
Total Contribution: $${totals[id].total}

</div>
`
})

document.getElementById("content").innerHTML = html
}

//5. Export Reports to Excel

async function exportCollectionsExcel(){

const snap = await db.collection("income").get()

let rows = []

snap.forEach(doc=>{
rows.push(doc.data())
})

const worksheet = XLSX.utils.json_to_sheet(rows)

const workbook = XLSX.utils.book_new()

XLSX.utils.book_append_sheet(workbook,worksheet,"Collections")

XLSX.writeFile(workbook,"church_collections.xlsx")
}

//6. Generate Contribution PDF (Member Statement)

async function generateMemberPDF(memberId){

const { jsPDF } = window.jspdf

const snap = await db.collection("income")
.where("MemberID","==",memberId)
.get()

let total = 0

const doc = new jsPDF()

doc.text("Church Contribution Statement",20,20)

let y = 40

snap.forEach(d=>{

const data = d.data()

doc.text(`${data.Purpose}  $${data.Amount}`,20,y)

y += 10

total += data.Amount

})

doc.text("Total Contribution: $" + total,20,y+10)

doc.save("member_statement.pdf")
}
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
console.log("app.js loaded")
console.log("All functions defined:", {
  dashboard: typeof dashboard,
  loadMembers: typeof loadMembers,
  loadBudget: typeof loadBudget,
  loadIncome: typeof loadIncome,
  loadExpense: typeof loadExpense,
  loadReports: typeof loadReports,
  exportCollectionsExcel: typeof exportCollectionsExcel,
  showTaxReportOptions: typeof showTaxReportOptions
})
// ===== DASHBOARD =====
async function dashboard(){
  const incomeSnap = await db.collection("income").get()
  const expenseSnap = await db.collection("expense").get()
  const budgetSnap = await db.collection("budget").get()
  let incomeTotal = 0, expenseTotal = 0, budgetTotal = 0
  let incomeByMonth = {}, expenseByCategory = {}
  incomeSnap.forEach(doc => {
    const d = doc.data()
    incomeTotal += d.Amount || 0
    const month = d.Date ? new Date(d.Date.toDate()).toLocaleString('default', { month: 'short' }) : 'Unknown'
    incomeByMonth[month] = (incomeByMonth[month] || 0) + (d.Amount || 0)
  })
  expenseSnap.forEach(doc => {
    const d = doc.data()
    expenseTotal += d.Amount || 0
    expenseByCategory[d.Category || 'Other'] = (expenseByCategory[d.Category || 'Other'] || 0) + (d.Amount || 0)
  })
  budgetSnap.forEach(doc => {
    const d = doc.data()
    budgetTotal += d.BudgetAmount || 0
  })
  let html = "<h2>📊 Finance Dashboard</h2><div class="stats-grid"><div class="stat-card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%);"><div class="stat-value">\$" + formatCurrency(incomeTotal) + "</div><div class="stat-label">Total Income</div></div><div class="stat-card" style="background: linear-gradient(135deg, #dc3545 0%, #e74c3c 100%);"><div class="stat-value">\$" + formatCurrency(expenseTotal) + "</div><div class="stat-label">Total Expenses</div></div><div class="stat-card" style="background: linear-gradient(135deg, #17a2b8 0%, #1ba1b8 100%);"><div class="stat-value">\$" + formatCurrency(incomeTotal - expenseTotal) + "</div><div class="stat-label">Net Balance</div></div><div class="stat-card" style="background: linear-gradient(135deg, #ffc107 0%, #ffb300 100%);"><div class="stat-value">\$" + formatCurrency(budgetTotal) + "</div><div class="stat-label">Total Budget</div></div></div><div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 30px;"><div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);"><canvas id="incomeChart"></canvas></div><div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);"><canvas id="expenseChart"></canvas></div><div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);"><canvas id="comparisonChart"></canvas></div><div style="background:white; padding:20px; border-radius:8px; box-shadow:0 2px 5px rgba(0,0,0,0.1);"><canvas id="budgetChart"></canvas></div></div>"
  document.getElementById("content").innerHTML = html
  setTimeout(() => {
    const monthLabels = Object.keys(incomeByMonth)
    const monthValues = Object.values(incomeByMonth)
    const ctxIncome = document.getElementById("incomeChart")
    if (ctxIncome) {
      new Chart(ctxIncome, {
        type: "bar",
        data: { labels: monthLabels, datasets: [{ label: "Income by Month", data: monthValues, backgroundColor: "#28a745" }] },
        options: { responsive: true, maintainAspectRatio: true }
      })
    }
  }, 100)
}
async function loadMembers(){
  let html = "<h2>👥 Members</h2><div class="form-container"><h3>Add New Member</h3><div class="form-row three"><div class="form-group"><label>Name *</label><input id="mname" placeholder="Full Name"></div><div class="form-group"><label>Phone *</label><input id="mphone" placeholder="Phone"></div><div class="form-group"><label>Email *</label><input id="memail" type="email" placeholder="Email"></div></div><div class="form-group"><label>Address 1 *</label><input id="madd1" placeholder="Street"></div><div class="form-group"><label>Address 2</label><input id="madd2"></div><button onclick="addMember()" class="success">✅ Add</button></div><h3>Members</h3><div class="search-box"><input id="memberSearch" placeholder="Search..." onkeyup="filterMembers()"></div>"
  const snap = await db.collection("members").get()
  let members = []
  snap.forEach(doc => members.push({id: doc.id, ...doc.data()}))
  html += "<table><thead><tr><th>Name</th><th>Phone</th><th>Email</th><th>Address</th><th>Total</th><th>Actions</th></tr></thead><tbody>"
  members.forEach(m => {
    html += "<tr><td>" + m.Name + "</td><td>" + (m.Phone || '-') + "</td><td>" + (m.Email || '-') + "</td><td>" + (m.Address1 || '-') + "</td><td>\$" + formatCurrency(m.TotalContribution || 0) + "</td><td><button class="small danger" onclick="deleteMember('" + m.id + "')">Delete</button></td></tr>"
  })
  html += "</tbody></table>"
  document.getElementById("content").innerHTML = html
}
async function addMember(){
  const name = document.getElementById("mname").value
  const phone = document.getElementById("mphone").value
  const email = document.getElementById("memail").value
  const add1 = document.getElementById("madd1").value
  const add2 = document.getElementById("madd2").value
  if (!validateRequired(name, "Name")) return
  if (!validateRequired(phone, "Phone")) return
  if (!validateRequired(email, "Email")) return
  if (!validateRequired(add1, "Address 1")) return
  if (!validatePhone(phone)) { showError("Invalid phone"); return }
  if (!validateEmail(email)) { showError("Invalid email"); return }
  if (await checkDuplicateMember(name, email, phone)) { showError("Member exists"); return }
  const ref = db.collection("members").doc()
  await ref.set({
    MemberID: ref.id, Name: name, Phone: phone, Email: email, Address1: add1, Address2: add2, 
    TotalContribution: 0, CreatedDate: new Date()
  })
  showSuccess("Member added!")
  loadMembers()
}
async function deleteMember(id) {
  if (confirm("Delete?")) {
    await db.collection("members").doc(id).delete()
    showSuccess("Deleted!")
    loadMembers()
  }
}
async function filterMembers(){
  const search = document.getElementById("memberSearch").value.toLowerCase()
  // Reload and filter display
}
async function loadBudget(){
  let html = "<h2>📋 Budget</h2><div class="form-container"><h3>Add</h3><div class="form-row three"><div class="form-group"><label>Year</label><input id="byear" type="number" value="2026"></div><div class="form-group"><label>Category</label><input id="bcat"></div><div class="form-group"><label>SubCategory</label><input id="bsubcat"></div></div><div class="form-group"><label>Amount</label><input id="bamount" type="number" step="0.01"></div><button onclick="addBudget()" class="success">✅ Add</button></div><h3>Budget List</h3><select id="budgetYearFilter" onchange="filterBudgetsByYear()"><option>All Years</option><option>2024</option><option>2025</option><option selected>2026</option><option>2027</option></select>"
  const snap = await db.collection("budget").get()
  html += "<table><thead><tr><th>Year</th><th>Category</th><th>SubCategory</th><th>Budget</th><th>Spent</th><th>Balance</th><th>Actions</th></tr></thead><tbody>"
  snap.forEach(doc => {
    const b = doc.data()
    const balance = (b.BudgetAmount || 0) - (b.Spent || 0)
    html += "<tr><td>" + (b.FiscalYear || 'N/A') + "</td><td>" + b.Category + "</td><td>" + b.SubCategory + "</td><td>\$" + formatCurrency(b.BudgetAmount) + "</td><td>\$" + formatCurrency(b.Spent || 0) + "</td><td>\$" + formatCurrency(balance) + "</td><td><button class="small danger" onclick="deleteBudget('" + doc.id + "')">Delete</button></td></tr>"
  })
  html += "</tbody></table>"
  document.getElementById("content").innerHTML = html
}
async function addBudget(){
  const year = document.getElementById("byear").value
  const cat = document.getElementById("bcat").value
  const sub = document.getElementById("bsubcat").value
  const amount = Number(document.getElementById("bamount").value)
  if (!validateRequired(cat, "Category")) return
  if (!validateRequired(sub, "SubCategory")) return
  if (!validatePositiveNumber(amount, "Amount")) return
  await db.collection("budget").add({
    FiscalYear: parseInt(year), Category: cat, SubCategory: sub,
    BudgetAmount: amount, Spent: 0, Balance: amount
  })
  showSuccess("Budget added!")
  loadBudget()
}
async function deleteBudget(id) {
  if (confirm("Delete?")) {
    await db.collection("budget").doc(id).delete()
    loadBudget()
  }
}
async function filterBudgetsByYear(){}
async function loadIncome(){
  const members = await getMemberDropdown()
  const today = getTodayDate()
  let html = "<h2>💰 Income</h2><div class="form-container"><div class="form-row"><div class="form-group"><label>Type</label><select id="itype"><option>Offering-General</option><option>Offering-Personal</option></select></div><div class="form-group"><label>Mode</label><select id="imode" onchange="toggleIncomeFields()"><option>Cash</option><option>Check</option><option>PayPal</option><option>Stripe</option><option>Venmo</option></select></div></div><div id="checkField" style="display:none;"><label>Check #</label><input id="ichecknum"></div><div id="transactionField" style="display:none;"><label>Transaction #</label><input id="itransnum"></div><div class="form-group"><label>Member</label><input type="radio" name="isMember" value="yes" onchange="toggleMemberField()"> Member <input type="radio" name="isMember" value="no" onchange="toggleMemberField()"> Non-Member</div><div id="memberSelect" style="display:none;">" + members + "</div><div id="nonMemberName" style="display:none;"><label>Name</label><input id="idonorname"></div><div class="form-row"><div class="form-group"><label>Amount</label><input id="iamount" type="number" step="0.01"></div><div class="form-group"><label>Date</label><input id="idate" type="date" value="" + today + ""></div></div><button onclick="addIncome()" class="success">✅ Save</button></div>"
  document.getElementById("content").innerHTML = html.replace(/\{\{today\}\}/g, today)
}
async function getMemberDropdown() {
  const snap = await db.collection("members").get()
  let html = '<select id="memberSelect2">'
  snap.forEach(doc => {
    const m = doc.data()
    html += '<option value="' + m.MemberID + '">' + m.Name + '</option>'
  })
  html += '</select>'
  return html
}
function toggleIncomeFields() {
  const mode = document.getElementById("imode").value
  document.getElementById("checkField").style.display = mode === "Check" ? "block" : "none"
  document.getElementById("transactionField").style.display = ["PayPal", "Stripe", "Venmo"].includes(mode) ? "block" : "none"
}
function toggleMemberField() {
  const isMember = document.querySelector('input[name="isMember"]:checked')?.value
  document.getElementById("memberSelect").style.display = isMember === "yes" ? "block" : "none"
  document.getElementById("nonMemberName").style.display = isMember === "no" ? "block" : "none"
}
async function addIncome(){
  const type = document.getElementById("itype").value
  const mode = document.getElementById("imode").value
  const amount = Number(document.getElementById("iamount").value)
  const date = document.getElementById("idate").value
  const isMember = document.querySelector('input[name="isMember"]:checked')?.value
  if (!validateRequired(type, "Type")) return
  if (!validateRequired(mode, "Mode")) return
  if (!validateRequired(isMember, "Member status")) return
  if (!validatePositiveNumber(amount, "Amount")) return
  if (mode === "Check" && !document.getElementById("ichecknum").value) { showError("Check # required"); return }
  if (["PayPal", "Stripe", "Venmo"].includes(mode) && !document.getElementById("itransnum").value) { showError("Transaction # required"); return }
  let memberId, memberName
  if (isMember === "yes") {
    memberId = document.getElementById("memberSelect2").value
    const memberDoc = await db.collection("members").doc(memberId).get()
    memberName = memberDoc.data().Name
  } else {
    memberName = document.getElementById("idonorname").value
    if (!validateRequired(memberName, "Donor Name")) return
  }
  await db.collection("income").add({
    Type: type, Mode: mode, MemberID: memberId, MemberName: memberName, Amount: amount,
    Date: new Date(date), CheckNumber: mode === "Check" ? document.getElementById("ichecknum").value : null,
    TransactionNumber: ["PayPal", "Stripe", "Venmo"].includes(mode) ? document.getElementById("itransnum").value : null
  })
  if (memberId) {
    const memberDoc = await db.collection("members").doc(memberId).get()
    const currentTotal = memberDoc.data().TotalContribution || 0
    await db.collection("members").doc(memberId).update({ TotalContribution: currentTotal + amount })
  }
  showSuccess("Income saved!")
  loadIncome()
}
async function loadExpense(){
  const budgetCats = await getBudgetDropdown()
  const members = await getMemberDropdown()
  const today = getTodayDate()
  let html = "<h2>💸 Expense</h2><div class="form-container"><div class="form-group"><label>Payee Type</label><select id="epayeetype" onchange="toggleExpensePayee()"><option>Member</option><option>Other</option></select></div><div id="memberPayeeDiv"><label>Member</label>" + members + "</div><div id="otherPayeeDiv" style="display:none;"><label>Name</label><input id="epayeename"><label>Address</label><input id="epayeeaddr"></div><div class="form-row"><div class="form-group"><label>Category</label>" + budgetCats + "</div><div class="form-group"><label>Amount</label><input id="eamount" type="number" step="0.01"></div></div><div class="form-row"><div class="form-group"><label>Purpose</label><input id="epurpose"></div><div class="form-group"><label>Date</label><input id="edate" type="date" value="" + today + ""></div></div><button onclick="addExpense()" class="success">✅ Save</button></div>"
  document.getElementById("content").innerHTML = html
}
async function getBudgetDropdown() {
  const snap = await db.collection("budget").get()
  let html = '<select id="budgetSelect">'
  snap.forEach(doc => {
    const b = doc.data()
    html += '<option value="' + doc.id + '">' + b.Category + ' - ' + b.SubCategory + '</option>'
  })
  html += '</select>'
  return html
}
function toggleExpensePayee() {
  const type = document.getElementById("epayeetype").value
  document.getElementById("memberPayeeDiv").style.display = type === "Member" ? "block" : "none"
  document.getElementById("otherPayeeDiv").style.display = type === "Other" ? "block" : "none"
}
async function addExpense(){
  const payeeType = document.getElementById("epayeetype").value
  const budgetId = document.getElementById("budgetSelect").value
  const amount = Number(document.getElementById("eamount").value)
  const purpose = document.getElementById("epurpose").value
  const date = document.getElementById("edate").value
  let payeeName = payeeType === "Member" ? document.getElementById("memberSelect2").value : document.getElementById("epayeename").value
  if (!validateRequired(payeeType, "Payee Type")) return
  if (!validateRequired(budgetId, "Budget")) return
  if (!validatePositiveNumber(amount, "Amount")) return
  if (!validateRequired(purpose, "Purpose")) return
  const budgetRef = db.collection("budget").doc(budgetId)
  const budgetDoc = await budgetRef.get()
  const budgetData = budgetDoc.data()
  await db.collection("expense").add({
    PayeeType: payeeType, PayeeName: payeeName, PayeeAddress: document.getElementById("epayeeaddr")?.value || null,
    BudgetID: budgetId, Category: budgetData.Category, SubCategory: budgetData.SubCategory,
    Amount: amount, Purpose: purpose, Date: new Date(date)
  })
  const newSpent = (budgetData.Spent || 0) + amount
  await budgetRef.update({ Spent: newSpent, Balance: budgetData.BudgetAmount - newSpent })
  showSuccess("Expense saved!")
  loadExpense()
}
function loadReports(){
  document.getElementById("content").innerHTML = '<h2>📈 Reports</h2><button onclick="collectionReport()" style="padding:30px;">📊 Collection</button><button onclick="expenseReport()" style="padding:30px;">💸 Expense</button>'
}
async function collectionReport(){
  const snap = await db.collection("income").get()
  let data = [], total = 0
  snap.forEach(doc => { const d = doc.data(); data.push(d); total += d.Amount || 0 })
  data.sort((a, b) => new Date(b.Date.toDate()) - new Date(a.Date.toDate()))
  let html = "<h2>💰 Collection Report</h2><table><thead><tr><th>Date</th><th>Member</th><th>Type</th><th>Mode</th><th>Amount</th></tr></thead><tbody>"
  data.forEach(d => {
    const dateStr = d.Date ? new Date(d.Date.toDate()).toLocaleDateString() : '-'
    html += "<tr><td>" + dateStr + "</td><td>" + (d.MemberName || '-') + "</td><td>" + (d.Type || '-') + "</td><td>" + (d.Mode || '-') + "</td><td>\$" + formatCurrency(d.Amount) + "</td></tr>"
  })
  html += "</tbody></table><h3>Total: \$" + formatCurrency(total) + "</h3>"
  document.getElementById("content").innerHTML = html
}
async function expenseReport(){
  const snap = await db.collection("expense").get()
  let data = [], total = 0, byCategory = {}
  snap.forEach(doc => { const d = doc.data(); data.push(d); total += d.Amount || 0; byCategory[d.Category] = (byCategory[d.Category] || 0) + (d.Amount || 0) })
  data.sort((a, b) => new Date(b.Date.toDate()) - new Date(a.Date.toDate()))
  let html = "<h2>💸 Expense Report</h2><table><thead><tr><th>Date</th><th>Category</th><th>Payee</th><th>Amount</th><th>Purpose</th></tr></thead><tbody>"
  data.forEach(d => {
    const dateStr = d.Date ? new Date(d.Date.toDate()).toLocaleDateString() : '-'
    html += "<tr><td>" + dateStr + "</td><td>" + (d.Category || '-') + "</td><td>" + (d.PayeeName || '-') + "</td><td>\$" + formatCurrency(d.Amount) + "</td><td>" + (d.Purpose || '-') + "</td></tr>"
  })
  html += "</tbody></table><h3>By Category</h3><table><tr><th>Category</th><th>Amount</th></tr>"
  Object.keys(byCategory).forEach(cat => { html += "<tr><td>" + cat + "</td><td>\$" + formatCurrency(byCategory[cat]) + "</td></tr>" })
  html += "</table><h3>Total: \$" + formatCurrency(total) + "</h3>"
  document.getElementById("content").innerHTML = html
}
async function exportCollectionsExcel(){
  const snap = await db.collection("income").get()
  let rows = []
  snap.forEach(doc => {
    const d = doc.data()
    rows.push({
      Date: d.Date ? new Date(d.Date.toDate()).toLocaleDateString() : '',
      Member: d.MemberName || '',
      Type: d.Type || '',
      Mode: d.Mode || '',
      Amount: d.Amount || 0
    })
  })
  exportToExcel(rows, 'collections.xlsx', 'Collections')
  showSuccess("Export complete!")
}
async function showTaxReportOptions(){
  const years = [2024, 2025, 2026, 2027]
  const snap = await db.collection("members").get()
  let html = '<h2>🎯 Tax Report</h2><div class="form-container"><label>Year</label><select id="taxYear">'
  years.forEach(y => { html += '<option value="' + y + '" ' + (y === getCurrentFiscalYear() ? 'selected' : '') + '>' + y + '</option>' })
  html += '</select><label>Members</label>'
  snap.forEach(doc => {
    const m = doc.data()
    html += '<label><input type="checkbox" class="member-checkbox" value="' + m.MemberID + '" data-name="' + m.Name + '" data-email="' + m.Email + '" data-addr1="' + (m.Address1 || '') + '">' + m.Name + '</label>'
  })
  html += '<button onclick="generateTaxReport()" class="success">✅ Generate</button></div>'
  document.getElementById("content").innerHTML = html
}
async function generateTaxReport(){
  const { jsPDF } = window.jspdf
  const year = document.getElementById("taxYear").value
  const checkedMembers = document.querySelectorAll(".member-checkbox:checked")
  if (checkedMembers.length === 0) { showError("Select a member"); return }
  const doc = new jsPDF()
  let yPos = 20
  addPDFHeader(doc, "Church Tax Report - " + year, true)
  yPos = 40
  for (let checkbox of checkedMembers) {
    const memberId = checkbox.value
    const memberName = checkbox.dataset.name
    const memberEmail = checkbox.dataset.email
    const addr1 = checkbox.dataset.addr1
    const snap = await db.collection("income").where("MemberID", "==", memberId).get()
    let total = 0
    snap.forEach(docSnap => {
      const d = docSnap.data()
      if (d.Date && new Date(d.Date.toDate()).getFullYear() == year) {
        total += d.Amount || 0
      }
    })
    if (yPos > 250) { doc.addPage(); yPos = 20 }
    doc.setFontSize(11)
    doc.setFont(undefined, "bold")
    doc.text(memberName, 20, yPos)
    yPos += 5
    doc.setFontSize(9)
    doc.setFont(undefined, "normal")
    doc.text("Email: " + memberEmail, 20, yPos)
    yPos += 4
    doc.text("Address: " + addr1, 20, yPos)
    yPos += 4
    doc.setFont(undefined, "bold")
    doc.text("Total: \$" + formatCurrency(total), 20, yPos)
    yPos += 8
    doc.line(20, yPos, 190, yPos)
    yPos += 5
  }
  doc.save("tax_report_" + year + ".pdf")
  showSuccess("Report generated!")
  dashboard()
}

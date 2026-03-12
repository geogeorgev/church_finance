# Church Finance Manager - User Guide

## Quick Start

### Login
- Enter your registered email and password
- Click "Login"

---

## 📊 Dashboard

**View:** Overview of all finances
- **Total Income** - All money received
- **Total Expenses** - All money spent
- **Net Balance** - Income minus expenses
- **Total Budget** - Sum of all budget allocations
- **Charts:**
  - Income by Month - See monthly trends
  - Expenses by Category - Pie chart of spending
  - Income vs Expense - Compare totals
  - Budget vs Spent - Track spending by category

---

## 👥 Members

### Add a New Member
1. Click **Members** button
2. Fill in required fields (marked with *):
   - **Name** - Full name (required)
   - **Phone** - Phone number (required)
   - **Email** - Email address (required)
   - **Address 1** - Street address (required)
   - **Address 2** - Apt/Suite (optional)
   - **Address 3** - City/State/ZIP (optional)
3. Click **✅ Add** button
4. You'll see a success message

### Search Members
1. In the Member List section, use the **Search** box
2. Type name or email to filter the list
3. Results update in real-time

### Delete a Member
1. Find member in the list
2. Click **Delete** button in the Actions column

### Validation Rules
- All fields with * are required
- Email must be a valid email format
- Phone must be 10+ digits
- No duplicate members allowed (same name, email, or phone)

---

## 📋 Budget

### Add a Budget
1. Click **Budget** button
2. Fill in the form:
   - **Fiscal Year** - Budget year (defaults to current year)
   - **Category** - Main budget category (e.g., "Worship", "Community")
   - **SubCategory** - Detailed category (e.g., "Supplies", "Outreach")
   - **Budget Amount** - How much is allocated
3. Click **✅ Add** button

### View Budgets
- See all budgets in table format
- Columns show: Year, Category, SubCategory, Budget Amount, Spent, Balance
- **Balance** turns red if negative (over budget)

### Filter by Year
1. Use the year filter dropdown
2. Select a year or "All Years"
3. Table updates automatically

### Delete a Budget
1. Find the budget in the table
2. Click **Delete** button

---

## 💰 Income

### Record Income
1. Click **Income** button
2. Select **Type**:
   - Offering - General
   - Offering - Personal
3. Select **Mode**:
   - Cash - No additional info needed
   - Check - Need to enter check number
   - PayPal - Need transaction number
   - Stripe - Need transaction number
   - Venmo - Need transaction number
4. Select **Member**:
   - **Yes** - Select existing member from dropdown
   - **No** - Enter non-member donor name
5. Enter **Amount** (required, must be positive)
6. Select **Date** (defaults to today)
7. Click **✅ Save Income**

### Important Notes
- Member contributions are automatically tracked
- Total Contribution in Members list updates automatically
- Check/Transaction numbers are validated based on payment mode
- Date can be any date (past or future)

---

## 💸 Expense

### Record Expense
1. Click **Expense** button
2. Select **Payee Type**:
   - Member - Payment to a church member
   - Other - Payment to vendor/contractor
3. If **Member**: Select member from dropdown
   - If **Other**: Enter payee name and address
4. Select **Category** from budget (must match budget)
5. Enter **Amount** (required, must be positive)
6. Enter **Purpose** (what the expense is for)
7. Select **Date** (defaults to today)
8. Click **✅ Save Expense**

### Important Notes
- Budget balance is automatically reduced
- You can only select categories that exist in Budget
- Spent amount tracks total expenses for that budget category
- If over budget, balance shows in red

---

## 📈 Reports

### Collection Report
1. Click **Reports** button
2. Click **📊 Collection Report**
3. Use filter to view:
   - **All Collections** - Everything
   - **Today Only** - Just today's income
   - **This Month** - Current month
   - **Year to Date** - From Jan 1 to today
4. View table with: Date, Member/Donor, Type, Mode, Amount
5. Total shows at the bottom

### Expense Report
1. Click **Reports** button
2. Click **💸 Expense Report**
3. View all expenses in table format
4. See category breakdown below
5. Grand total at the bottom

---

## 📥 Export

### Export Collections to Excel
1. Click **📥 Export** button
2. File downloads automatically named: `church_collections_YYYY-MM-DD.xlsx`
3. Open in Excel to review/edit
4. Columns include: Date, Member, Type, Mode, Amount, CheckNumber, TransactionNumber

---

## 🎯 Tax Report

### Generate Tax Report (PDF)
1. Click **🎯 Tax Report** button
2. **Select Year** - Choose which fiscal year
3. **Select Members** - Check boxes next to names you want to include
4. Click **✅ Generate PDF**
5. PDF downloads with filename: `tax_report_YYYY.pdf`

### What's Included in Tax Report
- Member name
- Email address
- Full mailing address
- Total contributions for selected year
- Professional formatting suitable for filing

### Tips
- Can select multiple members
- Year must match donation year for accuracy
- PDF is formatted for tax purposes
- Can print or share with members

---

## 🚪 Logout

- Click **🚪 Logout** button in top right
- Returns to login screen

---

## Tips & Best Practices

### General
1. **Backup regularly** - Download Excel exports for backup
2. **Use proper dates** - Be consistent with date entry
3. **Keep names consistent** - Use same format for member names
4. **Validate amounts** - Double-check dollar amounts before saving
5. **Review regularly** - Check reports monthly for accuracy

### For Members
- Email addresses should be unique
- Phone numbers help prevent duplicates
- Address info is required for tax reporting

### For Budget
- Create budgets before recording expenses
- Use consistent category names
- Review balance regularly
- Plan next year's budget in advance

### For Income
- Record donations promptly
- Use transaction numbers for digital payments
- Specify offering type for reporting
- Mark member status correctly

### For Expense
- Ensure payee is member or "Other"
- Match budget category exactly
- Record purpose for audit trail
- Attach receipts separately

---

## Troubleshooting

### "Member already exists"
- You're trying to add a member with a name, email, or phone that's already in the system
- Check if member exists first
- If needed, update address instead of adding new

### "Invalid email/phone"
- Email must have @ and domain
- Phone must be 10+ digits with valid format
- Try again with correct format

### "Budget category required"
- Must create budget before recording expense for that category
- Go to Budget section first
- Create matching category/subcategory

### "Check number/Transaction number required"
- You selected a payment mode that requires this info
- Enter the number from your receipt or payment system
- Save again

### Missing data in reports
- Make sure income/expense entries have proper dates
- Check that members are properly linked
- Run dashboard to see if data loads correctly

---

## System Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- JavaScript enabled
- Firestore access

---

## Support Notes

- All data is stored in Firestore (Google's database)
- Changes save immediately
- No manual save button needed
- Data is backed up by Firestore automatically
- Download Excel exports as additional backup

---

**Version 2.0 - Professional Edition**
*Enhanced with validation, mobile responsiveness, and comprehensive reporting*


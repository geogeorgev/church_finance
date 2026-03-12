// Utility Functions for Church Finance Manager

// Validation Functions
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePhone(phone) {
  const re = /^[\d\s\-\+\(\)]+$/;
  return phone.length >= 10 && re.test(phone);
}

function validateRequired(field, fieldName) {
  if (!field || field.trim() === '') {
    showError(`${fieldName} is required`);
    return false;
  }
  return true;
}

function validatePositiveNumber(num, fieldName) {
  if (isNaN(num) || num <= 0) {
    showError(`${fieldName} must be a positive number`);
    return false;
  }
  return true;
}

function showError(message) {
  alert(`❌ Error: ${message}`);
}

function showSuccess(message) {
  alert(`✅ ${message}`);
}

function clearForm(formId) {
  const form = document.getElementById(formId);
  if (form) {
    form.reset();
  }
}

function clearInputById(elementId) {
  const elem = document.getElementById(elementId);
  if (elem) {
    elem.value = '';
  }
}

// Format Functions
function formatCurrency(amount) {
  return parseFloat(amount || 0).toFixed(2);
}

function formatDate(date) {
  if (!date) return new Date().toISOString().split('T')[0];
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}

function getTodayDate() {
  return new Date().toISOString().split('T')[0];
}

// Check for Duplicates
async function checkDuplicateMember(name, email, phone) {
  const snap = await db.collection("members").get();

  for (let doc of snap.docs) {
    const member = doc.data();
    if ((name && member.Name.toLowerCase() === name.toLowerCase()) ||
        (email && member.Email && member.Email.toLowerCase() === email.toLowerCase()) ||
        (phone && member.Phone && member.Phone === phone)) {
      return true;
    }
  }
  return false;
}

// Modal Functions
function showModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function hideModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove('active');
}

// Table Rendering
function renderTable(data, columns, actions = null) {
  let html = '<table><thead><tr>';

  // Header
  columns.forEach(col => {
    html += `<th>${col.label}</th>`;
  });

  if (actions) {
    html += '<th>Actions</th>';
  }
  html += '</tr></thead><tbody>';

  // Body
  data.forEach((row, index) => {
    html += '<tr>';
    columns.forEach(col => {
      const value = row[col.key] || '';
      let displayValue = value;

      if (col.type === 'currency') {
        displayValue = `$${formatCurrency(value)}`;
      } else if (col.type === 'date') {
        displayValue = formatDate(value);
      }

      html += `<td>${displayValue}</td>`;
    });

    if (actions) {
      html += '<td class="table-actions">';
      actions.forEach(action => {
        html += `<button class="small ${action.class || ''}" onclick="${action.onclick}(${index})">${action.label}</button>`;
      });
      html += '</td>';
    }
    html += '</tr>';
  });

  html += '</tbody></table>';
  return html;
}

// Get Fiscal Year
function getCurrentFiscalYear() {
  return new Date().getFullYear();
}

function getFiscalYearFromDate(date) {
  if (!date) return getCurrentFiscalYear();
  if (typeof date === 'string') {
    return new Date(date).getFullYear();
  }
  if (date.toDate) {
    return date.toDate().getFullYear();
  }
  return date.getFullYear();
}

// Currency Input Helper
function parseCurrency(value) {
  return parseFloat(value.replace(/[^\d.]/g, '')) || 0;
}

// Date Utilities
function getMonthName(month) {
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  return months[month - 1];
}

function getDateRange(period) {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  if (period === 'today') {
    const dateStr = today.toISOString().split('T')[0];
    return { start: new Date(dateStr), end: new Date(dateStr) };
  } else if (period === 'thisMonth') {
    return {
      start: new Date(currentYear, today.getMonth(), 1),
      end: today
    };
  } else if (period === 'ytd') {
    return {
      start: new Date(currentYear, 0, 1),
      end: today
    };
  } else if (period === 'thisYear') {
    return {
      start: new Date(currentYear, 0, 1),
      end: new Date(currentYear, 11, 31)
    };
  }
  return { start: null, end: null };
}

// Export to Excel (requires XLSX library)
function exportToExcel(data, filename, sheetName = 'Sheet1') {
  if (!window.XLSX) {
    showError('XLSX library not loaded');
    return;
  }

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, filename);
}

// Generate PDF Header
function addPDFHeader(doc, title, date = true) {
  doc.setFontSize(18);
  doc.setTextColor(26, 84, 144); // Dark blue
  doc.text(title, 20, 20);

  if (date) {
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 30);
  }

  doc.setDrawColor(44, 123, 229);
  doc.line(20, 32, 190, 32);
  doc.setTextColor(0);
}

// Generate PDF Footer
function addPDFFooter(doc, pageNum = null) {
  const pageCount = doc.internal.pages.length - 1;
  doc.setFontSize(9);
  doc.setTextColor(150);

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`Page ${i} of ${pageCount}`, 190, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }
}


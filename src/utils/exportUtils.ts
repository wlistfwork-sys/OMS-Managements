import { ExpenseItem, HPCLedgerRow, HPCDailyReconciliation, EmployeeIncomeData } from '../types';

export function downloadCSV(filename: string, csvContent: string) {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function exportExpensesToCSV(expenses: ExpenseItem[]) {
  const headers = [
    'Expense ID',
    'Date',
    'Employee ID',
    'Employee Name',
    'Department',
    'Merchant',
    'Category',
    'Amount',
    'Currency',
    'Tax Amount',
    'Status',
    'Reimbursement Method',
    'Description'
  ];

  const rows = expenses.map(e => [
    `"${e.expenseNumber}"`,
    `"${e.date}"`,
    `"${e.empId}"`,
    `"${e.employeeName.replace(/"/g, '""')}"`,
    `"${e.department.replace(/"/g, '""')}"`,
    `"${e.merchant.replace(/"/g, '""')}"`,
    `"${e.category}"`,
    e.amount.toFixed(2),
    `"${e.currency}"`,
    e.taxAmount.toFixed(2),
    `"${e.status}"`,
    `"${e.reimbursementMethod}"`,
    `"${(e.description || '').replace(/"/g, '""')}"`
  ]);

  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`HPC_Expenses_Export_${dateStr}.csv`, csv);
}

// Export the Exact Image 1 Table: HPC Operations & Visa Client Ledger
export function exportHPCLedgerToCSV(rows: HPCLedgerRow[], pendingRows: any[], accountRows: any[], dateStr: string) {
  const lines: string[] = [];
  lines.push(`HPC OFFICE - OPERATIONAL LEDGER & VISA CLIENT PROCESSING`);
  lines.push(`Date: ${dateStr}`);
  lines.push('');

  // Main table headers matching Image 1
  const mainHeaders = [
    'Sr. No',
    'Date',
    'Emp#',
    'Executive',
    'Client Name',
    'Contact',
    'Passport No / National ID No',
    'Nationality',
    'Gender',
    'Visa Status',
    'Work',
    'Total',
    'Received',
    'Balance',
    'Accommodation',
    'Remarks'
  ];
  lines.push(mainHeaders.join(','));

  let totalReceived = 0;
  rows.forEach(r => {
    totalReceived += Number(r.received || 0);
    lines.push([
      r.srNo,
      `"${r.date}"`,
      `"${r.empNo}"`,
      `"${r.executive}"`,
      `"${r.clientName}"`,
      `"${r.contact}"`,
      `"${r.passportOrNationalId}"`,
      `"${r.nationality}"`,
      `"${r.gender}"`,
      `"${r.visaStatus}"`,
      `"${r.work}"`,
      r.total,
      r.received,
      r.balance,
      `"${r.accommodation}"`,
      `"${r.remarks}"`
    ].join(','));
  });

  lines.push(`,,,,,,,,,,,Total,${totalReceived.toFixed(2)},,,`);
  lines.push('');
  lines.push('');

  // Pending Payments table
  lines.push('Pending Payment');
  lines.push('Sr. no,Date,Emp#,Executive,Client Name,Passport No,Received,Remarks');
  let pendingTotal = 0;
  pendingRows.forEach(p => {
    pendingTotal += Number(p.received || 0);
    lines.push([
      p.srNo,
      `"${p.date}"`,
      `"${p.empNo}"`,
      `"${p.executive}"`,
      `"${p.clientName}"`,
      `"${p.passportNo}"`,
      p.received,
      `"${p.remarks}"`
    ].join(','));
  });
  lines.push(`,,,,,,Total,${pendingTotal.toFixed(2)}`);
  lines.push('');
  lines.push('');

  // Account Details table
  lines.push('Account Details');
  lines.push('Sr. No,Emp#,Executive,Amount,Bank Name,Remarks');
  let accountTotal = 0;
  accountRows.forEach(a => {
    accountTotal += Number(a.amount || 0);
    lines.push([
      a.srNo,
      `"${a.empNo}"`,
      `"${a.executive}"`,
      a.amount,
      `"${a.bankName}"`,
      `"${a.remarks}"`
    ].join(','));
  });
  lines.push(`,,,Total,${accountTotal.toFixed(2)},`);

  downloadCSV(`HPC_Daily_Ledger_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, lines.join('\r\n'));
}

// Export the Exact Image 2 Table: HPC Cash in Hand & Reconciliation
export function exportHPCReconciliationToCSV(recon: HPCDailyReconciliation) {
  const lines: string[] = [];
  lines.push(`HPC OFFICE - DAILY CASH & EXPENSE RECONCILIATION`);
  lines.push(`Date: ${recon.date} (${recon.dayOfWeek})`);
  lines.push('');
  lines.push(`T. Collection: ${recon.totalCollection.toFixed(2)} | In Account: ${recon.inAccount.toFixed(2)} | Net Amount: ${recon.netAmount.toFixed(2)}`);
  lines.push('');

  lines.push('CASH IN HAND (DENOMINATION BREAKDOWN),,,EXPENSE DETAIL');
  lines.push('Note,Qty,Amount,,Detail,Amount');

  const maxRows = Math.max(recon.notesBreakdown.length, recon.expenseDetails.length);
  for (let i = 0; i < maxRows; i++) {
    const noteRow = recon.notesBreakdown[i];
    const expRow = recon.expenseDetails[i];

    const notePart = noteRow ? `${noteRow.note},${noteRow.qty},${noteRow.amount.toFixed(2)}` : ',,';
    const expPart = expRow ? `"${expRow.detail}",${expRow.amount.toFixed(2)}` : ',';

    lines.push(`${notePart},,${expPart}`);
  }

  lines.push(`Cash in Hand,${recon.cashInHand.toFixed(2)},,,Total Expenses,${recon.totalExpenses.toFixed(2)}`);
  lines.push('');
  lines.push(`Total (Cash + Exp),${recon.totalCashPlusExp.toFixed(2)}`);
  lines.push(`Difference,${recon.difference.toFixed(2)}`);

  downloadCSV(`HPC_Cash_Reconciliation_${recon.date.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, lines.join('\r\n'));
}

// Export the Unified Merged Daily Ledger & Cash Reconciliation Master Sheet
export function exportHPCMergedDailyReportToCSV(
  dateStr: string,
  dayOfWeek: string,
  rows: HPCLedgerRow[],
  pendingRows: any[],
  accountRows: any[],
  recon: HPCDailyReconciliation
) {
  const lines: string[] = [];
  lines.push(`HPC OFFICE - UNIFIED MASTER DAILY LEDGER & CASH RECONCILIATION`);
  lines.push(`Date: ${dateStr} (${dayOfWeek})`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push('');
  lines.push(`DAILY FINANCIAL BALANCING SUMMARY:`);
  lines.push(`Total Target Collection,${recon.totalCollection.toFixed(2)}`);
  lines.push(`In Bank Account,${recon.inAccount.toFixed(2)}`);
  lines.push(`Physical Cash in Hand,${recon.cashInHand.toFixed(2)}`);
  lines.push(`Daily Operational Expenses,${recon.totalExpenses.toFixed(2)}`);
  lines.push(`Total (Cash + Exp),${recon.totalCashPlusExp.toFixed(2)}`);
  lines.push(`Net Amount,${recon.netAmount.toFixed(2)}`);
  lines.push(`Reconciliation Difference,${recon.difference.toFixed(2)}`);
  lines.push('');
  lines.push('================================================================');
  lines.push('PART 1: CASH RECONCILIATION & DENOMINATIONS');
  lines.push('Note Denomination,Quantity,Amount,,Expense Detail,Amount');
  const maxReconRows = Math.max(recon.notesBreakdown.length, recon.expenseDetails.length);
  for (let i = 0; i < maxReconRows; i++) {
    const note = recon.notesBreakdown[i];
    const exp = recon.expenseDetails[i];
    const nStr = note ? `${note.note},${note.qty},${note.amount.toFixed(2)}` : ',,';
    const eStr = exp ? `"${exp.detail}",${exp.amount.toFixed(2)}` : ',';
    lines.push(`${nStr},,${eStr}`);
  }
  lines.push(`Cash in Hand Total,${recon.cashInHand.toFixed(2)},,,Total Expenses,${recon.totalExpenses.toFixed(2)}`);
  lines.push('');
  lines.push('================================================================');
  lines.push('PART 2: DAILY CLIENT VISA PROCESSING LEDGER (IMAGE 1)');
  const mainHeaders = [
    'Sr. No', 'Date', 'Emp#', 'Executive', 'Client Name', 'Contact',
    'Passport No / National ID No', 'Nationality', 'Gender', 'Visa Status',
    'Work', 'Total', 'Received', 'Balance', 'Accommodation', 'Remarks'
  ];
  lines.push(mainHeaders.join(','));
  let totalRec = 0;
  rows.forEach(r => {
    totalRec += Number(r.received || 0);
    lines.push([
      r.srNo, `"${r.date}"`, `"${r.empNo}"`, `"${r.executive}"`, `"${r.clientName}"`,
      `"${r.contact}"`, `"${r.passportOrNationalId}"`, `"${r.nationality}"`, `"${r.gender}"`,
      `"${r.visaStatus}"`, `"${r.work}"`, r.total, r.received, r.balance,
      `"${r.accommodation}"`, `"${r.remarks}"`
    ].join(','));
  });
  lines.push(`,,,,,,,,,,,Total Received,${totalRec.toFixed(2)},,,`);
  lines.push('');
  lines.push('PART 3: PENDING PAYMENTS (CLEARANCE ADJUSTMENTS)');
  lines.push('Sr. no,Date,Emp#,Executive,Client Name,Passport No,Received,Remarks');
  let pTot = 0;
  pendingRows.forEach(p => {
    pTot += Number(p.received || 0);
    lines.push([p.srNo, `"${p.date}"`, `"${p.empNo}"`, `"${p.executive}"`, `"${p.clientName}"`, `"${p.passportNo}"`, p.received, `"${p.remarks}"`].join(','));
  });
  lines.push(`,,,,,,Total,${pTot.toFixed(2)}`);
  lines.push('');
  lines.push('PART 4: BANK ACCOUNT DEPOSITS');
  lines.push('Sr. No,Emp#,Executive,Amount,Bank Name,Remarks');
  let aTot = 0;
  accountRows.forEach(a => {
    aTot += Number(a.amount || 0);
    lines.push([a.srNo, `"${a.empNo}"`, `"${a.executive}"`, a.amount, `"${a.bankName}"`, `"${a.remarks}"`].join(','));
  });
  lines.push(`,,,Total,${aTot.toFixed(2)},`);

  downloadCSV(`HPC_Master_Daily_Merged_${dateStr.replace(/[^a-zA-Z0-9]/g, '_')}.csv`, lines.join('\r\n'));
}

// Print / PDF Trigger
export function triggerPrintReport() {
  window.print();
}

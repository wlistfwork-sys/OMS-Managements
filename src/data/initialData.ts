import { 
  UserProfile, 
  ExpenseItem, 
  HPCLedgerRow, 
  HPCPendingPayment, 
  HPCAccountDetail, 
  HPCDailyReconciliation, 
  EmployeeIncomeData, 
  InternalSystemNode,
  CashDenomination,
  HPCExpenseDetail
} from '../types';

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user_1',
    name: 'Asgar Miya',
    email: 'asgar.miya@hpcoffice.com',
    empId: '105',
    role: 'employee',
    department: 'Client Visa & Global Processing',
    designation: 'Senior Processing Executive',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    ssoProvider: 'Microsoft Entra ID',
    ssoConnected: true,
    tokenExpires: '2026-10-04T23:59:59Z'
  },
  {
    id: 'user_2',
    name: 'Sarah Chen',
    email: 'sarah.chen@hpcoffice.com',
    empId: '102',
    role: 'manager',
    department: 'Operations & Processing',
    designation: 'Department Operations Manager',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
    ssoProvider: 'Google Workspace',
    ssoConnected: true,
    tokenExpires: '2026-10-04T23:59:59Z'
  },
  {
    id: 'user_3',
    name: 'Dilip Sharma',
    email: 'dilip.sharma@hpcoffice.com',
    empId: '101',
    role: 'admin',
    department: 'Corporate Finance & Board',
    designation: 'Chief Financial Officer / Admin',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    ssoProvider: 'Okta',
    ssoConnected: true,
    tokenExpires: '2026-10-04T23:59:59Z'
  }
];

export const INITIAL_EXPENSES: ExpenseItem[] = [
  {
    id: 'exp_101',
    expenseNumber: 'EXP-2026-0891',
    empId: '105',
    employeeName: 'Asgar Miya',
    department: 'Client Visa & Global Processing',
    date: '2026-10-02',
    merchant: 'Emirates Post / Document Legalization Center',
    category: 'Client Visa & Processing',
    amount: 1450.00,
    currency: 'AED',
    taxAmount: 72.50,
    description: 'Urgent biometric dispatch & embassy attestation for Nepal-UAE client dossiers (Dil Bahadur & batch)',
    receiptFileName: 'attestation_embassy_voucher_105.pdf',
    receiptType: 'image',
    receiptUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520" fill="none"><rect width="400" height="520" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="480" rx="8" stroke="%23E2E8F0" stroke-width="2" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">EMIRATES POST &amp; ATTESTATION</text><text x="200" y="80" text-anchor="middle" font-family="monospace" font-size="11" fill="%2364748B">TRN: 100293847500003</text><line x1="40" y1="100" x2="360" y2="100" stroke="%23CBD5E1" stroke-dasharray="4 4"/><text x="40" y="130" font-family="monospace" font-size="12" fill="%23334155">Date: 02-Oct-2026 11:42 AM</text><text x="40" y="150" font-family="monospace" font-size="12" fill="%23334155">Customer: HPC Office / Asgar Miya</text><text x="40" y="170" font-family="monospace" font-size="12" fill="%23334155">Ref: Dil Bahadur / N1084291</text><line x1="40" y1="190" x2="360" y2="190" stroke="%23E2E8F0"/><text x="40" y="220" font-family="monospace" font-size="12" fill="%230F172A">Item: MOFA Consular Stamp</text><text x="360" y="220" text-anchor="end" font-family="monospace" font-size="12" fill="%230F172A">850.00 AED</text><text x="40" y="250" font-family="monospace" font-size="12" fill="%230F172A">Item: Priority Courier Baggage</text><text x="360" y="250" text-anchor="end" font-family="monospace" font-size="12" fill="%230F172A">600.00 AED</text><line x1="40" y1="280" x2="360" y2="280" stroke="%23CBD5E1" stroke-dasharray="4 4"/><text x="40" y="310" font-family="monospace" font-size="12" fill="%2364748B">Subtotal</text><text x="360" y="310" text-anchor="end" font-family="monospace" font-size="12" fill="%230F172A">1,377.50 AED</text><text x="40" y="335" font-family="monospace" font-size="12" fill="%2364748B">VAT (5%)</text><text x="360" y="335" text-anchor="end" font-family="monospace" font-size="12" fill="%230F172A">72.50 AED</text><text x="40" y="370" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">TOTAL PAID</text><text x="360" y="370" text-anchor="end" font-family="monospace" font-size="16" font-weight="bold" fill="%23059669">1,450.00 AED</text><rect x="60" y="410" width="280" height="40" fill="%230F172A" rx="4"/><text x="200" y="435" text-anchor="middle" font-family="monospace" font-size="12" fill="%23FFFFFF">PAID VIA CORPORATE VISA *9102</text><text x="200" y="480" text-anchor="middle" font-family="monospace" font-size="10" fill="%2394A3B8">||| | || ||||| |||| || |||||| | ||||||</text></svg>',
    status: 'submitted',
    reimbursementMethod: 'Bank Transfer',
    approvalChain: [
      { stepName: 'Department Manager Review', roleRequired: 'Operations Manager', status: 'pending' },
      { stepName: 'Finance Audit & Payment', roleRequired: 'Finance Officer', status: 'pending' }
    ],
    auditNotes: ['02-Oct-2026: Submitted with digital invoice receipt']
  },
  {
    id: 'exp_102',
    expenseNumber: 'EXP-2026-0884',
    empId: '105',
    employeeName: 'Asgar Miya',
    department: 'Client Visa & Global Processing',
    date: '2026-10-01',
    merchant: 'Dubai Airport Logistics Terminal 3',
    category: 'Transportation',
    amount: 320.00,
    currency: 'AED',
    taxAmount: 16.00,
    description: 'Airport client reception and luggage transfer for transit workers',
    receiptFileName: 'taxi_fleet_dispatch.png',
    receiptType: 'image',
    receiptUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="420" viewBox="0 0 400 420" fill="none"><rect width="400" height="420" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="380" rx="8" stroke="%23E2E8F0" stroke-width="2" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">RTA LOGISTICS &amp; TRANSIT</text><text x="40" y="110" font-family="monospace" font-size="12" fill="%23334155">Date: 01-Oct-2026</text><text x="40" y="140" font-family="monospace" font-size="12" fill="%23334155">Route: DXB Terminal 3 -> Al Quoz Hub</text><text x="40" y="170" font-family="monospace" font-size="12" fill="%23334155">Trip Fare: 304.00 AED</text><text x="40" y="200" font-family="monospace" font-size="12" fill="%23334155">VAT: 16.00 AED</text><text x="40" y="240" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">TOTAL: 320.00 AED</text><text x="200" y="320" text-anchor="middle" font-family="monospace" font-size="12" fill="%23059669">RECEIPT VERIFIED</text></svg>',
    status: 'manager_approved',
    reimbursementMethod: 'Bank Transfer',
    approvalChain: [
      { stepName: 'Department Manager Review', roleRequired: 'Operations Manager', status: 'approved', approvedBy: 'Sarah Chen', approvedAt: '2026-10-02 09:15 AM' },
      { stepName: 'Finance Audit & Payment', roleRequired: 'Finance Officer', status: 'pending' }
    ],
    auditNotes: ['01-Oct-2026: Submitted by Asgar Miya', '02-Oct-2026: Approved by Sarah Chen']
  },
  {
    id: 'exp_103',
    expenseNumber: 'EXP-2026-0870',
    empId: '102',
    employeeName: 'Sarah Chen',
    department: 'Operations & Processing',
    date: '2026-09-28',
    merchant: 'Regus Business Lounge & Boardrooms',
    category: 'Accommodation',
    amount: 2800.00,
    currency: 'AED',
    taxAmount: 140.00,
    description: 'Client briefing room booking and processing workshop space for October intake',
    receiptFileName: 'regus_invoice_sep28.pdf',
    receiptType: 'image',
    receiptUrl: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="420" viewBox="0 0 400 420" fill="none"><rect width="400" height="420" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="380" rx="8" stroke="%23E2E8F0" stroke-width="2" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">REGUS WORKSPACES</text><text x="40" y="110" font-family="monospace" font-size="12" fill="%23334155">Inv: REG-99381-AE</text><text x="40" y="140" font-family="monospace" font-size="12" fill="%23334155">Conference Suite x 2 Days</text><text x="40" y="170" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">TOTAL: 2,800.00 AED</text><text x="200" y="320" text-anchor="middle" font-family="monospace" font-size="12" fill="%23059669">REIMBURSED VIA DIRECT TRANSFER</text></svg>',
    status: 'reimbursed',
    reimbursementMethod: 'Bank Transfer',
    reimbursedDate: '2026-09-30',
    approvalChain: [
      { stepName: 'Department Manager Review', roleRequired: 'Operations Manager', status: 'approved', approvedBy: 'Dilip Sharma', approvedAt: '2026-09-29 10:00 AM' },
      { stepName: 'Finance Audit & Payment', roleRequired: 'Finance Officer', status: 'approved', approvedBy: 'Dilip Sharma', approvedAt: '2026-09-30 02:30 PM' }
    ],
    auditNotes: ['28-Sep-2026: Submitted', '29-Sep-2026: Approved by CFO', '30-Sep-2026: Reimbursed via Account Transfer']
  },
  {
    id: 'exp_104',
    expenseNumber: 'EXP-2026-0865',
    empId: '105',
    employeeName: 'Asgar Miya',
    department: 'Client Visa & Global Processing',
    date: '2026-09-25',
    merchant: 'HPC Mobile Telecom Recharge',
    category: 'Utilities & Telecommunications',
    amount: 195.00,
    currency: 'AED',
    taxAmount: 9.75,
    description: 'Monthly cellular roaming & field data package for overseas client coordination',
    status: 'reimbursed',
    reimbursementMethod: 'Cash Disbursement',
    reimbursedDate: '2026-09-27',
    approvalChain: [
      { stepName: 'Department Manager Review', roleRequired: 'Operations Manager', status: 'approved', approvedBy: 'Sarah Chen', approvedAt: '2026-09-26 11:00 AM' },
      { stepName: 'Finance Audit & Payment', roleRequired: 'Finance Officer', status: 'approved', approvedBy: 'Dilip Sharma', approvedAt: '2026-09-27 04:00 PM' }
    ]
  }
];

// HPC Ledger Initial Rows matching Image 1:
// Date: 04-Oct-2026
// Row 1: Sr 1, Date: 02-Oct-2026, Emp# 105, Executive: Asgar Miya, Client Name: Dil Bahadur, Nationality: Nepal, Gender: Male, Visa Status: Visit, Work: Nepal To UAE, Total: 280,000, Received: 50,000, Balance: 230,000, Remarks: A/C Asgar
// Row 2: Sr 2, Date: 04-Oct-2026, Emp# 105, Executive: Asgar Miya, Client Name: Dil Bahadur, Total: 0, Received: 30,000, Balance: (30,000), Remarks: Cash
export const INITIAL_HPC_LEDGER_ROWS: HPCLedgerRow[] = [
  {
    id: 'hpc_row_1',
    srNo: 1,
    date: '02-Oct-2026',
    empNo: '105',
    executive: 'Asgar Miya',
    clientName: 'Dil Bahadur',
    contact: '+971 52 489 1102',
    passportOrNationalId: 'N1084291',
    nationality: 'Nepal',
    gender: 'Male',
    visaStatus: 'Visit',
    work: 'Nepal To UAE',
    total: 280000,
    received: 50000,
    balance: 230000,
    accommodation: 'Company',
    remarks: 'A/C Asgar'
  },
  {
    id: 'hpc_row_2',
    srNo: 2,
    date: '04-Oct-2026',
    empNo: '105',
    executive: 'Asgar Miya',
    clientName: 'Dil Bahadur',
    contact: '+971 52 489 1102',
    passportOrNationalId: 'N1084291',
    nationality: 'Nepal',
    gender: 'Male',
    visaStatus: 'Visit',
    work: 'Nepal To UAE',
    total: 0,
    received: 30000,
    balance: -30000,
    accommodation: 'Company',
    remarks: 'Cash'
  },
  {
    id: 'hpc_row_3',
    srNo: 3,
    date: '04-Oct-2026',
    empNo: '102',
    executive: 'Sarah Chen',
    clientName: 'Ramesh Thapa',
    contact: '+971 55 901 3422',
    passportOrNationalId: 'N0948218',
    nationality: 'Nepal',
    gender: 'Male',
    visaStatus: 'Employment',
    work: 'Nepal To UAE (Direct)',
    total: 310000,
    received: 100000,
    balance: 210000,
    accommodation: 'Company',
    remarks: 'Corporate Clearing'
  }
];

// Initial Pending Payment table matching Image 1:
// Sr no. 1, Date: 01-Jan-2026, Received: 10,000, Total: 10,000.00
export const INITIAL_PENDING_PAYMENTS: HPCPendingPayment[] = [
  {
    id: 'pending_1',
    srNo: 1,
    date: '01-Jan-2026',
    empNo: '105',
    executive: 'Asgar Miya',
    clientName: 'Dil Bahadur (Old Balance)',
    passportNo: 'N1084291',
    received: 10000,
    remarks: 'Prior year adjustment clearance'
  }
];

// Initial Account Details table matching Image 1:
// Sr 1: Emp# 105, Executive: Asghar Miya, Amount: 50,000, Bank Name: A/C Asgar
// Sr 2: Amount: 10,000, Total: 60,000
export const INITIAL_ACCOUNT_DETAILS: HPCAccountDetail[] = [
  {
    id: 'acc_1',
    srNo: 1,
    empNo: '105',
    executive: 'Asghar Miya',
    amount: 50000,
    bankName: 'A/C Asgar',
    remarks: 'Primary wire transfer'
  },
  {
    id: 'acc_2',
    srNo: 2,
    empNo: '105',
    executive: 'Corporate Office',
    amount: 10000,
    bankName: 'HPC Corporate Clearing',
    remarks: 'Bank branch deposit'
  }
];

// Denomination notes matching Image 2:
// Note 1000: qty 30 -> 30000
// 500, 200, 100, 50, 20, 10, 5, 1
export const INITIAL_DENOMINATIONS: CashDenomination[] = [
  { note: 1000, qty: 30, amount: 30000 },
  { note: 500, qty: 0, amount: 0 },
  { note: 200, qty: 0, amount: 0 },
  { note: 100, qty: 0, amount: 0 },
  { note: 50, qty: 0, amount: 0 },
  { note: 20, qty: 0, amount: 0 },
  { note: 10, qty: 0, amount: 0 },
  { note: 5, qty: 0, amount: 0 },
  { note: 1, qty: 0, amount: 0 }
];

export const INITIAL_HPC_EXPENSE_DETAILS: HPCExpenseDetail[] = [
  { id: 'hexp_1', detail: 'Courier service for Embassy dossiers', amount: 1200, category: 'Logistics' },
  { id: 'hexp_2', detail: 'Biometric appointment fee voucher', amount: 2500, category: 'Government Fees' },
  { id: 'hexp_3', detail: 'Airport staff transit conveyance', amount: 800, category: 'Transportation' }
];

// Employee Income data with regional tax withholding support
export const INITIAL_EMPLOYEE_INCOMES: EmployeeIncomeData[] = [
  {
    id: 'inc_105',
    empId: '105',
    name: 'Asgar Miya',
    department: 'Client Visa & Global Processing',
    region: 'UAE',
    currency: 'AED',
    baseSalary: 14500,
    housingAllowance: 4500,
    transportAllowance: 1200,
    commissionBonus: 3500,
    overtimePay: 800,
    socialSecurityRate: 0.05, // 5% for GCC / pension
    taxExemptionClaim: 0,
    paymentFrequency: 'Monthly',
    bankAccountMasked: 'ENBD ****4491',
    updatedAt: '2026-10-01'
  },
  {
    id: 'inc_102',
    empId: '102',
    name: 'Sarah Chen',
    department: 'Operations & Processing',
    region: 'USA',
    currency: 'USD',
    baseSalary: 8200,
    housingAllowance: 0,
    transportAllowance: 300,
    commissionBonus: 1500,
    overtimePay: 0,
    socialSecurityRate: 0.0765, // FICA
    taxExemptionClaim: 1,
    paymentFrequency: 'Monthly',
    bankAccountMasked: 'CHASE ****8290',
    updatedAt: '2026-10-01'
  },
  {
    id: 'inc_101',
    empId: '101',
    name: 'Dilip Sharma',
    department: 'Corporate Finance & Board',
    region: 'UK',
    currency: 'GBP',
    baseSalary: 7400,
    housingAllowance: 0,
    transportAllowance: 250,
    commissionBonus: 2000,
    overtimePay: 0,
    socialSecurityRate: 0.08, // NI
    taxExemptionClaim: 0,
    paymentFrequency: 'Monthly',
    bankAccountMasked: 'BARCLAYS ****3198',
    updatedAt: '2026-10-01'
  },
  {
    id: 'inc_108',
    empId: '108',
    name: 'Bikram Adhikari',
    department: 'Field Processing Hub',
    region: 'Nepal',
    currency: 'NPR',
    baseSalary: 95000,
    housingAllowance: 25000,
    transportAllowance: 10000,
    commissionBonus: 15000,
    overtimePay: 5000,
    socialSecurityRate: 0.01, // 1% Social Security tax
    taxExemptionClaim: 0,
    paymentFrequency: 'Monthly',
    bankAccountMasked: 'NABIL ****9021',
    updatedAt: '2026-10-01'
  }
];

// Board of Internal Systems
export const INITIAL_INTERNAL_SYSTEMS: InternalSystemNode[] = [
  {
    id: 'sys_1',
    name: 'HPC Core Ledger & Operations ERP',
    serviceCode: 'HPC-ERP-NODE-01',
    category: 'ERP',
    status: 'operational',
    lastSync: 'Just now (12s ago)',
    scope: 'ledger:write, ledger:audit, receipts:sync',
    latencyMs: 18,
    authMethod: 'OAuth 2.0 / SAML 2.0 SSO'
  },
  {
    id: 'sys_2',
    name: 'Corporate Bank & Clearing Gateway',
    serviceCode: 'FIN-BANK-API-EAST',
    category: 'Banking',
    status: 'authorized',
    lastSync: '2 mins ago',
    scope: 'payouts:disburse, account:reconcile',
    latencyMs: 34,
    authMethod: 'mTLS Token'
  },
  {
    id: 'sys_3',
    name: 'Visa & Consular Immigration Board Portal',
    serviceCode: 'IMMIG-GVT-BOARD-2026',
    category: 'Government/Immigration',
    status: 'operational',
    lastSync: '5 mins ago',
    scope: 'visas:verify, passport:lookup',
    latencyMs: 42,
    authMethod: 'Board Gateway Token'
  },
  {
    id: 'sys_4',
    name: 'Global Tax Authority & Statutory Payroll Gateway',
    serviceCode: 'TAX-PAYROLL-SYNC-V3',
    category: 'Tax & Payroll',
    status: 'authorized',
    lastSync: '10 mins ago',
    scope: 'withholding:file, irs:w4, hmrc:paye, uae:pension',
    latencyMs: 27,
    authMethod: 'OAuth 2.0 / SAML 2.0 SSO'
  }
];

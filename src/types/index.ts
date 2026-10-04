export type UserRole = 'employee' | 'manager' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  empId: string;
  role: UserRole;
  department: string;
  designation: string;
  avatarUrl: string;
  ssoProvider: 'Google Workspace' | 'Microsoft Entra ID' | 'Okta' | 'HPC Internal SSO';
  ssoConnected: boolean;
  tokenExpires: string;
}

export type ExpenseCategory = 
  | 'Travel & Flights' 
  | 'Accommodation' 
  | 'Client Visa & Processing' 
  | 'Meals & Entertainment' 
  | 'Office Supplies & Logistics' 
  | 'Field Operations' 
  | 'Transportation' 
  | 'Utilities & Telecommunications';

export type ExpenseStatus = 
  | 'submitted' 
  | 'manager_approved' 
  | 'finance_audited' 
  | 'reimbursed' 
  | 'rejected' 
  | 'clarification_requested';

export interface ApprovalStep {
  stepName: string;
  roleRequired: string;
  approvedBy?: string;
  approvedAt?: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  comment?: string;
}

export interface ExpenseItem {
  id: string;
  expenseNumber: string;
  empId: string;
  employeeName: string;
  department: string;
  date: string;
  merchant: string;
  category: ExpenseCategory;
  amount: number;
  currency: string;
  taxAmount: number;
  description: string;
  receiptUrl?: string;
  receiptFileName?: string;
  receiptType?: 'image' | 'pdf';
  status: ExpenseStatus;
  reimbursementMethod: 'Bank Transfer' | 'Cash Disbursement' | 'Payroll Addition';
  approvalChain: ApprovalStep[];
  auditNotes?: string[];
  reimbursedDate?: string;
  clientReference?: string;
}

// HPC Daily Ledger Exact Fields from Image 1
export interface HPCLedgerRow {
  id: string;
  srNo: number;
  date: string; // e.g. 02-Oct-2026
  empNo: string; // e.g. 105
  executive: string; // e.g. Asgar Miya
  clientName: string; // e.g. Dil Bahadur
  contact: string;
  passportOrNationalId: string;
  nationality: string; // e.g. Nepal
  gender: 'Male' | 'Female' | 'Other';
  visaStatus: string; // e.g. Visit, Employment, Tourist
  work: string; // e.g. Nepal To UAE, Client Visa, Processing
  total: number; // e.g. 280,000
  received: number; // e.g. 50,000
  balance: number; // total - received (e.g. 230,000)
  accommodation: string; // e.g. Included, Company, Self
  remarks: string; // e.g. A/C Asgar, Cash
}

export interface HPCPendingPayment {
  id: string;
  srNo: number;
  date: string; // e.g. 01-Jan-2026
  empNo: string;
  executive: string;
  clientName: string;
  passportNo: string;
  received: number;
  remarks: string;
}

export interface HPCAccountDetail {
  id: string;
  srNo: number;
  empNo: string;
  executive: string;
  amount: number;
  bankName: string;
  remarks: string;
}

// HPC Denomination Cash Calculator & Reconciliation from Image 2
export interface CashDenomination {
  note: number; // 1000, 500, 200, 100, 50, 20, 10, 5, 1
  qty: number;
  amount: number;
}

export interface HPCExpenseDetail {
  id: string;
  detail: string;
  amount: number;
  category?: string;
}

export interface HPCDailyReconciliation {
  date: string;
  dayOfWeek: string;
  totalCollection: number; // T. Collection
  inAccount: number; // In Account (e.g. 60,000)
  netAmount: number; // Net Amount
  cashInHand: number; // sum of denominations
  totalExpenses: number; // sum of Expense detail
  totalCashPlusExp: number; // Cash in Hand + Total Expenses
  difference: number; // variance
  notesBreakdown: CashDenomination[];
  expenseDetails: HPCExpenseDetail[];
}

// Employee Income & Regional Tax Withholdings
export type TaxRegion = 'UAE' | 'USA' | 'UK' | 'Nepal' | 'Germany';

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

export interface EmployeeIncomeData {
  id: string;
  empId: string;
  name: string;
  department: string;
  region: TaxRegion;
  currency: string;
  baseSalary: number; // monthly
  housingAllowance: number;
  transportAllowance: number;
  commissionBonus: number;
  overtimePay: number;
  socialSecurityRate: number;
  taxExemptionClaim: number;
  paymentFrequency: 'Monthly' | 'Bi-weekly';
  bankAccountMasked: string;
  updatedAt: string;
}

export interface TaxCalculationResult {
  grossIncome: number;
  taxableIncome: number;
  incomeTax: number;
  socialSecurityTax: number;
  healthInsurance: number;
  totalDeductions: number;
  netPay: number;
  effectiveTaxRate: number;
  bracketBreakdown: {
    bracket: string;
    rate: number;
    amount: number;
  }[];
}

export interface InternalSystemNode {
  id: string;
  name: string;
  serviceCode: string;
  category: 'ERP' | 'Banking' | 'Government/Immigration' | 'Tax & Payroll' | 'Cloud Audit';
  status: 'operational' | 'authorized' | 'syncing' | 'degraded';
  lastSync: string;
  scope: string;
  latencyMs: number;
  authMethod: 'OAuth 2.0 / SAML 2.0 SSO' | 'mTLS Token' | 'Board Gateway Token';
}

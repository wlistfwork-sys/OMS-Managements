import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  ExpenseItem, 
  ExpenseStatus,
  HPCLedgerRow, 
  HPCPendingPayment, 
  HPCAccountDetail, 
  HPCDailyReconciliation, 
  EmployeeIncomeData, 
  InternalSystemNode,
  CashDenomination,
  HPCExpenseDetail
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_EXPENSES, 
  INITIAL_HPC_LEDGER_ROWS, 
  INITIAL_PENDING_PAYMENTS, 
  INITIAL_ACCOUNT_DETAILS, 
  INITIAL_DENOMINATIONS, 
  INITIAL_HPC_EXPENSE_DETAILS, 
  INITIAL_EMPLOYEE_INCOMES, 
  INITIAL_INTERNAL_SYSTEMS 
} from '../data/initialData';

export type AppView = 
  | 'expenses' 
  | 'approvals' 
  | 'hpc_ledger' 
  | 'hpc_cash' 
  | 'payroll_tax' 
  | 'admin_reports' 
  | 'internal_board';

interface AppContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  availableUsers: UserProfile[];
  
  // SSO & Internal System Board
  isSSOModalOpen: boolean;
  openSSOModal: () => void;
  closeSSOModal: () => void;
  authenticateSSO: (provider: UserProfile['ssoProvider']) => void;
  internalSystems: InternalSystemNode[];
  syncSystem: (id: string) => void;
  
  // Active Navigation
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  
  // Expenses & Reimbursements
  expenses: ExpenseItem[];
  addExpense: (expense: Partial<ExpenseItem> & { receiptFile?: File }) => void;
  updateExpense: (id: string, updates: Partial<ExpenseItem>) => void;
  updateExpenseStatus: (id: string, status: ExpenseStatus, comment?: string) => void;
  requestClarification: (id: string, note: string) => void;
  batchApproveExpenses: (ids: string[]) => void;
  deleteExpense: (id: string) => void;

  // HPC Operational Ledger (Image 1)
  hpcDate: string;
  setHpcDate: (date: string) => void;
  hpcRows: HPCLedgerRow[];
  addHpcRow: (row: Partial<HPCLedgerRow>) => void;
  updateHpcRow: (id: string, field: keyof HPCLedgerRow, value: any) => void;
  deleteHpcRow: (id: string) => void;
  
  pendingPayments: HPCPendingPayment[];
  addPendingPayment: (item: Partial<HPCPendingPayment>) => void;
  updatePendingPayment: (id: string, updates: Partial<HPCPendingPayment>) => void;
  deletePendingPayment: (id: string) => void;

  accountDetails: HPCAccountDetail[];
  addAccountDetail: (item: Partial<HPCAccountDetail>) => void;
  updateAccountDetail: (id: string, updates: Partial<HPCAccountDetail>) => void;
  deleteAccountDetail: (id: string) => void;

  // HPC Denomination Cash & Reconciliation (Image 2)
  reconciliation: HPCDailyReconciliation;
  updateDenominationQty: (note: number, qty: number) => void;
  addHpcExpenseDetail: (detail: string, amount: number, category?: string) => void;
  deleteHpcExpenseDetail: (id: string) => void;
  setTotalCollection: (amount: number) => void;

  // Employee Income & Regional Tax
  employeeIncomes: EmployeeIncomeData[];
  updateEmployeeIncome: (id: string, updates: Partial<EmployeeIncomeData>) => void;
  addEmployeeIncome: (data: Partial<EmployeeIncomeData>) => void;

  // Toast / feedback message
  notification: string | null;
  showNotification: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]);
  const [currentView, setCurrentView] = useState<AppView>('expenses');
  const [isSSOModalOpen, setIsSSOModalOpen] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Load from localStorage or defaults
  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    const saved = localStorage.getItem('hpc_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [hpcDate, setHpcDate] = useState('04-Oct-2026');
  
  const [hpcRows, setHpcRows] = useState<HPCLedgerRow[]>(() => {
    const saved = localStorage.getItem('hpc_ledger_rows');
    return saved ? JSON.parse(saved) : INITIAL_HPC_LEDGER_ROWS;
  });

  const [pendingPayments, setPendingPayments] = useState<HPCPendingPayment[]>(() => {
    const saved = localStorage.getItem('hpc_pending_payments');
    return saved ? JSON.parse(saved) : INITIAL_PENDING_PAYMENTS;
  });

  const [accountDetails, setAccountDetails] = useState<HPCAccountDetail[]>(() => {
    const saved = localStorage.getItem('hpc_account_details');
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNT_DETAILS;
  });

  const [denominations, setDenominations] = useState<CashDenomination[]>(() => {
    const saved = localStorage.getItem('hpc_denominations');
    return saved ? JSON.parse(saved) : INITIAL_DENOMINATIONS;
  });

  const [hpcExpenses, setHpcExpenses] = useState<HPCExpenseDetail[]>(() => {
    const saved = localStorage.getItem('hpc_daily_expenses');
    return saved ? JSON.parse(saved) : INITIAL_HPC_EXPENSE_DETAILS;
  });

  const [totalCollection, setTotalCollection] = useState<number>(() => {
    const saved = localStorage.getItem('hpc_total_collection');
    return saved ? Number(saved) : 90000;
  });

  const [employeeIncomes, setEmployeeIncomes] = useState<EmployeeIncomeData[]>(() => {
    const saved = localStorage.getItem('hpc_employee_incomes');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEE_INCOMES;
  });

  const [internalSystems, setInternalSystems] = useState<InternalSystemNode[]>(() => {
    const saved = localStorage.getItem('hpc_internal_systems');
    return saved ? JSON.parse(saved) : INITIAL_INTERNAL_SYSTEMS;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('hpc_expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('hpc_ledger_rows', JSON.stringify(hpcRows));
  }, [hpcRows]);

  useEffect(() => {
    localStorage.setItem('hpc_pending_payments', JSON.stringify(pendingPayments));
  }, [pendingPayments]);

  useEffect(() => {
    localStorage.setItem('hpc_account_details', JSON.stringify(accountDetails));
  }, [accountDetails]);

  useEffect(() => {
    localStorage.setItem('hpc_denominations', JSON.stringify(denominations));
  }, [denominations]);

  useEffect(() => {
    localStorage.setItem('hpc_daily_expenses', JSON.stringify(hpcExpenses));
  }, [hpcExpenses]);

  useEffect(() => {
    localStorage.setItem('hpc_total_collection', totalCollection.toString());
  }, [totalCollection]);

  useEffect(() => {
    localStorage.setItem('hpc_employee_incomes', JSON.stringify(employeeIncomes));
  }, [employeeIncomes]);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((curr) => (curr === msg ? null : curr));
    }, 4000);
  };

  const switchUser = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showNotification(`Switched role to ${found.name} (${found.designation})`);
    }
  };

  const authenticateSSO = (provider: UserProfile['ssoProvider']) => {
    setCurrentUser(prev => ({
      ...prev,
      ssoProvider: provider,
      ssoConnected: true,
      tokenExpires: new Date(Date.now() + 86400000).toISOString()
    }));
    setIsSSOModalOpen(false);
    showNotification(`Successfully authenticated via ${provider} SSO`);
  };

  const syncSystem = (id: string) => {
    setInternalSystems(prev => prev.map(sys => {
      if (sys.id === id) {
        return {
          ...sys,
          status: 'syncing',
          lastSync: 'Syncing now...'
        };
      }
      return sys;
    }));

    setTimeout(() => {
      setInternalSystems(prev => prev.map(sys => {
        if (sys.id === id) {
          return {
            ...sys,
            status: 'operational',
            lastSync: 'Just now',
            latencyMs: Math.floor(Math.random() * 25) + 15
          };
        }
        return sys;
      }));
      showNotification(`Internal system node synchronized successfully.`);
    }, 1200);
  };

  // Expenses operations
  const addExpense = (newExpense: Partial<ExpenseItem>) => {
    const expenseNum = `EXP-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const item: ExpenseItem = {
      id: `exp_${Date.now()}`,
      expenseNumber: expenseNum,
      empId: currentUser.empId,
      employeeName: currentUser.name,
      department: currentUser.department,
      date: newExpense.date || new Date().toISOString().split('T')[0],
      merchant: newExpense.merchant || 'General Merchant',
      category: newExpense.category || 'Office Supplies & Logistics',
      amount: Number(newExpense.amount) || 0,
      currency: newExpense.currency || 'AED',
      taxAmount: Number(newExpense.taxAmount) || 0,
      description: newExpense.description || '',
      receiptFileName: newExpense.receiptFileName || 'receipt_scan.pdf',
      receiptType: 'image',
      receiptUrl: newExpense.receiptUrl,
      status: 'submitted',
      reimbursementMethod: newExpense.reimbursementMethod || 'Bank Transfer',
      approvalChain: [
        { stepName: 'Department Manager Review', roleRequired: 'Operations Manager', status: 'pending' },
        { stepName: 'Finance Audit & Payment', roleRequired: 'Finance Officer', status: 'pending' }
      ],
      auditNotes: [`${new Date().toLocaleDateString('en-GB')}: Submitted by ${currentUser.name}`],
      clientReference: newExpense.clientReference
    };

    setExpenses(prev => [item, ...prev]);
    showNotification(`Expense claim ${expenseNum} submitted for manager review.`);
  };

  const updateExpenseStatus = (id: string, status: ExpenseStatus, comment?: string) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;

      const newChain = [...exp.approvalChain];
      const newAudit = [...(exp.auditNotes || [])];

      if (status === 'manager_approved') {
        if (newChain[0]) {
          newChain[0] = {
            ...newChain[0],
            status: 'approved',
            approvedBy: currentUser.name,
            approvedAt: now,
            comment: comment || 'Approved by Department Manager'
          };
        }
        newAudit.push(`${now}: Approved by ${currentUser.name} (Manager)`);
      } else if (status === 'reimbursed') {
        if (newChain[1]) {
          newChain[1] = {
            ...newChain[1],
            status: 'approved',
            approvedBy: currentUser.name,
            approvedAt: now,
            comment: comment || 'Reimbursement disbursed to employee account'
          };
        }
        newAudit.push(`${now}: Payment processed by ${currentUser.name} (${exp.reimbursementMethod})`);
      } else if (status === 'rejected') {
        newAudit.push(`${now}: Rejected by ${currentUser.name} - Reason: ${comment || 'Non-compliant expense policy'}`);
      }

      return {
        ...exp,
        status,
        approvalChain: newChain,
        auditNotes: newAudit,
        reimbursedDate: status === 'reimbursed' ? new Date().toISOString().split('T')[0] : exp.reimbursedDate
      };
    }));

    showNotification(`Expense marked as ${status.replace('_', ' ')}.`);
  };

  const requestClarification = (id: string, note: string) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      return {
        ...exp,
        status: 'clarification_requested',
        auditNotes: [...(exp.auditNotes || []), `${now}: Clarification requested by ${currentUser.name} - "${note}"`]
      };
    }));
    showNotification('Clarification notice sent to employee.');
  };

  const batchApproveExpenses = (ids: string[]) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    setExpenses(prev => prev.map(exp => {
      if (!ids.includes(exp.id)) return exp;
      const newChain = [...exp.approvalChain];
      if (newChain[0] && newChain[0].status === 'pending') {
        newChain[0] = {
          ...newChain[0],
          status: 'approved',
          approvedBy: currentUser.name,
          approvedAt: now,
          comment: 'Batch approved in Manager Queue'
        };
      }
      return {
        ...exp,
        status: 'manager_approved',
        approvalChain: newChain,
        auditNotes: [...(exp.auditNotes || []), `${now}: Batch approved by ${currentUser.name}`]
      };
    }));
    showNotification(`Approved ${ids.length} expenses in batch.`);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showNotification('Expense entry removed.');
  };

  const updateExpense = (id: string, updates: Partial<ExpenseItem>) => {
    const now = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    setExpenses(prev => prev.map(exp => {
      if (exp.id !== id) return exp;
      const updatedAudit = [...(exp.auditNotes || [])];
      updatedAudit.push(`${now}: Updated by ${currentUser.name}`);
      return {
        ...exp,
        ...updates,
        auditNotes: updatedAudit
      };
    }));
    showNotification('Expense claim updated successfully.');
  };

  // HPC Daily Ledger operations (Image 1)
  const addHpcRow = (partial: Partial<HPCLedgerRow>) => {
    const maxSr = hpcRows.reduce((max, r) => Math.max(max, r.srNo || 0), 0);
    const totalVal = Number(partial.total) || 0;
    const receivedVal = Number(partial.received) || 0;
    const newRow: HPCLedgerRow = {
      id: `hpc_${Date.now()}`,
      srNo: maxSr + 1,
      date: partial.date || hpcDate,
      empNo: partial.empNo || currentUser.empId,
      executive: partial.executive || currentUser.name,
      clientName: partial.clientName || 'New Client',
      contact: partial.contact || '',
      passportOrNationalId: partial.passportOrNationalId || '',
      nationality: partial.nationality || 'Nepal',
      gender: partial.gender || 'Male',
      visaStatus: partial.visaStatus || 'Visit',
      work: partial.work || 'Nepal To UAE',
      total: totalVal,
      received: receivedVal,
      balance: totalVal - receivedVal,
      accommodation: partial.accommodation || 'Company',
      remarks: partial.remarks || 'Cash'
    };
    setHpcRows(prev => [...prev, newRow]);
    showNotification(`Added client record for ${newRow.clientName}`);
  };

  const updateHpcRow = (id: string, field: keyof HPCLedgerRow, value: any) => {
    setHpcRows(prev => prev.map(row => {
      if (row.id !== id) return row;
      const updated = { ...row, [field]: value };
      if (field === 'total' || field === 'received') {
        const tot = Number(field === 'total' ? value : updated.total) || 0;
        const rec = Number(field === 'received' ? value : updated.received) || 0;
        updated.balance = tot - rec;
      }
      return updated;
    }));
  };

  const deleteHpcRow = (id: string) => {
    setHpcRows(prev => prev.filter(r => r.id !== id));
    showNotification('Client entry removed from ledger.');
  };

  const addPendingPayment = (item: Partial<HPCPendingPayment>) => {
    const maxSr = pendingPayments.reduce((max, r) => Math.max(max, r.srNo || 0), 0);
    const newPending: HPCPendingPayment = {
      id: `pen_${Date.now()}`,
      srNo: maxSr + 1,
      date: item.date || hpcDate,
      empNo: item.empNo || currentUser.empId,
      executive: item.executive || currentUser.name,
      clientName: item.clientName || 'Pending Client',
      passportNo: item.passportNo || '',
      received: Number(item.received) || 0,
      remarks: item.remarks || ''
    };
    setPendingPayments(prev => [...prev, newPending]);
    showNotification('Pending payment item recorded.');
  };

  const updatePendingPayment = (id: string, updates: Partial<HPCPendingPayment>) => {
    setPendingPayments(prev => prev.map(p => {
      if (p.id !== id) return p;
      return {
        ...p,
        ...updates,
        received: updates.received !== undefined ? Number(updates.received) : p.received
      };
    }));
    showNotification('Pending payment record updated.');
  };

  const deletePendingPayment = (id: string) => {
    setPendingPayments(prev => prev.filter(p => p.id !== id));
    showNotification('Pending payment record deleted.');
  };

  const addAccountDetail = (item: Partial<HPCAccountDetail>) => {
    const maxSr = accountDetails.reduce((max, r) => Math.max(max, r.srNo || 0), 0);
    const newAcc: HPCAccountDetail = {
      id: `acc_${Date.now()}`,
      srNo: maxSr + 1,
      empNo: item.empNo || currentUser.empId,
      executive: item.executive || currentUser.name,
      amount: Number(item.amount) || 0,
      bankName: item.bankName || 'A/C Asgar',
      remarks: item.remarks || ''
    };
    setAccountDetails(prev => [...prev, newAcc]);
    showNotification('Account deposit record saved.');
  };

  const updateAccountDetail = (id: string, updates: Partial<HPCAccountDetail>) => {
    setAccountDetails(prev => prev.map(a => {
      if (a.id !== id) return a;
      return {
        ...a,
        ...updates,
        amount: updates.amount !== undefined ? Number(updates.amount) : a.amount
      };
    }));
    showNotification('Account deposit detail updated.');
  };

  const deleteAccountDetail = (id: string) => {
    setAccountDetails(prev => prev.filter(a => a.id !== id));
    showNotification('Account deposit record deleted.');
  };

  // Denominations & Reconciliation (Image 2)
  const updateDenominationQty = (note: number, qty: number) => {
    const sanitizedQty = Math.max(0, Math.floor(qty || 0));
    setDenominations(prev => prev.map(d => {
      if (d.note === note) {
        return {
          ...d,
          qty: sanitizedQty,
          amount: note * sanitizedQty
        };
      }
      return d;
    }));
  };

  const addHpcExpenseDetail = (detail: string, amount: number, category?: string) => {
    const newExp: HPCExpenseDetail = {
      id: `hexp_${Date.now()}`,
      detail,
      amount: Number(amount) || 0,
      category: category || 'Operations'
    };
    setHpcExpenses(prev => [...prev, newExp]);
    showNotification(`Logged expense voucher: ${detail}`);
  };

  const deleteHpcExpenseDetail = (id: string) => {
    setHpcExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Dynamic reconciliation calculation
  const inAccountTotal = accountDetails.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);
  const cashInHandTotal = denominations.reduce((sum, d) => sum + (Number(d.amount) || 0), 0);
  const totalExpensesAmount = hpcExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const totalCashPlusExp = cashInHandTotal + totalExpensesAmount;
  const netAmount = totalCollection - totalExpensesAmount;
  const difference = totalCollection - (inAccountTotal + cashInHandTotal);

  const reconciliation: HPCDailyReconciliation = {
    date: hpcDate,
    dayOfWeek: 'Sunday',
    totalCollection,
    inAccount: inAccountTotal,
    netAmount,
    cashInHand: cashInHandTotal,
    totalExpenses: totalExpensesAmount,
    totalCashPlusExp,
    difference,
    notesBreakdown: denominations,
    expenseDetails: hpcExpenses
  };

  // Employee Income & Regional Tax operations
  const updateEmployeeIncome = (id: string, updates: Partial<EmployeeIncomeData>) => {
    setEmployeeIncomes(prev => prev.map(inc => {
      if (inc.id !== id) return inc;
      return {
        ...inc,
        ...updates,
        updatedAt: new Date().toISOString().split('T')[0]
      };
    }));
    showNotification('Employee payroll and tax profile updated.');
  };

  const addEmployeeIncome = (data: Partial<EmployeeIncomeData>) => {
    const newInc: EmployeeIncomeData = {
      id: `inc_${Date.now()}`,
      empId: data.empId || `${Math.floor(100 + Math.random() * 900)}`,
      name: data.name || 'New Employee',
      department: data.department || 'Operations',
      region: data.region || 'UAE',
      currency: data.currency || (data.region === 'USA' ? 'USD' : data.region === 'UK' ? 'GBP' : data.region === 'Nepal' ? 'NPR' : 'AED'),
      baseSalary: Number(data.baseSalary) || 5000,
      housingAllowance: Number(data.housingAllowance) || 0,
      transportAllowance: Number(data.transportAllowance) || 0,
      commissionBonus: Number(data.commissionBonus) || 0,
      overtimePay: Number(data.overtimePay) || 0,
      socialSecurityRate: Number(data.socialSecurityRate) || 0.05,
      taxExemptionClaim: Number(data.taxExemptionClaim) || 0,
      paymentFrequency: data.paymentFrequency || 'Monthly',
      bankAccountMasked: data.bankAccountMasked || 'IBAN ****0000',
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setEmployeeIncomes(prev => [...prev, newInc]);
    showNotification(`Added payroll profile for ${newInc.name}`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: INITIAL_USERS,
        isSSOModalOpen,
        openSSOModal: () => setIsSSOModalOpen(true),
        closeSSOModal: () => setIsSSOModalOpen(false),
        authenticateSSO,
        internalSystems,
        syncSystem,
        currentView,
        setCurrentView,
        expenses,
        addExpense,
        updateExpense,
        updateExpenseStatus,
        requestClarification,
        batchApproveExpenses,
        deleteExpense,
        hpcDate,
        setHpcDate,
        hpcRows,
        addHpcRow,
        updateHpcRow,
        deleteHpcRow,
        pendingPayments,
        addPendingPayment,
        updatePendingPayment,
        deletePendingPayment,
        accountDetails,
        addAccountDetail,
        updateAccountDetail,
        deleteAccountDetail,
        reconciliation,
        updateDenominationQty,
        addHpcExpenseDetail,
        deleteHpcExpenseDetail,
        setTotalCollection,
        employeeIncomes,
        updateEmployeeIncome,
        addEmployeeIncome,
        notification,
        showNotification
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

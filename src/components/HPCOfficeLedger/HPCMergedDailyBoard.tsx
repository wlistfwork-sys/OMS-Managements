import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HPCLedgerRow, HPCPendingPayment, HPCAccountDetail } from '../../types';
import { 
  FileSpreadsheet, 
  Coins, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  Calendar, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Calculator, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  TrendingUp,
  CreditCard,
  Building,
  User,
  SlidersHorizontal,
  RefreshCw,
  Edit2,
  Check,
  X
} from 'lucide-react';
import { exportHPCMergedDailyReportToCSV } from '../../utils/exportUtils';

export const HPCMergedDailyBoard: React.FC = () => {
  const { 
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
    expenses,
    currentUser
  } = useApp();

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');
  
  // Section view layout mode: 'all_merged' | 'ledger_focus' | 'cash_focus'
  const [layoutMode, setLayoutMode] = useState<'all_merged' | 'ledger_focus' | 'cash_focus'>('all_merged');

  // Modals state
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddPendingModalOpen, setIsAddPendingModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);

  // Quick expense voucher form
  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');

  // Target Collection auto-sync vs manual
  const [isManualCollection, setIsManualCollection] = useState(false);
  const [manualCollectionInput, setManualCollectionInput] = useState(reconciliation.totalCollection.toString());

  // New Client Form state (with manual Employee ID field!)
  const [newClient, setNewClient] = useState<Partial<HPCLedgerRow>>({
    date: hpcDate,
    empNo: currentUser.empId,
    executive: currentUser.name,
    clientName: '',
    contact: '',
    passportOrNationalId: '',
    nationality: 'Nepal',
    gender: 'Male',
    visaStatus: 'Visit',
    work: 'Nepal To UAE',
    total: 280000,
    received: 50000,
    accommodation: 'Company',
    remarks: 'A/C Asgar'
  });

  // New Pending Payment Form state (with manual Employee ID field!)
  const [newPending, setNewPending] = useState<Partial<HPCPendingPayment>>({
    date: hpcDate,
    empNo: currentUser.empId,
    executive: currentUser.name,
    clientName: '',
    passportNo: '',
    received: 10000,
    remarks: ''
  });

  // New Account Detail Form state (with manual Employee ID field!)
  const [newAccount, setNewAccount] = useState<Partial<HPCAccountDetail>>({
    empNo: currentUser.empId,
    executive: currentUser.name,
    amount: 10000,
    bankName: 'A/C Asgar',
    remarks: ''
  });

  // Inline edit state for Pending Payments
  const [editingPendingId, setEditingPendingId] = useState<string | null>(null);
  const [editPendingData, setEditPendingData] = useState<Partial<HPCPendingPayment>>({});

  // Inline edit state for Account Details
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editAccountData, setEditAccountData] = useState<Partial<HPCAccountDetail>>({});

  // Dedicated Modal edit state
  const [pendingToEditModal, setPendingToEditModal] = useState<HPCPendingPayment | null>(null);
  const [accountToEditModal, setAccountToEditModal] = useState<HPCAccountDetail | null>(null);

  // Calculations for today's data
  const totalReceivedMain = hpcRows.reduce((sum, r) => sum + (Number(r.received) || 0), 0);
  const totalPendingReceived = pendingPayments.reduce((sum, p) => sum + (Number(p.received) || 0), 0);
  const autoCalculatedCollection = totalReceivedMain + totalPendingReceived; // e.g. 80,000 + 10,000 = 90,000.00!

  const effectiveCollection = isManualCollection 
    ? reconciliation.totalCollection 
    : (autoCalculatedCollection > 0 ? autoCalculatedCollection : reconciliation.totalCollection);

  const effectiveDifference = effectiveCollection - (reconciliation.inAccount + reconciliation.cashInHand);
  const effectiveNetAmount = effectiveCollection - reconciliation.totalExpenses;

  // Day of week calculation from hpcDate string (e.g. '04-Oct-2026')
  const getDayName = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const day = parseInt(parts[0]);
        const month = months.indexOf(parts[1]);
        const year = parseInt(parts[2]);
        if (day && month >= 0 && year) {
          const d = new Date(year, month, day);
          return d.toLocaleDateString('en-US', { weekday: 'long' });
        }
      }
    } catch (e) {
      // fallback
    }
    return 'Sunday';
  };

  const currentDayOfWeek = getDayName(hpcDate);

  // Date stepper
  const handleShiftDay = (delta: number) => {
    try {
      const parts = hpcDate.split('-');
      if (parts.length === 3) {
        const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        const day = parseInt(parts[0]);
        const month = months.indexOf(parts[1]);
        const year = parseInt(parts[2]);
        const d = new Date(year, month, day);
        d.setDate(d.getDate() + delta);
        const newDay = String(d.getDate()).padStart(2, '0');
        const newMonth = months[d.getMonth()];
        const newYear = d.getFullYear();
        setHpcDate(`${newDay}-${newMonth}-${newYear}`);
      }
    } catch (e) {
      // ignore
    }
  };

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.clientName) return;
    addHpcRow({
      ...newClient,
      date: newClient.date || hpcDate
    });
    setIsAddClientModalOpen(false);
    setNewClient({
      date: hpcDate,
      empNo: currentUser.empId,
      executive: currentUser.name,
      clientName: '',
      contact: '',
      passportOrNationalId: '',
      nationality: 'Nepal',
      gender: 'Male',
      visaStatus: 'Visit',
      work: 'Nepal To UAE',
      total: 280000,
      received: 50000,
      accommodation: 'Company',
      remarks: 'A/C Asgar'
    });
  };

  const handleCreatePending = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPending.clientName) return;
    addPendingPayment({
      ...newPending,
      date: newPending.date || hpcDate
    });
    setIsAddPendingModalOpen(false);
  };

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccount.bankName) return;
    addAccountDetail(newAccount);
    setIsAddAccountModalOpen(false);
  };

  // Pending Payments edit handlers
  const handleStartEditPending = (item: HPCPendingPayment) => {
    setEditingPendingId(item.id);
    setEditPendingData({ ...item });
  };

  const handleSaveEditPending = (id: string) => {
    updatePendingPayment(id, editPendingData);
    setEditingPendingId(null);
    setEditPendingData({});
  };

  const handleCancelEditPending = () => {
    setEditingPendingId(null);
    setEditPendingData({});
  };

  const handleUpdatePendingFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingToEditModal) return;
    updatePendingPayment(pendingToEditModal.id, pendingToEditModal);
    setPendingToEditModal(null);
  };

  // Account Details edit handlers
  const handleStartEditAccount = (item: HPCAccountDetail) => {
    setEditingAccountId(item.id);
    setEditAccountData({ ...item });
  };

  const handleSaveEditAccount = (id: string) => {
    updateAccountDetail(id, editAccountData);
    setEditingAccountId(null);
    setEditAccountData({});
  };

  const handleCancelEditAccount = () => {
    setEditingAccountId(null);
    setEditAccountData({});
  };

  const handleUpdateAccountFromModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!accountToEditModal) return;
    updateAccountDetail(accountToEditModal.id, accountToEditModal);
    setAccountToEditModal(null);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmount) return;
    addHpcExpenseDetail(newExpenseDesc, parseFloat(newExpenseAmount));
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  const handleImportApprovedCashClaims = () => {
    const approvedCash = expenses.filter(e => 
      e.reimbursementMethod === 'Cash Disbursement' && 
      (e.status === 'manager_approved' || e.status === 'reimbursed')
    );
    
    let count = 0;
    approvedCash.forEach(exp => {
      const exists = reconciliation.expenseDetails.some(d => d.detail.includes(exp.expenseNumber));
      if (!exists) {
        addHpcExpenseDetail(`${exp.expenseNumber}: ${exp.merchant} (${exp.employeeName})`, exp.amount, exp.category);
        count++;
      }
    });

    if (count === 0) {
      alert('No new approved cash disbursements found to import.');
    }
  };

  const filteredRows = hpcRows.filter(r => 
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.passportOrNationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.executive.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.work.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.empNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* 1. MASTER DAILY HEADER & DATE CONTROLLER */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              HPC
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                  HPC OFFICE · DAILY MASTER LEDGER &amp; RECONCILIATION
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Calculator Active
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Unified operations: Client dossiers, bank clearing, cash denomination counting, and daily variance reconciliation
              </p>
            </div>
          </div>

          {/* Date Navigator Bar */}
          <div className="flex flex-wrap items-center gap-2">
            
            {/* Prev / Next Day Controls */}
            <div className="flex items-center bg-slate-50 border border-slate-300 rounded-lg p-1 text-xs">
              <button
                onClick={() => handleShiftDay(-1)}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                title="Previous Day"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1 px-2 font-mono font-bold text-red-700">
                <span>Date:</span>
                <input
                  type="text"
                  value={hpcDate}
                  onChange={(e) => setHpcDate(e.target.value)}
                  className="w-28 text-center bg-transparent focus:outline-hidden font-bold"
                  title="Edit Date"
                />
                <span className="text-slate-500 font-sans font-medium text-[11px]">
                  ({currentDayOfWeek})
                </span>
              </div>

              <button
                onClick={() => handleShiftDay(1)}
                className="p-1 hover:bg-slate-200 rounded text-slate-600 transition-colors"
                title="Next Day"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Actions */}
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client Record</span>
            </button>

            <button
              onClick={() => exportHPCMergedDailyReportToCSV(
                hpcDate,
                currentDayOfWeek,
                hpcRows,
                pendingPayments,
                accountDetails,
                {
                  ...reconciliation,
                  totalCollection: effectiveCollection,
                  netAmount: effectiveNetAmount,
                  difference: effectiveDifference
                }
              )}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Daily CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print PDF</span>
            </button>
          </div>

        </div>

        {/* 2. REAL-TIME MASTER FINANCIAL BALANCING STRIP (IMAGE 2 RECONCILIATION CALCULATOR) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-center">
          
          {/* T. Collection */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 uppercase">
              <span>T. Collection</span>
              <button 
                onClick={() => setIsManualCollection(!isManualCollection)}
                className="text-[9px] font-normal text-slate-400 hover:text-slate-800 underline"
              >
                {isManualCollection ? 'Auto' : 'Edit'}
              </button>
            </div>
            {isManualCollection ? (
              <input
                type="number"
                value={manualCollectionInput}
                onChange={(e) => {
                  setManualCollectionInput(e.target.value);
                  const val = parseFloat(e.target.value);
                  if (!isNaN(val)) setTotalCollection(val);
                }}
                className="w-full text-center font-mono font-bold text-lg border border-slate-300 rounded mt-1 bg-white"
              />
            ) : (
              <div className="text-xl font-black font-mono tabular-nums text-slate-900 mt-1">
                {effectiveCollection.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            )}
            <span className="text-[10px] text-slate-400 font-mono block truncate">
              {isManualCollection ? 'Manual Override' : 'Ledger + Pending sum'}
            </span>
          </div>

          {/* In Account (Auto-calculated from Bank Account Deposits) */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase block">
              In Account
            </span>
            <div className="text-xl font-black font-mono tabular-nums text-blue-900 mt-1">
              {reconciliation.inAccount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 font-mono block">
              {accountDetails.length} bank deposits
            </span>
          </div>

          {/* Cash in Hand (Auto-calculated from Denominations) */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-red-700 uppercase block">
              Cash in Hand
            </span>
            <div className="text-xl font-black font-mono tabular-nums text-red-700 mt-1">
              {reconciliation.cashInHand.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              From notes counter
            </span>
          </div>

          {/* Expense Detail Total */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase block">
              Total Expenses
            </span>
            <div className="text-xl font-black font-mono tabular-nums text-slate-900 mt-1">
              {reconciliation.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              {reconciliation.expenseDetails.length} daily vouchers
            </span>
          </div>

          {/* Total (Cash + Exp) */}
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase block">
              Total (Cash + Exp)
            </span>
            <div className="text-xl font-black font-mono tabular-nums text-slate-900 mt-1">
              {reconciliation.totalCashPlusExp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-400 font-mono block">
              Cash + Vouchers
            </span>
          </div>

          {/* Difference / Balancing Status */}
          <div className={`p-3 rounded-xl border ${
            effectiveDifference === 0 
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
              : 'bg-amber-50/70 border-amber-200 text-amber-900'
          }`}>
            <span className="text-[11px] font-bold uppercase block">
              Difference (Variance)
            </span>
            <div className="text-xl font-black font-mono tabular-nums mt-1">
              {effectiveDifference === 0 ? '0.00' : effectiveDifference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] font-bold block">
              {effectiveDifference === 0 ? 'Balanced' : 'Variance Detected'}
            </span>
          </div>

        </div>

        {/* View Layout Filter Tabs */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setLayoutMode('all_merged')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                layoutMode === 'all_merged' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Merged Master View (All-in-One)
            </button>
            <button
              onClick={() => setLayoutMode('ledger_focus')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                layoutMode === 'ledger_focus' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Client Ledger Focus
            </button>
            <button
              onClick={() => setLayoutMode('cash_focus')}
              className={`px-3 py-1 font-semibold rounded-md transition-colors ${
                layoutMode === 'cash_focus' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cash &amp; Denominations Focus
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search client, passport, emp#..."
              className="pl-8 pr-3 py-1 text-xs rounded-md border border-slate-300 bg-white w-52 focus:outline-hidden"
            />
          </div>
        </div>

      </div>

      {/* 2. MAIN OPERATIONAL LEDGER (EXACT 16 COLUMNS FROM IMAGE 1) */}
      {(layoutMode === 'all_merged' || layoutMode === 'ledger_focus') && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Daily Visa Client Processing Ledger (Image 1)
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-500 font-mono">
                {filteredRows.length} active dossier rows
              </span>
            </div>
            
            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-md transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client Entry (with manual Emp#)</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse font-sans">
              <thead>
                <tr className="bg-emerald-50/70 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                  <th className="py-2.5 px-2 text-center w-12">Sr. No</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                  <th className="py-2.5 px-2 text-center w-16">Emp#</th>
                  <th className="py-2.5 px-3 whitespace-nowrap text-red-700">Executive</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Client Name</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Contact</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Passport No / National ID No</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Nationality</th>
                  <th className="py-2.5 px-2 text-center">Gender</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Visa Status</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Work</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                  <th className="py-2.5 px-3 text-right text-emerald-800">Received</th>
                  <th className="py-2.5 px-3 text-right text-red-700">Balance</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Accommodation</th>
                  <th className="py-2.5 px-3 whitespace-nowrap">Remarks</th>
                  <th className="py-2.5 px-2 text-center w-10 no-print"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRows.map((row) => {
                  const isNegativeBalance = row.balance < 0;
                  return (
                    <tr key={row.id} className="hover:bg-slate-50 divide-x divide-slate-100 transition-colors">
                      <td className="py-2 px-2 text-center font-mono font-medium text-slate-600">
                        {row.srNo}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700 font-mono text-[11px]">
                        {row.date}
                      </td>
                      
                      {/* Manual Inline Editable Employee ID (Emp#) */}
                      <td className="py-1 px-1 text-center font-mono font-bold text-slate-800">
                        <input
                          type="text"
                          value={row.empNo}
                          onChange={(e) => updateHpcRow(row.id, 'empNo', e.target.value)}
                          className="w-14 text-center font-mono font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-900 rounded py-0.5 border border-transparent hover:border-slate-300 transition-colors"
                          title="Click to edit Employee ID manually"
                        />
                      </td>

                      <td className="py-2 px-3 whitespace-nowrap font-medium text-slate-900">
                        {row.executive}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-semibold text-slate-900">
                        {row.clientName}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-600 font-mono text-[11px]">
                        {row.contact || '-'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-mono text-[11px] text-slate-700">
                        {row.passportOrNationalId || '-'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {row.nationality}
                      </td>
                      <td className="py-2 px-2 text-center text-slate-600">
                        {row.gender}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {row.visaStatus}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {row.work}
                      </td>
                      <td className="py-2 px-3 text-right font-mono tabular-nums text-slate-800">
                        {row.total ? row.total.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold tabular-nums text-emerald-800">
                        {row.received ? row.received.toLocaleString() : '-'}
                      </td>
                      <td className={`py-2 px-3 text-right font-mono font-semibold tabular-nums ${
                        isNegativeBalance ? 'text-red-600' : row.balance > 0 ? 'text-red-700' : 'text-slate-400'
                      }`}>
                        {isNegativeBalance ? `(${Math.abs(row.balance).toLocaleString()})` : row.balance > 0 ? row.balance.toLocaleString() : '-'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap text-slate-700">
                        {row.accommodation || '-'}
                      </td>
                      <td className="py-2 px-3 whitespace-nowrap font-medium text-slate-800">
                        {row.remarks || '-'}
                      </td>
                      <td className="py-2 px-2 text-center no-print">
                        <button
                          onClick={() => deleteHpcRow(row.id)}
                          className="p-1 text-slate-300 hover:text-rose-600 rounded transition-colors"
                          title="Delete row"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Total Footer matching Image 1 */}
              <tfoot>
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 divide-x divide-slate-200">
                  <td colSpan={11} className="py-2.5 px-4 text-right uppercase tracking-wider text-slate-700">
                    Total Received (Main Ledger)
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-slate-400">
                    -
                  </td>
                  <td className="py-2.5 px-3 text-right font-mono text-emerald-900 bg-emerald-100/50 text-sm">
                    {totalReceivedMain.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td colSpan={4} className="py-2.5 px-3 bg-slate-50"></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}

      {/* 5. SUB-TABLES: PENDING PAYMENT & ACCOUNT DETAILS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sub-Table 1: Pending Payment */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-50/60 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pending Payment (Clearance)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {pendingPayments.length} items
                </span>
              </div>
              <button
                onClick={() => setIsAddPendingModalOpen(true)}
                className="px-2 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Record</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold divide-x divide-slate-200">
                    <th className="py-2 px-2 text-center w-12">Sr. no</th>
                    <th className="py-2 px-3 whitespace-nowrap">Date</th>
                    <th className="py-2 px-2 text-center w-16">Emp#</th>
                    <th className="py-2 px-3 whitespace-nowrap">Executive</th>
                    <th className="py-2 px-3 whitespace-nowrap">Client Name</th>
                    <th className="py-2 px-3 whitespace-nowrap">Passport No</th>
                    <th className="py-2 px-3 text-right">Received</th>
                    <th className="py-2 px-3 whitespace-nowrap">Remarks</th>
                    <th className="py-2 px-2 text-center w-16 no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pendingPayments.map(item => {
                    const isEditing = editingPendingId === item.id;
                    return (
                      <tr 
                        key={item.id} 
                        className={`divide-x divide-slate-100 transition-colors ${
                          isEditing ? 'bg-amber-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-2 text-center font-mono">{item.srNo}</td>
                        
                        {/* Date */}
                        <td className="py-1 px-2 font-mono text-[11px]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.date ?? item.date}
                              onChange={(e) => setEditPendingData({ ...editPendingData, date: e.target.value })}
                              className="w-24 px-1.5 py-0.5 font-mono text-[11px] border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.date
                          )}
                        </td>

                        {/* Emp# (Manual Editable) */}
                        <td className="py-1 px-1 text-center font-mono font-bold">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.empNo ?? item.empNo}
                              onChange={(e) => setEditPendingData({ ...editPendingData, empNo: e.target.value })}
                              className="w-14 px-1 py-0.5 text-center font-mono font-bold border border-slate-300 rounded bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                              placeholder="Emp#"
                            />
                          ) : (
                            <input
                              type="text"
                              value={item.empNo}
                              onChange={(e) => updatePendingPayment(item.id, { empNo: e.target.value })}
                              className="w-14 text-center font-mono font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-900 rounded py-0.5 border border-transparent hover:border-slate-300 transition-colors"
                              title="Click to edit Employee ID manually"
                            />
                          )}
                        </td>

                        {/* Executive */}
                        <td className="py-1 px-2 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.executive ?? item.executive}
                              onChange={(e) => setEditPendingData({ ...editPendingData, executive: e.target.value })}
                              className="w-24 px-1.5 py-0.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.executive
                          )}
                        </td>

                        {/* Client Name */}
                        <td className="py-1 px-2 whitespace-nowrap font-medium">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.clientName ?? item.clientName}
                              onChange={(e) => setEditPendingData({ ...editPendingData, clientName: e.target.value })}
                              className="w-28 px-1.5 py-0.5 font-semibold border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.clientName
                          )}
                        </td>

                        {/* Passport No */}
                        <td className="py-1 px-2 font-mono text-[11px]">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.passportNo ?? item.passportNo}
                              onChange={(e) => setEditPendingData({ ...editPendingData, passportNo: e.target.value })}
                              className="w-24 px-1.5 py-0.5 font-mono text-[11px] border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.passportNo
                          )}
                        </td>

                        {/* Received Amount */}
                        <td className="py-1 px-2 text-right font-mono font-bold text-emerald-800 tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editPendingData.received ?? item.received}
                              onChange={(e) => setEditPendingData({ ...editPendingData, received: Number(e.target.value) })}
                              className="w-24 px-1.5 py-0.5 text-right font-mono font-bold text-emerald-800 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.received.toLocaleString()
                          )}
                        </td>

                        {/* Remarks */}
                        <td className="py-1 px-2 whitespace-nowrap text-slate-500">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editPendingData.remarks ?? item.remarks}
                              onChange={(e) => setEditPendingData({ ...editPendingData, remarks: e.target.value })}
                              className="w-24 px-1.5 py-0.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.remarks || '-'
                          )}
                        </td>

                        {/* Actions: Edit, Update/Save, Delete */}
                        <td className="py-1 px-2 text-center no-print">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEditPending(item.id)}
                                title="Update &amp; Save"
                                className="p-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelEditPending}
                                title="Cancel"
                                className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleStartEditPending(item)}
                                title="Edit &amp; Update Record"
                                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deletePendingPayment(item.id)}
                                title="Delete Record"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 uppercase tracking-wider">Total Pending Received</span>
            <span className="font-mono text-emerald-900 text-sm tabular-nums">
              {totalPendingReceived.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        {/* Sub-Table 2: Account Details */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-50/60 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Account Details (Bank Deposits)
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  {accountDetails.length} deposits
                </span>
              </div>
              <button
                onClick={() => setIsAddAccountModalOpen(true)}
                className="px-2 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Add Deposit</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold divide-x divide-slate-200">
                    <th className="py-2 px-2 text-center w-12">Sr. No</th>
                    <th className="py-2 px-2 text-center w-16">Emp#</th>
                    <th className="py-2 px-3 whitespace-nowrap">Executive</th>
                    <th className="py-2 px-3 text-right">Amount</th>
                    <th className="py-2 px-3 whitespace-nowrap">Bank Name</th>
                    <th className="py-2 px-3 whitespace-nowrap">Remarks</th>
                    <th className="py-2 px-2 text-center w-16 no-print">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {accountDetails.map(item => {
                    const isEditing = editingAccountId === item.id;
                    return (
                      <tr 
                        key={item.id} 
                        className={`divide-x divide-slate-100 transition-colors ${
                          isEditing ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2 px-2 text-center font-mono">{item.srNo}</td>
                        
                        {/* Emp# (Manual Editable) */}
                        <td className="py-1 px-1 text-center font-mono font-bold">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editAccountData.empNo ?? item.empNo}
                              onChange={(e) => setEditAccountData({ ...editAccountData, empNo: e.target.value })}
                              className="w-14 px-1 py-0.5 text-center font-mono font-bold border border-slate-300 rounded bg-white text-slate-900 focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                              placeholder="Emp#"
                            />
                          ) : (
                            <input
                              type="text"
                              value={item.empNo}
                              onChange={(e) => updateAccountDetail(item.id, { empNo: e.target.value })}
                              className="w-14 text-center font-mono font-bold text-slate-900 bg-transparent hover:bg-white focus:bg-white focus:ring-1 focus:ring-slate-900 rounded py-0.5 border border-transparent hover:border-slate-300 transition-colors"
                              title="Click to edit Employee ID manually"
                            />
                          )}
                        </td>

                        {/* Executive */}
                        <td className="py-1 px-2 whitespace-nowrap">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editAccountData.executive ?? item.executive}
                              onChange={(e) => setEditAccountData({ ...editAccountData, executive: e.target.value })}
                              className="w-24 px-1.5 py-0.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.executive
                          )}
                        </td>

                        {/* Amount */}
                        <td className="py-1 px-2 text-right font-mono font-bold text-blue-900 tabular-nums">
                          {isEditing ? (
                            <input
                              type="number"
                              value={editAccountData.amount ?? item.amount}
                              onChange={(e) => setEditAccountData({ ...editAccountData, amount: Number(e.target.value) })}
                              className="w-24 px-1.5 py-0.5 text-right font-mono font-bold text-blue-900 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.amount.toLocaleString()
                          )}
                        </td>

                        {/* Bank Name */}
                        <td className="py-1 px-2 whitespace-nowrap font-medium text-slate-900">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editAccountData.bankName ?? item.bankName}
                              onChange={(e) => setEditAccountData({ ...editAccountData, bankName: e.target.value })}
                              className="w-28 px-1.5 py-0.5 font-medium border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.bankName
                          )}
                        </td>

                        {/* Remarks */}
                        <td className="py-1 px-2 whitespace-nowrap text-slate-500">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editAccountData.remarks ?? item.remarks}
                              onChange={(e) => setEditAccountData({ ...editAccountData, remarks: e.target.value })}
                              className="w-28 px-1.5 py-0.5 border border-slate-300 rounded bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                            />
                          ) : (
                            item.remarks || '-'
                          )}
                        </td>

                        {/* Actions: Edit, Update/Save, Delete */}
                        <td className="py-1 px-2 text-center no-print">
                          {isEditing ? (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleSaveEditAccount(item.id)}
                                title="Update &amp; Save"
                                className="p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={handleCancelEditAccount}
                                title="Cancel"
                                className="p-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-1">
                              <button
                                onClick={() => handleStartEditAccount(item)}
                                title="Edit &amp; Update Deposit"
                                className="p-1 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteAccountDetail(item.id)}
                                title="Delete Deposit"
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-3 bg-slate-100 border-t border-slate-300 flex items-center justify-between text-xs font-bold">
            <span className="text-slate-700 uppercase tracking-wider">Total in Bank Account</span>
            <span className="font-mono text-blue-900 text-sm tabular-nums">
              {reconciliation.inAccount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

      {/* 4. CASH IN HAND (PHYSICAL DENOMINATIONS) & EXPENSE DETAIL (OPERATIONAL VOUCHERS) - PLACED DIRECTLY BELOW PENDING PAYMENT & ACCOUNT DETAILS */}
      {(layoutMode === 'all_merged' || layoutMode === 'cash_focus') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Left Box: Cash in hand (Denomination Breakdown Table) */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-3 bg-emerald-50/80 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Cash in hand (Physical Denominations)
                </h3>
                <span className="text-[11px] text-slate-500">
                  Real-time currency note desk calculator
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-red-700 bg-white px-2.5 py-1 rounded-md border border-red-200">
                Sum: {reconciliation.cashInHand.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                    <th className="py-2 px-4 text-center w-28">Note</th>
                    <th className="py-2 px-4 text-center w-32">Qty</th>
                    <th className="py-2 px-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reconciliation.notesBreakdown.map((row) => (
                    <tr key={row.note} className="hover:bg-slate-50/80 divide-x divide-slate-100 transition-colors">
                      <td className="py-1.5 px-4 text-center font-mono font-bold text-slate-800 text-sm">
                        {row.note}
                      </td>
                      <td className="py-1.5 px-4 text-center">
                        <input
                          type="number"
                          min="0"
                          value={row.qty === 0 ? '' : row.qty}
                          onChange={(e) => updateDenominationQty(row.note, parseInt(e.target.value) || 0)}
                          placeholder="0"
                          className="w-20 px-2 py-0.5 text-center font-mono font-bold border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                        />
                      </td>
                      <td className="py-1.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums text-sm">
                        {row.amount > 0 ? row.amount.toLocaleString() : '0'}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                    <td colSpan={2} className="py-2.5 px-4 text-red-700 text-xs font-bold uppercase">
                      Total Cash in Hand
                    </td>
                    <td className="py-2.5 px-4 text-right font-mono text-red-700 text-base font-bold tabular-nums">
                      {reconciliation.cashInHand.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Right Box: Expense detail Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
            <div>
              <div className="p-3 bg-emerald-50/80 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Expense detail (Operational Vouchers)
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    Daily cash disbursements &amp; courier fees
                  </span>
                </div>
                <button
                  onClick={handleImportApprovedCashClaims}
                  className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-md transition-colors flex items-center gap-1"
                >
                  <Coins className="w-3 h-3 text-slate-500" />
                  <span>Import Claims</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                      <th className="py-2 px-4">Detail</th>
                      <th className="py-2 px-4 text-right w-36">Amount</th>
                      <th className="py-2 px-2 text-center w-8 no-print"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reconciliation.expenseDetails.map((exp) => (
                      <tr key={exp.id} className="hover:bg-slate-50/80 divide-x divide-slate-100 transition-colors">
                        <td className="py-2 px-4 font-medium text-slate-800">
                          {exp.detail}
                        </td>
                        <td className="py-2 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                          {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className="py-2 px-2 text-center no-print">
                          <button
                            onClick={() => deleteHpcExpenseDetail(exp.id)}
                            className="text-slate-300 hover:text-rose-600 p-1"
                            title="Remove item"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {Array.from({ length: Math.max(0, 4 - reconciliation.expenseDetails.length) }).map((_, i) => (
                      <tr key={`blank_hexp_${i}`} className="divide-x divide-slate-100 text-slate-300">
                        <td className="py-2 px-4">-</td>
                        <td className="py-2 px-4 text-right font-mono">-</td>
                        <td className="py-2 px-2 no-print"></td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                      <td className="py-2.5 px-4 text-slate-800 text-xs font-bold uppercase tracking-wider">
                        Total Expenses
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono text-slate-900 text-sm font-bold tabular-nums">
                        {reconciliation.totalExpenses > 0 ? reconciliation.totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 }) : '-'}
                      </td>
                      <td className="no-print"></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Quick Add Expense Form */}
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <form onSubmit={handleAddExpense} className="flex gap-2">
                <input
                  type="text"
                  value={newExpenseDesc}
                  onChange={(e) => setNewExpenseDesc(e.target.value)}
                  placeholder="Add operational cash expense voucher..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden"
                />
                <input
                  type="number"
                  step="0.01"
                  value={newExpenseAmount}
                  onChange={(e) => setNewExpenseAmount(e.target.value)}
                  placeholder="Amount"
                  className="w-24 px-2 py-1.5 text-xs rounded-md border border-slate-300 bg-white font-mono focus:outline-hidden"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md hover:bg-slate-800 shadow-xs"
                >
                  Add
                </button>
              </form>
            </div>

          </div>

        </div>
      )}

      {/* MODAL 1: ADD CLIENT PROCESSING RECORD (WITH MANUAL EMPLOYEE ID) */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add New Client Processing Record
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter client passport, visa status, contracted fee, and advance payment
            </p>

            <form onSubmit={handleCreateClient} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newClient.clientName}
                    onChange={(e) => setNewClient({ ...newClient, clientName: e.target.value })}
                    placeholder="e.g. Dil Bahadur"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Passport / National ID</label>
                  <input
                    type="text"
                    value={newClient.passportOrNationalId}
                    onChange={(e) => setNewClient({ ...newClient, passportOrNationalId: e.target.value })}
                    placeholder="e.g. N1084291"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={newClient.nationality}
                    onChange={(e) => setNewClient({ ...newClient, nationality: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newClient.gender}
                    onChange={(e) => setNewClient({ ...newClient, gender: e.target.value as any })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Visa Status</label>
                  <input
                    type="text"
                    value={newClient.visaStatus}
                    onChange={(e) => setNewClient({ ...newClient, visaStatus: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Work / Processing Type</label>
                  <input
                    type="text"
                    value={newClient.work}
                    onChange={(e) => setNewClient({ ...newClient, work: e.target.value })}
                    placeholder="e.g. Nepal To UAE"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accommodation</label>
                  <input
                    type="text"
                    value={newClient.accommodation}
                    onChange={(e) => setNewClient({ ...newClient, accommodation: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Total Fee Amount</label>
                  <input
                    type="number"
                    value={newClient.total}
                    onChange={(e) => setNewClient({ ...newClient, total: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Received (Advance)</label>
                  <input
                    type="number"
                    value={newClient.received}
                    onChange={(e) => setNewClient({ ...newClient, received: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              {/* MANUAL EMPLOYEE ID & EXECUTIVE ENTRY */}
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Employee ID (Emp#) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.empNo || ''}
                    onChange={(e) => setNewClient({ ...newClient, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono font-bold text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1">
                    Executive (In-charge) *
                  </label>
                  <input
                    type="text"
                    required
                    value={newClient.executive || ''}
                    onChange={(e) => setNewClient({ ...newClient, executive: e.target.value })}
                    placeholder="e.g. Asgar Miya"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Remarks / Payment Mode</label>
                  <input
                    type="text"
                    value={newClient.remarks}
                    onChange={(e) => setNewClient({ ...newClient, remarks: e.target.value })}
                    placeholder="e.g. A/C Asgar / Cash"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contact (Phone / Mobile)</label>
                  <input
                    type="text"
                    value={newClient.contact}
                    onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                    placeholder="e.g. +971 52 489 1102"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded-md font-semibold"
                >
                  Save Client Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD PENDING PAYMENT */}
      {isAddPendingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Pending Payment</h3>
            <form onSubmit={handleCreatePending} className="space-y-3 text-xs mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Emp# (Employee ID) *</label>
                  <input
                    type="text"
                    required
                    value={newPending.empNo || ''}
                    onChange={(e) => setNewPending({ ...newPending, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border rounded-md font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Executive</label>
                  <input
                    type="text"
                    value={newPending.executive || ''}
                    onChange={(e) => setNewPending({ ...newPending, executive: e.target.value })}
                    placeholder="e.g. Asgar Miya"
                    className="w-full px-3 py-1.5 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={newPending.clientName}
                  onChange={(e) => setNewPending({ ...newPending, clientName: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Passport No</label>
                  <input
                    type="text"
                    value={newPending.passportNo}
                    onChange={(e) => setNewPending({ ...newPending, passportNo: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Received Amount</label>
                  <input
                    type="number"
                    value={newPending.received}
                    onChange={(e) => setNewPending({ ...newPending, received: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-md font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={newPending.remarks}
                  onChange={(e) => setNewPending({ ...newPending, remarks: e.target.value })}
                  placeholder="Clearance notes..."
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddPendingModalOpen(false)} className="px-3 py-1.5">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD ACCOUNT DEPOSIT */}
      {isAddAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Record Bank Deposit / Account Transfer</h3>
            <form onSubmit={handleCreateAccount} className="space-y-3 text-xs mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Emp# (Employee ID) *</label>
                  <input
                    type="text"
                    required
                    value={newAccount.empNo || ''}
                    onChange={(e) => setNewAccount({ ...newAccount, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border rounded-md font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Executive In-charge</label>
                  <input
                    type="text"
                    value={newAccount.executive}
                    onChange={(e) => setNewAccount({ ...newAccount, executive: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Bank Name / Account Label *</label>
                <input
                  type="text"
                  required
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  placeholder="e.g. A/C Asgar / Corporate Clearing"
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  required
                  value={newAccount.amount}
                  onChange={(e) => setNewAccount({ ...newAccount, amount: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded-md font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={newAccount.remarks}
                  onChange={(e) => setNewAccount({ ...newAccount, remarks: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsAddAccountModalOpen(false)} className="px-3 py-1.5">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-slate-900 text-white rounded-md font-semibold">Save Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT PENDING PAYMENT */}
      {pendingToEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit &amp; Update Pending Payment</h3>
              <button 
                onClick={() => setPendingToEditModal(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdatePendingFromModal} className="space-y-3 text-xs mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Emp# (Employee ID) *</label>
                  <input
                    type="text"
                    required
                    value={pendingToEditModal.empNo || ''}
                    onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border rounded-md font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Executive</label>
                  <input
                    type="text"
                    value={pendingToEditModal.executive || ''}
                    onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, executive: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={pendingToEditModal.clientName}
                  onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, clientName: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Passport No</label>
                  <input
                    type="text"
                    value={pendingToEditModal.passportNo}
                    onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, passportNo: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Received Amount</label>
                  <input
                    type="number"
                    value={pendingToEditModal.received}
                    onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, received: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border rounded-md font-mono font-bold text-emerald-800"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={pendingToEditModal.remarks || ''}
                  onChange={(e) => setPendingToEditModal({ ...pendingToEditModal, remarks: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setPendingToEditModal(null)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-md font-semibold">Update Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: EDIT ACCOUNT DEPOSIT */}
      {accountToEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Edit &amp; Update Account Deposit</h3>
              <button 
                onClick={() => setAccountToEditModal(null)} 
                className="text-slate-400 hover:text-slate-700 p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUpdateAccountFromModal} className="space-y-3 text-xs mt-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Emp# (Employee ID) *</label>
                  <input
                    type="text"
                    required
                    value={accountToEditModal.empNo || ''}
                    onChange={(e) => setAccountToEditModal({ ...accountToEditModal, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border rounded-md font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Executive In-charge</label>
                  <input
                    type="text"
                    value={accountToEditModal.executive}
                    onChange={(e) => setAccountToEditModal({ ...accountToEditModal, executive: e.target.value })}
                    className="w-full px-3 py-1.5 border rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold mb-1">Bank Name / Account Label *</label>
                <input
                  type="text"
                  required
                  value={accountToEditModal.bankName}
                  onChange={(e) => setAccountToEditModal({ ...accountToEditModal, bankName: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Amount</label>
                <input
                  type="number"
                  required
                  value={accountToEditModal.amount}
                  onChange={(e) => setAccountToEditModal({ ...accountToEditModal, amount: Number(e.target.value) })}
                  className="w-full px-3 py-1.5 border rounded-md font-mono font-bold text-blue-900"
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Remarks</label>
                <input
                  type="text"
                  value={accountToEditModal.remarks || ''}
                  onChange={(e) => setAccountToEditModal({ ...accountToEditModal, remarks: e.target.value })}
                  className="w-full px-3 py-1.5 border rounded-md"
                />
              </div>
              <div className="pt-3 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setAccountToEditModal(null)} className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded-md font-semibold">Update Deposit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Coins, 
  Plus, 
  Trash2, 
  Download, 
  Printer, 
  RefreshCw, 
  Calculator, 
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react';
import { exportHPCReconciliationToCSV } from '../../utils/exportUtils';

export const HPCCashReconciliation: React.FC = () => {
  const { 
    reconciliation, 
    updateDenominationQty, 
    addHpcExpenseDetail, 
    deleteHpcExpenseDetail,
    setTotalCollection,
    hpcDate,
    accountDetails,
    expenses
  } = useApp();

  const [newExpenseDesc, setNewExpenseDesc] = useState('');
  const [newExpenseAmount, setNewExpenseAmount] = useState('');
  const [isEditingCollection, setIsEditingCollection] = useState(false);
  const [tempCollection, setTempCollection] = useState(reconciliation.totalCollection.toString());

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpenseDesc || !newExpenseAmount) return;
    addHpcExpenseDetail(newExpenseDesc, parseFloat(newExpenseAmount));
    setNewExpenseDesc('');
    setNewExpenseAmount('');
  };

  const handleSaveCollection = () => {
    const val = parseFloat(tempCollection);
    if (!isNaN(val)) {
      setTotalCollection(val);
    }
    setIsEditingCollection(false);
  };

  // Import cash disbursement expenses from the claims system
  const handleImportApprovedCashClaims = () => {
    const approvedCash = expenses.filter(e => 
      e.reimbursementMethod === 'Cash Disbursement' && 
      (e.status === 'manager_approved' || e.status === 'reimbursed')
    );
    
    let count = 0;
    approvedCash.forEach(exp => {
      // Avoid duplicate by checking desc
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

  return (
    <div className="space-y-6">
      
      {/* Top Header Card matching Image 2 */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              HPC
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                HPC OFFICE
              </h1>
              <div className="flex items-center gap-3 text-xs mt-1">
                <span className="font-semibold text-slate-700">Date:</span>
                <span className="text-red-700 font-bold font-mono text-sm">{reconciliation.date}</span>
                <span className="text-red-700 font-bold text-sm">({reconciliation.dayOfWeek})</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleImportApprovedCashClaims}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Coins className="w-3.5 h-3.5 text-slate-600" />
              <span>Import Petty Cash Claims</span>
            </button>

            <button
              onClick={() => exportHPCReconciliationToCSV(reconciliation)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* 3 Top Summary Boxes matching Image 2: T. Collection | In Account | Net Amount */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5">
          
          {/* T. Collection */}
          <div className="text-center p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              T. Collection
            </span>
            {isEditingCollection ? (
              <div className="flex items-center justify-center gap-1 mt-2">
                <input
                  type="number"
                  value={tempCollection}
                  onChange={(e) => setTempCollection(e.target.value)}
                  className="w-32 px-2 py-1 text-center font-mono font-bold text-lg border border-slate-300 rounded-md"
                />
                <button
                  onClick={handleSaveCollection}
                  className="px-2 py-1 bg-slate-900 text-white text-xs rounded-md"
                >
                  Save
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingCollection(true)}
                className="cursor-pointer hover:bg-slate-100/80 p-1 rounded-md transition-colors"
                title="Click to edit Target Collection"
              >
                <div className="text-2xl font-black font-mono tabular-nums text-slate-900 mt-1">
                  {reconciliation.totalCollection.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <span className="text-[10px] text-slate-400 font-mono">click to adjust total</span>
              </div>
            )}
          </div>

          {/* In Account (matches Image 1 Account Details: 60,000.00) */}
          <div className="text-center p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              In Account
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-blue-900 mt-1">
              {reconciliation.inAccount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Auto-synced from Bank Account Details ({accountDetails.length} deposits)
            </span>
          </div>

          {/* Net Amount */}
          <div className="text-center p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Net Amount
            </span>
            <div className="text-2xl font-black font-mono tabular-nums text-emerald-900 mt-1">
              {reconciliation.netAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              (T. Collection - Total Expenses)
            </span>
          </div>

        </div>
      </div>

      {/* Side-by-Side Tables matching Image 2: Cash in hand & Expense detail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Left Box: Cash in hand (Denomination Breakdown Table) */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-3 bg-emerald-50/80 border-b border-slate-200 text-center">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide">
              Cash in hand
            </h3>
            <span className="text-[11px] text-slate-500">
              Interactive physical currency denomination counter
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                  <th className="py-2.5 px-4 text-center w-28">Note</th>
                  <th className="py-2.5 px-4 text-center w-32">Qty</th>
                  <th className="py-2.5 px-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reconciliation.notesBreakdown.map((row) => (
                  <tr key={row.note} className="hover:bg-slate-50/80 divide-x divide-slate-100 transition-colors">
                    <td className="py-2 px-4 text-center font-mono font-bold text-slate-800 text-sm">
                      {row.note}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <input
                        type="number"
                        min="0"
                        value={row.qty === 0 ? '' : row.qty}
                        onChange={(e) => updateDenominationQty(row.note, parseInt(e.target.value) || 0)}
                        placeholder="0"
                        className="w-20 px-2 py-1 text-center font-mono font-bold border border-slate-300 rounded-md focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                      />
                    </td>
                    <td className="py-2 px-4 text-right font-mono font-bold text-slate-900 tabular-nums text-sm">
                      {row.amount > 0 ? row.amount.toLocaleString() : '0'}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                  <td colSpan={2} className="py-3 px-4 text-red-700 text-sm font-bold">
                    Cash in Hand
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-red-700 text-base font-bold tabular-nums">
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
            <div className="p-3 bg-emerald-50/80 border-b border-slate-200 text-center">
              <h3 className="text-sm font-bold text-slate-900 tracking-wide">
                Expense detail
              </h3>
              <span className="text-[11px] text-slate-500">
                Operational cash disbursement &amp; daily vouchers
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                    <th className="py-2.5 px-4">Detail</th>
                    <th className="py-2.5 px-4 text-right w-36">Amount</th>
                    <th className="py-2.5 px-2 text-center w-8 no-print"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reconciliation.expenseDetails.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/80 divide-x divide-slate-100 transition-colors">
                      <td className="py-2.5 px-4 font-medium text-slate-800">
                        {exp.detail}
                      </td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                        {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-2.5 px-2 text-center no-print">
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
                  {Array.from({ length: Math.max(0, 5 - reconciliation.expenseDetails.length) }).map((_, i) => (
                    <tr key={`blank_hexp_${i}`} className="divide-x divide-slate-100 text-slate-300">
                      <td className="py-2.5 px-4">-</td>
                      <td className="py-2.5 px-4 text-right font-mono">-</td>
                      <td className="py-2.5 px-2 no-print"></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 border-t-2 border-slate-300 font-bold">
                    <td className="py-3 px-4 text-slate-800 text-sm font-bold uppercase tracking-wider">
                      Total
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-900 text-base font-bold tabular-nums">
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
                placeholder="Log daily expense voucher item..."
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

      {/* Bottom Summary Boxes matching Image 2: Total (Cash + Exp) & Difference */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Total (Cash + Exp) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Total (Cash + Exp)
            </span>
            <div className="text-3xl font-black font-mono tabular-nums text-slate-900 mt-2">
              {reconciliation.totalCashPlusExp.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Combined cash on hand ({reconciliation.cashInHand.toLocaleString()}) + operational expenses ({reconciliation.totalExpenses.toLocaleString()})
            </p>
          </div>

          {/* Difference */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Difference (Variance)
            </span>
            <div className="text-3xl font-black font-mono tabular-nums text-slate-900 mt-2">
              {reconciliation.difference === 0 ? '-' : reconciliation.difference.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {reconciliation.difference === 0 ? (
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" /> Balanced: Account deposits + Cash equals collection
                </span>
              ) : (
                <span className="text-amber-700 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Variance of {Math.abs(reconciliation.difference).toLocaleString()} detected
                </span>
              )}
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

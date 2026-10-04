import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseItem } from '../../types';
import { 
  CheckSquare, 
  CheckCircle2, 
  X, 
  AlertCircle, 
  HelpCircle, 
  FileText, 
  ShieldCheck, 
  SlidersHorizontal,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ExpenseDetailModal } from '../ExpenseTracker/ExpenseDetailModal';

export const ApprovalManager: React.FC = () => {
  const { 
    expenses, 
    currentUser, 
    updateExpenseStatus, 
    requestClarification, 
    batchApproveExpenses 
  } = useApp();

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [inspectExpense, setInspectExpense] = useState<ExpenseItem | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Pending manager approvals
  const pendingExpenses = expenses.filter(e => e.status === 'submitted');
  const managerApprovedExpenses = expenses.filter(e => e.status === 'manager_approved');

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(pendingExpenses.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleBatchApprove = () => {
    if (selectedIds.length === 0) return;
    batchApproveExpenses(selectedIds);
    setSelectedIds([]);
  };

  const handleRejectConfirm = (id: string) => {
    if (!rejectReason) return;
    updateExpenseStatus(id, 'rejected', rejectReason);
    setRejectingId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header and Workflow Policy Card */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900">
                Automated Department Approval Queue
              </h1>
              <span className="text-[11px] font-semibold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                Manager: {currentUser.name}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Review receipts, verify VAT tax compliance, and execute batch approval workflows
            </p>
          </div>

          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">
                {selectedIds.length} selected
              </span>
              <button
                onClick={handleBatchApprove}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Batch Approve Selected</span>
              </button>
            </div>
          )}
        </div>

        {/* Multi-tier Approval Logic Rules */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 1: Fast-Track &le; 250 AED</span>
              <span className="text-[10px] font-semibold text-emerald-700 font-mono">Auto-Audit</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Routine transportation &amp; telecom claims validated via receipt OCR hash check.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 2: 250 - 2,500 AED</span>
              <span className="text-[10px] font-semibold text-blue-700 font-mono">Manager Sign-off</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Requires Department Operations Manager sign-off before proceeding to banking disbursal.
            </p>
          </div>

          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800">Tier 3: &gt; 2,500 AED</span>
              <span className="text-[10px] font-semibold text-purple-700 font-mono">CFO Board Escalation</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Escalates automatically to Chief Financial Officer (Dilip Sharma) for corporate clearance.
            </p>
          </div>
        </div>
      </div>

      {/* Pending Approval Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Pending Manager Review ({pendingExpenses.length})
            </h3>
          </div>
          {pendingExpenses.length > 0 && (
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.length === pendingExpenses.length && pendingExpenses.length > 0}
                onChange={handleSelectAll}
                className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span>Select All for Batch Approval</span>
            </label>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4 w-10"></th>
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Claimant</th>
                <th className="py-3 px-4">Merchant &amp; Justification</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
                <th className="py-3 px-4 text-right">Decision Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pendingExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">Approval queue is completely clear!</p>
                    <p className="text-xs text-slate-400 mt-1">All employee expense claims have been processed</p>
                  </td>
                </tr>
              ) : (
                pendingExpenses.map(exp => {
                  const isSelected = selectedIds.includes(exp.id);
                  const isRejectingThis = rejectingId === exp.id;

                  return (
                    <tr key={exp.id} className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-slate-50' : ''}`}>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(exp.id)}
                          className="rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">
                        {exp.expenseNumber}
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {exp.date}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{exp.employeeName}</div>
                        <div className="text-[11px] text-slate-400">#{exp.empId}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{exp.merchant}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                          {exp.description || 'No description provided'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                        {exp.category}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] text-slate-500 font-normal">{exp.currency}</span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setInspectExpense(exp)}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-md font-medium transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Audit</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {!isRejectingThis ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => updateExpenseStatus(exp.id, 'manager_approved', `Approved by Manager ${currentUser.name}`)}
                              className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors shadow-xs"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                const note = prompt('State clarification question for employee:');
                                if (note) requestClarification(exp.id, note);
                              }}
                              className="px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-md"
                            >
                              Inquire
                            </button>
                            <button
                              onClick={() => setRejectingId(exp.id)}
                              className="px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-md"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="text"
                              value={rejectReason}
                              onChange={(e) => setRejectReason(e.target.value)}
                              placeholder="Reason for rejection..."
                              className="px-2 py-1 text-xs border border-rose-300 rounded-md w-40"
                            />
                            <button
                              onClick={() => handleRejectConfirm(exp.id)}
                              className="px-2 py-1 text-xs font-semibold bg-rose-600 text-white rounded-md"
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => setRejectingId(null)}
                              className="px-1.5 py-1 text-xs text-slate-400 hover:text-slate-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recently Approved / Disbursal Pipeline */}
      {managerApprovedExpenses.length > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Ready for Finance Disbursal ({managerApprovedExpenses.length})
            </h3>
            <span className="text-[11px] text-slate-500">
              Approved by Department Managers · Awaiting Accounting Payment Transfer
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {managerApprovedExpenses.map(exp => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    OK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs text-slate-900">{exp.expenseNumber}</span>
                      <span className="text-xs font-semibold text-slate-800">{exp.merchant}</span>
                      <span className="text-[11px] text-slate-400">· {exp.employeeName}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Disbursement: {exp.reimbursementMethod} · Approved by {exp.approvalChain[0]?.approvedBy || 'Manager'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono font-bold text-sm text-slate-900 tabular-nums">
                    {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {exp.currency}
                  </span>
                  <button
                    onClick={() => updateExpenseStatus(exp.id, 'reimbursed', 'Disbursed by Finance Clearing')}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
                  >
                    Disburse Payment
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Inspect Detail Modal */}
      <ExpenseDetailModal
        expense={inspectExpense}
        onClose={() => setInspectExpense(null)}
      />

    </div>
  );
};

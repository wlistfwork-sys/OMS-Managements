import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseItem } from '../../types';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  FileText, 
  Download, 
  Printer, 
  User, 
  Building, 
  CreditCard,
  Send,
  HelpCircle
} from 'lucide-react';

interface ExpenseDetailModalProps {
  expense: ExpenseItem | null;
  onClose: () => void;
}

export const ExpenseDetailModal: React.FC<ExpenseDetailModalProps> = ({ expense, onClose }) => {
  const { currentUser, updateExpenseStatus, requestClarification } = useApp();
  const [rejectReason, setRejectReason] = useState('');
  const [isRejecting, setIsRejecting] = useState(false);
  const [clarificationNote, setClarificationNote] = useState('');
  const [isClarifying, setIsClarifying] = useState(false);

  if (!expense) return null;

  const canManage = currentUser.role === 'manager' || currentUser.role === 'admin';

  const handleApprove = () => {
    if (currentUser.role === 'manager') {
      updateExpenseStatus(expense.id, 'manager_approved', `Approved by Manager ${currentUser.name}`);
    } else {
      updateExpenseStatus(expense.id, 'reimbursed', `Reimbursement processed via ${expense.reimbursementMethod}`);
    }
    onClose();
  };

  const handleReject = () => {
    if (!rejectReason) return;
    updateExpenseStatus(expense.id, 'rejected', rejectReason);
    setIsRejecting(false);
    onClose();
  };

  const handleSendClarification = () => {
    if (!clarificationNote) return;
    requestClarification(expense.id, clarificationNote);
    setIsClarifying(false);
    onClose();
  };

  const getStatusBadge = () => {
    switch (expense.status) {
      case 'submitted':
        return <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-xs font-semibold">Under Review</span>;
      case 'manager_approved':
        return <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md text-xs font-semibold">Manager Approved</span>;
      case 'reimbursed':
        return <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md text-xs font-semibold">Reimbursed &amp; Paid</span>;
      case 'rejected':
        return <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md text-xs font-semibold">Rejected</span>;
      case 'clarification_requested':
        return <span className="text-purple-700 bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md text-xs font-semibold">Clarification Needed</span>;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              EXP
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  {expense.expenseNumber}
                </h3>
                {getStatusBadge()}
              </div>
              <p className="text-xs text-slate-500">
                Submitted by {expense.employeeName} ({expense.department}) on {expense.date}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              title="Print Expense Voucher"
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Column: Details & Real-Time Approval Steps */}
          <div className="space-y-5">
            
            {/* Amount Banner */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Total Reimbursement Claim
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
                  {expense.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
                <span className="text-sm font-semibold text-slate-600">{expense.currency}</span>
                {expense.taxAmount > 0 && (
                  <span className="text-xs text-slate-400 font-mono">
                    (incl. {expense.taxAmount.toFixed(2)} {expense.currency} VAT)
                  </span>
                )}
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Merchant / Provider</span>
                <span className="font-semibold text-slate-900 text-right">{expense.merchant}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Category</span>
                <span className="font-semibold text-slate-900">{expense.category}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Disbursement Method</span>
                <span className="font-semibold text-slate-900">{expense.reimbursementMethod}</span>
              </div>
              {expense.clientReference && (
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">HPC Client File</span>
                  <span className="font-semibold text-slate-900">{expense.clientReference}</span>
                </div>
              )}
              {expense.description && (
                <div className="pt-1">
                  <span className="text-slate-500 block mb-1">Business Purpose:</span>
                  <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    {expense.description}
                  </p>
                </div>
              )}
            </div>

            {/* Real-time Approval Chain Steps */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Automated Approval Workflow
              </h4>
              <div className="space-y-3">
                {expense.approvalChain.map((step, idx) => {
                  const isApproved = step.status === 'approved';
                  return (
                    <div key={idx} className="flex items-start gap-3 text-xs">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                        isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {isApproved ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-900">{step.stepName}</span>
                          <span className={`text-[11px] font-medium capitalize ${
                            isApproved ? 'text-emerald-700' : 'text-amber-600'
                          }`}>
                            {step.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {step.approvedBy ? `Signed by ${step.approvedBy} on ${step.approvedAt}` : `Pending sign-off by ${step.roleRequired}`}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit History Log */}
            {expense.auditNotes && expense.auditNotes.length > 0 && (
              <div>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Audit History
                </h4>
                <div className="space-y-1">
                  {expense.auditNotes.map((note, idx) => (
                    <p key={idx} className="text-[11px] font-mono text-slate-600 bg-slate-50 px-2 py-1 rounded-sm">
                      · {note}
                    </p>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column: Receipt Image Preview & Manager Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-800">
                  Digital Receipt Evidence
                </span>
                {expense.receiptUrl && (
                  <a 
                    href={expense.receiptUrl} 
                    download={expense.receiptFileName || 'receipt.png'}
                    className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:underline"
                  >
                    <Download className="w-3 h-3" />
                    <span>Download</span>
                  </a>
                )}
              </div>

              {/* Receipt Viewport */}
              <div className="w-full h-80 bg-slate-100 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-2 relative shadow-inner">
                {expense.receiptUrl ? (
                  <img 
                    src={expense.receiptUrl} 
                    alt="Receipt" 
                    className="max-h-full max-w-full object-contain rounded-md"
                  />
                ) : (
                  <div className="text-center p-4">
                    <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-600 font-medium">Digital Receipt on Record</p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">{expense.receiptFileName}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Manager / Admin Workflow Action Controls */}
            {canManage && expense.status !== 'reimbursed' && expense.status !== 'rejected' && (
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">
                    Manager Review Actions
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Logged as {currentUser.name}
                  </span>
                </div>

                {!isRejecting && !isClarifying && (
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={handleApprove}
                      className="px-3 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1 shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{currentUser.role === 'admin' ? 'Disburse' : 'Approve'}</span>
                    </button>
                    <button
                      onClick={() => setIsClarifying(true)}
                      className="px-2.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>Inquire</span>
                    </button>
                    <button
                      onClick={() => setIsRejecting(true)}
                      className="px-2.5 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                )}

                {/* Reject reason input */}
                {isRejecting && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-rose-700">
                      Reason for Rejection (Audit Required)
                    </label>
                    <input
                      type="text"
                      value={rejectReason}
                      onChange={(e) => setRejectReason(e.target.value)}
                      placeholder="e.g. Missing tax invoice / Policy threshold exceeded"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-rose-300 bg-white focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsRejecting(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleReject}
                        disabled={!rejectReason}
                        className="px-3 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-md disabled:opacity-50"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  </div>
                )}

                {/* Clarification input */}
                {isClarifying && (
                  <div className="space-y-2">
                    <label className="block text-[11px] font-semibold text-slate-700">
                      Specify Question or Missing Document
                    </label>
                    <input
                      type="text"
                      value={clarificationNote}
                      onChange={(e) => setClarificationNote(e.target.value)}
                      placeholder="e.g. Please re-upload itemized receipt showing VAT breakdown"
                      className="w-full px-2.5 py-1.5 text-xs rounded-md border border-slate-300 bg-white focus:outline-hidden"
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setIsClarifying(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSendClarification}
                        disabled={!clarificationNote}
                        className="px-3 py-1 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md disabled:opacity-50"
                      >
                        Send Request
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

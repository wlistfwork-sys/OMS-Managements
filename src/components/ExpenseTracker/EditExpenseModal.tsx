import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseItem, ExpenseCategory, ExpenseStatus } from '../../types';
import { 
  X, 
  Trash2, 
  Save, 
  DollarSign, 
  Building, 
  User, 
  Calendar, 
  FileText, 
  AlertTriangle 
} from 'lucide-react';

interface EditExpenseModalProps {
  expense: ExpenseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EditExpenseModal: React.FC<EditExpenseModalProps> = ({ expense, isOpen, onClose }) => {
  const { updateExpense, deleteExpense, hpcRows } = useApp();

  const [date, setDate] = useState('');
  const [empId, setEmpId] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [department, setDepartment] = useState('');
  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Client Visa & Processing');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [taxAmount, setTaxAmount] = useState('');
  const [status, setStatus] = useState<ExpenseStatus>('submitted');
  const [reimbursementMethod, setReimbursementMethod] = useState<'Bank Transfer' | 'Cash Disbursement' | 'Payroll Addition'>('Bank Transfer');
  const [description, setDescription] = useState('');
  const [clientReference, setClientReference] = useState('');

  useEffect(() => {
    if (expense) {
      setDate(expense.date || '');
      setEmpId(expense.empId || '');
      setEmployeeName(expense.employeeName || '');
      setDepartment(expense.department || '');
      setMerchant(expense.merchant || '');
      setCategory(expense.category);
      setAmount(expense.amount ? expense.amount.toString() : '');
      setCurrency(expense.currency || 'AED');
      setTaxAmount(expense.taxAmount ? expense.taxAmount.toString() : '0');
      setStatus(expense.status);
      setReimbursementMethod(expense.reimbursementMethod || 'Bank Transfer');
      setDescription(expense.description || '');
      setClientReference(expense.clientReference || '');
    }
  }, [expense]);

  if (!isOpen || !expense) return null;

  const categories: ExpenseCategory[] = [
    'Client Visa & Processing',
    'Travel & Flights',
    'Accommodation',
    'Transportation',
    'Meals & Entertainment',
    'Office Supplies & Logistics',
    'Field Operations',
    'Utilities & Telecommunications'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchant || !amount) return;

    updateExpense(expense.id, {
      date,
      empId,
      employeeName,
      department,
      merchant,
      category,
      amount: parseFloat(amount) || 0,
      currency,
      taxAmount: parseFloat(taxAmount) || 0,
      status,
      reimbursementMethod,
      description,
      clientReference: clientReference || undefined
    });

    onClose();
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete claim ${expense.expenseNumber} (${merchant})? This action cannot be undone.`)) {
      deleteExpense(expense.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-xs">
              EDIT
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Edit &amp; Update Expense Claim
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {expense.expenseNumber} · Modify details, amounts, employee ID, or clearance status
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* Row 1: Employee ID & Employee Name (Both manually editable!) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Employee ID (Emp#) *
              </label>
              <input
                type="text"
                required
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                placeholder="e.g. 105"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Employee Name *
              </label>
              <input
                type="text"
                required
                value={employeeName}
                onChange={(e) => setEmployeeName(e.target.value)}
                placeholder="e.g. Asgar Miya"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 font-semibold text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">
                Department
              </label>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Department"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 bg-white focus:outline-hidden"
              />
            </div>
          </div>

          {/* Row 2: Merchant & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Merchant / Payee Name *
              </label>
              <input
                type="text"
                required
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Emirates Post"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Expense Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 3: Amount, Currency, Tax */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Amount *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 text-xs font-mono font-bold tabular-nums rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-20 px-2 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300 bg-white"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NPR">NPR</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                VAT / Tax Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>
          </div>

          {/* Row 4: Status & Disbursement Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Approval &amp; Payment Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ExpenseStatus)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 font-semibold focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="submitted">Under Review (Submitted)</option>
                <option value="manager_approved">Manager Approved</option>
                <option value="finance_audited">In Disbursement (Finance Audited)</option>
                <option value="reimbursed">Reimbursed &amp; Paid</option>
                <option value="clarification_requested">Clarification Requested</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Reimbursement Method
              </label>
              <select
                value={reimbursementMethod}
                onChange={(e) => setReimbursementMethod(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              >
                <option value="Bank Transfer">Bank Direct Deposit (Salary Account)</option>
                <option value="Cash Disbursement">Cash Disbursement from Petty Counter</option>
                <option value="Payroll Addition">Add to Monthly Payroll Credit</option>
              </select>
            </div>
          </div>

          {/* Row 5: Client Link Dossier */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Link to HPC Client Dossier (Optional)
            </label>
            <select
              value={clientReference}
              onChange={(e) => setClientReference(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
            >
              <option value="">-- General Operational Expense (No Client Link) --</option>
              {hpcRows.map(row => (
                <option key={row.id} value={`${row.clientName} (${row.passportOrNationalId})`}>
                  Client: {row.clientName} · Passport: {row.passportOrNationalId} · Work: {row.work}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Business Purpose &amp; Justification
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="State the business requirement, project code, or client mission details..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Claim</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save &amp; Update Claim</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

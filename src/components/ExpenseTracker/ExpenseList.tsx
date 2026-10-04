import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ExpenseItem, ExpenseStatus, ExpenseCategory } from '../../types';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  FileText, 
  ChevronRight, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Receipt,
  Eye,
  SlidersHorizontal
} from 'lucide-react';
import { exportExpensesToCSV } from '../../utils/exportUtils';
import { ExpenseDetailModal } from './ExpenseDetailModal';

interface ExpenseListProps {
  onOpenNewExpense: () => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({ onOpenNewExpense }) => {
  const { expenses, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedExpense, setSelectedExpense] = useState<ExpenseItem | null>(null);

  // Filter expenses
  const filteredExpenses = expenses.filter(exp => {
    const matchesSearch = 
      exp.merchant.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exp.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (exp.clientReference && exp.clientReference.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || exp.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || exp.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Calculate metrics
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const pendingAmount = expenses.filter(e => e.status === 'submitted').reduce((sum, e) => sum + e.amount, 0);
  const reimbursedAmount = expenses.filter(e => e.status === 'reimbursed').reduce((sum, e) => sum + e.amount, 0);
  const pendingCount = expenses.filter(e => e.status === 'submitted').length;

  const getStatusBadge = (status: ExpenseStatus) => {
    switch (status) {
      case 'submitted':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Under Review
          </span>
        );
      case 'manager_approved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Manager Approved
          </span>
        );
      case 'finance_audited':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
            In Disbursement
          </span>
        );
      case 'reimbursed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Reimbursed
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            Rejected
          </span>
        );
      case 'clarification_requested':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-purple-700">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
            Clarification
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
            Total Claims Tracked
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-slate-500">AED</span>
          </div>
          <span className="text-xs text-slate-400 mt-1 block">
            {expenses.length} claims submitted across company
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider block">
            Pending Manager Review
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {pendingAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-slate-500">AED</span>
          </div>
          <span className="text-xs text-amber-700 font-medium mt-1 block">
            {pendingCount} claims awaiting approval
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
            Cleared &amp; Reimbursed
          </span>
          <div className="flex items-baseline justify-between mt-2">
            <span className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {reimbursedAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
            <span className="text-xs font-semibold text-slate-500">AED</span>
          </div>
          <span className="text-xs text-emerald-700 font-medium mt-1 block">
            Disbursed to employee bank accounts
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
              Quick Claim Action
            </span>
            <p className="text-xs text-slate-600 mt-1">
              Upload receipt vouchers with smart OCR auto-fill
            </p>
          </div>
          <button
            onClick={onOpenNewExpense}
            className="w-full mt-3 py-2 px-3 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Upload New Receipt</span>
          </button>
        </div>

      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search merchant, claim ID, employee, or dossier..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
            />
          </div>

          {/* Action buttons: Export CSV + Filter tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportExpensesToCSV(filteredExpenses)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filter Segmented Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
            {[
              { id: 'all', label: 'All Claims' },
              { id: 'submitted', label: 'Pending Review' },
              { id: 'manager_approved', label: 'Approved' },
              { id: 'reimbursed', label: 'Reimbursed' },
              { id: 'clarification_requested', label: 'Clarification' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-2.5 py-1 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden"
            >
              <option value="all">All Categories</option>
              <option value="Client Visa & Processing">Client Visa &amp; Processing</option>
              <option value="Travel & Flights">Travel &amp; Flights</option>
              <option value="Accommodation">Accommodation</option>
              <option value="Transportation">Transportation</option>
              <option value="Office Supplies & Logistics">Office Supplies</option>
              <option value="Utilities & Telecommunications">Utilities &amp; Telecom</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Expense Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                <th className="py-3 px-4">Claim ID</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Merchant / Payee</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Receipt</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-semibold text-slate-700">No expense claims match this filter</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting filters or claim a new expense receipt</p>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr 
                    key={exp.id}
                    onClick={() => setSelectedExpense(exp)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {exp.expenseNumber}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {exp.date}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{exp.employeeName}</div>
                      <div className="text-[11px] text-slate-400">#{exp.empId} · {exp.department.split('&')[0]}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-900 truncate max-w-[200px]" title={exp.merchant}>
                        {exp.merchant}
                      </div>
                      {exp.clientReference && (
                        <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                          Ref: {exp.clientReference}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {exp.category}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 tabular-nums whitespace-nowrap">
                      {exp.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-[10px] text-slate-500 font-normal">{exp.currency}</span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-md font-medium">
                        <FileText className="w-3 h-3 text-slate-500" />
                        <span>View</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {getStatusBadge(exp.status)}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedExpense(exp);
                        }}
                        className="p-1 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-800 transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      <ExpenseDetailModal
        expense={selectedExpense}
        onClose={() => setSelectedExpense(null)}
      />

    </div>
  );
};

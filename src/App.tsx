import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { SSOModal } from './components/SSOModal';
import { InternalSystemsBoard } from './components/InternalSystemsBoard';
import { ExpenseList } from './components/ExpenseTracker/ExpenseList';
import { NewExpenseModal } from './components/ExpenseTracker/NewExpenseModal';
import { ApprovalManager } from './components/Approvals/ApprovalManager';
import { HPCMergedDailyBoard } from './components/HPCOfficeLedger/HPCMergedDailyBoard';
import { PayrollTaxEngine } from './components/PayrollTax/PayrollTaxEngine';
import { FinancialDashboard } from './components/AdminReports/FinancialDashboard';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, notification } = useApp();
  const [isNewExpenseOpen, setIsNewExpenseOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-slate-900 selection:text-white overflow-x-hidden">
      {/* Navigation Header */}
      <Navbar onOpenNewExpense={() => setIsNewExpenseOpen(true)} />

      {/* Main Viewport Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {currentView === 'expenses' && (
          <ExpenseList onOpenNewExpense={() => setIsNewExpenseOpen(true)} />
        )}
        {currentView === 'approvals' && (
          <ApprovalManager />
        )}
        {(currentView === 'hpc_ledger' || currentView === 'hpc_cash') && (
          <HPCMergedDailyBoard />
        )}
        {currentView === 'payroll_tax' && (
          <PayrollTaxEngine />
        )}
        {currentView === 'admin_reports' && (
          <FinancialDashboard />
        )}
        {currentView === 'internal_board' && (
          <InternalSystemsBoard />
        )}
      </main>

      {/* Quiet Corporate Footer adhering to anti-slop rules */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">HPC Office Financial &amp; Operations Portal</span>
            <span>·</span>
            <span>All systems synchronized with Board ERP</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>SSO Token Validated</span>
            <span>·</span>
            <span>Statutory Tax Engine Active</span>
            <span>·</span>
            <span>2026 Fiscal Cycle</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <SSOModal />
      <NewExpenseModal 
        isOpen={isNewExpenseOpen} 
        onClose={() => setIsNewExpenseOpen(false)} 
      />

      {/* Toast Notification */}
      {notification && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-2.5 text-xs animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

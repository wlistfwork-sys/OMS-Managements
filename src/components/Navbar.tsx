import React, { useState, useEffect, useRef } from 'react';
import { useApp, AppView } from '../context/AppContext';
import { 
  Receipt, 
  CheckSquare, 
  Calculator, 
  BarChart3, 
  ShieldCheck, 
  ChevronDown, 
  FileSpreadsheet,
  Plus,
  Menu,
  X
} from 'lucide-react';

interface NavbarProps {
  onOpenNewExpense: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewExpense }) => {
  const { 
    currentUser, 
    switchUser, 
    availableUsers, 
    currentView, 
    setCurrentView,
    openSSOModal,
    expenses
  } = useApp();

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pendingApprovalsCount = expenses.filter(e => e.status === 'submitted').length;

  const navItems: { id: AppView; label: string; fullLabel: string; description: string; icon: React.ReactNode; badge?: number }[] = [
    { 
      id: 'expenses', 
      label: 'Expenses', 
      fullLabel: 'Expenses & Claims',
      description: 'Submit receipts, track vouchers & view reimbursements',
      icon: <Receipt className="w-3.5 h-3.5 shrink-0" /> 
    },
    { 
      id: 'approvals', 
      label: 'Approvals', 
      fullLabel: 'Approvals Queue',
      description: 'Department manager review & batch decisions',
      icon: <CheckSquare className="w-3.5 h-3.5 shrink-0" />, 
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined 
    },
    { 
      id: 'hpc_ledger', 
      label: 'Daily Ledger', 
      fullLabel: 'Daily Ledger & Cash Recon',
      description: 'Visa client processing, clearing accounts & cash reconciliation',
      icon: <FileSpreadsheet className="w-3.5 h-3.5 shrink-0" /> 
    },
    { 
      id: 'payroll_tax', 
      label: 'Payroll & Tax', 
      fullLabel: 'Payroll & Tax Engine',
      description: 'Regional statutory tax withholdings & pay statements',
      icon: <Calculator className="w-3.5 h-3.5 shrink-0" /> 
    },
    { 
      id: 'admin_reports', 
      label: 'Reports', 
      fullLabel: 'Monthly Reports',
      description: 'Department spending audit & CSV/PDF accounting exports',
      icon: <BarChart3 className="w-3.5 h-3.5 shrink-0" /> 
    },
    { 
      id: 'internal_board', 
      label: 'Systems', 
      fullLabel: 'Systems Board',
      description: 'Enterprise SSO bridge, ERP nodes & sync health',
      icon: <ShieldCheck className="w-3.5 h-3.5 shrink-0" /> 
    }
  ];

  // Close menus on outside click or Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsUserDropdownOpen(false);
        setIsMobileMenuOpen(false);
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsUserDropdownOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSelectNav = (viewId: AppView) => {
    setCurrentView(viewId);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="no-print sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Main Navbar Row */}
        <div className="flex items-center justify-between h-16 gap-1 sm:gap-2 xl:gap-3">
          
          {/* Zone 1: Hamburger Menu (Mobile/Tablet) + Wordmark */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* Hamburger Toggle (shows below xl) */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-900" />
              ) : (
                <Menu className="w-5 h-5 text-slate-900" />
              )}
            </button>

            {/* Wordmark Logo */}
            <button 
              onClick={() => handleSelectNav('expenses')}
              className="flex items-center gap-2 text-left focus:outline-hidden group shrink-0"
            >
              <div className="w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs sm:text-sm tracking-wider shadow-xs group-hover:bg-slate-800 transition-colors shrink-0">
                HPC
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold tracking-tight text-slate-900 leading-tight whitespace-nowrap">
                  HPC Enterprise
                </span>
                <span className="hidden 2xl:inline text-[10px] text-slate-500 font-medium tracking-tight whitespace-nowrap">
                  Expense &amp; Operations Clearing
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Desktop Navigation Links (Clean text with active indicator, fits comfortably >= xl) */}
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1 shrink min-w-0 justify-center">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 2xl:px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 ${
                    isActive 
                      ? 'bg-slate-100 text-slate-900' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-500 text-white font-mono ml-0.5">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions (New Expense CTA + SSO Status + Profile Menu) */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            
            {/* New Expense Claim CTA */}
            <button
              onClick={onOpenNewExpense}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs shrink-0"
              title="Submit a new expense reimbursement"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Claim Expense</span>
              <span className="sm:hidden text-[11px]">Claim</span>
            </button>

            {/* SSO Status Pill */}
            <button
              onClick={openSSOModal}
              title="Click to manage SSO Internal Authorization"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shrink-0"
            >
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
              <span className="hidden sm:inline text-slate-500 text-[11px]">SSO:</span>
              <span className="font-semibold text-slate-900 text-xs truncate max-w-[65px] sm:max-w-[75px]">
                {currentUser.ssoProvider.split(' ')[0]}
              </span>
            </button>

            {/* User Profile Switcher */}
            <div className="relative shrink-0" ref={dropdownRef}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                className="flex items-center gap-1 p-1 rounded-lg hover:bg-slate-100 transition-colors text-slate-700 focus:outline-hidden"
                aria-label="User profile and role menu"
              >
                <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-700 border border-slate-300 shrink-0">
                  {currentUser.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  ) : (
                    currentUser.name.charAt(0)
                  )}
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {/* Desktop Profile & Role Switch Dropdown */}
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-1">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                      Switch Role (Demo SSO)
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      Toggle roles to test manager approvals, admin reports &amp; operational views
                    </p>
                  </div>

                  <div className="py-1 max-h-64 overflow-y-auto">
                    {availableUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => {
                          switchUser(u.id);
                          setIsUserDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left flex items-start gap-2.5 hover:bg-slate-50 transition-colors ${
                          u.id === currentUser.id ? 'bg-slate-50 text-slate-900 font-medium' : 'text-slate-700'
                        }`}
                      >
                        <div className="w-7 h-7 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-0.5 border border-slate-200">
                          <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-semibold truncate">{u.name}</span>
                            <span className={`text-[10px] uppercase font-mono px-1.5 py-0.2 rounded font-semibold ${
                              u.role === 'admin' 
                                ? 'bg-purple-100 text-purple-800' 
                                : u.role === 'manager' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {u.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate">{u.designation} · #{u.empId}</p>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-2 mt-1 px-3 py-1 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500">Board Auth Token:</span>
                    <span className="font-mono text-emerald-700 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      ACTIVE 24h
                    </span>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Mobile / Tablet Expandable Drawer Navigation */}
        {isMobileMenuOpen && (
          <div className="xl:hidden py-3 border-t border-slate-200 animate-in fade-in slide-in-from-top-2">
            
            {/* Current User Summary Banner in Mobile Menu */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 mb-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                    <img src={currentUser.avatarUrl} alt={currentUser.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1.5">
                      <span>{currentUser.name}</span>
                      <span className="px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase rounded bg-slate-200 text-slate-800">
                        {currentUser.role}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">
                      {currentUser.designation} · Emp# {currentUser.empId}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="px-2 py-1 text-[11px] font-semibold text-slate-700 bg-white border border-slate-200 rounded-md hover:bg-slate-100 shrink-0"
                >
                  Switch Role
                </button>
              </div>

              {/* Role Switcher Drawer (if clicked inside mobile menu) */}
              {isUserDropdownOpen && (
                <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {availableUsers.map(u => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setIsUserDropdownOpen(false);
                      }}
                      className={`p-2 text-left rounded-lg text-xs flex items-center gap-2 transition-colors ${
                        u.id === currentUser.id 
                          ? 'bg-slate-900 text-white font-semibold' 
                          : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      <div className="w-5 h-5 rounded-full overflow-hidden shrink-0 bg-slate-300">
                        <img src={u.avatarUrl} alt={u.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{u.name}</span>
                        <span className="text-[10px] opacity-75 block capitalize">{u.role}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Mobile View Switcher Menu Links */}
            <div className="space-y-1">
              {navItems.map(item => {
                const isActive = currentView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition-colors ${
                      isActive 
                        ? 'bg-slate-900 text-white shadow-xs' 
                        : 'text-slate-700 hover:bg-slate-100 bg-white border border-slate-100'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`p-2 rounded-lg ${isActive ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-700'}`}>
                        {item.icon}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold leading-tight">
                          {item.fullLabel}
                        </div>
                        <div className={`text-[11px] truncate mt-0.5 ${isActive ? 'text-slate-300' : 'text-slate-500'}`}>
                          {item.description}
                        </div>
                      </div>
                    </div>

                    {item.badge !== undefined && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full font-mono ml-2 shrink-0 ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500 text-white'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer inside Mobile Drawer */}
            <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
              <button
                onClick={() => {
                  openSSOModal();
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 font-semibold text-slate-700 hover:text-slate-950"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>SSO Credentials: Connected</span>
              </button>

              <button
                onClick={() => {
                  onOpenNewExpense();
                  setIsMobileMenuOpen(false);
                }}
                className="px-3 py-1 font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md"
              >
                + New Claim
              </button>
            </div>

          </div>
        )}

        {/* Mobile / Tablet Quick-Scroll Navigation Bar (when mobile drawer is closed) */}
        {!isMobileMenuOpen && (
          <div className="xl:hidden flex items-center gap-1.5 overflow-x-auto py-2 border-t border-slate-100 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectNav(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors shrink-0 ${
                    isActive 
                      ? 'bg-slate-900 text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.2 text-[9px] font-bold rounded-full font-mono ${
                      isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

      </div>
    </header>
  );
};

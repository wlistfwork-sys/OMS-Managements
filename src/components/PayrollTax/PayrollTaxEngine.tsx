import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EmployeeIncomeData, TaxRegion } from '../../types';
import { calculateRegionalTax } from '../../utils/taxCalculator';
import { 
  Calculator, 
  Plus, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  FileText, 
  Printer, 
  Download, 
  Lock, 
  CheckCircle,
  Building,
  User,
  Percent
} from 'lucide-react';
import { downloadCSV } from '../../utils/exportUtils';

export const PayrollTaxEngine: React.FC = () => {
  const { employeeIncomes, updateEmployeeIncome, addEmployeeIncome, currentUser } = useApp();

  const [selectedIncomeId, setSelectedIncomeId] = useState<string>(employeeIncomes[0]?.id || '');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeRegionTab, setActiveRegionTab] = useState<TaxRegion | 'ALL'>('ALL');

  const selectedEmployee = employeeIncomes.find(e => e.id === selectedIncomeId) || employeeIncomes[0];
  const taxResult = selectedEmployee ? calculateRegionalTax(selectedEmployee) : null;

  // New Employee state
  const [newEmp, setNewEmp] = useState<Partial<EmployeeIncomeData>>({
    name: '',
    empId: '',
    department: 'Client Visa & Global Processing',
    region: 'UAE',
    currency: 'AED',
    baseSalary: 12000,
    housingAllowance: 3000,
    transportAllowance: 1000,
    commissionBonus: 1500,
    overtimePay: 0,
    socialSecurityRate: 0.05,
    taxExemptionClaim: 0,
    paymentFrequency: 'Monthly',
    bankAccountMasked: 'ENBD ****1092'
  });

  const filteredEmployees = activeRegionTab === 'ALL' 
    ? employeeIncomes 
    : employeeIncomes.filter(e => e.region === activeRegionTab);

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.name) return;
    addEmployeeIncome(newEmp);
    setIsAddModalOpen(false);
    setNewEmp({
      name: '',
      empId: '',
      department: 'Client Visa & Global Processing',
      region: 'UAE',
      currency: 'AED',
      baseSalary: 12000,
      housingAllowance: 3000,
      transportAllowance: 1000,
      commissionBonus: 1500,
      overtimePay: 0,
      socialSecurityRate: 0.05,
      taxExemptionClaim: 0,
      paymentFrequency: 'Monthly',
      bankAccountMasked: 'ENBD ****1092'
    });
  };

  const handleExportPayrollCSV = () => {
    const headers = [
      'Employee ID',
      'Name',
      'Department',
      'Region',
      'Currency',
      'Base Salary',
      'Gross Pay',
      'Income Tax Withholding',
      'Social Security / Pension',
      'Net Pay',
      'Bank Account'
    ];

    const rows = employeeIncomes.map(emp => {
      const calc = calculateRegionalTax(emp);
      return [
        `"${emp.empId}"`,
        `"${emp.name}"`,
        `"${emp.department}"`,
        `"${emp.region}"`,
        `"${emp.currency}"`,
        emp.baseSalary,
        calc.grossIncome,
        calc.incomeTax,
        calc.socialSecurityTax,
        calc.netPay,
        `"${emp.bankAccountMasked}"`
      ];
    });

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    downloadCSV(`HPC_Payroll_Tax_Withholdings_${new Date().toISOString().split('T')[0]}.csv`, csv);
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Employee Income &amp; Multi-Region Tax Withholdings
                </h1>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Secure Vault
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Configured with statutory tax engines for UAE (0% + Pension), USA (W-4 / FICA), UK (PAYE), Nepal (1% SST Slabs), and Germany
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Employee Income</span>
            </button>
            <button
              onClick={handleExportPayrollCSV}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span>Export Payroll CSV</span>
            </button>
          </div>
        </div>

        {/* Region filter tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Jurisdictions' },
            { id: 'UAE', label: 'UAE / GCC (0% Tax + Pension)' },
            { id: 'USA', label: 'USA (IRS W-4 & FICA)' },
            { id: 'UK', label: 'UK (HMRC PAYE & NI)' },
            { id: 'Nepal', label: 'Nepal (IRD Tax Slabs)' },
            { id: 'Germany', label: 'Germany (Lohnsteuer)' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveRegionTab(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                activeRegionTab === tab.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Split Grid (Left: Employee Roster, Right: Selected Tax Withholding Calculation & Pay Slip) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Employee Income Ledger (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Employee Compensation Roster ({filteredEmployees.length})
            </h3>
            <span className="text-[11px] text-slate-400">Select to view pay slip</span>
          </div>

          <div className="divide-y divide-slate-100">
            {filteredEmployees.map(emp => {
              const calc = calculateRegionalTax(emp);
              const isSelected = selectedEmployee?.id === emp.id;

              return (
                <div
                  key={emp.id}
                  onClick={() => setSelectedIncomeId(emp.id)}
                  className={`p-4 cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100/80 border-l-4 border-slate-900' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{emp.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">#{emp.empId}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{emp.department}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-slate-200 text-slate-800">
                      {emp.region}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100/60">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Gross Income</span>
                      <span className="font-mono font-bold text-slate-900 tabular-nums">
                        {calc.grossIncome.toLocaleString()} {emp.currency}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Est. Net Pay</span>
                      <span className="font-mono font-bold text-emerald-700 tabular-nums">
                        {calc.netPay.toLocaleString()} {emp.currency}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Employee Withholding Analysis & Pay Slip (7 cols) */}
        {selectedEmployee && taxResult && (
          <div className="lg:col-span-7 space-y-6">
            
            {/* Pay Slip Viewport with Printable Layout */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs print-break-inside-avoid">
              
              {/* Slip Header */}
              <div className="flex items-start justify-between border-b border-slate-200 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                      CONFIDENTIAL PAY SLIP &amp; TAX STATEMENT
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-slate-900 mt-1">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Employee ID: <strong className="text-slate-800">#{selectedEmployee.empId}</strong> · {selectedEmployee.department}
                  </p>
                </div>

                <div className="text-right">
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors no-print"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>Print Statement</span>
                  </button>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Disbursal Account: <span className="font-mono text-slate-700 font-semibold">{selectedEmployee.bankAccountMasked}</span>
                  </p>
                </div>
              </div>

              {/* Earnings & Allowances Breakdown */}
              <div className="mt-5 space-y-3">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  1. Gross Earnings Breakdown ({selectedEmployee.currency})
                </span>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Base Salary</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {selectedEmployee.baseSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Housing Allowance</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {selectedEmployee.housingAllowance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Transport Allowance</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {selectedEmployee.transportAllowance.toLocaleString()}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[11px] text-slate-400 block">Commission &amp; Bonus</span>
                    <span className="font-mono font-bold text-slate-900 text-sm tabular-nums">
                      {selectedEmployee.commissionBonus.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-slate-100/70 rounded-lg flex items-center justify-between text-xs font-bold text-slate-800">
                  <span>TOTAL GROSS COMPENSATION</span>
                  <span className="font-mono text-base text-slate-900 tabular-nums">
                    {taxResult.grossIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedEmployee.currency}
                  </span>
                </div>
              </div>

              {/* Tax Withholdings & Statutory Deductions */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    2. Regional Statutory Deductions &amp; Withholdings ({selectedEmployee.region})
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-500">
                    Effective Rate: {(taxResult.effectiveTaxRate * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="space-y-2">
                  {taxResult.bracketBreakdown.map((item, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-slate-900">{item.bracket}</span>
                        <p className="text-[11px] text-slate-500">
                          Statutory withholding compliance schedule
                        </p>
                      </div>
                      <span className="font-mono font-bold text-rose-700 text-sm tabular-nums">
                        -{item.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedEmployee.currency}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-lg flex items-center justify-between text-xs font-bold text-rose-900">
                  <span>TOTAL STATUTORY WITHHOLDINGS</span>
                  <span className="font-mono text-base tabular-nums">
                    -{taxResult.totalDeductions.toLocaleString(undefined, { minimumFractionDigits: 2 })} {selectedEmployee.currency}
                  </span>
                </div>
              </div>

              {/* Net Disbursable Take-Home Pay */}
              <div className="mt-6 p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider block">
                    3. Net Monthly Disbursal
                  </span>
                  <p className="text-xs text-emerald-700 mt-0.5">
                    Authorized for direct deposit to {selectedEmployee.bankAccountMasked}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono tabular-nums text-emerald-900">
                    {taxResult.netPay.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-bold text-emerald-800 ml-1.5">{selectedEmployee.currency}</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* Add Employee Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">
              Add Secure Employee Compensation &amp; Tax Profile
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Enter employee salary, allowances, and statutory jurisdiction
            </p>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.name}
                    onChange={(e) => setNewEmp({ ...newEmp, name: e.target.value })}
                    placeholder="e.g. Asgar Miya"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID Number *</label>
                  <input
                    type="text"
                    required
                    value={newEmp.empId}
                    onChange={(e) => setNewEmp({ ...newEmp, empId: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Tax Jurisdiction *</label>
                  <select
                    value={newEmp.region}
                    onChange={(e) => {
                      const reg = e.target.value as TaxRegion;
                      const curr = reg === 'USA' ? 'USD' : reg === 'UK' ? 'GBP' : reg === 'Nepal' ? 'NPR' : reg === 'Germany' ? 'EUR' : 'AED';
                      setNewEmp({ ...newEmp, region: reg, currency: curr });
                    }}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  >
                    <option value="UAE">UAE / GCC</option>
                    <option value="USA">USA (IRS W-4)</option>
                    <option value="UK">UK (HMRC PAYE)</option>
                    <option value="Nepal">Nepal (IRD Slabs)</option>
                    <option value="Germany">Germany (EU)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Currency</label>
                  <input
                    type="text"
                    value={newEmp.currency}
                    onChange={(e) => setNewEmp({ ...newEmp, currency: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newEmp.department}
                    onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Base Salary *</label>
                  <input
                    type="number"
                    required
                    value={newEmp.baseSalary}
                    onChange={(e) => setNewEmp({ ...newEmp, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Housing Allowance</label>
                  <input
                    type="number"
                    value={newEmp.housingAllowance}
                    onChange={(e) => setNewEmp({ ...newEmp, housingAllowance: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Transport Allowance</label>
                  <input
                    type="number"
                    value={newEmp.transportAllowance}
                    onChange={(e) => setNewEmp({ ...newEmp, transportAllowance: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Commission / Bonus</label>
                  <input
                    type="number"
                    value={newEmp.commissionBonus}
                    onChange={(e) => setNewEmp({ ...newEmp, commissionBonus: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Masked Bank Account / IBAN</label>
                  <input
                    type="text"
                    value={newEmp.bankAccountMasked}
                    onChange={(e) => setNewEmp({ ...newEmp, bankAccountMasked: e.target.value })}
                    placeholder="e.g. ENBD ****9012"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded-md font-semibold"
                >
                  Save Compensation Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

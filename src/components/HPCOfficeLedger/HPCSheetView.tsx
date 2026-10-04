import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { HPCLedgerRow, HPCPendingPayment, HPCAccountDetail } from '../../types';
import { 
  TableProperties, 
  Plus, 
  Download, 
  Trash2, 
  Calendar, 
  User, 
  DollarSign, 
  CreditCard, 
  Printer, 
  Search,
  Check,
  FileSpreadsheet,
  Edit2,
  X
} from 'lucide-react';
import { exportHPCLedgerToCSV } from '../../utils/exportUtils';

export const HPCSheetView: React.FC = () => {
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
    currentUser
  } = useApp();

  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [isAddPendingModalOpen, setIsAddPendingModalOpen] = useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Inline edit state for Pending Payments
  const [editingPendingId, setEditingPendingId] = useState<string | null>(null);
  const [editPendingData, setEditPendingData] = useState<Partial<HPCPendingPayment>>({});

  // Inline edit state for Account Details
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [editAccountData, setEditAccountData] = useState<Partial<HPCAccountDetail>>({});

  // Dedicated Modal edit state
  const [pendingToEditModal, setPendingToEditModal] = useState<HPCPendingPayment | null>(null);
  const [accountToEditModal, setAccountToEditModal] = useState<HPCAccountDetail | null>(null);

  // New Client Form state
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

  // New Pending Payment Form state
  const [newPending, setNewPending] = useState<Partial<HPCPendingPayment>>({
    date: hpcDate,
    empNo: currentUser.empId,
    executive: currentUser.name,
    clientName: '',
    passportNo: '',
    received: 10000,
    remarks: ''
  });

  // New Account Detail Form state
  const [newAccount, setNewAccount] = useState<Partial<HPCAccountDetail>>({
    empNo: currentUser.empId,
    executive: currentUser.name,
    amount: 10000,
    bankName: 'A/C Asgar',
    remarks: ''
  });

  // Calculations matching Image 1
  const totalReceivedMain = hpcRows.reduce((sum, r) => sum + (Number(r.received) || 0), 0);
  const totalPendingReceived = pendingPayments.reduce((sum, p) => sum + (Number(p.received) || 0), 0);
  const totalAccountAmount = accountDetails.reduce((sum, a) => sum + (Number(a.amount) || 0), 0);

  const filteredRows = hpcRows.filter(r => 
    r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.passportOrNationalId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.executive.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.work.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.clientName) return;
    addHpcRow(newClient);
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
    addPendingPayment(newPending);
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

  return (
    <div className="space-y-6">
      
      {/* Top Banner matching Image 1 layout */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-slate-900">
                  HPC Daily Operations &amp; Visa Client Ledger
                </h1>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-lg text-xs font-bold font-mono">
                  <span>Date:</span>
                  <input
                    type="text"
                    value={hpcDate}
                    onChange={(e) => setHpcDate(e.target.value)}
                    className="bg-transparent font-bold font-mono text-red-700 focus:outline-hidden w-28 text-center"
                  />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Synchronized operational sheet: visa clearance, client collection, pending receivables, and bank clearing accounts
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ledger..."
                className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 bg-white focus:outline-hidden w-48"
              />
            </div>

            <button
              onClick={() => setIsAddClientModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Client Entry</span>
            </button>

            <button
              onClick={() => exportHPCLedgerToCSV(hpcRows, pendingPayments, accountDetails, hpcDate)}
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
      </div>

      {/* Main Table: Exact 16 Columns from Image 1 */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Daily Visa Client Processing Ledger
          </span>
          <span className="text-xs text-slate-500 font-mono">
            {filteredRows.length} active records
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-sans">
            <thead>
              <tr className="bg-emerald-50/70 border-b border-slate-200 text-slate-700 font-bold divide-x divide-slate-200">
                <th className="py-2.5 px-2 text-center w-12">Sr. No</th>
                <th className="py-2.5 px-3 whitespace-nowrap">Date</th>
                <th className="py-2.5 px-2 text-center w-14">Emp#</th>
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

              {/* Blank empty placeholder rows matching the physical spreadsheet aesthetic */}
              {Array.from({ length: Math.max(0, 5 - filteredRows.length) }).map((_, i) => (
                <tr key={`blank_${i}`} className="divide-x divide-slate-100 text-slate-300">
                  <td className="py-2 px-2 text-center font-mono">{filteredRows.length + i + 1}</td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-2"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3 text-right">-</td>
                  <td className="py-2 px-3 text-right">-</td>
                  <td className="py-2 px-3 text-right text-red-400">-</td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-3"></td>
                  <td className="py-2 px-2 no-print"></td>
                </tr>
              ))}
            </tbody>
            {/* Total Footer matching Image 1 */}
            <tfoot>
              <tr className="bg-slate-100 font-bold border-t-2 border-slate-300 divide-x divide-slate-200">
                <td colSpan={11} className="py-2.5 px-4 text-right uppercase tracking-wider text-slate-700">
                  Total Received
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

      {/* Two Sub-Tables matching Bottom of Image 1: Pending Payment & Account Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sub-Table 1: Pending Payment */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-3 bg-emerald-50/60 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Pending Payment
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Clearance Adjustments)
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
            <span className="text-slate-700 uppercase tracking-wider">Total</span>
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
                  Account Details
                </span>
                <span className="text-[11px] text-slate-500 font-mono">
                  (Bank Deposits &amp; Wires)
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
            <span className="text-slate-700 uppercase tracking-wider">Total</span>
            <span className="font-mono text-blue-900 text-sm tabular-nums">
              {totalAccountAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

      </div>

      {/* Add Client Entry Modal */}
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Employee ID (Emp#) *</label>
                  <input
                    type="text"
                    required
                    value={newClient.empNo || ''}
                    onChange={(e) => setNewClient({ ...newClient, empNo: e.target.value })}
                    placeholder="e.g. 105"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md font-mono font-bold text-slate-900 bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Executive (In-charge) *</label>
                  <input
                    type="text"
                    required
                    value={newClient.executive || ''}
                    onChange={(e) => setNewClient({ ...newClient, executive: e.target.value })}
                    placeholder="e.g. Asgar Miya"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-md bg-white focus:outline-hidden focus:ring-1 focus:ring-slate-900"
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

      {/* Add Pending Payment Modal */}
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

      {/* Add Account Deposit Modal */}
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

      {/* Edit Pending Payment Modal */}
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

      {/* Edit Account Deposit Modal */}
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

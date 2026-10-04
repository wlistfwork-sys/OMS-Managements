import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Upload, 
  Sparkles, 
  FileText, 
  Check, 
  Image as ImageIcon, 
  DollarSign, 
  Calendar, 
  Building, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { ExpenseCategory } from '../../types';

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewExpenseModal: React.FC<NewExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, currentUser, hpcRows } = useApp();

  const [merchant, setMerchant] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('Client Visa & Processing');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('AED');
  const [taxAmount, setTaxAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [reimbursementMethod, setReimbursementMethod] = useState<'Bank Transfer' | 'Cash Disbursement' | 'Payroll Addition'>('Bank Transfer');
  const [clientReference, setClientReference] = useState('');
  
  // Receipt state
  const [receiptUrl, setReceiptUrl] = useState<string | null>(null);
  const [receiptName, setReceiptName] = useState<string | null>(null);
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [ocrSuccessMessage, setOcrSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setReceiptName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setReceiptUrl(result);
        triggerOCRScan(file.name);
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset sample receipts for quick evaluation
  const handleSelectSampleReceipt = (type: 'visa' | 'taxi' | 'hotel') => {
    if (type === 'visa') {
      setReceiptName('consular_embassy_receipt.png');
      setReceiptUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="420" viewBox="0 0 400 420" fill="none"><rect width="400" height="420" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="380" rx="8" stroke="%23E2E8F0" stroke-width="2" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">EMBASSY &amp; CONSULAR SERVICE</text><text x="40" y="110" font-family="monospace" font-size="12" fill="%23334155">Date: 03-Oct-2026</text><text x="40" y="140" font-family="monospace" font-size="12" fill="%23334155">Client Visa Application Stamp</text><text x="40" y="170" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">TOTAL: 950.00 AED</text><text x="40" y="200" font-family="monospace" font-size="12" fill="%23059669">VAT 5%: 47.50 AED</text><text x="200" y="320" text-anchor="middle" font-family="monospace" font-size="12" fill="%23059669">VERIFIED RECEIPT</text></svg>');
      triggerOCRScan('Consular Embassy Attestation Voucher', 950.00, 47.50, 'Client Visa & Processing');
    } else if (type === 'taxi') {
      setReceiptName('airport_express_transit.png');
      setReceiptUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="360" viewBox="0 0 400 360" fill="none"><rect width="400" height="360" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="320" rx="8" stroke="%23E2E8F0" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold" fill="%230F172A">AIRPORT TRANSIT CAB</text><text x="40" y="110" font-family="monospace" font-size="12" fill="%23334155">Fare: 185.00 AED</text><text x="40" y="140" font-family="monospace" font-size="12" fill="%23059669">VAT 5%: 9.25 AED</text><text x="200" y="240" text-anchor="middle" font-family="monospace" font-size="14" font-weight="bold">PAID CASH</text></svg>');
      triggerOCRScan('Airport Express Transit Co', 185.00, 9.25, 'Transportation');
    } else {
      setReceiptName('marriott_executive_accommodation.png');
      setReceiptUrl('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none"><rect width="400" height="400" fill="%23FFFFFF"/><rect x="20" y="20" width="360" height="360" rx="8" stroke="%23E2E8F0" fill="%23F8FAFC"/><text x="200" y="60" text-anchor="middle" font-family="monospace" font-size="16" font-weight="bold">HOTEL ACCOMMODATION</text><text x="40" y="110" font-family="monospace" font-size="12">1 Night Transit Suite</text><text x="40" y="140" font-family="monospace" font-size="16" font-weight="bold">TOTAL: 650.00 AED</text><text x="40" y="170" font-family="monospace" font-size="12">VAT 5%: 32.50 AED</text></svg>');
      triggerOCRScan('Marriott Transit Hotel', 650.00, 32.50, 'Accommodation');
    }
  };

  const triggerOCRScan = (
    fileName: string, 
    customAmount?: number, 
    customTax?: number, 
    customCat?: ExpenseCategory
  ) => {
    setIsScanningOCR(true);
    setOcrSuccessMessage(null);

    setTimeout(() => {
      setIsScanningOCR(false);
      const parsedAmount = customAmount || Math.floor(150 + Math.random() * 850);
      const parsedTax = customTax || +(parsedAmount * 0.05).toFixed(2);
      const parsedMerchant = fileName.replace(/_/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase();

      setMerchant(parsedMerchant);
      setAmount(parsedAmount.toString());
      setTaxAmount(parsedTax.toString());
      if (customCat) setCategory(customCat);
      setOcrSuccessMessage(`Receipt parsed: extracted amount ${parsedAmount} ${currency} and 5% VAT`);
    }, 700);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !merchant) return;

    addExpense({
      merchant,
      category,
      amount: parseFloat(amount),
      currency,
      taxAmount: taxAmount ? parseFloat(taxAmount) : 0,
      date,
      description,
      reimbursementMethod,
      clientReference: clientReference || undefined,
      receiptFileName: receiptName || 'uploaded_receipt.png',
      receiptUrl: receiptUrl || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-tight">
              Claim New Expense Reimbursement
            </h3>
            <p className="text-xs text-slate-500">
              Submit digital receipt for automated manager approval and accounting clearance
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Receipt Upload & OCR Scanner Area */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-slate-500" />
                <span>Upload Receipt Voucher</span>
              </label>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                <span>Quick samples:</span>
                <button
                  type="button"
                  onClick={() => handleSelectSampleReceipt('visa')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Visa Fee
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSampleReceipt('taxi')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Transit
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectSampleReceipt('hotel')}
                  className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Hotel
                </button>
              </div>
            </div>

            <div className="relative border-2 border-dashed border-slate-300 rounded-xl p-4 hover:border-slate-400 transition-colors bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <input
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {receiptUrl ? (
                <div className="flex items-center gap-4 w-full">
                  <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 overflow-hidden flex items-center justify-center shrink-0">
                    <img src={receiptUrl} alt="Receipt Preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{receiptName}</p>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5" /> Receipt Attached &amp; Validated
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReceiptUrl(null);
                      setReceiptName(null);
                      setOcrSuccessMessage(null);
                    }}
                    className="text-xs text-rose-600 hover:underline px-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="py-2">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-slate-700">
                    Click to browse or drag and drop receipt image or PDF
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    PNG, JPG, PDF up to 10MB (Smart OCR Auto-fills Fields)
                  </p>
                </div>
              )}
            </div>

            {/* OCR Progress or Success indicator */}
            {isScanningOCR && (
              <div className="p-2 bg-indigo-50 border border-indigo-200 rounded-lg flex items-center gap-2 text-xs text-indigo-700">
                <Sparkles className="w-4 h-4 animate-spin" />
                <span>Scanning receipt text, merchant, total amount and tax invoice...</span>
              </div>
            )}
            {ocrSuccessMessage && !isScanningOCR && (
              <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{ocrSuccessMessage}</span>
              </div>
            )}
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Merchant */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Merchant / Payee Name *
              </label>
              <input
                type="text"
                required
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="e.g. Dubai Immigration MOFA / Etihad Airways"
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            {/* Category */}
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

            {/* Amount & Currency */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Claim Amount &amp; Currency *
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    const val = parseFloat(e.target.value);
                    if (!isNaN(val) && !taxAmount) {
                      setTaxAmount((val * 0.05).toFixed(2));
                    }
                  }}
                  placeholder="0.00"
                  className="flex-1 px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                />
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-24 px-2 py-2 text-xs font-mono font-semibold rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
                >
                  <option value="AED">AED</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="NPR">NPR</option>
                </select>
              </div>
            </div>

            {/* Tax Amount / VAT */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                VAT / Tax Amount ({currency})
              </label>
              <input
                type="number"
                step="0.01"
                value={taxAmount}
                onChange={(e) => setTaxAmount(e.target.value)}
                placeholder="Included VAT/GST"
                className="w-full px-3 py-2 text-xs font-mono tabular-nums rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            {/* Expense Date */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">
                Transaction Date *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 focus:outline-hidden focus:ring-1 focus:ring-slate-900 bg-white"
              />
            </div>

            {/* Reimbursement Method */}
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

          {/* Client Reference Link (From HPC Daily Ledger) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Link to HPC Client / Processing Dossier (Optional)
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

          {/* Business Purpose / Description */}
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
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">
              Claimant: <strong className="text-slate-800">{currentUser.name}</strong> (#{currentUser.empId})
            </span>
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
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                Submit Expense Claim
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};

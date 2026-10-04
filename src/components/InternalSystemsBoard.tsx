import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  Server, 
  ShieldCheck, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  Key, 
  Lock, 
  Layers,
  Database,
  Building,
  CreditCard,
  FileCheck
} from 'lucide-react';

export const InternalSystemsBoard: React.FC = () => {
  const { internalSystems, syncSystem, currentUser, openSSOModal } = useApp();

  return (
    <div className="space-y-6">
      {/* Header and status banner */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0 shadow-sm">
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900">
                  Board of Internal Systems &amp; SSO Gateway
                </h1>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Authorized via {currentUser.ssoProvider} for {currentUser.name} ({currentUser.email}) · Board Session ID: <code className="font-mono text-slate-700">HPC-SSO-9021-X</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={openSSOModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-slate-500" />
              <span>Manage SSO Token</span>
            </button>
            <button
              onClick={() => internalSystems.forEach(s => syncSystem(s.id))}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sync All Systems</span>
            </button>
          </div>
        </div>

        {/* Security Policy Strip */}
        <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[11px]">Authentication Method</span>
            <span className="font-semibold text-slate-800">{currentUser.ssoProvider} SAML 2.0</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Token Validity</span>
            <span className="font-mono font-medium text-emerald-700">23h 58m Remaining</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Audit Logging</span>
            <span className="font-semibold text-slate-800">Immutable Cryptographic Log</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Encryption Standard</span>
            <span className="font-mono font-medium text-slate-800">TLS 1.3 / AES-256-GCM</span>
          </div>
        </div>
      </div>

      {/* Grid of Internal System Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {internalSystems.map(system => {
          const getCategoryIcon = () => {
            switch (system.category) {
              case 'ERP': return <Database className="w-5 h-5 text-indigo-600" />;
              case 'Banking': return <CreditCard className="w-5 h-5 text-emerald-600" />;
              case 'Government/Immigration': return <Building className="w-5 h-5 text-amber-600" />;
              case 'Tax & Payroll': return <FileCheck className="w-5 h-5 text-blue-600" />;
              default: return <Server className="w-5 h-5 text-slate-600" />;
            }
          };

          return (
            <div 
              key={system.id}
              className="bg-white rounded-xl border border-slate-200 p-5 hover:border-slate-300 transition-all shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {getCategoryIcon()}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 leading-tight">
                        {system.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-slate-400">
                          {system.serviceCode}
                        </span>
                        <span className="text-slate-300">·</span>
                        <span className="text-[11px] text-slate-500">
                          {system.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    system.status === 'operational' || system.status === 'authorized'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      system.status === 'operational' || system.status === 'authorized' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></span>
                    {system.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Authorized Scopes:</span>
                    <span className="font-mono text-[11px] text-slate-700 text-right truncate max-w-[240px]">
                      {system.scope}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Auth Handshake:</span>
                    <span className="font-semibold text-slate-800">{system.authMethod}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Roundtrip Latency:</span>
                    <span className="font-mono font-medium text-slate-800">{system.latencyMs} ms</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">
                  Last synced: <span className="text-slate-600 font-medium">{system.lastSync}</span>
                </span>
                <button
                  onClick={() => syncSystem(system.id)}
                  disabled={system.status === 'syncing'}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3 h-3 ${system.status === 'syncing' ? 'animate-spin' : ''}`} />
                  <span>{system.status === 'syncing' ? 'Syncing...' : 'Sync Node'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Board Security & Audit Trail */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
          Recent SSO Authorization Activity Log
        </h3>
        <div className="space-y-2 text-xs text-slate-600 font-mono">
          <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
            <span>[2026-10-04 08:30:11 UTC] SSO Auth Token granted for user: asgar.miya@hpcoffice.com via Microsoft Entra ID</span>
            <span className="text-emerald-600 font-semibold">TOKEN_200_OK</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
            <span>[2026-10-04 08:30:14 UTC] Board node HPC-ERP-NODE-01 handshake verified (Scopes: ledger:write, ledger:audit)</span>
            <span className="text-emerald-600 font-semibold">SYNCHRONIZED</span>
          </div>
          <div className="p-2.5 bg-slate-50 rounded-lg flex items-center justify-between">
            <span>[2026-10-04 08:30:15 UTC] Corporate Bank Disbursal Gateway cleared for reimbursement requests</span>
            <span className="text-emerald-600 font-semibold">CONNECTED</span>
          </div>
        </div>
      </div>
    </div>
  );
};

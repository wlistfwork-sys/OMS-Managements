import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Shield, Key, CheckCircle, RefreshCw, X, Globe, Lock, Server } from 'lucide-react';
import { UserProfile } from '../types';

export const SSOModal: React.FC = () => {
  const { 
    isSSOModalOpen, 
    closeSSOModal, 
    currentUser, 
    authenticateSSO, 
    internalSystems 
  } = useApp();

  const [selectedProvider, setSelectedProvider] = useState<UserProfile['ssoProvider']>(currentUser.ssoProvider);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  if (!isSSOModalOpen) return null;

  const providers: { id: UserProfile['ssoProvider']; name: string; domain: string; desc: string; iconColor: string }[] = [
    {
      id: 'Google Workspace',
      name: 'Google Workspace SSO',
      domain: 'accounts.google.com',
      desc: 'OAuth 2.0 / OpenID Connect with Corporate Domain Directory',
      iconColor: 'bg-red-500'
    },
    {
      id: 'Microsoft Entra ID',
      name: 'Microsoft Entra ID (Azure AD)',
      domain: 'login.microsoftonline.com',
      desc: 'SAML 2.0 & MS Graph Identity Federation for Enterprise',
      iconColor: 'bg-blue-600'
    },
    {
      id: 'Okta',
      name: 'Okta Workforce Identity Cloud',
      domain: 'hpcoffice.okta.com',
      desc: 'Universal Directory with Multi-Factor Adaptive Authentication',
      iconColor: 'bg-indigo-600'
    },
    {
      id: 'HPC Internal SSO',
      name: 'HPC Secure Board Gateway SAML',
      domain: 'sso.hpcoffice.internal',
      desc: 'High-security internal hardware token & internal subnet authentication',
      iconColor: 'bg-slate-900'
    }
  ];

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    setTimeout(() => {
      authenticateSSO(selectedProvider);
      setIsAuthorizing(false);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                Single Sign-On (SSO) &amp; Board Access
              </h3>
              <p className="text-xs text-slate-500">
                Authorize connection to the Board of Internal Systems
              </p>
            </div>
          </div>
          <button 
            onClick={closeSSOModal}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Active Identity Summary */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                {currentUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                <p className="text-[11px] text-slate-500">{currentUser.email} · Employee #{currentUser.empId}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                Authorized
              </span>
              <p className="text-[10px] text-slate-400 font-mono">Token: active</p>
            </div>
          </div>

          {/* Select SSO Provider */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Select Enterprise Identity Provider
            </label>
            <div className="space-y-2">
              {providers.map(p => (
                <label 
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedProvider === p.id 
                      ? 'border-slate-900 bg-slate-50/80 ring-1 ring-slate-900' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input 
                    type="radio" 
                    name="sso_provider" 
                    checked={selectedProvider === p.id}
                    onChange={() => setSelectedProvider(p.id)}
                    className="mt-1 text-slate-900 focus:ring-slate-900"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{p.name}</span>
                      <span className="text-[10px] font-mono text-slate-400">{p.domain}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Scopes & Permissions Granted */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-semibold text-slate-700 block mb-1.5">
              Authorized Scopes on Internal Systems Board:
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>HPC Core ERP Ledger (Read / Write)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Immigration &amp; Visa Board API</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Corporate Banking Disbursal</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Regional Payroll &amp; Tax Authority</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Session expires in 23h 58m
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={closeSSOModal}
              className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAuthorize}
              disabled={isAuthorizing}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs disabled:opacity-50"
            >
              {isAuthorizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Validating SSO Tokens...</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5" />
                  <span>Re-Authenticate SSO</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

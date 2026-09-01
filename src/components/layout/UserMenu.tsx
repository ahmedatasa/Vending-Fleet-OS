import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, ChevronDown, ShieldCheck, Sparkles, RefreshCw } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Badge } from '../common/Badge';

export const UserMenu: React.FC = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const isAr = language === 'ar';

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 p-1.5 rounded-xl border border-slate-700/80 bg-slate-800/60 hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
        </div>
        <div className="hidden md:block text-left rtl:text-right">
          <div className="text-xs font-semibold text-slate-200 leading-tight">
            {user.fullName}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">
            {user.role}
          </div>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl z-50 overflow-hidden">
          {/* User Header */}
          <div className="p-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-slate-100 truncate">{user.fullName}</h4>
                <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                <div className="mt-1">
                  <Badge variant="primary" size="sm">{user.role}</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Quick RBAC Switcher */}
          <div className="p-3 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                {t('selectDemoRole')}
              </span>
            </div>
            <div className="space-y-1">
              {DEMO_ACCOUNTS.map(demo => (
                <button
                  key={demo.role}
                  onClick={() => {
                    loginAsDemo(demo);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    user.role === demo.role
                      ? 'bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30'
                      : 'hover:bg-slate-800 text-slate-300'
                  }`}
                >
                  <span className="truncate">{isAr ? demo.nameAr : demo.name}</span>
                  <span className="text-[10px] font-mono opacity-70">{demo.role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Logout */}
          <div className="p-2 bg-slate-950/40">
            <button
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('signOut')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

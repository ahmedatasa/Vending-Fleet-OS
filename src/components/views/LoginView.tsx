import React, { useState } from 'react';
import { Cpu, ShieldCheck, Mail, Lock, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS, DemoAccount } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../common/Button';
import { LanguageToggle } from '../layout/LanguageToggle';
import { ThemeToggle } from '../layout/ThemeToggle';
import { NavigationTab } from '../../types';

interface LoginViewProps {
  onSuccessLogin?: () => void;
  onNavigate?: (tab: NavigationTab, id?: string) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccessLogin, onNavigate }) => {
  const { login, loginAsDemo, isLoading } = useAuth();
  const { t, language, isRTL } = useLanguage();

  const [email, setEmail] = useState('admin@vendingfleet.com');
  const [password, setPassword] = useState('password123');
  const [errorMessage, setErrorMessage] = useState('');

  const isAr = language === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const ok = await login(email, password);
    if (ok && onSuccessLogin) {
      onSuccessLogin();
    } else if (!ok) {
      setErrorMessage('Invalid credentials. Please verify your email and password.');
    }
  };

  const handleDemoSelect = (demo: DemoAccount) => {
    loginAsDemo(demo);
    if (onSuccessLogin) {
      onSuccessLogin();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top right language and theme controls */}
      <div className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <LanguageToggle />
        <ThemeToggle />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-blue-600/20">
            <Cpu className="w-6 h-6" />
          </div>
        </div>
        <h2 className="text-center text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">
          {t('appName')}
        </h2>
        <p className="mt-2 text-center text-xs text-slate-400 max-w-sm mx-auto">
          {t('loginSubtitle')}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-900/90 border border-slate-800 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 backdrop-blur-xl">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
              {errorMessage}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-slate-300">
                {t('email')}
              </label>
              <div className="mt-1 relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Mail className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 ${
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  } text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300">
                {t('password')}
              </label>
              <div className="mt-1 relative">
                <div className={`absolute inset-y-0 ${isRTL ? 'right-0 pr-3' : 'left-0 pl-3'} flex items-center pointer-events-none`}>
                  <Lock className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full bg-slate-950 border border-slate-700 rounded-lg py-2.5 ${
                    isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'
                  } text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500`}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center text-slate-400">
                <input type="checkbox" defaultChecked className="rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 mr-2 rtl:ml-2 rtl:mr-0" />
                <span>{t('rememberMe')}</span>
              </label>
              <span className="text-blue-400 hover:text-blue-300 cursor-pointer">
                {t('forgotPassword')}
              </span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              isLoading={isLoading}
              icon={ArrowRight}
              iconPosition="end"
            >
              {t('signIn')}
            </Button>
          </form>

          {/* Instant Demo Accounts Picker */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="flex items-center gap-1.5 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                {t('demoAccounts')}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map(demo => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoSelect(demo)}
                  className="flex flex-col text-left rtl:text-right p-2.5 rounded-xl border border-slate-800 bg-slate-950/60 hover:bg-slate-800 hover:border-slate-700 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-blue-400 truncate">
                      {isAr ? demo.nameAr : demo.name}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-mono ${demo.badgeColor}`}>
                      {demo.role.split('_')[0]}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate">
                    {isAr ? demo.titleAr : demo.title}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

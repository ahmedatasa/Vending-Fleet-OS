import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Server,
  Bell,
  Clock,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  Cpu,
  Layers,
  Sparkles,
  Phone,
  Mail,
  Headphones,
  Save,
  MessageSquare
} from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { api } from '../../services/api';

export const SettingsView: React.FC = () => {
  const { t, language } = useLanguage();
  const { showToast } = useNotification();

  const [criticalSla, setCriticalSla] = useState(2);
  const [highSla, setHighSla] = useState(4);
  const [mediumSla, setMediumSla] = useState(8);
  const [lowSla, setLowSla] = useState(24);

  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  // Customer Support & Hotline Settings
  const [supportPhone, setSupportPhone] = useState('800-123-4567');
  const [supportEmail, setSupportEmail] = useState('support@vendingfleet.com');
  const [supportHoursAr, setSupportHoursAr] = useState('خدمة العملاء على مدار 24 ساعة طوال أيام الأسبوع');
  const [supportWhatsapp, setSupportWhatsapp] = useState('+966-50-000-0000');
  const [isSavingSupport, setIsSavingSupport] = useState(false);

  // Load existing settings
  useEffect(() => {
    api.getSettings().then(s => {
      if (s) {
        if (s.criticalSla !== undefined) setCriticalSla(s.criticalSla);
        if (s.highSla !== undefined) setHighSla(s.highSla);
        if (s.mediumSla !== undefined) setMediumSla(s.mediumSla);
        if (s.lowSla !== undefined) setLowSla(s.lowSla);
        if (s.emailAlerts !== undefined) setEmailAlerts(s.emailAlerts);
        if (s.smsAlerts !== undefined) setSmsAlerts(s.smsAlerts);
        if (s.supportPhone) setSupportPhone(s.supportPhone);
        if (s.supportEmail) setSupportEmail(s.supportEmail);
        if (s.supportHoursAr) setSupportHoursAr(s.supportHoursAr);
        if (s.supportWhatsapp) setSupportWhatsapp(s.supportWhatsapp);
      }
    }).catch(() => {});
  }, []);

  const handleSaveSla = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.updateSettings({
        criticalSla,
        highSla,
        mediumSla,
        lowSla,
        emailAlerts,
        smsAlerts,
        supportPhone,
        supportEmail,
        supportHoursAr,
        supportWhatsapp
      });
      showToast(t('success'), 'تم حفظ وتحديث أوقات الاستجابة (SLA) في محرك البلاغات بنجاح!', 'success');
    } catch {
      showToast(t('error'), 'فشل حفظ الإعدادات', 'error');
    }
  };

  const handleSaveSupportConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingSupport(true);
    try {
      await api.updateSettings({
        criticalSla,
        highSla,
        mediumSla,
        lowSla,
        emailAlerts,
        smsAlerts,
        supportPhone,
        supportEmail,
        supportHoursAr,
        supportWhatsapp
      });
      showToast(t('success'), 'تم حفظ رقم هاتف الاستفسار والمتابعة وبيانات الدعم الفني بنجاح، وتم تحديثها فوراً في بوابة البلاغات العامة!', 'success');
    } catch {
      showToast(t('error'), 'تعذر حفظ بيانات الدعم الفني', 'error');
    } finally {
      setIsSavingSupport(false);
    }
  };

  const handleResetData = async () => {
    if (!window.confirm('إعادة ضبط جميع بيانات الأسطول والتذاكر إلى الحالة الأولية النظيفة؟')) return;

    setIsResetting(true);
    try {
      await api.resetDatabase();
      showToast(t('success'), 'تمت إعادة ضبط قاعدة البيانات بنجاح إلى النسخة الأولية!', 'success');
    } catch {
      showToast(t('error'), 'فشلت إعادة ضبط قاعدة البيانات', 'error');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-100">{t('settings')} & Platform Engine</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          إعدادات النظام، هاتف الاستفسار والمتابعة لبوابة العملاء، سياسات الاستجابة SLA ومراقبة البنية التحتية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: System Status */}
        <div className="space-y-6">
          <Card title="Infrastructure Health" subtitle="Container runtime diagnostics">
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Database className="w-4 h-4 text-blue-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Fleet Data Server Engine</span>
                    <span className="text-[10px] text-slate-400 font-mono">Port 3000 • Unified Real-time Sync</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                  ONLINE
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Server className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">QR Public Ingestion API</span>
                    <span className="text-[10px] text-slate-400 font-mono">REST Full-Stack Worker</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                  HEALTHY
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Cpu className="w-4 h-4 text-emerald-400" />
                  <div>
                    <span className="font-semibold text-slate-200 block">Excel Normalization Service</span>
                    <span className="text-[10px] text-slate-400 font-mono">SheetJS XLSX Pipeline</span>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold font-mono">
                  READY
                </span>
              </div>
            </div>
          </Card>

          {/* Database Reset Card */}
          <Card title="Database Maintenance" subtitle="Development and demo reset">
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              إعادة تحميل البيانات الأولية النظيفة التي تحتوي على المكائن، المباني، قطع الغيار والبلاغات الافتراضية.
            </p>
            <Button
              variant="danger"
              size="sm"
              fullWidth
              icon={RotateCcw}
              isLoading={isResetting}
              onClick={handleResetData}
            >
              Reset Seed Database
            </Button>
          </Card>
        </div>

        {/* Right 2 Columns: Support Phone & SLA Policies */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Customer Support & QR Portal Helpline Configuration */}
          <Card 
            title="إعدادات خدمة العملاء ورقم الاستفسار والمتابعة (QR Portal Support)" 
            subtitle="الرقم والبيانات التي تظهر للعملاء عند مسح كود الـ QR وفي شاشة تأكيد البلاغ واسترجاع المبالغ"
          >
            <form onSubmit={handleSaveSupportConfig} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-blue-400 block mb-1 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5" />
                    <span>رقم الهاتف المخصص للاستفسار والمتابعة (Hotline)</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={supportPhone}
                    onChange={e => setSupportPhone(e.target.value)}
                    placeholder="مثال: 800-123-4567 أو 920001234"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono font-bold focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    يظهر مباشرة في أسفل شاشة تسجيل البلاغ وشاشة التأكيد للعميل.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>البريد الإلكتروني لخدمة العملاء</span>
                  </label>
                  <input
                    type="email"
                    value={supportEmail}
                    onChange={e => setSupportEmail(e.target.value)}
                    placeholder="support@vendingfleet.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 block">
                    يُستخدم لمراسلات الدعم الفني واسترجاع العمليات البنكية.
                  </span>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>أوقات العمل المعتمدة</span>
                  </label>
                  <input
                    type="text"
                    value={supportHoursAr}
                    onChange={e => setSupportHoursAr(e.target.value)}
                    placeholder="خدمة العملاء على مدار 24 ساعة طوال أيام الأسبوع"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-emerald-400 block mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>رقم الواتساب للاستفسارات السريعة (اختياري)</span>
                  </label>
                  <input
                    type="text"
                    value={supportWhatsapp}
                    onChange={e => setSupportWhatsapp(e.target.value)}
                    placeholder="+966-50-000-0000"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800/80">
                <Button 
                  type="submit" 
                  variant="primary" 
                  size="sm"
                  icon={Save}
                  isLoading={isSavingSupport}
                >
                  حفظ وتحديث بيانات هاتف الدعم الفني
                </Button>
              </div>
            </form>
          </Card>

          {/* SLA Thresholds Form */}
          <Card title="Maintenance SLA Targets" subtitle="أقصى وقت مسموح به لحل البلاغ حسب درجة الخطورة">
            <form onSubmit={handleSaveSla} className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="text-xs font-semibold text-rose-400 block mb-1">
                    حرج (Critical)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={criticalSla}
                      onChange={e => setCriticalSla(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">ساعات</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-amber-400 block mb-1">
                    مرتفع (High)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={highSla}
                      onChange={e => setHighSla(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">ساعات</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-blue-400 block mb-1">
                    متوسط (Medium)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={mediumSla}
                      onChange={e => setMediumSla(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">ساعات</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">
                    منخفض (Low)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={1}
                      value={lowSla}
                      onChange={e => setLowSla(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-blue-500"
                    />
                    <span className="absolute right-2.5 top-2 text-[10px] text-slate-400 font-mono">ساعات</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-800/80">
                <Button type="submit" variant="outline" size="sm">
                  حفظ سياسة الـ SLA
                </Button>
              </div>
            </form>
          </Card>

          {/* Dispatch Alert Notifications */}
          <Card title="Automated Dispatch Notifications" subtitle="إشعارات التوجيه والتنبيهات المباشرة للفنيين والمشرفين">
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">إشعارات SMS للأعطال الحرجة (Critical SMS)</span>
                  <span className="text-[11px] text-slate-400">إرسال رسالة نصية فورية للفني المناوب عند تسجيل بلاغ عطل حرج (SLA ساعتين)</span>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={e => setSmsAlerts(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800 cursor-pointer">
                <div>
                  <span className="text-xs font-bold text-slate-200 block">ملخص نقص قطع الغيار بالمستودع</span>
                  <span className="text-[11px] text-slate-400">إشعار مدير المستودع تلقائياً عند هبوط كمية قطع الغيار عن حد الأمان</span>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={e => setEmailAlerts(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                />
              </label>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

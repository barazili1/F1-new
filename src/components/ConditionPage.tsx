import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Users, Shield, Bell, Chrome, Youtube, Send, Key, Coins, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
const logoUrl = 'https://plain-eeur-prod-public.komododecks.com/202606/24/Bdn19OZTrlYXQS8dLPf7/image.jpg';
import { Provider } from '../types';

interface ConditionPageProps {
  onComplete: (provider: Provider, userId: string) => void;
}

export default function ConditionPage({ onComplete }: ConditionPageProps) {
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [onlineUsers, setOnlineUsers] = useState(() => Math.floor(Math.random() * 1001) + 1000);
  
  // Requirement states
  const [telegramJoined, setTelegramJoined] = useState(false);
  const [youtubeJoined, setYoutubeJoined] = useState(false);
  const [promoUsed, setPromoUsed] = useState(false);
  const [deposited, setDeposited] = useState(false);
  
  // Form input states
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Validation errors
  const [errors, setErrors] = useState<string | null>(null);
  
  // Feedback states
  const [copied, setCopied] = useState(false);
  
  // Dialog/Modal states
  const [isLoadingDialog, setIsLoadingDialog] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [isConfirmDialog, setIsConfirmDialog] = useState(false);

  // Fluctuating online users: changes every 2 seconds randomly between 1000 and 2000
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 1001) + 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Determine promo code based on selected provider
  const activePromo = selectedProvider === 'melbet' ? 'TOO3' : 'A77N';

  // Copy Promo Code function
  const handleCopyPromo = () => {
    navigator.clipboard.writeText(activePromo);
    setCopied(true);
    setPromoUsed(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors(null);

    if (!userId.trim()) {
      setErrors('الرجاء إدخال معرف اللاعب (UserID)');
      return;
    }
    if (userId.trim().length < 5) {
      setErrors('معرف اللاعب يجب أن يكون 5 أرقام على الأقل');
      return;
    }
    if (password !== activePromo) {
      setErrors(`كلمة المرور غير صحيحة! كلمة المرور هي البروموكود: ${activePromo}`);
      return;
    }
    // Note: Subscription steps (Telegram, YouTube) and deposit confirmation are now optional as requested!
    // All checks passed! Trigger loading dialog
    setIsLoadingDialog(true);
    setLoadingStep(0);
  };

  // Loading Steps Simulation
  useEffect(() => {
    if (!isLoadingDialog) return;

    const timer = setInterval(() => {
      setLoadingStep((prev) => {
        if (prev >= 3) {
          clearInterval(timer);
          setTimeout(() => {
            setIsLoadingDialog(false);
            setIsConfirmDialog(true);
          }, 1000);
          return 3;
        }
        return prev + 1;
      });
    }, 1200);

    return () => clearInterval(timer);
  }, [isLoadingDialog]);

  const handleConfirm = () => {
    setIsConfirmDialog(false);
    if (selectedProvider) {
      onComplete(selectedProvider, userId);
    }
  };

  const loadingMessages = [
    'جاري فحص معرف المستخدم في قاعدة البيانات...',
    `جاري التحقق من تفعيل بروموكود VIP (${activePromo})...`,
    'جاري فحص شروط الإيداع النشط لـ 1xbet / MELBET...',
    'جاري ربط حسابك بخادم بث الأود للتفاح...'
  ];

  // Dynamic Theme Styling
  const getThemeColors = () => {
    if (selectedProvider === '1xbet') {
      return {
        accent: 'blue',
        text: 'text-blue-400',
        border: 'border-blue-500/80',
        bgGlow: 'shadow-[0_0_20px_rgba(59,130,246,0.35)]',
        bg: 'bg-blue-600 hover:bg-blue-700',
        accentBorder: 'border-blue-500',
        ring: 'focus:ring-blue-500',
        glowClass: 'animate-glow-blue'
      };
    } else if (selectedProvider === 'melbet') {
      return {
        accent: 'yellow',
        text: 'text-amber-400',
        border: 'border-amber-400/80',
        bgGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.35)]',
        bg: 'bg-amber-500 hover:bg-amber-600 text-black font-bold',
        accentBorder: 'border-amber-400',
        ring: 'focus:ring-amber-400',
        glowClass: 'animate-glow-yellow'
      };
    }
    return {
      accent: 'gray',
      text: 'text-gray-400',
      border: 'border-gray-700',
      bgGlow: '',
      bg: 'bg-gray-800',
      accentBorder: 'border-gray-700',
      ring: 'focus:ring-gray-700',
      glowClass: ''
    };
  };

  const theme = getThemeColors();

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans pb-12 select-none relative">
      {/* Dynamic Background Glows */}
      <AnimatePresence>
        {selectedProvider === '1xbet' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"
          />
        )}
        {selectedProvider === 'melbet' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* --- TOP BAR --- */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Right side: Users online */}
          <div className="flex items-center gap-2" id="top-bar-right">
            <span className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </span>
            <div className="text-right">
              <span className="text-xs text-gray-500 block leading-none">Users online</span>
              <span className="text-sm font-mono font-bold text-gray-200">{onlineUsers.toLocaleString()}</span>
            </div>
          </div>

          {/* Left side: Brand Name */}
          <div className="flex items-center gap-2" id="top-bar-left">
            <span className="text-xl font-black tracking-wider bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-amber-400 font-mono">
              DRAGON VIP
            </span>
          </div>
        </div>
      </header>

      {/* --- BODY --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 max-w-xl mx-auto w-full relative z-10">
        
        {/* Small Circular Logo */}
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8"
        >
          <div className="relative w-20 h-20 rounded-full p-[2px] bg-gradient-to-tr from-blue-500 via-purple-600 to-amber-500 shadow-lg">
            <img 
              src={logoUrl} 
              alt="Dragon VIP Logo" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>

        {/* Dynamic Header Titles */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-400">
            {selectedProvider ? 'أكمل شروط التفعيل الحصرية' : 'اختر منصتك الخاصة'}
          </h2>
          <p className="text-sm text-gray-400 mt-2">
            {selectedProvider 
              ? 'يرجى إتمام الخطوات التالية للربط التلقائي وتفعيل مولّد تفاحات الحظ' 
              : 'للبدء، انقر على خيار المنصة التي تلعب عليها حالياً'}
          </p>
        </div>

        {/* --- MAIN UNIFIED CARD --- */}
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-5 md:p-6 shadow-xl relative overflow-hidden">
          {/* Top subtle glow bar */}
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-amber-500 opacity-60" />

          <AnimatePresence mode="wait">
            {!selectedProvider ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-4 w-full"
              >
                {/* 1xbet Card */}
                <button
                  id="btn-provider-1xbet"
                  onClick={() => setSelectedProvider('1xbet')}
                  className="group relative aspect-square flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#050f26]/40 via-[#020714]/40 to-[#01030a]/40 border-2 border-blue-500 rounded-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_10px_25px_rgba(59,130,246,0.1)] hover:shadow-[0_0_40px_rgba(59,130,246,0.25)] overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-blue-500/20 text-blue-400 text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border border-blue-500/30">
                    BLUE
                  </div>
                  <span className="text-2xl font-black tracking-wider text-white group-hover:text-blue-300 transition-colors duration-300 mb-3 font-sans">
                    1xbet
                  </span>
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-blue-950/40 border-2 border-blue-500/30 group-hover:border-blue-400 group-hover:scale-110 group-hover:bg-blue-900/30 transition-all duration-500 overflow-hidden shadow-[0_0_15px_rgba(59,130,246,0.15)] group-hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                    <div className="absolute inset-0.5 rounded-full border border-dashed border-blue-400/30 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <img
                        src="https://i.pinimg.com/736x/85/09/2e/85092e36302014dac2140125ca9e706f.jpg"
                        alt="1xbet Logo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </button>

                {/* MELBET Card */}
                <button
                  id="btn-provider-melbet"
                  onClick={() => setSelectedProvider('melbet')}
                  className="group relative aspect-square flex flex-col items-center justify-center p-5 bg-gradient-to-b from-[#1c1405]/40 via-[#0d0902]/40 to-[#050301]/40 border-2 border-amber-400 rounded-2xl cursor-pointer hover:scale-[1.03] active:scale-95 transition-all duration-300 shadow-[0_10px_25px_rgba(245,158,11,0.1)] hover:shadow-[0_0_40px_rgba(245,158,11,0.25)] overflow-hidden"
                >
                  <div className="absolute top-2 right-2 bg-amber-500/20 text-amber-400 text-[8px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full border border-amber-500/30">
                    GOLD
                  </div>
                  <span className="text-2xl font-black tracking-wider text-white group-hover:text-amber-300 transition-colors duration-300 mb-3 font-sans">
                    MELBET
                  </span>
                  <div className="relative w-16 h-16 rounded-full flex items-center justify-center bg-amber-950/40 border-2 border-amber-400/30 group-hover:border-amber-400 group-hover:scale-110 group-hover:bg-amber-900/30 transition-all duration-500 overflow-hidden shadow-[0_0_15px_rgba(245,158,11,0.15)] group-hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]">
                    <div className="absolute inset-0.5 rounded-full border border-dashed border-amber-400/30 animate-spin" style={{ animationDuration: '6s' }} />
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                      <img
                        src="https://i.pinimg.com/736x/c3/b4/dd/c3b4dd80d6037256492166ffa8fee192.jpg"
                        alt="Melbet Logo"
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                </button>
              </motion.div>
            ) : (
              /* --- CONDITIONS VIEW --- */
              <motion.div
                key="conditions"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.2 }}
                className="w-full bg-transparent"
              >
                {/* Back button to change provider */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-900 pb-4">
                  <div className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full ${selectedProvider === '1xbet' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`} />
                    <span className="text-sm font-bold text-gray-300">منصة التشغيل: <span className={theme.text + ' font-black text-base uppercase'}>{selectedProvider}</span></span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProvider(null);
                      setErrors(null);
                    }}
                    className="text-xs text-gray-500 hover:text-white flex items-center gap-1 bg-gray-950/80 hover:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-800 transition-colors cursor-pointer"
                  >
                    تغيير المنصة
                    <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                
                {/* 1. Telegram Channel Subscription */}
                <div className="p-4 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 border border-blue-500/20">
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">1. الاشتراك في قناة التلجرام</h4>
                      <p className="text-xs text-gray-500">متابعة إشعارات وقنوات توزيـع الـ VIP اليومية</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.open('https://t.me/THEAGLE', '_blank');
                      setTelegramJoined(true);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      telegramJoined 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md'
                    }`}
                  >
                    {telegramJoined ? (
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> تم الاشتراك</span>
                    ) : 'انقر للاشتراك'}
                  </button>
                </div>

                {/* 2. Youtube Channel Subscription */}
                <div className="p-4 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">2. الاشتراك في قناة اليوتيوب</h4>
                      <p className="text-xs text-gray-500">لمتابعة كواليس وشروحات ثغرات اللعبة</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      window.open('https://youtube.com/@dragon-p8k6q?si=L0m8iSBnUFAF0Z_-', '_blank');
                      setYoutubeJoined(true);
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      youtubeJoined 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                        : 'bg-red-600 hover:bg-red-700 text-white shadow-md'
                    }`}
                  >
                    {youtubeJoined ? (
                      <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5" /> تم الاشتراك</span>
                    ) : 'انقر للاشتراك'}
                  </button>
                </div>

                {/* 3. Promo Code Section */}
                <div className="p-4 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-400 border border-purple-500/20">
                        <Chrome className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold">3. تسجيل الدخول بالبروموكود الحصري</h4>
                        <p className="text-xs text-gray-500">يجب إنشاء حساب جديد بالبروموكود للتفعيل</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Copy box */}
                  <div className="flex items-center justify-between bg-black/80 rounded-xl p-3 border border-gray-800">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">كود الخادم:</span>
                      <span className="text-lg font-mono font-black text-amber-400 tracking-wider select-text">{activePromo}</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyPromo}
                      className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        copied 
                          ? 'bg-emerald-500 text-black' 
                          : 'bg-gray-900 hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-800'
                      }`}
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>نسخ الكود</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* 4. Deposit task */}
                <div className="p-4 bg-black/10 backdrop-blur-sm rounded-xl border border-white/10 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 border border-amber-500/20">
                      <Coins className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold">4. إيداع 300 أو أكثر أو 10$</h4>
                      <p className="text-xs text-gray-500">تنشيط الإيداع يربط معرفك تلقائياً بقناة VIP للتنين</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeposited(!deposited)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                      deposited 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-gray-900 hover:bg-gray-850 text-gray-300 border border-gray-800'
                    }`}
                  >
                    {deposited ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>مكتمل</span>
                      </>
                    ) : (
                      'تأكيد الإيداع'
                    )}
                  </button>
                </div>

                {/* 5. UserID Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 ml-1 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-gray-500" />
                    معرف حساب اللاعب (UserID)
                  </label>
                  <div className="relative">
                    <input
                      id="input-userid"
                      type="text"
                      pattern="[0-9]*"
                      inputMode="numeric"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                      placeholder="أدخل الـ ID الخاص بك في الحساب الجديد..."
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left font-mono text-base placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors focus:ring-1 focus:ring-gray-800"
                    />
                  </div>
                </div>

                {/* 6. Password Input (A77N) */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 ml-1 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-gray-500" />
                    كلمة مرور فك تشفير خوارزمية التنين (الباسورد وهو {activePromo})
                  </label>
                  <div className="relative">
                    <input
                      id="input-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="أدخل كلمة مرور الخادم (البروموكود)..."
                      className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-left font-mono text-base placeholder-gray-600 focus:outline-none focus:border-gray-600 transition-colors focus:ring-1 focus:ring-gray-800 pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Error Banner */}
                {errors && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-900/30 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold leading-relaxed"
                  >
                    ⚠ {errors}
                  </motion.div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  id="btn-submit-conditions"
                  type="submit"
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${theme.bg} ${theme.bgGlow} hover:scale-[1.01]`}
                >
                  <span>تقديم وتأكيد الاتصال بخادم الـ VIP</span>
                  <Shield className="w-4 h-4" />
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
        </div>
      </main>

      {/* --- LOADING DIALOG (ديالوج تحميل) --- */}
      <AnimatePresence>
        {isLoadingDialog && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/85 backdrop-blur-md border border-white/10 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl relative"
            >
              {/* Spinner */}
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className={`absolute inset-0 rounded-full border-4 border-gray-800`} />
                <div className={`absolute inset-0 rounded-full border-4 ${selectedProvider === '1xbet' ? 'border-t-blue-500' : 'border-t-amber-400'} animate-spin`} />
              </div>

              <h3 className="text-lg font-bold mb-2">جاري المعالجة وتأكيد الاتصال...</h3>
              <p className="text-xs text-gray-500 leading-relaxed min-h-[36px] px-2">
                {loadingMessages[loadingStep]}
              </p>

              {/* Progress Line */}
              <div className="mt-6 w-full h-1 bg-gray-900 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full ${selectedProvider === '1xbet' ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.5)]'}`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${(loadingStep + 1) * 25}%` }}
                  transition={{ duration: 1 }}
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRMATION DIALOG (ديالوج تأكيد) --- */}
      <AnimatePresence>
        {isConfirmDialog && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-lg flex items-center justify-center z-50 px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-black/85 backdrop-blur-lg border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-2xl relative"
            >
              {/* Animated check circle */}
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <Check className="w-8 h-8 animate-bounce" />
              </div>

              <h3 className="text-xl font-bold text-emerald-400 mb-3">تم التفعيل بنجاح!</h3>
              
              <div className="space-y-3 text-sm text-gray-300 leading-relaxed mb-8">
                <p>
                  مرحباً بك في عالم الكسب الاستثنائي. تم إدراج معرف اللاعب الخاص بك:
                </p>
                <div className="bg-black/80 font-mono font-bold py-2 px-4 rounded-xl border border-gray-900 text-white tracking-widest text-lg">
                  {userId}
                </div>
                <p className="text-xs text-gray-400">
                  تم ربط الحساب بنجاح مع الخوادم لـ <span className="uppercase font-bold text-gray-200">{selectedProvider}</span>. خوارزميات التنين جاهزة لتسليمك الإشارات الموثوقة.
                </p>
              </div>

              <button
                id="btn-confirm-activation"
                onClick={handleConfirm}
                className="w-full py-3.5 bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold rounded-xl transition-all shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-[1.02] cursor-pointer"
              >
                الدخول لصفحة التفاحة الحية
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

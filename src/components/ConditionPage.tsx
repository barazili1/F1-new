import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check, Shield, Youtube, Send, Key, Coins, User, ArrowRight, Eye, EyeOff, Award, Lock, ExternalLink, Zap } from 'lucide-react';
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

  // Fluctuating online users
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

  // Calculate completed requirements progress
  const completedSteps = [telegramJoined, youtubeJoined, promoUsed, deposited].filter(Boolean).length;
  const progressPercent = (completedSteps / 4) * 100;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans pb-16 select-none relative overflow-x-hidden">
      {/* Immersive Background Glowing Mesh / Ambient Red Lights */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-red-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-red-950/5 rounded-full blur-[140px] pointer-events-none" />

      {/* --- PREMIUM STICKY TOP BAR --- */}
      <header className="border-b border-red-500/10 bg-transparent px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          {/* Active users telemetry */}
          <div className="flex items-center gap-3" id="top-bar-right">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            </span>
            <div className="text-left">
              <span className="text-[9px] text-gray-500 block leading-none uppercase font-mono tracking-widest">Active Channels</span>
              <span className="text-xs font-mono font-black text-red-500">{onlineUsers.toLocaleString()} online</span>
            </div>
          </div>

          {/* Luxury Brand Typography */}
          <div className="flex items-center gap-2" id="top-bar-left">
            <span className="text-xl md:text-2xl font-black tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-700 font-mono drop-shadow-[0_0_12px_rgba(220,38,38,0.3)]">
              DRAGON VIP
            </span>
            <span className="text-[9px] bg-red-950/30 border border-red-500/20 text-red-400 px-1.5 py-0.5 rounded font-mono font-bold">V5.0</span>
          </div>
        </div>
      </header>

      {/* --- MAIN WRAPPER --- */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 md:px-6 py-8 max-w-xl mx-auto w-full relative z-10">
        
        {/* Animated Brand Logo Orb */}
        <motion.div 
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative mb-6"
        >
          <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-red-600 to-red-950 blur-xl opacity-30 animate-pulse" />
          <div className="relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr from-red-600 via-neutral-900 to-red-800 shadow-2xl">
            <div className="w-full h-full rounded-full overflow-hidden bg-transparent p-0.5">
              <img 
                src={logoUrl} 
                alt="Dragon VIP Logo" 
                className="w-full h-full object-cover rounded-full transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </motion.div>

        {/* Section Header */}
        <div className="text-center mb-8">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-neutral-200 to-red-500 font-sans"
          >
            {selectedProvider ? 'تفعيل الاتصال الآمن بالخادم' : 'بوابة التنين الذكي للثغرات'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.1 }}
            className="text-xs md:text-sm text-gray-400 mt-2 font-medium"
          >
            {selectedProvider 
              ? 'يرجى إتمام المتطلبات المباشرة لتنشيط بث الإشارات المضمونة' 
              : 'للبدء، انقر على خيار المنصة التي تلعب عليها حالياً'}
          </motion.p>
        </div>

        {/* --- LUXURIOUS UNIFIED GLASS CARD --- */}
        <div className="w-full bg-transparent border border-red-500/15 rounded-3xl p-5 md:p-7 relative overflow-hidden">
          {/* Neon Top Laser Accent */}
          <div className="absolute left-0 right-0 top-0 h-[2.5px] bg-gradient-to-r from-red-600 via-red-500 to-neutral-950 opacity-90" />
          
          <AnimatePresence mode="wait">
            {!selectedProvider ? (
              <motion.div 
                key="selection"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-5 w-full"
              >
                {/* Intro details */}
                <div className="text-center border-b border-white/5 pb-4">
                  <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase bg-red-500/10 border border-red-500/20 px-3.5 py-1.5 rounded-full">
                    بوابات البث النشطة • Active Channels
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  {/* 1xbet Card - Glowing Deep Cyber Red */}
                  <button
                    id="btn-provider-1xbet"
                    onClick={() => setSelectedProvider('1xbet')}
                    className="group relative flex flex-col justify-between p-5 bg-transparent border-2 border-red-500/15 hover:border-red-600 rounded-2xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden text-right"
                  >
                    {/* Glowing Accent Top Line */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-red-600/30 group-hover:bg-red-500 transition-colors" />

                    {/* Top line with tag */}
                    <div className="w-full flex justify-between items-center mb-4">
                      <span className="text-[8px] font-mono font-black tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        VIP STREAM RED
                      </span>
                      <span className="text-[9px] font-mono font-bold text-red-500/80 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        18ms
                      </span>
                    </div>

                    {/* Logo & Platform Name */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 p-0.5 border border-red-500/25 group-hover:border-red-500 transition-all shadow-lg flex-shrink-0">
                        <img
                          src="https://i.pinimg.com/736x/85/09/2e/85092e36302014dac2140125ca9e706f.jpg"
                          alt="1xbet Logo"
                          className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-right">
                        <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors font-sans">
                          1xbet VIP
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium leading-normal mt-0.5">ثغرة خوادم 1xbet الحية</p>
                      </div>
                    </div>

                    {/* Metrics Footer */}
                    <div className="w-full border-t border-white/5 pt-3.5 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                      <span>ACCURACY: <strong className="text-red-500 font-bold">98.4%</strong></span>
                      <span>ACTIVE: <strong className="text-gray-300">4,120</strong></span>
                    </div>
                  </button>

                  {/* MELBET Card - Glowing High-End Amber Gold */}
                  <button
                    id="btn-provider-melbet"
                    onClick={() => setSelectedProvider('melbet')}
                    className="group relative flex flex-col justify-between p-5 bg-transparent border-2 border-red-500/15 hover:border-red-600 rounded-2xl cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 overflow-hidden text-right"
                  >
                    {/* Glowing Accent Top Line */}
                    <div className="absolute top-0 inset-x-0 h-[2px] bg-red-600/30 group-hover:bg-red-500 transition-colors" />

                    {/* Top line with tag */}
                    <div className="w-full flex justify-between items-center mb-4">
                      <span className="text-[8px] font-mono font-black tracking-widest bg-red-500/10 border border-red-500/20 text-red-400 px-2 py-0.5 rounded">
                        VIP STREAM DARK RED
                      </span>
                      <span className="text-[9px] font-mono font-bold text-red-500/80 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        24ms
                      </span>
                    </div>

                    {/* Logo & Platform Name */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-neutral-900 p-0.5 border border-red-500/25 group-hover:border-red-500 transition-all shadow-lg flex-shrink-0">
                        <img
                          src="https://i.pinimg.com/736x/c3/b4/dd/c3b4dd80d6037256492166ffa8fee192.jpg"
                          alt="Melbet Logo"
                          className="w-full h-full object-cover rounded-lg grayscale group-hover:grayscale-0 transition-all duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="text-right">
                        <h3 className="text-xl font-black text-white group-hover:text-red-500 transition-colors font-sans">
                          MELBET VIP
                        </h3>
                        <p className="text-[10px] text-gray-400 font-medium leading-normal mt-0.5">ثغرة خوادم Melbet الحية</p>
                      </div>
                    </div>

                    {/* Metrics Footer */}
                    <div className="w-full border-t border-white/5 pt-3.5 flex justify-between items-center text-[9px] text-gray-500 font-mono">
                      <span>ACCURACY: <strong className="text-red-500 font-bold">97.9%</strong></span>
                      <span>ACTIVE: <strong className="text-gray-300">2,890</strong></span>
                    </div>
                  </button>
                </div>

                {/* Sub-footer secure indicators */}
                <div className="bg-transparent border border-red-500/10 rounded-2xl p-4 flex flex-col gap-2.5 text-xs text-gray-400 leading-relaxed font-sans mt-1" dir="rtl">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>تشفير حماية ذكي ثنائي (SSL/TLS AES-256) لحظر أي عمليات فحص أو كشف من اللعبة وتأمين حسابك.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <Zap className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                    <span>مزامنة مباشرة لنسب الأود (Multipliers) لمطابقة مستويات التنبؤ الحقيقية بأعلى كفاءة.</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* --- REDESIGNED CONDITIONS FORM VIEW --- */
              <motion.div
                key="conditions"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="w-full bg-transparent"
              >
                {/* Back / Change Provider Header */}
                <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(220,38,38,0.8)]" />
                    <span className="text-xs font-bold text-gray-400 font-sans leading-none">
                      منصة التشغيل: <span className="text-red-500 font-black text-sm uppercase tracking-wider">{selectedProvider}</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedProvider(null);
                      setErrors(null);
                    }}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1.5 bg-transparent hover:bg-white/5 px-2.5 py-1.5 rounded-lg border border-white/5 hover:border-white/10 transition-all cursor-pointer font-bold"
                  >
                    تغيير المنصة
                    <ArrowRight className="w-3 h-3 rotate-180" />
                  </button>
                </div>

                {/* --- PREMIUM DYNAMIC PROGRESS TRACKER --- */}
                <div className="mb-6 bg-transparent border border-red-500/10 rounded-2xl p-4 relative overflow-hidden" dir="rtl">
                  <div className="flex justify-between items-center mb-2.5">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-red-500 animate-pulse" />
                      <span className="text-xs font-black text-gray-200">التقدم في إتمام المتطلبات المباشرة</span>
                    </div>
                    <span className="text-xs font-mono font-black text-red-500">{completedSteps} / 4</span>
                  </div>
                  
                  {/* Progress Line */}
                  <div className="w-full h-2 bg-neutral-900 rounded-full overflow-hidden p-[1px] border border-white/5">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-red-600 to-red-500 rounded-full shadow-[0_0_10px_rgba(220,38,38,0.8)]"
                      initial={{ width: '0%' }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  <p className="text-[10px] text-gray-500 mt-2 font-medium">
                    يرجى إتمام الخطوات الـ 4 الموضحة بالأسفل لتنشيط الاتصال الآمن بسيرفر الثغرة.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4" dir="rtl">
                  
                  {/* Step 1: Telegram Subscription */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    telegramJoined 
                      ? 'bg-red-950/10 border-red-500/30' 
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        telegramJoined 
                          ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                          : 'bg-neutral-900/60 text-gray-400 border-white/5'
                      }`}>
                        <Send className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-gray-200 flex items-center gap-1.5">
                          1. الاشتراك في قناة التلجرام
                          {telegramJoined && <Check className="w-3.5 h-3.5 text-red-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">لمتابعة التحديثات وتوزيع الثغرات والمكاسب اليومية</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.open('https://t.me/THEAGLE2', '_blank');
                        setTelegramJoined(true);
                      }}
                      className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all duration-300 flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                        telegramJoined 
                          ? 'bg-transparent text-red-400 border border-red-500/20' 
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_3px_10px_rgba(220,38,38,0.25)] hover:scale-[1.02]'
                      }`}
                    >
                      {telegramJoined ? (
                        <>مكتمل</>
                      ) : (
                        <>
                          انضم الآن
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step 2: Youtube Subscription */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    youtubeJoined 
                      ? 'bg-red-950/10 border-red-500/30' 
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        youtubeJoined 
                          ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                          : 'bg-neutral-900/60 text-gray-400 border-white/5'
                      }`}>
                        <Youtube className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-gray-200 flex items-center gap-1.5">
                          2. الاشتراك في قناة اليوتيوب
                          {youtubeJoined && <Check className="w-3.5 h-3.5 text-red-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">لمتابعة شروحات واستراتيجيات تفاح الحظ الحية</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        window.open('https://youtube.com/@dragon-p8k6q?si=L0m8iSBnUFAF0Z_-', '_blank');
                        setYoutubeJoined(true);
                      }}
                      className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all duration-300 flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                        youtubeJoined 
                          ? 'bg-transparent text-red-400 border border-red-500/20' 
                          : 'bg-red-600 hover:bg-red-700 text-white shadow-[0_3px_10px_rgba(220,38,38,0.25)] hover:scale-[1.02]'
                      }`}
                    >
                      {youtubeJoined ? (
                        <>مكتمل</>
                      ) : (
                        <>
                          اشترك الآن
                          <ExternalLink className="w-3 h-3" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* Step 3: Promo code dynamic copybox */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 space-y-3.5 ${
                    promoUsed 
                      ? 'bg-red-950/10 border-red-500/30' 
                      : 'bg-transparent border-white/5'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        promoUsed 
                          ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                          : 'bg-neutral-900/60 text-gray-400 border-white/5'
                      }`}>
                        <Key className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-gray-200 flex items-center gap-1.5">
                          3. التسجيل بالبروموكود الحصري
                          {promoUsed && <Check className="w-3.5 h-3.5 text-red-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">تنشيط بروموكود الحساب الجديد يتيح تفعيل وتفادي كشف خوارزمية السيرفر</p>
                      </div>
                    </div>

                    {/* Copier box */}
                    <div className="flex items-center justify-between bg-transparent rounded-xl p-3 border border-red-500/10 shadow-inner">
                      <div className="flex items-center gap-2">
                        <span className="text-[9px] text-gray-500 font-bold uppercase font-mono">CODE:</span>
                        <span className="text-lg font-mono font-black text-red-500 tracking-widest select-all">{activePromo}</span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyPromo}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer ${
                          copied 
                            ? 'bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.4)]' 
                            : 'bg-transparent hover:bg-white/5 text-gray-300 border border-white/5'
                        }`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-3 h-3" />
                            <span>تم النسخ</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>نسخ الكود</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Step 4: Deposit confirmation */}
                  <div className={`p-4 rounded-2xl border transition-all duration-300 flex items-center justify-between gap-4 ${
                    deposited 
                      ? 'bg-red-950/10 border-red-500/30' 
                      : 'bg-transparent border-white/5 hover:border-white/10'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-colors ${
                        deposited 
                          ? 'bg-red-500/20 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(220,38,38,0.3)]' 
                          : 'bg-neutral-900/60 text-gray-400 border-white/5'
                      }`}>
                        <Coins className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-right">
                        <h4 className="text-xs font-black text-gray-200 flex items-center gap-1.5">
                          4. إيداع 300 جنيه أو 10$
                          {deposited && <Check className="w-3.5 h-3.5 text-red-500" />}
                        </h4>
                        <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">يربط حسابك آلياً ببوابة توقعات السيرفر الممتازة ومزامنة نسب الربح</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setDeposited(!deposited)}
                      className={`px-3 py-2 rounded-xl text-[11px] font-black transition-all duration-300 flex items-center gap-1 flex-shrink-0 cursor-pointer ${
                        deposited 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-[0_0_10px_rgba(220,38,38,0.1)]' 
                          : 'bg-transparent hover:bg-white/5 border border-white/5'
                      }`}
                    >
                      {deposited ? (
                        <>مكتمل</>
                      ) : (
                        'تأكيد الإيداع'
                      )}
                    </button>
                  </div>

                  {/* Divider line */}
                  <div className="h-[1px] bg-white/5 my-4" />

                  {/* Form fields: User ID input */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 flex items-center gap-1.5 mr-1 select-none">
                      <User className="w-3.5 h-3.5 text-gray-500" />
                      معرف اللاعب الجديد (UserID)
                    </label>
                    <div className="relative">
                      <input
                        id="input-userid"
                        type="text"
                        pattern="[0-9]*"
                        inputMode="numeric"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value.replace(/\D/g, ''))}
                        placeholder="أدخل الـ ID المكون من أرقام فقط..."
                        className="w-full bg-transparent border border-red-500/15 focus:border-red-500 rounded-xl px-4 py-3 text-right font-mono text-base placeholder-gray-600 focus:outline-none transition-colors focus:ring-1 focus:ring-red-950"
                      />
                      {userId.length >= 5 && (
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-red-500 flex items-center justify-center animate-pulse">
                          <Check className="w-4 h-4" />
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Form fields: Server password */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-black text-gray-400 flex items-center gap-1.5 mr-1 select-none">
                      <Lock className="w-3.5 h-3.5 text-gray-500" />
                      كلمة مرور التشفير (الباسورد وهو {activePromo})
                    </label>
                    <div className="relative">
                      <input
                        id="input-password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="أدخل كلمة المرور الحصرية الخاصة بالسيرفر..."
                        className="w-full bg-transparent border border-red-500/15 focus:border-red-500 rounded-xl px-4 py-3 text-right font-mono text-base placeholder-gray-600 focus:outline-none transition-colors focus:ring-1 focus:ring-red-950 pl-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error banner block */}
                  {errors && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-3 bg-red-950/40 text-red-400 border border-red-500/20 rounded-xl text-xs font-semibold leading-relaxed flex items-start gap-2"
                    >
                      <span className="text-base select-none leading-none">⚠️</span>
                      <span>{errors}</span>
                    </motion.div>
                  )}

                  {/* MAIN CONNECT / REGISTER BUTTON */}
                  <button
                    id="btn-submit-conditions"
                    type="submit"
                    className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 shadow-lg bg-red-600 hover:bg-red-700 text-white font-bold shadow-[0_0_20px_rgba(220,38,38,0.35)] hover:scale-[1.01] active:scale-[0.99] mt-2"
                  >
                    <span>تنشيط وتوصيل الحساب بخوادم الـ VIP</span>
                    <Shield className="w-4 h-4" />
                  </button>

                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* --- PREMIUM HIGH-TECH HUD LOADING DIALOG --- */}
      <AnimatePresence>
        {isLoadingDialog && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-transparent backdrop-blur-xl border border-red-500/10 rounded-3xl p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(0,0,0,0.8)] relative overflow-hidden"
            >
              {/* Glowing decorative ambient point */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full blur-[60px] pointer-events-none bg-red-500/20" />

              {/* High-tech main rotating radar */}
              <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
                {/* Outer spin rings */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-red-500/30 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute -inset-2 rounded-full border border-dotted border-red-500/10 animate-spin" style={{ animationDuration: '12s', animationDirection: 'reverse' }} />
                
                {/* Inner glowing circle */}
                <div className="w-16 h-16 rounded-full bg-transparent border flex items-center justify-center shadow-lg border-red-500/40 shadow-red-500/15">
                  <Shield className="w-7 h-7 animate-pulse text-red-500" />
                </div>
              </div>

              <h3 className="text-xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">اتصال آمن بالخادم...</h3>
              
              <div className="bg-transparent border border-red-500/10 p-3 rounded-xl min-h-[56px] flex items-center justify-center">
                <p className="text-xs text-gray-400 leading-relaxed font-medium px-1">
                  {loadingMessages[loadingStep]}
                </p>
              </div>

              {/* High-Fidelity Cyber Progress HUD */}
              <div className="mt-8 space-y-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 font-bold px-1">
                  <span>TERMINAL CONNECTING</span>
                  <span>{Math.round((loadingStep + 1) * 25)}%</span>
                </div>
                <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-red-500/10 p-[1px]">
                  <motion.div
                    className="h-full rounded-full bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(loadingStep + 1) * 25}%` }}
                    transition={{ duration: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRMATION DIALOG --- */}
      <AnimatePresence>
        {isConfirmDialog && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 px-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-transparent backdrop-blur-xl border-2 border-red-500/20 rounded-3xl p-6 md:p-8 max-w-sm w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.15)] relative overflow-hidden"
            >
              {/* Corner tech lines */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-red-500/40" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-red-500/40" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-red-500/40" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-red-500/40" />

              {/* Glowing background halo */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 bg-red-500/10 rounded-full blur-[60px] pointer-events-none" />

              {/* Success Check Circle */}
              <div className="relative w-20 h-20 rounded-full bg-red-500/10 border-2 border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(220,38,38,0.2)]">
                <Check className="w-10 h-10" />
                <div className="absolute -inset-1 rounded-full border border-dashed border-red-500/20 animate-spin" style={{ animationDuration: '10s' }} />
              </div>

              <h3 className="text-2xl font-black text-red-500 mb-3 tracking-tight font-sans">تم التفعيل بنجاح!</h3>
              
              <div className="space-y-4 text-sm text-gray-300 leading-relaxed mb-8">
                <p className="font-semibold text-gray-300">
                  مرحباً بك في عالم الأرباح المضمونة. تم تسجيل وتأمين معرف اللاعب الخاص بك بنجاح:
                </p>
                
                {/* Premium User ID tag */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-red-800 rounded-2xl blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse-slow" />
                  <div className="relative bg-transparent font-mono font-black py-3 px-5 rounded-xl border border-red-500/20 text-white tracking-widest text-2xl shadow-inner">
                    {userId}
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  تم ربط الحساب بنجاح مع خادم التوقعات الحية لـ <span className="uppercase font-black text-gray-200">{selectedProvider} VIP</span>. نظام التنين جاهز لتسليمك الإشارات الموثوقة.
                </p>
              </div>

              <button
                id="btn-confirm-activation"
                onClick={handleConfirm}
                className="w-full py-4 bg-gradient-to-r from-red-600 to-red-800 text-white font-black text-sm rounded-xl transition-all shadow-[0_4px_25px_rgba(220,38,38,0.3)] hover:shadow-[0_4px_35px_rgba(220,38,38,0.5)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              >
                الدخول لصفحة التنبؤ الحية
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

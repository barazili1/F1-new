import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, RotateCcw, Play, Sparkles, TrendingUp, DollarSign, Award, Trophy, Bell, ChevronUp, ChevronRight, LogOut } from 'lucide-react';
const logoUrl = 'https://plain-eeur-prod-public.komododecks.com/202606/24/Bdn19OZTrlYXQS8dLPf7/image.jpg';
import { Provider, WinningRecord } from '../types';

interface ApplePredictorProps {
  provider: Provider;
  userId: string;
  onSignOut: () => void;
}

// Apple of Fortune multiplier levels
const STEP_MULTIPLIERS = [
  { step: 1, multiplier: 1.23 },
  { step: 2, multiplier: 1.54 },
  { step: 3, multiplier: 1.93 },
  { step: 4, multiplier: 2.41 },
  { step: 5, multiplier: 4.02 },
  { step: 6, multiplier: 6.71 },
  { step: 7, multiplier: 11.18 },
  { step: 8, multiplier: 19.36 },
  { step: 9, multiplier: 40.24 },
  { step: 10, multiplier: 80.48 }
];

// Names for mock winnings to generate realistic Arab/international IDs
const ID_PREFIXES = ['18', '24', '35', '59', '77', '91', '40', '83', '62', '51'];

export default function ApplePredictor({ provider, userId, onSignOut }: ApplePredictorProps) {
  const [onlineUsers, setOnlineUsers] = useState(() => Math.floor(Math.random() * 1001) + 1000);
  const [currentStep, setCurrentStep] = useState(1); // Row 1 to 10
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // 5 slots representing columns in the Apple of Fortune row
  // null = unchecked, 'safe' = correct glowing golden apple, 'regular' = regular/unchecked
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [activePrediction, setActivePrediction] = useState<number | null>(null);

  // Live winners list state
  const [winnings, setWinnings] = useState<WinningRecord[]>([]);

  // Sound Synth Ref to avoid multi-allocating AudioContext
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Firebase Realtime Database integration for user ID: 1729018123
  const [firebaseData, setFirebaseData] = useState<any>(null);
  const [isLoadingFirebase, setIsLoadingFirebase] = useState(false);
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const getValue = (key: string, data: any): string => {
    if (!data) return "0";
    const val = data[key];
    if (val === undefined || val === null) return "0";
    if (typeof val === 'object') {
      const subVal = val[key];
      return subVal !== undefined && subVal !== null ? String(subVal) : "0";
    }
    return String(val);
  };

  const fetchFirebaseData = async () => {
    if (userId !== '1729018123') return null;
    setIsLoadingFirebase(true);
    try {
      const res = await fetch('https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json');
      if (!res.ok) throw new Error('Failed to fetch from server');
      const data = await res.json();
      setFirebaseData(data);
      setFirebaseError(null);
      return data;
    } catch (err: any) {
      console.error('Failed to fetch predictions:', err);
      setFirebaseError('فشل الاتصال بخادم التوقعات الحية');
      return null;
    } finally {
      setIsLoadingFirebase(false);
    }
  };

  const generateResetData = () => {
    const data: Record<string, { [key: string]: string }> = {};

    // Rows 1-4 (indices 1 to 20): m1 to m20
    // Each has exactly 1 bad apple ("1")
    for (let r = 0; r < 4; r++) {
      const start = r * 5 + 1;
      const badIndex = Math.floor(Math.random() * 5); // 0 to 4
      for (let c = 0; c < 5; c++) {
        const id = start + c;
        const val = c === badIndex ? "1" : "0";
        data[`m${id}`] = { [`m${id}`]: val };
      }
    }

    // Rows 5-7 (indices 21 to 35): m21 to m35
    // Each has exactly 2 bad apples ("1")
    for (let r = 4; r < 7; r++) {
      const start = r * 5 + 1;
      const badIndices: number[] = [];
      while (badIndices.length < 2) {
        const idx = Math.floor(Math.random() * 5);
        if (!badIndices.includes(idx)) {
          badIndices.push(idx);
        }
      }
      for (let c = 0; c < 5; c++) {
        const id = start + c;
        const val = badIndices.includes(c) ? "1" : "0";
        data[`m${id}`] = { [`m${id}`]: val };
      }
    }

    // Rows 8-9 (indices 36 to 45): m36 to m45
    // Each has exactly 3 bad apples ("1")
    for (let r = 7; r < 9; r++) {
      const start = r * 5 + 1;
      const badIndices: number[] = [];
      while (badIndices.length < 3) {
        const idx = Math.floor(Math.random() * 5);
        if (!badIndices.includes(idx)) {
          badIndices.push(idx);
        }
      }
      for (let c = 0; c < 5; c++) {
        const id = start + c;
        const val = badIndices.includes(c) ? "1" : "0";
        data[`m${id}`] = { [`m${id}`]: val };
      }
    }

    // Row 10 (indices 46 to 50): m46 to m50
    // Choose exactly 4 bad apples ("1")
    {
      const start = 46;
      const badIndices: number[] = [];
      while (badIndices.length < 4) {
        const idx = Math.floor(Math.random() * 5);
        if (!badIndices.includes(idx)) {
          badIndices.push(idx);
        }
      }
      for (let c = 0; c < 5; c++) {
        const id = start + c;
        const val = badIndices.includes(c) ? "1" : "0";
        data[`m${id}`] = { [`m${id}`]: val };
      }
    }

    return data;
  };

  const resetFirebaseData = async () => {
    if (userId !== '1729018123') return;
    setIsLoadingFirebase(true);
    try {
      const newData = generateResetData();
      const res = await fetch('https://evoioi-default-rtdb.europe-west1.firebasedatabase.app/m11.json', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newData)
      });
      if (!res.ok) throw new Error('Failed to reset on server');
      const responseData = await res.json();
      setFirebaseData(responseData || newData);
      setFirebaseError(null);
    } catch (err: any) {
      console.error('Failed to reset predictions:', err);
      setFirebaseError('فشل تحديث الخادم بالقيم الجديدة');
    } finally {
      setIsLoadingFirebase(false);
    }
  };

  useEffect(() => {
    if (userId === '1729018123') {
      fetchFirebaseData();
    }
  }, [userId]);

  // Initialize live winnings list with 6 realistic records
  useEffect(() => {
    const initialWinnings: WinningRecord[] = [];
    for (let i = 0; i < 6; i++) {
      initialWinnings.push(generateRandomWinning());
    }
    setWinnings(initialWinnings);
  }, []);

  // Fluctuating online users: changes every 2 seconds randomly between 1000 and 2000
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 1001) + 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulating new real-time winners
  useEffect(() => {
    const interval = setInterval(() => {
      // Push new winner
      setWinnings((prev) => {
        const updated = [generateRandomWinning(), ...prev];
        return updated.slice(0, 10); // keep last 10
      });

      // Play subtle ambient sound for new winner
      playWinnerSound();

    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Helper: Synthesize premium futuristic digital sound effects using Web Audio API
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  };

  const playBeep = (freq: number, duration: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine') => {
    try {
      initAudio();
      if (!audioCtxRef.current) return;
      
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context might be blocked or unsupported, ignore gracefully
    }
  };

  const playScanTick = () => {
    playBeep(880, 0.05, 'triangle');
  };

  const playSuccessReveal = () => {
    // Elegant arpeggio chime
    setTimeout(() => playBeep(523.25, 0.15), 0);   // C5
    setTimeout(() => playBeep(659.25, 0.15), 100); // E5
    setTimeout(() => playBeep(783.99, 0.15), 200); // G5
    setTimeout(() => playBeep(1046.50, 0.35), 300); // C6
  };

  const playWinnerSound = () => {
    // Very subtle low-frequency background alert
    playBeep(220, 0.1);
  };

  // Helper to generate realistic winning feeds in Egyptian Pounds and Dollars
  const generateRandomWinning = (): WinningRecord => {
    const randomPrefix = ID_PREFIXES[Math.floor(Math.random() * ID_PREFIXES.length)];
    const randomSuffix = Math.floor(10 + Math.random() * 90).toString(); // 2-digit end
    const maskedId = `${randomPrefix}*******${randomSuffix}`;
    const prov: Provider = Math.random() > 0.4 ? '1xbet' : 'melbet';
    
    // Choose step multiplier
    const stepObj = STEP_MULTIPLIERS[Math.floor(Math.random() * STEP_MULTIPLIERS.length)];
    const mult = stepObj.multiplier;
    const baseBet = Math.random() > 0.5 ? 200 + Math.floor(Math.random() * 180) * 10 : 10 + Math.floor(Math.random() * 40) * 5; // can be in EGP or USD
    const isEgp = Math.random() > 0.3;
    const amt = Math.round(baseBet * mult);

    return {
      id: Math.random().toString(36).substr(2, 9),
      userId: maskedId,
      provider: prov,
      winAmount: amt,
      multiplier: mult,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };
  };

  // Start Predictor Algorithm Scan
  const handleStart = () => {
    if (isScanning) return;
    initAudio();
    setIsScanning(true);
    setScanProgress(0);
    setSlots([null, null, null, null, null]);
    setActivePrediction(null);

    // In parallel, trigger fetch to make sure we've got the latest data
    let freshData = firebaseData;
    if (userId === '1729018123') {
      fetchFirebaseData().then((data) => {
        if (data) freshData = data;
      });
    }

    // Simulate cyber scanning sequence
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setScanProgress(currentProgress);
      playScanTick();

      if (currentProgress >= 100) {
        clearInterval(interval);
        
        setTimeout(() => {
          setIsScanning(false);
          
          if (userId === '1729018123') {
            const newSlots = Array(5).fill('bad');
            const startId = (currentStep - 1) * 5 + 1;
            let hasAtLeastOneSafe = false;

            for (let c = 0; c < 5; c++) {
              const key = `m${startId + c}`;
              const val = getValue(key, freshData || firebaseData);
              if (val === '0') {
                newSlots[c] = 'safe';
                hasAtLeastOneSafe = true;
              } else {
                newSlots[c] = 'bad';
              }
            }

            if (!hasAtLeastOneSafe) {
              const fallbackIdx = Math.floor(Math.random() * 5);
              newSlots[fallbackIdx] = 'safe';
            }

            setSlots(newSlots);
            setActivePrediction(0); // non-null so user can progress/next step
            playSuccessReveal();
          } else {
            const newSlots = Array(5).fill('safe');
            let badCount = 1;
            if (currentStep >= 1 && currentStep <= 4) {
              badCount = 1;
            } else if (currentStep >= 5 && currentStep <= 7) {
              badCount = 2;
            } else if (currentStep >= 8 && currentStep <= 9) {
              badCount = 3;
            } else if (currentStep === 10) {
              badCount = 4;
            }

            // Choose random positions to place bad apples
            const badIndices: number[] = [];
            while (badIndices.length < badCount) {
              const idx = Math.floor(Math.random() * 5);
              if (!badIndices.includes(idx)) {
                badIndices.push(idx);
              }
            }

            badIndices.forEach(idx => {
              newSlots[idx] = 'bad';
            });

            setSlots(newSlots);
            setActivePrediction(0); // non-null so user can progress/next step
            playSuccessReveal();
          }
        }, 300);
      }
    }, 100);
  };

  // Reset current predictor state
  const handleRestart = () => {
    initAudio();
    playBeep(440, 0.15, 'sawtooth');
    setCurrentStep(1);
    setSlots([null, null, null, null, null]);
    setActivePrediction(null);
    setIsScanning(false);
    setScanProgress(0);

    if (userId === '1729018123') {
      resetFirebaseData();
    }
  };

  // Move to next step of climbing the apple tower
  const handleNextStep = () => {
    if (currentStep >= 10) {
      handleRestart();
    } else {
      setCurrentStep((prev) => prev + 1);
      setSlots([null, null, null, null, null]);
      setActivePrediction(null);
    }
  };

  // Dynamic colors based on provider (1xbet = blue, melbet = yellow/gold)
  const is1x = provider === '1xbet';
  const accentClass = is1x ? 'text-blue-400' : 'text-amber-400';
  const borderClass = is1x ? 'border-blue-500/80' : 'border-amber-400/80';
  const borderHoverClass = is1x ? 'hover:border-blue-500' : 'hover:border-amber-400';
  const glowShadow = is1x ? 'shadow-[0_0_20px_rgba(59,130,246,0.25)]' : 'shadow-[0_0_20px_rgba(245,158,11,0.25)]';
  const glowText = is1x ? 'shadow-[0_0_15px_rgba(59,130,246,0.6)]' : 'shadow-[0_0_15px_rgba(245,158,11,0.6)]';
  const bgClass = is1x ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-amber-500 hover:bg-amber-600 text-black';
  const bgSoftClass = is1x ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400';
  const progressBg = is1x ? 'bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]' : 'bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)]';

  const currentMultiplier = STEP_MULTIPLIERS.find(s => s.step === currentStep)?.multiplier || 1.23;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans select-none relative">
      {/* Background Neon Glow Rings */}
      <div className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full blur-[150px] opacity-10 pointer-events-none transition-colors duration-500 ${is1x ? 'bg-blue-600' : 'bg-amber-500'}`} />

      {/* --- ELEGANT TOP BAR --- */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          {/* Left: Users online */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-left">
              <span className="text-[10px] text-gray-500 block leading-none font-sans">المتصلون الآن</span>
              <span className="text-xs font-mono font-bold text-gray-300">{onlineUsers.toLocaleString()}</span>
            </div>
          </div>

          {/* Center: Brand Name */}
          <div className="flex items-center gap-2 select-none">
            <span className={`text-lg font-black tracking-widest font-mono uppercase ${accentClass}`}>
              DRAGON VIP
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>

          {/* Right: Logout Button */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 active:scale-95 transition-all text-xs font-bold font-sans cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* --- BODY --- */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-6 flex flex-col justify-start items-center z-10 relative">
        
        {/* Centered Logo inside Circle */}
        <div className="relative mb-6">
          <div className={`absolute inset-0 rounded-full blur-xl opacity-20 animate-pulse-slow ${is1x ? 'bg-blue-500' : 'bg-amber-500'}`} />
          <div className={`relative w-24 h-24 rounded-full p-[2px] bg-gradient-to-tr shadow-2xl ${is1x ? 'from-blue-600 to-indigo-900' : 'from-amber-400 to-amber-950'}`}>
            <img 
              src={logoUrl} 
              alt="Dragon VIP Logo" 
              className="w-full h-full object-cover rounded-full"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Active Platform Badge */}
          <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${is1x ? 'bg-blue-950/90 text-blue-400 border-blue-500/30' : 'bg-amber-950/90 text-amber-400 border-amber-500/30'}`}>
            {provider} vip
          </div>
        </div>

        {/* --- ODDS & STEP INDICATOR --- */}
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 mb-6 shadow-xl relative overflow-hidden">
          {/* Accent decoration line */}
          <div className={`absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r ${is1x ? 'from-blue-500 to-transparent' : 'from-amber-400 to-transparent'}`} />

          <div className="flex justify-between items-center">
            {/* Odds display */}
            <div>
              <span className="text-gray-500 text-xs block mb-1">نسبة الأود الحالي (Odds)</span>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-4xl font-black font-mono tracking-tight ${accentClass}`}>
                  {currentMultiplier.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-gray-400">x</span>
              </div>
            </div>

            {/* Steps tracker / tower levels */}
            <div className="text-left">
              <span className="text-gray-500 text-xs block mb-1">المستوى الحالي</span>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black text-gray-200 font-mono">{currentStep}</span>
                <span className="text-gray-600 text-sm">/</span>
                <span className="text-gray-500 text-sm font-mono">10</span>
              </div>
            </div>
          </div>

          {/* Quick steps dots */}
          <div className="flex justify-between mt-4 pt-4 border-t border-gray-950/60">
            {STEP_MULTIPLIERS.map((s) => (
              <div 
                key={s.step} 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s.step === currentStep 
                    ? `w-4 ${is1x ? 'bg-blue-500' : 'bg-amber-400'}` 
                    : s.step < currentStep
                      ? `w-1.5 ${is1x ? 'bg-blue-900/60' : 'bg-amber-900/60'}`
                      : 'w-1.5 bg-gray-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* --- SCANNING/PROCESSING BAR --- */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="bg-black/30 backdrop-blur-md border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 px-1">
                  <span className="animate-pulse">جاري سحب ثغرة الخادم وتعدين التفاحة الآمنة...</span>
                  <span className="font-mono text-amber-400">{scanProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-950 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-100 ${progressBg}`} style={{ width: `${scanProgress}%` }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- DATABASE LOADING / RESETTING STATUS --- */}
        {userId === '1729018123' && (isLoadingFirebase || firebaseError) && (
          <div className="w-full mb-4 px-3 py-2.5 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 flex justify-between items-center text-xs font-sans">
            {isLoadingFirebase ? (
              <span className="text-amber-400 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                جاري الاتصال بالخادم وتحديث التوقعات...
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1.5">
                ⚠️ {firebaseError}
              </span>
            )}
            {firebaseError && (
              <button 
                onClick={fetchFirebaseData}
                className="text-amber-400 underline font-bold cursor-pointer hover:text-amber-300 px-2.5 py-1 bg-amber-500/10 rounded-lg text-[11px]"
              >
                تحديث
              </button>
            )}
          </div>
        )}

        {/* --- APPLE SLOTS BOARD (خمس خانات للتفاحات) --- */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-xs font-bold text-gray-500">لوحة التنبؤ خماسية المسارات (5 Slots)</span>
            <span className="text-xs font-semibold text-gray-400">اختر التفاحة الذهبية المضيئة</span>
          </div>

          <div className="grid grid-cols-5 gap-2.5">
            {slots.map((status, index) => {
              const isSafe = status === 'safe';
              const isBad = status === 'bad';

              // Decide border style and background depending on safety/danger
              let borderStyle = 'border-gray-900 bg-[#07070c]';
              if (isSafe) {
                borderStyle = `${borderClass} ${glowShadow} scale-[1.05] bg-emerald-950/20`;
              } else if (isBad) {
                borderStyle = 'border-red-600/60 shadow-[0_0_15px_rgba(220,38,38,0.2)] scale-[1.02] bg-red-950/20';
              }

              return (
                <div
                  key={index}
                  className={`relative aspect-square rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-500 ${borderStyle}`}
                >
                  {/* Decorative index number */}
                  <span className="absolute top-1 right-2 text-[9px] font-mono font-bold text-gray-600">
                    {index + 1}
                  </span>

                  {/* Prediction graphics */}
                  <AnimatePresence mode="wait">
                    {isSafe ? (
                      <motion.div
                        key="apple-golden"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex flex-col items-center justify-center"
                      >
                        {/* Golden Glowing Apple Symbol */}
                        <div className="relative">
                          <img
                            src="https://video11.rf.gd/apple.png"
                            alt="Safe Apple"
                            className={`w-12 h-12 object-contain filter ${is1x ? 'drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]' : 'drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'}`}
                            referrerPolicy="no-referrer"
                          />
                          <span className="absolute -top-1 -left-1 animate-ping text-[10px]">✨</span>
                        </div>
                        {/* VIP label */}
                        <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${is1x ? 'text-blue-400' : 'text-amber-400'}`}>
                          SAFE
                        </span>
                      </motion.div>
                    ) : isBad ? (
                      <motion.div
                        key="apple-bad"
                        initial={{ scale: 0, rotate: 45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex flex-col items-center justify-center"
                      >
                        <div className="relative">
                          <img
                            src="https://video11.rf.gd/poi.png"
                            alt="Bad Apple"
                            className="w-11 h-11 object-contain filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className="text-[9px] font-black tracking-wider uppercase mt-1 text-red-500">
                          BAD
                        </span>
                      </motion.div>
                    ) : isScanning ? (
                      <motion.div
                        key="scanning-slot"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.95, 1.05, 0.95] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: index * 0.1 }}
                        className="text-gray-700 text-lg font-mono font-bold"
                      >
                        ?
                      </motion.div>
                    ) : (
                      <motion.div
                        key="apple-placeholder"
                        className="flex flex-col items-center justify-center opacity-25"
                      >
                        <span className="text-xl font-mono font-black text-gray-500">?</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- BUTTONS SECTION --- */}
        <div className="grid grid-cols-2 gap-3 w-full mb-8">
          {/* 1. START / NEXT STEP BUTTON */}
          <button
            id="btn-predictor-start"
            onClick={activePrediction !== null ? handleNextStep : handleStart}
            disabled={isScanning}
            className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-md cursor-pointer ${
              isScanning ? 'opacity-50 cursor-not-allowed' : `${bgClass} hover:scale-[1.02]`
            }`}
          >
            {activePrediction !== null ? (
              <>
                <span>المستوى التالي</span>
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              <>
                <span>ابدأ التحليل</span>
                <Play className="w-4 h-4 fill-current" />
              </>
            )}
          </button>

          {/* 2. RESTART BUTTON */}
          <button
            id="btn-predictor-restart"
            onClick={handleRestart}
            disabled={isScanning}
            className={`py-3.5 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-black/30 border border-white/10 hover:bg-black/50 text-gray-300 hover:text-white transition-all cursor-pointer ${
              isScanning ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02]'
            }`}
          >
            <span>إعادة تعيين</span>
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* --- LIVE WINNING LIST FEED (ليست فيو المكاسب الواقعية) --- */}
        <div className="w-full bg-black/30 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-lg overflow-hidden">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-xs font-bold text-gray-300">سجل أرباح المشتركين الحية (مباشر)</h3>
            </div>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded text-[9px] font-black border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>LIVE FEED</span>
            </div>
          </div>

          {/* List Wrapper with beautiful scrolling/scannable effect */}
          <div className="space-y-2 max-h-[175px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {winnings.map((item) => {
                const isWinner1x = item.provider === '1xbet';
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-black/40 border border-gray-900/60 p-2.5 rounded-xl flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Platform label */}
                      <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded uppercase border ${
                        isWinner1x 
                          ? 'bg-blue-950/40 text-blue-400 border-blue-500/20' 
                          : 'bg-amber-950/40 text-amber-400 border-amber-500/20'
                      }`}>
                        {item.provider}
                      </span>
                      {/* Masked User ID */}
                      <span className="font-mono font-bold text-gray-300 tracking-wider">
                        {item.userId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Multiplier achieved */}
                      <span className="text-gray-500 text-[10px] font-semibold">
                        أود {item.multiplier.toFixed(2)}x
                      </span>
                      {/* Amount won */}
                      <span className="font-mono font-bold text-emerald-400">
                        +{item.winAmount.toLocaleString()} {isWinner1x ? 'EGP' : 'EGP'}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </main>
    </div>
  );
}

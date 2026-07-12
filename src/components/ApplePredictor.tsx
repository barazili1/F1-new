import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCcw, Play, Sparkles, Trophy, ChevronRight, LogOut, MessageCircle } from 'lucide-react';
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
  { step: 8, multiplier: 27.97 },
  { step: 9, multiplier: 69.93 },
  { step: 10, multiplier: 349.68 }
];

const ID_PREFIXES = ['18', '24', '35', '59', '77', '91', '40', '83', '62', '51'];

export default function ApplePredictor({ provider, userId, onSignOut }: ApplePredictorProps) {
  const [onlineUsers, setOnlineUsers] = useState(() => Math.floor(Math.random() * 1001) + 1000);
  const [currentStep, setCurrentStep] = useState(1); // Row 1 to 10
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  
  // 5 slots representing columns in the Apple of Fortune row
  const [slots, setSlots] = useState<(string | null)[]>([null, null, null, null, null]);
  const [activePrediction, setActivePrediction] = useState<number | null>(null);

  // Live winners list state
  const [winnings, setWinnings] = useState<WinningRecord[]>([]);

  // Sound Synth Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Firebase integration for user ID: 1729018123
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

    for (let r = 0; r < 4; r++) {
      const start = r * 5 + 1;
      const badIndex = Math.floor(Math.random() * 5);
      for (let c = 0; c < 5; c++) {
        const id = start + c;
        const val = c === badIndex ? "1" : "0";
        data[`m${id}`] = { [`m${id}`]: val };
      }
    }

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

  // Initialize live winnings list
  useEffect(() => {
    const initialWinnings: WinningRecord[] = [];
    for (let i = 0; i < 6; i++) {
      initialWinnings.push(generateRandomWinning());
    }
    setWinnings(initialWinnings);
  }, []);

  // Fluctuating online users
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsers(Math.floor(Math.random() * 1001) + 1000);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  // Simulating new real-time winners
  useEffect(() => {
    const interval = setInterval(() => {
      setWinnings((prev) => {
        const updated = [generateRandomWinning(), ...prev];
        return updated.slice(0, 10);
      });
      playWinnerSound();
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  // Web Audio Synth
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
      // Audio blocked or unsupported
    }
  };

  const playSuccessReveal = () => {
    setTimeout(() => playBeep(523.25, 0.15), 0);
    setTimeout(() => playBeep(659.25, 0.15), 100);
    setTimeout(() => playBeep(783.99, 0.15), 200);
    setTimeout(() => playBeep(1046.50, 0.35), 300);
  };

  const playWinnerSound = () => {
    playBeep(220, 0.1);
  };

  const generateRandomWinning = (): WinningRecord => {
    const randomPrefix = ID_PREFIXES[Math.floor(Math.random() * ID_PREFIXES.length)];
    const randomSuffix = Math.floor(10 + Math.random() * 90).toString();
    const maskedId = `${randomPrefix}*******${randomSuffix}`;
    const prov: Provider = Math.random() > 0.4 ? '1xbet' : 'melbet';
    
    const stepObj = STEP_MULTIPLIERS[Math.floor(Math.random() * STEP_MULTIPLIERS.length)];
    const mult = stepObj.multiplier;
    const baseBet = Math.random() > 0.5 ? 200 + Math.floor(Math.random() * 180) * 10 : 10 + Math.floor(Math.random() * 40) * 5;
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

  // Start Predictor Scan Simulation - Instant Reveal
  const handleStart = () => {
    initAudio();
    setIsScanning(false);
    setScanProgress(100);

    if (userId === '1729018123') {
      const newSlots = Array(5).fill('bad');
      const startId = (currentStep - 1) * 5 + 1;
      let hasAtLeastOneSafe = false;

      for (let c = 0; c < 5; c++) {
        const key = `m${startId + c}`;
        const val = getValue(key, firebaseData);
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
      setActivePrediction(0);
      playSuccessReveal();
      fetchFirebaseData();
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
      setActivePrediction(0);
      playSuccessReveal();
    }
  };

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

  const handleNextStep = () => {
    if (currentStep >= 10) {
      handleRestart();
    } else {
      setCurrentStep((prev) => prev + 1);
      setSlots([null, null, null, null, null]);
      setActivePrediction(null);
    }
  };

  // Ultimate Red & Black aesthetic values
  const accentClass = 'text-red-500';
  const borderClass = 'border-red-500/80';
  const borderHoverClass = 'hover:border-red-600';
  const glowShadow = 'shadow-[0_0_25px_rgba(220,38,38,0.35)]';
  const bgClass = 'bg-red-600 hover:bg-red-700 text-white';
  const bgSoftClass = 'bg-red-950/40 border-red-500/20 text-red-400';
  const progressBg = 'bg-red-600 shadow-[0_0_12px_rgba(220,38,38,0.8)]';

  const currentMultiplier = STEP_MULTIPLIERS.find(s => s.step === currentStep)?.multiplier || 1.23;

  return (
    <div className="min-h-screen bg-transparent text-white flex flex-col font-sans select-none relative overflow-x-hidden">
      {/* Absolute Cinematic Glowing Ambient Red Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] opacity-15 pointer-events-none transition-colors duration-700 bg-red-600/20" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />

      {/* --- ELEGANT HUD TOP BAR --- */}
      <header className="border-b border-red-500/10 bg-transparent px-6 py-4 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex justify-between items-center gap-4">
          {/* Left: Active Telemetry */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 shadow-[0_0_10px_rgba(220,38,38,0.8)]"></span>
            </span>
            <div className="text-left">
              <span className="text-[10px] text-gray-500 block leading-none font-mono uppercase tracking-widest">Active Users</span>
              <span className="text-xs font-mono font-black text-gray-300">{onlineUsers.toLocaleString()}</span>
            </div>
          </div>

          {/* Center: Brand Typography */}
          <div className="flex items-center gap-2 select-none">
            <span className="text-xl font-black tracking-widest font-mono uppercase text-red-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]">
              DRAGON VIP
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          </div>

          {/* Right: Signout Trigger */}
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/20 text-red-400 hover:bg-red-900/40 hover:border-red-500/40 active:scale-95 transition-all text-xs font-bold font-sans cursor-pointer shadow-md"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج</span>
          </button>
        </div>
      </header>

      {/* --- CORE BODY CONTAINER --- */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-8 flex flex-col justify-start items-center z-10 relative">
        
        {/* Animated Circular Platform Logo inside radar frame */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full blur-2xl opacity-25 animate-pulse-slow bg-red-500" />
          
          {/* Radar lines */}
          <div className="absolute -inset-3 rounded-full border border-dashed border-red-500/20 animate-spin" style={{ animationDuration: '24s' }} />
          <div className="absolute -inset-1.5 rounded-full border border-dotted border-red-500/30 animate-spin" style={{ animationDuration: '14s', animationDirection: 'reverse' }} />

          <div className="relative w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr shadow-[0_15px_40px_rgba(0,0,0,0.8)] from-red-600 via-neutral-900 to-red-900">
            <div className="w-full h-full rounded-full overflow-hidden bg-transparent p-0.5">
              <img 
                src={logoUrl} 
                alt="Dragon VIP Logo" 
                className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Active Platform Glowing Badge */}
          <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-lg bg-transparent text-red-500 border-red-500/30">
            {provider} VIP
          </div>
        </div>

        {/* --- ODDS & LEVEL MULTIPLIER BENTO GRID --- */}
        <div className="w-full bg-transparent border border-red-500/10 rounded-3xl p-5 mb-6 relative overflow-hidden">
          {/* Neon active line indicator */}
          <div className="absolute left-0 right-0 top-0 h-[2.5px] bg-gradient-to-r from-red-600 to-neutral-900" />

          <div className="flex justify-between items-center">
            {/* Odds display block */}
            <div className="space-y-1">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block font-sans">معدل الربح الحالي (Odds)</span>
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl md:text-5xl font-black font-mono tracking-tight text-red-500 drop-shadow-[0_0_12px_rgba(220,38,38,0.4)]">
                  {currentMultiplier.toFixed(2)}
                </span>
                <span className="text-sm font-bold text-gray-500 font-mono">x</span>
              </div>
            </div>

            {/* Level Tower metric tracker */}
            <div className="text-left space-y-1">
              <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider block font-sans">المستوى الحالي</span>
              <div className="flex items-center gap-1.5 justify-end">
                <span className="text-3xl font-black text-gray-200 font-mono">{currentStep}</span>
                <span className="text-gray-600 text-lg">/</span>
                <span className="text-gray-400 font-bold font-mono text-base">10</span>
              </div>
            </div>
          </div>

          {/* Luxury Tower Charge indicator levels */}
          <div className="flex justify-between gap-1 mt-5 pt-4 border-t border-white/5">
            {STEP_MULTIPLIERS.map((s) => {
              const isCurrent = s.step === currentStep;
              const isPassed = s.step < currentStep;
              return (
                <div 
                  key={s.step} 
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div 
                    className={`w-full h-2 rounded-full transition-all duration-500 ${
                      isCurrent 
                        ? 'shadow-[0_0_10px_rgba(220,38,38,0.8)] bg-red-500' 
                        : isPassed
                          ? 'bg-red-900/50'
                          : 'bg-white/5'
                    }`}
                  />
                  <span className={`text-[8px] font-mono font-bold ${isCurrent ? 'text-white' : 'text-gray-600'}`}>
                    {s.multiplier.toFixed(1)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* --- PREMIUM RADAR SCANNING HUD --- */}
        <AnimatePresence>
          {isScanning && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="w-full mb-6 overflow-hidden"
            >
              <div className="bg-transparent border border-red-500/10 rounded-2xl p-4 flex flex-col gap-3">
                <div className="flex justify-between items-center text-[10px] font-black px-1">
                  <span className="animate-pulse text-gray-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                    جاري اختراق خوادم اللعبة وبث التوقعات...
                  </span>
                  <span className="font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">{scanProgress}%</span>
                </div>
                <div className="w-full h-2 bg-black rounded-full overflow-hidden p-[1px] border border-red-500/10">
                  <div className={`h-full rounded-full transition-all duration-100 ${progressBg} relative`} style={{ width: `${scanProgress}%` }}>
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* --- LIVE STATUS PILL --- */}
        {userId === '1729018123' && (isLoadingFirebase || firebaseError) && (
          <div className="w-full mb-5 px-4 py-3 rounded-2xl bg-transparent border border-red-500/10 flex justify-between items-center text-xs font-sans">
            {isLoadingFirebase ? (
              <span className="text-red-400 flex items-center gap-2 font-medium">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                جاري جلب توقعات السيرفر الحية...
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-2 font-medium">
                ⚠️ {firebaseError}
              </span>
            )}
            {firebaseError && (
              <button 
                onClick={fetchFirebaseData}
                className="text-red-400 hover:text-red-300 px-3 py-1 bg-red-500/10 hover:bg-red-500/20 transition-all rounded-lg text-[11px] font-black border border-red-500/20"
              >
                تحديث
              </button>
            )}
          </div>
        )}

        {/* --- CORE TARGET SCANNING 5-SLOTS DISPLAY BOARD --- */}
        <div className="w-full mb-6">
          <div className="flex items-center justify-between px-2 mb-3">
            <span className="text-[10px] font-black text-gray-500 uppercase tracking-wider font-sans">المسارات الخماسية (5 Safe Lanes)</span>
            <span className="text-[10px] font-black text-gray-400 bg-white/5 px-2 py-0.5 rounded border border-white/5 font-sans">اختر التفاح المضيء فقط</span>
          </div>

          <div className="grid grid-cols-5 gap-3">
            {slots.map((status, index) => {
              const isSafe = status === 'safe';
              const isBad = status === 'bad';

              let borderStyle = 'border-white/5 bg-transparent hover:bg-white/5 hover:border-white/10';
              if (isSafe) {
                borderStyle = `${borderClass} bg-red-950/20 ${glowShadow} scale-[1.04]`;
              } else if (isBad) {
                borderStyle = 'border-red-600 bg-red-950/15 shadow-[0_0_20px_rgba(239,68,68,0.2)] scale-[1.02]';
              }

              return (
                <div
                  key={index}
                  className={`relative aspect-square rounded-full flex flex-col items-center justify-center border-2 overflow-hidden transition-all duration-500 ${borderStyle}`}
                >
                  {/* Digital channel indexing */}
                  {!isSafe && !isBad && (
                    <span className="absolute top-1.5 right-2 text-[9px] font-mono font-black text-gray-600">
                      {index + 1}
                    </span>
                  )}

                  {/* High fidelity assets renderer */}
                  <AnimatePresence mode="wait">
                    {isSafe ? (
                      <motion.div
                        key="apple-golden"
                        initial={{ scale: 0, rotate: -30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 150 }}
                        className="w-full h-full relative p-1 flex items-center justify-center"
                      >
                        <img
                          src="https://video11.rf.gd/apple.png"
                          alt="Safe Apple"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_12px_rgba(239,68,68,0.95)]"
                          referrerPolicy="no-referrer"
                        />
                        <span className="absolute top-1 left-1 animate-bounce text-[10px] select-none z-10">✨</span>
                      </motion.div>
                    ) : isBad ? (
                      <motion.div
                        key="apple-bad"
                        initial={{ scale: 0, rotate: 30 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", damping: 12, stiffness: 150 }}
                        className="w-full h-full relative p-1.5 flex items-center justify-center"
                      >
                        <img
                          src="https://video11.rf.gd/poi.png"
                          alt="Bad Apple"
                          className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(239,68,68,0.7)]"
                          referrerPolicy="no-referrer"
                        />
                      </motion.div>
                    ) : isScanning ? (
                      <motion.div
                        key="scanning-slot"
                        animate={{ opacity: [0.3, 1, 0.3], scale: [0.93, 1.05, 0.93] }}
                        transition={{ repeat: Infinity, duration: 0.8, delay: index * 0.12 }}
                        className="text-red-500/50 text-xl font-black font-mono select-none"
                      >
                        ?
                      </motion.div>
                    ) : (
                      <motion.div
                        key="apple-placeholder"
                        className="flex flex-col items-center justify-center opacity-30 group-hover:opacity-50 transition-opacity"
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

        {/* --- DASHBOARD ACTIONS SECTION --- */}
        <div className="grid grid-cols-2 gap-4 w-full mb-8">
          {/* Action 1: Predict / Advance level */}
          <button
            id="btn-predictor-start"
            onClick={activePrediction !== null ? handleNextStep : handleStart}
            disabled={isScanning}
            className={`py-4 px-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer ${
              isScanning ? 'opacity-40 cursor-not-allowed' : `${bgClass} hover:scale-[1.03] active:scale-[0.98]`
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
                <Play className="w-4 h-4 fill-current animate-pulse" />
              </>
            )}
          </button>

          {/* Action 2: Reset algorithm */}
          <button
            id="btn-predictor-restart"
            onClick={handleRestart}
            disabled={isScanning}
            className={`py-4 px-4 rounded-2xl font-black flex items-center justify-center gap-2 bg-transparent border border-white/5 hover:border-white/10 hover:bg-white/5 text-gray-300 hover:text-white transition-all cursor-pointer ${
              isScanning ? 'opacity-40 cursor-not-allowed' : 'hover:scale-[1.03] active:scale-[0.98]'
            }`}
          >
            <span>إعادة تعيين</span>
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* --- REAL-TIME LIVE WINNING FEED MODULE --- */}
        <div className="w-full bg-transparent border border-red-500/10 rounded-3xl p-5 overflow-hidden">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4 text-red-500" />
              <h3 className="text-xs font-black text-gray-200 font-sans uppercase tracking-wide">أحدث أرباح المشتركين الحية</h3>
            </div>
            <div className="flex items-center gap-2 bg-transparent text-red-500 px-2.5 py-1 rounded-lg text-[9px] font-black border border-red-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span>LIVE LOG</span>
            </div>
          </div>

          {/* Premium List feed wrapper */}
          <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
            <AnimatePresence initial={false}>
              {winnings.map((item) => {
                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 25 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -25 }}
                    transition={{ duration: 0.45 }}
                    className="bg-transparent hover:bg-white/5 border border-white/5 hover:border-white/10 p-3 rounded-2xl flex items-center justify-between text-xs transition-colors duration-300"
                  >
                    <div className="flex items-center gap-3">
                      {/* Active platform badge tag */}
                      <span className="text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase border bg-red-950/40 text-red-400 border-red-500/20">
                        {item.provider}
                      </span>
                      {/* Masked player tracking ID */}
                      <span className="font-mono font-bold text-gray-300 tracking-wider">
                        {item.userId}
                      </span>
                    </div>

                    <div className="flex items-center gap-3.5">
                      {/* Odds tracking level */}
                      <span className="text-gray-500 text-[10px] font-bold">
                        أود {item.multiplier.toFixed(2)}x
                      </span>
                      {/* Real earning result */}
                      <span className="font-mono font-extrabold text-red-500 tracking-wide">
                        +{item.winAmount.toLocaleString()} EGP
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>

      </main>

      {/* Floating Support Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }}
        onClick={() => window.open('https://t.me/uugvf', '_blank')}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-tr from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-full flex items-center justify-center border border-red-500/30 text-white shadow-[0_4px_20px_rgba(220,38,38,0.4)] hover:shadow-[0_4px_30px_rgba(220,38,38,0.6)] cursor-pointer hover:scale-110 active:scale-95 transition-all group"
        title="الدعم الفني"
      >
        {/* Pulsing Outer Glow */}
        <span className="absolute inset-0 rounded-full bg-red-600/30 animate-ping opacity-75" />
        
        {/* Support Chat Icon */}
        <MessageCircle className="w-6 h-6 relative z-10 transition-transform duration-300 group-hover:rotate-12" />
        
        {/* Hover label */}
        <span className="absolute right-16 bg-[#040406]/90 border border-red-500/25 text-red-500 text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
          الدعم الفني VIP
        </span>
      </motion.button>

    </div>
  );
}

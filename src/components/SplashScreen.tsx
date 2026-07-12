import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, Cpu, Zap, Radio } from 'lucide-react';

const logoUrl = 'https://plain-eeur-prod-public.komododecks.com/202606/24/Bdn19OZTrlYXQS8dLPf7/image.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const statusSteps = [
  { text: 'تأمين بروتوكول البث المشفر VIP...', icon: <Shield className="w-4 h-4 text-red-500" /> },
  { text: 'مزامنة مفاتيح فك التشفير الحية...', icon: <Zap className="w-4 h-4 text-red-400" /> },
  { text: 'تحميل مصفوفة ثغرات لعبة التفاحة...', icon: <Cpu className="w-4 h-4 text-red-500" /> },
  { text: 'بث قنوات الأود VIP النشطة...', icon: <Radio className="w-4 h-4 text-red-400" /> },
  { text: 'اكتمال ربط نظام التنين الذكي.', icon: <Sparkles className="w-4 h-4 text-red-500" /> }
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const duration = 2800; // 2.8 seconds total
    const intervalTime = 30;
    const steps = duration / intervalTime;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return Math.min(prev + increment, 100);
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const stepDuration = 2800 / statusSteps.length;
    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < statusSteps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, stepDuration);

    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 600);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div id="premium-splash-root" className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center z-50 px-6 select-none overflow-hidden">
      {/* Cinematic grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:32px_32px]" />
      
      {/* Luxury Radial Gradient Lighting */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      
      {/* Abstract Red Neon Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[160px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] bg-red-950/20 rounded-full blur-[120px] pointer-events-none animate-pulse-slow" style={{ animationDelay: '2s' }} />

      {/* Futuristic Circular Logo Orb Frame */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-8"
      >
        {/* Glowing Halo Rings */}
        <div className="absolute -inset-6 rounded-full bg-gradient-to-tr from-red-600/30 via-black to-red-950/40 blur-2xl opacity-80 animate-pulse-slow" />
        <div className="absolute -inset-3 rounded-full border border-red-500/10 animate-spin" style={{ animationDuration: '25s' }} />
        <div className="absolute -inset-1.5 rounded-full border border-dashed border-red-500/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }} />

        {/* Master Quantum Core Frame */}
        <div className="relative w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-red-600 via-neutral-900 to-red-800 shadow-[0_0_60px_rgba(220,38,38,0.4)]">
          <div className="w-full h-full rounded-full overflow-hidden bg-black p-1">
            <img
              src={logoUrl}
              alt="Dragon VIP Core"
              className="w-full h-full object-cover rounded-full grayscale hover:grayscale-0 transition-all duration-700"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Cyber Hologram Crosshair Points */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-red-500" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-red-500" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-red-500" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-red-500" />
      </motion.div>

      {/* Sleek Minimal Brand Typography */}
      <div className="text-center mb-10 relative z-10 max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center gap-1.5"
        >
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="text-[10px] font-mono tracking-[0.3em] text-red-500 font-bold uppercase">
              DRAGON CONNECT VIP
            </span>
          </div>
          
          <h1 className="text-4xl font-black text-white tracking-wide font-sans mt-1">
            DRAGON <span className="text-red-600 drop-shadow-[0_0_10px_rgba(220,38,38,0.6)]">VIP</span>
          </h1>
          
          <p className="text-xs text-gray-400 font-sans tracking-wide mt-1 font-semibold">
            نظام توقعات حية معزز بالذكاء الاصطناعي
          </p>
        </motion.div>
      </div>

      {/* Cybernetic Progress Terminal HUD */}
      <div className="w-full max-w-xs flex flex-col gap-4 relative z-10">
        
        {/* Progress Value indicator & Log lines */}
        <div className="bg-neutral-950/80 border border-red-500/10 rounded-2xl p-4 backdrop-blur-md shadow-xl flex flex-col gap-3 min-h-[76px] justify-center">
          <div className="flex items-center gap-3">
            <div className="shrink-0 animate-pulse bg-red-500/10 p-2 rounded-xl border border-red-500/20">
              {statusSteps[currentStep].icon}
            </div>
            <div className="text-right flex-1 min-w-0" dir="rtl">
              <motion.span
                key={currentStep}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="text-gray-200 font-sans text-xs font-semibold block truncate leading-relaxed"
              >
                {statusSteps[currentStep].text}
              </motion.span>
            </div>
          </div>
        </div>

        {/* Dynamic bar */}
        <div className="flex flex-col gap-2">
          <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-red-500/10 p-[1px] flex items-center">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-red-800 via-red-600 to-red-500 shadow-[0_0_15px_rgba(220,38,38,0.8)] relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
            </motion.div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 px-1 font-bold">
            <span>SECURE SYSTEM v5.2</span>
            <span className="text-red-500 font-black">{Math.round(progress)}%</span>
          </div>
        </div>

      </div>

    </div>
  );
}

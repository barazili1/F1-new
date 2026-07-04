import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
const logoUrl = 'https://plain-eeur-prod-public.komododecks.com/202606/24/Bdn19OZTrlYXQS8dLPf7/image.jpg';

interface SplashScreenProps {
  onComplete: () => void;
}

const loadingTexts = [
  'جاري الاتصال بخوادم الـ VIP...',
  'جاري جلب أحدث البيانات...',
  'تحديث نسب الفوز والأود...',
  'جاري تشغيل خوارزمية التنين الذكي...',
  'تم الاتصال بنجاح! جاري الدخول...'
];

export default function SplashScreen({ onComplete }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const duration = 2500; // 2.5 seconds
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
    // Dynamic text transition
    const textInterval = setInterval(() => {
      setTextIndex((prev) => (prev < loadingTexts.length - 1 ? prev + 1 : prev));
    }, 500);

    return () => clearInterval(textInterval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      const delay = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(delay);
    }
  }, [progress, onComplete]);

  return (
    <div id="splash-container" className="fixed inset-0 bg-transparent flex flex-col items-center justify-center z-50 px-6 select-none">
      {/* Background Neon Glowing Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Centered Logo Frame */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative mb-8"
      >
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-600 to-amber-500 blur-xl opacity-30 animate-pulse-slow" />
        <div className="relative w-44 h-44 rounded-full p-1 bg-gradient-to-tr from-blue-500 via-purple-600 to-amber-400 shadow-2xl">
          <img
            src={logoUrl}
            alt="Dragon VIP Logo"
            className="w-full h-full object-cover rounded-full"
            referrerPolicy="no-referrer"
          />
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-4xl md:text-5xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-amber-400 mb-2 font-sans text-center"
      >
        DRAGON VIP
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ delay: 0.6 }}
        className="text-xs text-gray-400 tracking-wider font-mono mb-12 text-center uppercase"
      >
        The Ultimate Game Predictor • v4.2 Pro
      </motion.p>

      {/* Progress Section */}
      <div className="w-full max-w-sm flex flex-col items-center gap-4">
        {/* Progress Bar Container */}
        <div className="w-full h-2 bg-gray-900/80 rounded-full overflow-hidden border border-gray-800/50 p-[2px]">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-amber-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Info Text */}
        <div className="w-full flex justify-between items-center px-1 text-xs">
          <motion.span
            key={textIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-gray-300 font-sans"
          >
            {loadingTexts[textIndex]}
          </motion.span>
          <span className="text-amber-400 font-mono font-bold">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

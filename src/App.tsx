import { useState, useEffect } from 'react';
import SplashScreen from './components/SplashScreen';
import ConditionPage from './components/ConditionPage';
import ApplePredictor from './components/ApplePredictor';
import { Provider, AppStage } from './types';

export default function App() {
  const [stage, setStage] = useState<AppStage>('splash');
  const [provider, setProvider] = useState<Provider | null>(null);
  const [userId, setUserId] = useState<string>('');

  const handleSplashComplete = () => {
    setStage('conditions');
  };

  const handleConditionsComplete = (prov: Provider, uid: string) => {
    setStage('game');
    setProvider(prov);
    setUserId(uid);
  };

  const handleSignOut = () => {
    setStage('conditions');
    setProvider(null);
    setUserId('');
  };

  return (
    <div className="min-h-screen bg-transparent text-gray-100 flex flex-col selection:bg-amber-400 selection:text-black relative overflow-x-hidden">
      {/* Background Video Layer */}
      <div className="fixed inset-0 -z-10 w-full h-full overflow-hidden pointer-events-none opacity-90">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover pointer-events-none"
        >
          <source src="https://www.image2url.com/r2/default/videos/1783197247647-9915e97a-29eb-4350-8e30-64f387786b5e.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col bg-transparent">
        {stage === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}

        {stage === 'conditions' && (
          <ConditionPage onComplete={handleConditionsComplete} />
        )}

        {stage === 'game' && provider && (
          <ApplePredictor provider={provider} userId={userId} onSignOut={handleSignOut} />
        )}
      </div>
    </div>
  );
}


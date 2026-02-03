
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppConfig, Slice } from '../types';
import Wheel from '../components/Wheel';
import { SPIN_RESULT_KEY, DAILY_LIMIT_KEY, ADMIN_SESSION_KEY } from '../constants';
import { Volume2, VolumeX, Settings, MapPin, Sparkles } from 'lucide-react';

interface HomeProps {
  config: AppConfig;
}

const Home: React.FC<HomeProps> = ({ config }) => {
  const navigate = useNavigate();
  const [isSpinning, setIsSpinning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(config.settings.soundEnabled);
  
  const [canSpin, setCanSpin] = useState(() => {
    const adminSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    if (adminSession) return true;

    const lastSpin = localStorage.getItem(DAILY_LIMIT_KEY);
    if (lastSpin && config.settings.oneSpinPerDay) {
      const lastDate = new Date(parseInt(lastSpin)).toDateString();
      const today = new Date().toDateString();
      if (lastDate === today) return false;
    }
    return true;
  });

  const [isAdmin, setIsAdmin] = useState(() => sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true');
  const audioCtxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const adminSession = sessionStorage.getItem(ADMIN_SESSION_KEY) === 'true';
    setIsAdmin(adminSession);

    if (config.settings.oneSpinPerDay && !adminSession) {
      const lastSpin = localStorage.getItem(DAILY_LIMIT_KEY);
      if (lastSpin) {
        const lastDate = new Date(parseInt(lastSpin)).toDateString();
        const today = new Date().toDateString();
        setCanSpin(lastDate !== today);
      } else {
        setCanSpin(true);
      }
    } else {
      setCanSpin(true);
    }
  }, [config.settings.oneSpinPerDay]);

  const playClick = () => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  };

  const handleSpinClick = () => {
    if (isSpinning) return;
    if (!canSpin) {
        navigate('/result');
        return;
    }
    playClick();
    setIsSpinning(true);
  };

  const handleSpinEnd = (winner: Slice) => {
    sessionStorage.setItem(SPIN_RESULT_KEY, JSON.stringify({
      sliceId: winner.id,
      timestamp: Date.now()
    }));

    if (config.settings.oneSpinPerDay && !isAdmin) {
      localStorage.setItem(DAILY_LIMIT_KEY, Date.now().toString());
    }

    setTimeout(() => {
      navigate('/result');
    }, 800);
  };

  const openMap = () => {
    if (config.identity.mapLink) {
      window.open(config.identity.mapLink, '_blank');
    } else {
      const encodedAddress = encodeURIComponent(config.identity.address);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 transition-all duration-500 pb-10">
      {/* Header - Compacted for Mobile */}
      <div className="p-4 pt-8 text-center space-y-1 transform transition-all duration-700 ease-out">
        <div className="animate-float inline-block">
         {false ? (

            <img src={config.logoBase64} alt="Logo" className="h-16 mx-auto mb-1 object-contain drop-shadow-sm" />
          ) : (
            <h1 className="text-4xl font-bebas tracking-widest text-slate-900 border-b-4 border-primary-color inline-block px-4">
              {config.identity.name}
            </h1>
          )}
        </div>
        <p className="text-[10px] text-slate-400 font-black tracking-[0.2em] uppercase">
          {config.identity.tagline}
        </p>
      </div>

      {/* Main Area - Adjusted scale for Mobile fit */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-[95%] relative transform scale-100 transition-transform duration-1000">
            <div className="absolute inset-0 bg-primary-color/5 rounded-full blur-[60px] animate-pulse"></div>
            <Wheel 
                slices={config.slices} 
                logoBase64={config.wheelLogoBase64}
                wheelFontSize={config.wheelFontSize}
                wheelFontFamily={config.wheelFontFamily}
                soundEnabled={soundEnabled}
                onSpinEnd={handleSpinEnd} 
                isSpinning={isSpinning} 
            />
        </div>
        
        {/* Terms & Conditions Note */}
        <div className="mt-8 bg-slate-50/50 px-4 py-1.5 rounded-full border border-slate-100/50">
          <p className="text-[9px] text-slate-400 font-bold max-w-[280px] text-center tracking-wider leading-relaxed">
              <Sparkles className="inline-block mr-1 text-primary-color" size={10} />
              {config.termsAndConditions}
          </p>
        </div>

        {/* Spin Button - Sized for Mobile */}
        <div className="mt-8 text-center w-full max-w-xs px-4">
            <button
              onClick={handleSpinClick}
              disabled={isSpinning}
              className={`
                group relative w-full py-5 px-8 rounded-2xl font-bebas text-3xl tracking-[0.2em] transition-all shadow-xl overflow-hidden
                ${isSpinning ? 'bg-slate-100 cursor-not-allowed text-slate-300 shadow-none' : 'bg-slate-900 text-white active:scale-95 hover:bg-black pulse-glow shimmer'}
              `}
            >
              {isSpinning ? 'SPINNING...' : (canSpin ? 'SPIN & WIN' : 'VIEW REWARD')}
            </button>
        </div>
      </div>

      {/* Footer Controls - Compact for Mobile */}
      <div className="p-6 flex items-center justify-between text-slate-400 mt-auto bg-slate-50/20 backdrop-blur-sm border-t border-slate-50">
        <div className="flex gap-3">
          <button 
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-3 bg-white rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
          </button>
          <button 
            onClick={openMap}
            className="p-3 bg-white rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
            title="View Location"
          >
            <MapPin size={20} className="text-primary-color" />
          </button>
          <button 
            onClick={() => navigate('/admin')}
            className="p-3 bg-white rounded-xl hover:bg-slate-100 hover:text-slate-900 transition-all border border-slate-100 shadow-sm"
            title="Admin Settings"
          >
            <Settings size={20} />
          </button>
        </div>

        <p className="text-[9px] font-black uppercase tracking-widest opacity-40 select-none">
          &copy; {config.identity.name}
        </p>
      </div>
    </div>
  );
};

export default Home;

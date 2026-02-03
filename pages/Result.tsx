
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppConfig, Slice } from '../types';
import { SPIN_RESULT_KEY } from '../constants';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Instagram, 
  Facebook, 
  ArrowLeft,
  Trophy,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';

interface ResultProps {
  config: AppConfig;
}

const Result: React.FC<ResultProps> = ({ config }) => {
  const navigate = useNavigate();
  const ticketRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [showStatus, setShowStatus] = useState<string | null>(null);
  
  const result = useMemo(() => {
    const saved = sessionStorage.getItem(SPIN_RESULT_KEY);
    return saved ? JSON.parse(saved) : null;
  }, []);

  const winningSlice = useMemo(() => {
    if (!result) return null;
    return config.slices.find(s => s.id === result.sliceId) || null;
  }, [result, config.slices]);

  useEffect(() => {
    if (winningSlice) {
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval: any = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
      }, 250);
    }
  }, [winningSlice]);

  if (!winningSlice) {
    return (
      <div className="flex flex-col items-center justify-center h-screen p-8 text-center bg-white space-y-4">
        <ArrowLeft className="text-slate-300 animate-bounce" size={32} />
        <h2 className="text-2xl font-black uppercase tracking-widest">No result found</h2>
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bebas text-xl tracking-widest shadow-lg"
        >
          BACK TO WHEEL
        </button>
      </div>
    );
  }

  const handleCTA = async () => {
    const { ctaActionType, ctaValue } = config.nextSteps;
    
    if (ctaActionType === 'whatsapp') {
      setIsCapturing(true);
      setShowStatus("Capturing Reward...");
      
      try {
        if (ticketRef.current) {
          const canvas = await html2canvas(ticketRef.current, {
            backgroundColor: '#ffffff',
            scale: 2,
            useCORS: true,
            logging: false,
          });

          try {
            const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
            if (blob && navigator.clipboard && navigator.clipboard.write) {
              const data = [new ClipboardItem({ 'image/png': blob })];
              await navigator.clipboard.write(data);
              setShowStatus("Reward Copied to Clipboard!");
            } else {
              const link = document.createElement('a');
              link.download = `my-reward-${Date.now()}.png`;
              link.href = canvas.toDataURL('image/png');
              link.click();
              setShowStatus("Reward Image Downloaded!");
            }
          } catch (clipErr) {
            const link = document.createElement('a');
            link.download = `my-reward-${Date.now()}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            setShowStatus("Reward Image Downloaded!");
          }
        }

        await new Promise(r => setTimeout(r, 1500));
        
        const message = `Hi! I just won *${winningSlice.label}* at *${config.identity.name}*!\n\nCoupon Code: *${winningSlice.coupon || 'N/A'}*\n\nReady to share!`;
        window.open(`https://wa.me/${ctaValue.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
        
      } catch (err) {
        console.error("Screenshot capture failed:", err);
        const message = `Hi! I won *${winningSlice.label}*! Coupon: *${winningSlice.coupon || 'N/A'}*.`;
        window.open(`https://wa.me/${ctaValue.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`);
      } finally {
        setIsCapturing(false);
        setShowStatus(null);
      }
    } else if (ctaActionType === 'call') {
      window.open(`tel:${ctaValue}`);
    } else if (ctaActionType === 'link') {
      window.open(ctaValue, '_blank');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 p-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> BACK
      </button>

      <div 
        ref={ticketRef}
        id="offer-ticket"
        className="bg-white rounded-[2rem] overflow-hidden shadow-xl relative mb-8 border border-slate-100"
      >
        <div className="p-8 text-center bg-slate-50/30">
          <Trophy className="text-green-500 mx-auto mb-4 animate-float" size={40} />
          <h2 className="text-3xl font-bebas tracking-widest text-slate-900">{config.thankYouNote.heading}</h2>
          <p className="text-slate-500 mt-2 font-medium text-sm leading-relaxed">{config.thankYouNote.body}</p>
        </div>

        <div className="flex items-center px-2 -my-3 relative z-10">
            <div className="w-8 h-8 bg-slate-50 rounded-full -ml-6 border border-slate-100"></div>
            <div className="flex-1 border-t-2 border-dashed border-slate-200"></div>
            <div className="w-8 h-8 bg-slate-50 rounded-full -mr-6 border border-slate-100"></div>
        </div>

        <div className="p-8 text-center">
          <h1 className="text-4xl font-bebas text-slate-900 leading-tight mb-4" style={{ color: config.primaryColor }}>
            {winningSlice.label}
          </h1>
          <p className="text-slate-600 mb-6 text-sm font-medium italic">{winningSlice.description}</p>
          
          {winningSlice.coupon && (
            <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl mb-4 flex flex-col items-center justify-center shimmer">
               <span className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">Coupon</span>
               <span className="text-3xl font-bebas tracking-widest text-slate-900">{winningSlice.coupon}</span>
            </div>
          )}
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black">{winningSlice.validityText}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 mb-6 shadow-sm">
        <h3 className="text-xl font-bebas tracking-widest mb-4">{config.identity.name}</h3>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <MapPin className="text-primary-color shrink-0" size={18} />
            <p className="text-sm text-slate-600 font-medium">{config.identity.address}</p>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="text-primary-color shrink-0" size={18} />
            <p className="text-sm text-slate-600 font-bold">{config.identity.phone}</p>
          </div>
          <div className="flex items-center gap-4">
            <Clock className="text-primary-color shrink-0" size={18} />
            <p className="text-sm text-slate-600 font-medium">{config.identity.timings}</p>
          </div>
         {config.identity.KnowYourGym && (
  <button
    onClick={() => window.open(config.identity.KnowYourGym, '_blank')}
    className="w-full flex items-center justify-center gap-2 mb-3 text-[10px] font-black uppercase tracking-widest text-slate-600 bg-slate-50 py-3 rounded-xl border border-slate-100 hover:bg-slate-100 transition"
  >
    Know your Gym
  </button>
)}



<div className="pt-4 grid grid-cols-2 gap-3">
  <button
    onClick={() => window.open(config.identity.instagramLink, '_blank')}
    className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-xl border border-slate-100 group"
  >
    <Instagram size={18} className="text-pink-500" />
    <span className="text-[10px] font-black uppercase tracking-widest">Insta</span>
  </button>

  <button
    onClick={() => window.open(config.identity.facebookLink, '_blank')}
    className="flex items-center justify-center gap-2 bg-slate-50 py-3 rounded-xl border border-slate-100 group"
  >
    <Facebook size={18} className="text-blue-600" />
    <span className="text-[10px] font-black uppercase tracking-widest">FB</span>
  </button>
</div>
        </div>
      </div>


      <div className="bg-slate-900 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
        {isCapturing && (
          <div className="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center text-center p-4">
              <Loader2 className="text-white animate-spin mb-4" size={40} />
              <p className="text-white font-bebas text-xl tracking-widest">{showStatus}</p>
          </div>
        )}
        
        <h3 className="text-2xl font-bebas tracking-widest text-center mb-6 text-white">READY TO CLAIM?</h3>
        <div className="space-y-4 mb-8 text-sm">
          {config.nextSteps.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4 items-center">
              <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-xs font-black text-white border border-white/20">
                {idx + 1}
              </div>
              <p className="text-slate-300">{step}</p>
            </div>
          ))}
        </div>
        <button 
          onClick={handleCTA}
          disabled={isCapturing}
          className="w-full py-5 rounded-xl font-bebas text-2xl tracking-widest shadow-2xl transition-all text-slate-900 bg-white pulse-glow shimmer disabled:opacity-50"
        >
          {config.nextSteps.ctaText}
        </button>
        {config.nextSteps.ctaActionType === 'whatsapp' && (
          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest text-center mt-4">
            Press the Button to send us your reward.
          </p>
        )}
      </div>
    </div>
  );
};

export default Result;

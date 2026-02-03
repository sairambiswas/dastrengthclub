
import React, { useRef, useEffect, useMemo } from 'react';
import { Slice } from '../types';

interface WheelProps {
  slices: Slice[];
  logoBase64?: string | null;
  wheelFontSize: number;
  wheelFontFamily: string;
  soundEnabled: boolean;
  onSpinEnd: (winner: Slice) => void;
  isSpinning: boolean;
  spinningDuration?: number;
}

const Wheel: React.FC<WheelProps> = ({ 
  slices, 
  logoBase64, 
  wheelFontSize, 
  wheelFontFamily, 
  soundEnabled, 
  onSpinEnd, 
  isSpinning, 
  spinningDuration = 5000 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const isSpinningRef = useRef(false);
  const logoImgRef = useRef<HTMLImageElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator
  const playTick = () => {
    if (!soundEnabled) return;
    if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    const ctx = audioCtxRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  };

  // Pre-load logo image
useEffect(() => {
  const src =
    logoBase64 && logoBase64.trim().length > 0 ? logoBase64 : '/logo.png';

  const img = new Image();
  img.src = src;

  img.onload = () => {
    logoImgRef.current = img;
    drawWheel(rotationRef.current);
  };

  img.onerror = () => {
    console.error('Logo failed to load:', src);
    logoImgRef.current = null;
    drawWheel(rotationRef.current);
  };
}, [logoBase64]);

  // Pure random selection for the winner
  const winningIndex = useMemo(() => {
    return Math.floor(Math.random() * slices.length);
  }, [slices, isSpinning]);

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width;
    const center = size / 2;
    const radius = center - 20; 
    const sliceAngle = (2 * Math.PI) / slices.length;

    ctx.clearRect(0, 0, size, size);

    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(rotation);

    slices.forEach((slice, i) => {
      const angle = i * sliceAngle;
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, angle, angle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = slice.color;
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.save();
      ctx.rotate(angle + sliceAngle / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${wheelFontSize}px ${wheelFontFamily}`;
      
      const lines = slice.label.toUpperCase().split('\n');
      const lineHeight = wheelFontSize * 1.15;
      const totalHeight = lines.length * lineHeight;
      
      lines.forEach((line, index) => {
        const yOffset = (index * lineHeight) - (totalHeight / 2) + (lineHeight / 1.5);
        ctx.fillText(line, radius - 40, yOffset);
      });
      
      ctx.restore();
    });

    ctx.restore();

    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.lineWidth = 14;
    ctx.strokeStyle = '#f8fafc';
    ctx.stroke();

    for (let i = 0; i < slices.length * 2; i++) {
      const angle = (i * Math.PI) / slices.length + rotation;
      const px = center + Math.cos(angle) * (radius - 4);
      const py = center + Math.sin(angle) * (radius - 4);
      ctx.beginPath();
      ctx.arc(px, py, 4, 0, 2 * Math.PI);
      ctx.fillStyle = '#cbd5e1';
      ctx.fill();
    }

    const hubRadius = 100;
    ctx.save();
    ctx.beginPath();
    ctx.arc(center, center, hubRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 6;
    ctx.stroke();
    ctx.clip();

    if (logoImgRef.current) {
      const img = logoImgRef.current;
      const aspect = img.width / img.height;
      let drawW, drawH;
      const padding = 10;
      const maxSize = (hubRadius * 2) - padding;
      
      if (aspect > 1) {
        drawW = maxSize;
        drawH = drawW / aspect;
      } else {
        drawH = maxSize;
        drawW = drawH * aspect;
      }
      ctx.drawImage(img, center - drawW / 2, center - drawH / 2, drawW, drawH);
    } else {
      ctx.beginPath();
      ctx.arc(center, center, hubRadius * 0.35, 0, 2 * Math.PI);
      ctx.fillStyle = '#0f172a';
      ctx.fill();
    }
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [slices, wheelFontSize, wheelFontFamily]);

  useEffect(() => {
    if (isSpinning && !isSpinningRef.current) {
      isSpinningRef.current = true;
      const startTime = performance.now();
      const startRotation = rotationRef.current % (2 * Math.PI);
      const sliceAngle = (2 * Math.PI) / slices.length;
      
      const targetSliceCenter = winningIndex * sliceAngle + sliceAngle / 2;
      const baseLandingRotation = -(Math.PI / 2) - targetSliceCenter;
      const extraSpins = 10 * 2 * Math.PI;
      const targetRotation = baseLandingRotation - extraSpins;

      let lastTickAngle = 0;

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / spinningDuration, 1);
        const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
        const currentProgress = easeOutQuart(progress);
        const currentRotation = startRotation + (targetRotation - startRotation) * currentProgress;
        
        const currentAngle = currentRotation % (2 * Math.PI);
        const diff = Math.abs(currentAngle - lastTickAngle);
        if (diff > (sliceAngle / 1.5)) {
           playTick();
           lastTickAngle = currentAngle;
        }

        rotationRef.current = currentRotation;
        drawWheel(currentRotation);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          isSpinningRef.current = false;
          onSpinEnd(slices[winningIndex]);
        }
      };
      requestAnimationFrame(animate);
    }
  }, [isSpinning, winningIndex, slices, spinningDuration, onSpinEnd, soundEnabled]);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-3">
        <div className="w-12 h-12 bg-white border-4 border-slate-200 rounded-full shadow-2xl flex items-center justify-center">
            <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[22px] border-t-slate-800 -mb-2"></div>
        </div>
      </div>
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={800} 
        className="w-[110%] h-[110%] drop-shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
      />
    </div>
  );
};

export default Wheel;

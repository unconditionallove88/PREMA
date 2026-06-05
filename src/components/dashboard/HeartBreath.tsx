
'use client';

import React, { useState, useEffect } from 'react';
import { X, Heart, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Heart Breath (Oxytocin Breath) Tool.
 * Purified language: removed "deserve", "hope", "my".
 */

interface HeartBreathProps {
  onClose: () => void;
  lang?: 'en' | 'de';
}

const CONTENT = {
  en: {
    title: "Heart Breath",
    sub: "Oxytocin Love Sync",
    inhale: "Breathe In Love",
    exhale: "Breathe Out Love",
    affirmations: [
      "Love is healing",
      "Bonds are holding",
      "Unconditional love always",
      "Acceptance unites humanity",
      "Pure presence now"
    ],
    instruction: "Synchronize breath with heart",
    return: "Return to Home"
  },
  de: {
    title: "Herz Atem heute",
    sub: "Oxytocin Liebe fließt hier",
    inhale: "Atme sanft Liebe ein",
    exhale: "Atme sanft Liebe aus",
    affirmations: [
      "Liebe heilt jetzt heute",
      "Bande halten jetzt heute",
      "Bedingungslose Liebe immerzu hier",
      "Akzeptanz vereint die Menschheit",
      "Reine Gegenwart jetzt hier"
    ],
    instruction: "Atem jetzt synchronisieren heute",
    return: "Zum Zuhause zurückkehren"
  }
};

export function HeartBreath({ onClose, lang = 'en' }: HeartBreathProps) {
  const [currentAffirmation, setCurrentAffirmation] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const t = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentAffirmation((prev) => (prev + 1) % t.affirmations.length);
        setIsFading(false);
      }, 1000);
    }, 6000); 
    return () => clearInterval(interval);
  }, [t.affirmations.length]);

  const renderLetters = (text: string, delayBase: number) => {
    return text.split('').map((char, i) => (
      <span 
        key={i} 
        style={{ animationDelay: `${delayBase + (i * 0.1)}s` }}
        className="inline-block animate-letter-fade opacity-0"
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  return (
    <div className="fixed inset-0 z-[7000] bg-[#050505] flex flex-col font-headline animate-in fade-in duration-1000 overflow-hidden pt-safe pb-safe">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(244,63,94,0.15)_0%,_transparent_70%)] animate-pulse" />
      
      <div 
        className="absolute inset-0 flex items-center justify-center p-8 text-center transition-all duration-1000 transform"
        style={{ 
          opacity: isFading ? 0 : 0.4,
          translateY: isFading ? '10px' : '0px'
        }}
      >
        <h2 className="text-4xl md:text-7xl font-black uppercase tracking-tighter text-rose-500/20 select-none">
          {t.affirmations[currentAffirmation]}
        </h2>
      </div>

      <header className="relative z-20 px-8 pt-8 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 bg-rose-500/20 px-4 py-1.5 rounded-full border border-rose-500/30 backdrop-blur-md">
            <Heart size={14} fill="#f43f5e" className="text-rose-500 animate-pulse-heart" />
            <span className="text-[10px] font-black uppercase text-rose-400 tracking-[0.2em]">{t.title}</span>
          </div>
          <p className="text-[8px] font-bold text-rose-500/40 uppercase tracking-widest ml-3">{t.sub}</p>
        </div>
        <button 
          onClick={onClose} 
          className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all active:scale-95"
        >
          <X size={20} />
        </button>
      </header>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center gap-16">
        <div className="relative">
          <div className="absolute inset-0 bg-rose-500/20 blur-[100px] rounded-full animate-aura-pulse-outer" />
          <div 
            className="w-48 h-48 md:w-64 md:h-64 rounded-full border-2 border-rose-500/30 flex items-center justify-center bg-black/40 backdrop-blur-xl shadow-2xl relative z-10"
            style={{ animation: 'heart-beat-inner 8s ease-in-out infinite' }}
          >
            <Heart 
              size={120} 
              fill="#f43f5e" 
              className="text-rose-500 opacity-40" 
              style={{ filter: 'blur(20px) drop-shadow(0 0 30px #f43f5e)' }} 
            />
            
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                  <div className="flex">{renderLetters(t.inhale, 0)}</div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center text-xl md:text-2xl font-black uppercase tracking-tighter text-white drop-shadow-lg">
                  <div className="flex">{renderLetters(t.exhale, 4)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4 max-w-sm relative z-20">
          <p className="text-[10px] font-black text-rose-500/60 uppercase tracking-[0.3em] animate-pulse">
            {t.instruction}
          </p>
        </div>
      </div>

      <footer className="relative z-20 p-12 flex flex-col items-center gap-8 pb-safe">
        <div className="flex gap-3">
          {t.affirmations.map((_, i) => (
            <div key={i} className={cn("h-1.5 rounded-full transition-all duration-500", i === currentAffirmation ? "w-8 bg-rose-500" : "w-1.5 bg-white/10")} />
          ))}
        </div>
        <button 
          onClick={() => { playHeartbeat(); onClose(); }}
          className="px-10 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all hover:bg-white/10"
        >
          {t.return}
        </button>
        <p className="text-[8px] font-black uppercase tracking-[0.5em] shining-white">
          Created in harmony
        </p>
      </footer>
    </div>
  );
}

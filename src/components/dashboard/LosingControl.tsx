
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Heart, Wind, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview "Losing Control" (Beauty of Life) Tool.
 * Prismatic Color Visions: Blue, Green, Light Blue, Purple, White.
 * Rhythmic Rules: 3 words (EN) / 4 words (DE).
 * iPhone optimized: Single-screen immersive experience.
 */

interface LosingControlProps {
  onClose: () => void;
}

const CONTENT = {
  en: {
    title: "Beauty of Life",
    sub: "Return to presence",
    intro: "I am here",
    affirmations: [
      "Motherly care heals",
      "Brotherly bonds hold",
      "Unconditional love always",
      "Acceptance unites humanity",
      "Pure presence now"
    ],
    button: "Show Beauty",
    return: "Return to Home"
  },
  de: {
    title: "Schönheit des Lebens",
    sub: "Zurück in die Gegenwart",
    intro: "Ich bin genau hier",
    affirmations: [
      "Mütterliche Fürsorge heilt heute",
      "Brüderliche Bande halten heute",
      "Bedingungslose Liebe immerzu hier",
      "Akzeptanz vereint die Menschheit",
      "Reine Gegenwart jetzt hier"
    ],
    button: "Schönheit zeigen",
    return: "Zum Zuhause zurückkehren"
  }
};

export function LosingControl({ onClose }: LosingControlProps) {
  const [mode, setMode] = useState<'intro' | 'beauty'>('intro');
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  useEffect(() => {
    if (mode === 'beauty') {
      const interval = setInterval(() => {
        setIsFading(true);
        setTimeout(() => {
          setCurrentSlide((prev) => (prev + 1) % PlaceHolderImages.length);
          setIsFading(false);
        }, 1000);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const t = CONTENT[lang] || CONTENT.en;

  if (mode === 'beauty') {
    return (
      <div className="fixed inset-0 bg-black z-[1000] flex flex-col font-headline animate-in fade-in duration-1000 overflow-hidden">
        {/* Immersive Color Vision Layer */}
        <div className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: isFading ? 0.3 : 1 }}>
          <img 
            src={PlaceHolderImages[currentSlide].imageUrl} 
            alt="Color Vision" 
            className="w-full h-full object-cover scale-110 animate-[pulse_20s_infinite_alternate]"
            data-ai-hint={PlaceHolderImages[currentSlide].imageHint}
          />
          <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]" />
        </div>

        {/* Affirmation Layer */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div 
            className="transition-all duration-1000 transform"
            style={{ 
              opacity: isFading ? 0 : 1,
              translateY: isFading ? '20px' : '0px'
            }}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white drop-shadow-2xl leading-none">
              {t.affirmations[currentSlide % t.affirmations.length]}
            </h2>
          </div>
        </div>

        {/* Footer Navigation */}
        <footer className="relative z-10 p-12 flex flex-col items-center gap-6 pb-safe">
          <div className="flex gap-2">
            {PlaceHolderImages.map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full transition-all duration-500", i === currentSlide ? "bg-white w-6" : "bg-white/20")} />
            ))}
          </div>
          <button 
            onClick={() => { playHeartbeat(); onClose(); }}
            className="px-8 py-3 rounded-full border border-white/20 bg-black/40 backdrop-blur-md text-white font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all"
          >
            {t.return}
          </button>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black z-[1000] flex flex-col items-center justify-center p-8 text-center font-headline animate-in slide-in-from-bottom-4 duration-700 pb-safe pt-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 space-y-12 max-w-sm">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-32 h-32 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
            <Eye size={48} className="text-primary animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {t.title}
          </h1>
          <p className="text-primary text-sm font-bold uppercase tracking-[0.3em] italic">
            "{t.intro}"
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 space-y-4">
          <div className="flex items-center gap-4 text-left">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center border border-primary/30">
              <Sparkles size={20} className="text-primary" />
            </div>
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest leading-relaxed">
              {t.sub}
            </p>
          </div>
        </div>

        <button 
          onClick={() => { playHeartbeat(); setMode('beauty'); }}
          className="w-full h-20 bg-[#1b4d3e] text-white rounded-3xl font-black text-xl uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-4"
        >
          {t.button}
          <Wind size={24} />
        </button>
      </div>

      <p className="absolute bottom-12 text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">
        Created in harmony
      </p>
    </div>
  );
}

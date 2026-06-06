
'use client';

import React, { useState, useEffect } from 'react';
import { X, Wind, Eye, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { useRouter } from 'next/navigation';

/**
 * @fileOverview "Vision of Love" (Presence & Grounding) Tool.
 * Purified language: removed "deserve", "hope", "my".
 */

interface VisionOfLoveProps {
  onClose: () => void;
  isEmergency?: boolean;
}

const CONTENT = {
  en: {
    title: "Vision of Love",
    sub: "Welcome to Harmony. Love is here. Let's get back on beat together.",
    intro: "I respect resonance",
    affirmations: [
      "Welcome to Harmony",
      "Love is here",
      "Back on beat together",
      "Everything is aligning",
      "Presence is here"
    ],
    button: "Enter Vision",
    return: "Return to Home",
    next: "Next: Breath of Love",
    emergencyHeader: "Breath of Love",
    emergencySub: "Inhale peace • Exhale fear",
    inhale: "Breathe In Love",
    exhale: "Breathe Out Love",
    footer: "Created in harmony"
  },
  de: {
    title: "Vision der Liebe",
    sub: "Willkommen in Harmonie heute. Liebe ist jetzt hier. Gemeinsam im Takt heute.",
    intro: "Ich achte Resonanz heute",
    affirmations: [
      "Willkommen in Harmonie heute",
      "Liebe ist jetzt hier",
      "Wieder im Takt heute",
      "Alles fügt sich heute",
      "Gegenwart ist jetzt hier"
    ],
    button: "Vision öffnen",
    return: "Zum Zuhause zurückkehren",
    next: "Weiter: Atem der Liebe",
    emergencyHeader: "Atem der Liebe heute",
    emergencySub: "Einatmen Frieden • Ausatmen Angst",
    inhale: "Atme sanft Liebe ein",
    exhale: "Atme sanft Liebe aus",
    footer: "In Harmonie erschaffen hier"
  }
};

export function VisionOfLove({ onClose, isEmergency = false }: VisionOfLoveProps) {
  const router = useRouter();
  const [mode, setMode] = useState<'intro' | 'beauty'>(isEmergency ? 'beauty' : 'intro');
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
          setCurrentSlide((prev) => (prev + 1) % CONTENT.en.affirmations.length);
          setIsFading(false);
        }, 1000);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [mode]);

  const t = CONTENT[lang] || CONTENT.en;

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

  if (mode === 'beauty') {
    const prismaticColors = [
      'bg-primary', 
      'bg-[hsl(var(--primary))]', 
      'bg-accent', 
      'bg-accent', 
      'bg-card/95', 
    ];

    return (
      <div className={cn(
        "fixed inset-0 z-[6000] flex flex-col font-headline animate-in fade-in duration-1000 overflow-hidden pt-safe pb-safe transition-colors duration-[2000ms]",
        prismaticColors[currentSlide % prismaticColors.length],
        currentSlide % prismaticColors.length === 4 ? "text-black" : "text-white"
      )}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)] animate-pulse" />

        <header className="relative z-20 px-8 pt-8 flex items-center justify-between">
           {isEmergency && (
             <div className="flex flex-col items-start gap-1">
               <div className={cn(
                 "flex items-center gap-2 px-3 py-1 rounded-full border backdrop-blur-md transition-colors",
                 currentSlide % prismaticColors.length === 4 ? "bg-card/10 border-black/20" : "bg-card/20 border-border/30"
               )}>
                 <Wind size={14} className="animate-bounce" />
                 <span className="text-[10px] font-black uppercase tracking-widest">{t.emergencyHeader}</span>
               </div>
               <p className="text-[8px] font-bold opacity-60 uppercase tracking-widest ml-2">{t.emergencySub}</p>
             </div>
           )}
           <button onClick={onClose} className={cn(
             "p-3 rounded-full border transition-all backdrop-blur-md",
             currentSlide % prismaticColors.length === 4 ? "bg-card/5 border-black/10 text-black/40 hover:text-black" : "bg-card/10 border-border/20 text-white/60 hover:text-white"
           )}>
             <X size={20} />
           </button>
        </header>

        <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-8 text-center gap-12">
          <div 
            className="transition-all duration-1000 transform"
            style={{ 
              opacity: isFading ? 0 : 1,
              transform: isFading ? 'translateY(20px)' : 'translateY(0px)'
            }}
          >
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter drop-shadow-2xl leading-tight max-w-lg mx-auto">
              {t.affirmations[currentSlide]}
            </h2>
          </div>

          {isEmergency && (
            <div className="w-full flex flex-col items-center justify-center gap-12 relative min-h-[120px] scale-90 md:scale-100">
               <div className="absolute text-2xl md:text-3xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center drop-shadow-lg">
                 <div className="flex">{renderLetters(t.inhale, 0)}</div>
               </div>
               <div className="absolute text-2xl md:text-3xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center drop-shadow-lg">
                 <div className="flex">{renderLetters(t.exhale, 4)}</div>
               </div>
            </div>
          )}
        </div>

        <footer className="relative z-10 p-12 flex flex-col items-center gap-6 pb-safe">
          <div className="flex gap-2">
            {t.affirmations.map((_, i) => (
              <div key={i} className={cn(
                "h-1.5 rounded-full transition-all duration-500", 
                i === currentSlide ? "w-8 bg-current" : "w-1.5 bg-current opacity-20"
              )} />
            ))}
          </div>
          <div className="flex flex-col gap-3 w-full max-w-sm">
            {!isEmergency && (
              <button 
                onClick={() => { playHeartbeat(); router.push('/self-care'); }}
                className={cn(
                  "w-full py-5 rounded-full font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl",
                  currentSlide % prismaticColors.length === 4 ? "bg-card text-white" : "bg-card text-[#f43f5e]"
                )}
              >
                {t.next} <ArrowRight size={14} />
              </button>
            )}
            <button 
              onClick={() => { playHeartbeat(); onClose(); }}
              className={cn(
                "px-8 py-4 rounded-full border backdrop-blur-md font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all",
                currentSlide % prismaticColors.length === 4 ? "border-black/20 bg-card/5 text-black" : "border-border/20 bg-card/40 text-white"
              )}
            >
              {t.return}
            </button>
          </div>
          <p className={cn("text-[8px] font-black uppercase tracking-[0.5em] shining-white mt-4")}>Created in harmony</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-card z-[6000] flex flex-col items-center justify-center px-8 text-center font-headline animate-in slide-in-from-bottom-4 duration-700 pb-safe pt-safe overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-rose-500/10 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-card/5 rounded-full border border-border/10 text-white/40 hover:text-white transition-all z-10"
      >
        <X size={20} />
      </button>

      <div className="relative z-10 space-y-12 max-w-md">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-rose-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-32 h-32 bg-rose-500/10 border-2 border-rose-500/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl">
            <Eye size={48} className="text-rose-500 animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {t.title}
          </h1>
          <p className="text-rose-400 text-sm font-bold uppercase tracking-widest leading-relaxed max-w-[300px] mx-auto italic">
            {t.sub}
          </p>
        </div>

        <div className="bg-card/5 border border-border/10 rounded-[2.5rem] p-8">
          <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.4em]">
            "{t.intro}"
          </p>
        </div>

        <button 
          onClick={() => { playHeartbeat(); setMode('beauty'); }}
          className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl uppercase tracking-widest active:scale-95 shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-4"
        >
          {t.button}
          <Wind size={24} />
        </button>
      </div>

      <footer className="absolute bottom-12 text-center w-full">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}

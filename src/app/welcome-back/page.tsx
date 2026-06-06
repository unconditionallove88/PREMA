
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Heart } from 'lucide-react';

/**
 * @fileOverview Welcome Back Calibration Page.
 * Visuals refined for subtle influence and "Inside Out" vision.
 * Updated: Removed "safety" terminology.
 */

export default function WelcomeBack() {
  const router = useRouter();
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const handleLangChange = (newLang: 'EN' | 'DE') => {
    setLang(newLang);
    localStorage.setItem('stayonbeat_lang', newLang);
  };

  const content = {
    EN: {
      title: "HEY, NICE TO",
      highlight: "SEE YOU AGAIN",
      subtitle: "YOUR RESONANCE PROFILE IS READY LET’S GET YOU CALIBRATED",
      button: "Enter"
    },
    DE: {
      title: "HEY, SCHÖN DICH",
      highlight: "WIEDERZUSEHEN",
      subtitle: "DEIN RESONANZ-PROFIL IST BEREIT SCHÜTZEN WIR DICH",
      button: "ZUM DASHBOARD GEHEN"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col items-center pt-10 px-6 overflow-y-auto font-headline text-center relative overflow-hidden">
      {/* Subtle Resonance Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      
      {/* Language Toggle */}
      <div className="flex items-center gap-4 bg-card/90 backdrop-blur-md px-6 py-2 rounded-full border border-border z-50 mb-10">
        <button 
          onClick={() => handleLangChange('EN')}
          className={`text-[10px] font-semibold tracking-[0.3em] transition-all ${lang === 'EN' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          EN
        </button>
        <span className="text-border font-semibold">|</span>
        <button 
          onClick={() => handleLangChange('DE')}
          className={`text-[10px] font-semibold tracking-[0.3em] transition-all ${lang === 'DE' ? 'text-primary' : 'text-muted-foreground'}`}
        >
          DE
        </button>
      </div>

      <div className="w-full max-w-xl flex flex-col items-center gap-10 py-10 relative z-10">
        <div className="h-[180px] w-full flex items-center justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-radiate-out" />
            <Heart size={80} fill="hsl(var(--primary))" className="text-primary animate-pulse-heart relative z-10" />
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-[28px] font-semibold uppercase tracking-normal leading-tight text-foreground">
            {content[lang].title} <br/>
            <span className="text-primary">{content[lang].highlight}</span>
          </h1>
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground leading-tight max-w-[280px] mx-auto">
            {content[lang].subtitle}
          </p>
        </div>

        <div className="flex flex-col gap-6 w-full max-w-md pt-4">
          <button 
            onClick={() => router.push('/dashboard')}
            className="pill-button w-full bg-primary text-primary-foreground text-xl font-semibold uppercase tracking-widest active:scale-95 transition-all shadow-soft h-[72px]"
          >
            {content[lang].button}
          </button>
          
          <div className="flex items-center justify-center gap-3 text-muted-foreground">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Resonance Protocol v2.5</span>
          </div>
        </div>
      </div>
    </main>
  );
}

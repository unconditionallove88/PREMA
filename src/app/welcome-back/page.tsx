
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
  const [orbFocused, setOrbFocused] = useState(false);
  const [orbHovered, setOrbHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = localStorage.getItem('prema_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const handleLangChange = (newLang: 'EN' | 'DE') => {
    setLang(newLang);
    localStorage.setItem('prema_lang', newLang);
  };

  const handleOrbActivate = () => {
    router.push('/dashboard');
  };

  const handleOrbKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleOrbActivate();
    }
  };

  const content = {
    EN: {
      title: "HEY, NICE TO",
      highlight: "SEE YOU AGAIN",
      subtitle: "YOUR RESONANCE PROFILE IS READY LET’S GET YOU CALIBRATED",
      helper: "Touch to begin"
    },
    DE: {
      title: "HEY, SCHÖN DICH",
      highlight: "WIEDERZUSEHEN",
      subtitle: "DEIN RESONANZ-PROFIL IST BEREIT SCHÜTZEN WIR DICH",
      helper: "ZUM STARTEN BERÜHREN"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col items-center pt-10 px-6 overflow-y-auto font-headline text-center relative overflow-hidden">
      {/* Subtle Intention Glows */}
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
        {/* Interactive Orb - Primary CTA */}
        <div className="h-[240px] w-full flex flex-col items-center justify-center">
          <button
            onClick={handleOrbActivate}
            onKeyDown={handleOrbKeyDown}
            onFocus={() => setOrbFocused(true)}
            onBlur={() => setOrbFocused(false)}
            onMouseEnter={() => setOrbHovered(true)}
            onMouseLeave={() => setOrbHovered(false)}
            tabIndex={0}
            className="relative focus:outline-none group"
            aria-label="Enter dashboard"
          >
            {/* Pulsing Rings - Enhanced with hover state */}
            <div className={`absolute inset-0 rounded-full transition-all duration-500 ${
              orbHovered || orbFocused ? 'bg-primary/30' : 'bg-primary/15'
            } blur-3xl animate-radiate-out`} />
            
            {/* Additional focus ring */}
            {(orbFocused || orbHovered) && (
              <div className="absolute inset-0 rounded-full border-2 border-primary/40 animate-pulse" />
            )}
            
            {/* Core orb */}
            <div className={`relative z-10 transition-all duration-300 ${
              orbHovered || orbFocused ? 'scale-110' : 'scale-100'
            }`}>
              <Heart 
                size={80} 
                fill="hsl(var(--primary))" 
                className={`text-primary ${
                  orbHovered || orbFocused 
                    ? 'animate-pulse-heart drop-shadow-lg' 
                    : 'animate-pulse-heart'
                }`}
                style={orbHovered || orbFocused ? {
                  filter: 'drop-shadow(0 0 25px hsl(var(--primary)))'
                } : {
                  filter: 'drop-shadow(0 0 15px hsl(var(--primary)))'
                }}
              />
            </div>
          </button>
          
          {/* Helper Text - Appears below orb */}
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mt-6 animate-pulse">
            {content[lang].helper}
          </p>
        </div>

        {/* Text Content - Below the Orb */}
        <div className="space-y-4">
          <h1 className="text-[28px] font-semibold uppercase tracking-normal leading-tight text-foreground">
            {content[lang].title} <br/>
            <span className="text-primary">{content[lang].highlight}</span>
          </h1>
          <p className="text-base font-semibold uppercase tracking-widest text-muted-foreground leading-tight max-w-[280px] mx-auto">
            {content[lang].subtitle}
          </p>
        </div>

        {/* Protocol Info */}
        <div className="flex items-center justify-center gap-3 text-muted-foreground">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Intention Protocol v2.5</span>
        </div>
      </div>
    </main>
  );
}

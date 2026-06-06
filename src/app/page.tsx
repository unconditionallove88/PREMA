
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Prema Landing (Entrance).
 * Languages: en (lowercase), de (lowercase).
 * Updated: single entry CTA and warm dawn branding.
 * Shining white footer applied.
 */

export default function Home() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = typeof window !== 'undefined' ? localStorage.getItem('stayonbeat_lang') : 'en';
    if (['en', 'de'].includes(savedLang?.toLowerCase() as string)) setLang(savedLang?.toLowerCase() as any);
  }, []);

  const handleLangChange = (newLang: 'en' | 'de') => {
    setLang(newLang);
    localStorage.setItem('stayonbeat_lang', newLang);
  };

  const content = {
    en: {
      slogan: "You are safe, you are loved",
      getStarted: "Enter",
      footer: "Created in harmony"
    },
    de: {
      slogan: "Du bist sicher, du bist geliebt",
      getStarted: "Enter",
      footer: "Mit Anmut geschaffen"
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-background text-foreground flex flex-col items-center justify-between py-12 px-6 overflow-y-auto font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/10 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      {/* Language Toggle */}
      <div className="flex items-center gap-4 bg-card/80 backdrop-blur-md px-6 py-2.5 rounded-full border border-border z-50 shrink-0 shadow-soft overflow-x-auto max-w-full no-scrollbar">
        {['en', 'de'].map((l, i) => (
          <div key={l} className="flex items-center gap-4">
            <button onClick={() => handleLangChange(l as any)} className={cn("text-[10px] font-semibold tracking-[0.3em] transition-all uppercase whitespace-nowrap", lang === l ? 'text-primary' : 'text-muted-foreground')}>{l}</button>
            {i < 1 && <span className="text-border font-semibold">|</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl text-center flex-1 justify-center py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            <div className="w-32 h-32 bg-primary/15 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_50px_rgba(245,169,133,0.18)] relative z-10">
              <Heart 
                size={64} 
                fill="#F5B38B" 
                className="text-[#F5B38B] animate-pulse-heart" 
                style={{ filter: 'blur(12px) drop-shadow(0 0 10px rgba(245,179,141,0.55))' }} 
              />
            </div>
          </div>
          <h1 className="mt-10 text-5xl md:text-7xl font-semibold tracking-normal leading-none text-foreground text-center">PREMA</h1>
          <p className="text-primary font-semibold mt-4 tracking-[0.12em] uppercase text-[10px] italic opacity-90">{content[lang].slogan}</p>
        </div>
        
        {/* Circular Entry Portals */}
        <div className="w-full max-w-xs mx-auto">
          <button 
            onClick={() => router.push('/auth?mode=signin')} 
            className="w-full h-20 rounded-[2.5rem] bg-primary text-primary-foreground border border-primary/30 backdrop-blur-md shadow-soft transition-all hover:scale-[1.01] active:scale-[0.98] uppercase tracking-[0.2em] text-base font-semibold"
          >
            {content[lang].getStarted}
          </button>
        </div>
      </div>

      <footer className="w-full text-center mt-12 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] mb-2 shining-white">
          {content[lang].footer}
        </p>
        <div className="w-8 h-1 bg-primary/20 rounded-full mx-auto" />
      </footer>
    </main>
  );
}

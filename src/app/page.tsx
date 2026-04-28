
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview High-Fidelity Landing Sanctuary (Entrance).
 * Languages: en (lowercase), de (lowercase).
 * Updated: Circular entry tabs and integrated slogans.
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
      slogan: "Love is everywhere", 
      getStarted: "Join the Circle", 
      signIn: "Welcome Home Soul", 
      footer: "Created in harmony" 
    },
    de: { 
      slogan: "Liebe ist überall hier", 
      getStarted: "Werde Teil des Kreises", 
      signIn: "Willkommen Zuhause heute hier", 
      footer: "In Harmonie erschaffen hier" 
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen w-full bg-black text-white flex flex-col items-center justify-between py-12 px-6 overflow-y-auto font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none animate-pulse" />

      {/* Language Toggle */}
      <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/10 z-50 shrink-0 shadow-2xl overflow-x-auto max-w-full no-scrollbar">
        {['en', 'de'].map((l, i) => (
          <div key={l} className="flex items-center gap-4">
            <button onClick={() => handleLangChange(l as any)} className={cn("text-[10px] font-black tracking-[0.3em] transition-all uppercase whitespace-nowrap", lang === l ? 'text-primary' : 'text-white/40')}>{l}</button>
            {i < 1 && <span className="text-white/10 font-black">|</span>}
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center w-full max-w-2xl text-center flex-1 justify-center py-12 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="flex flex-col items-center justify-center mb-16">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 w-48 h-48 bg-primary/10 blur-[80px] rounded-full" />
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20 shadow-[0_0_50px_rgba(27,77,62,0.15)] relative z-10">
              <Heart 
                size={64} 
                fill="#10B981" 
                className="text-[#10B981] animate-pulse-heart" 
                style={{ filter: 'blur(12px) drop-shadow(0 0 10px #10B981)' }} 
              />
            </div>
          </div>
          <h1 className="mt-10 text-5xl md:text-7xl font-black tracking-tighter uppercase leading-none text-white text-center">STAY<span className="text-primary">ON</span>BEAT</h1>
          <p className="text-primary font-bold mt-4 tracking-[0.3em] uppercase text-[10px] italic opacity-80">{content[lang].slogan}</p>
        </div>
        
        {/* Circular Entry Portals */}
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center">
          <button 
            onClick={() => router.push('/auth?mode=signup')} 
            className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-[#1b4d3e] text-white flex flex-col items-center justify-center gap-3 p-6 group transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(27,77,62,0.2)] border-2 border-primary/20 relative"
          >
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl group-hover:bg-primary/20 transition-all" />
            <span className="text-lg md:text-xl font-black uppercase tracking-tight leading-none z-10 max-w-[120px]">
              {content[lang].getStarted}
            </span>
          </button>

          <button 
            onClick={() => router.push('/auth?mode=signin')} 
            className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-white/[0.03] backdrop-blur-sm border-2 border-primary/20 text-primary flex flex-col items-center justify-center gap-3 p-6 group transition-all hover:scale-105 active:scale-95 shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-white/5 rounded-full transition-all group-hover:bg-white/10" />
            <span className="text-sm md:text-base font-black uppercase tracking-widest leading-tight z-10 max-w-[120px]">
              {content[lang].signIn}
            </span>
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

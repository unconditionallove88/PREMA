
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { ArrowRight, HeartHandshake } from 'lucide-react';

/**
 * @fileOverview Breath of Love (Pure Intention Ritual).
 * Updated: Integrated into the recovery grounding sequence.
 */

const CONTENT = {
  en: {
    inhale: "Breathe In Love",
    exhale: "Breathe Out Love",
    button: "Return to Home",
    next: "Circle of Love (Support)"
  },
  de: {
    inhale: "Atme sanft Liebe ein",
    exhale: "Atme sanft Liebe aus",
    button: "Zum Zuhause zurückkehren",
    next: "Circle of Love (Halt)"
  }
};

export default function SelfCare() {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

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

  return (
    <main className="h-screen w-full bg-primary/20 text-white flex flex-col font-headline relative overflow-hidden pt-safe pb-safe">
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full text-center space-y-12">
          <div className="flex items-center justify-center gap-12 relative min-h-[120px]">
            {/* Inhale - Starts at 0s of 8s cycle */}
            <div className="absolute text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center">
              <div className="flex">
                {renderLetters(t.inhale, 0)}
              </div>
            </div>
            
            {/* Exhale - Starts at 4s of 8s cycle */}
            <div className="absolute text-4xl md:text-6xl font-black uppercase tracking-tighter flex whitespace-nowrap justify-center items-center">
              <div className="flex">
                {renderLetters(t.exhale, 4)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="p-12 flex flex-col items-center justify-center shrink-0 pb-16 gap-4">
        <button 
          onClick={() => { playHeartbeat(); router.push('/heart-status'); }}
          className="w-full max-w-sm py-5 bg-card text-black rounded-full font-black uppercase text-[10px] tracking-[0.4em] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-2xl"
        >
          <HeartHandshake size={18} /> {t.next} <ArrowRight size={14} />
        </button>
        <button 
          onClick={() => { playHeartbeat(); router.push('/dashboard'); }}
          className="px-8 py-3 rounded-full border border-border/10 bg-card/5 backdrop-blur-md transition-all active:scale-95 group hover:bg-card/10"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white transition-colors">
            {t.button}
          </span>
        </button>
      </footer>
    </main>
  );
}

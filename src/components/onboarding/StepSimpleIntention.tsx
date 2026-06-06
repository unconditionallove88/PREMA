
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Heart, ShieldCheck, UserCheck, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Simplified Intention Calibration.
 * A psychological asking of the user's focus.
 * Languages: en (3 words), de (4 words).
 */

const OPTIONS = [
  { 
    id: 'respect', 
    icon: UserCheck, 
    label: "Cultivate self respect", 
    de: "Selbstrespekt jetzt tief kultivieren", 
    color: "text-blue-400", 
    bg: "bg-blue-500/5",
    border: "border-blue-500/20"
  },
  { 
    id: 'love', 
    icon: Heart, 
    label: "Feel love", 
    de: "Liebe heute fühlen", 
    color: "text-rose-400", 
    bg: "bg-rose-500/5",
    border: "border-rose-500/20"
  },
  { 
    id: 'honesty', 
    icon: ShieldCheck, 
    label: "Practice absolute honesty", 
    de: "Absolute Ehrlichkeit heute praktizieren", 
    color: "text-primary", 
    bg: "bg-primary/5",
    border: "border-primary/20"
  }
];

const UI = {
  en: { header: 'The Intention', sub: 'What is your focus?', confirm: 'Seal my intention', footer: 'Created in harmony' },
  de: { header: 'Die Intention heute', sub: 'Was ist dein Fokus?', confirm: 'Intention jetzt versiegeln heute', footer: 'In Harmonie erschaffen heute hier' }
};

export function StepSimpleIntention({ onComplete, onBack }: { onComplete: (id: string) => void, onBack?: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.en;

  const handleSelect = (id: string) => {
    playHeartbeat();
    setSelected(id);
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-6 text-center relative pt-safe pb-safe">
      {onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="mt-12 mb-10">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Sparkles size={28} className="text-primary animate-pulse" />
        </div>
        <h2 className="text-[28px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px]">{t.sub}</p>
      </div>

      <div className="w-full space-y-4 mb-12">
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => handleSelect(opt.id)}
              className={cn(
                "w-full p-8 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left",
                isActive ? `${opt.bg} border-primary shadow-2xl` : "bg-card border-border/5 hover:border-border/10"
              )}
            >
              <div className={cn("p-4 rounded-2xl", isActive ? "bg-card/10 text-white" : "bg-card/5 text-white/20")}>
                <Icon size={28} />
              </div>
              <span className={cn("font-black text-lg uppercase tracking-tight leading-tight", isActive ? "text-white" : "text-white/40")}>
                {lang === 'en' ? opt.label : opt.de}
              </span>
            </button>
          );
        })}
      </div>

      <div className="w-full space-y-8 shrink-0">
        <button 
          onClick={() => selected && onComplete(selected)} 
          disabled={!selected} 
          className={cn(
            "pill-button w-full h-20 text-xl font-black uppercase tracking-widest transition-all shadow-lg",
            selected ? 'bg-primary text-white' : 'bg-card/5 text-white/10 cursor-not-allowed border border-border/5'
          )}
        >
          {t.confirm}
        </button>
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">
          {t.footer}
        </p>
      </div>
    </div>
  );
}

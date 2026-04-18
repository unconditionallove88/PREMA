"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview "Something to Remember" (Safety Protocol Step).
 * Updated: Added common opioids to the mixing wisdom guide.
 * Languages: Unified to lowercase en/de.
 */

const MIXING_WISDOM = [
  { s1: 'Alcohol', s2: 'GHB/GBL', risk: 'Critical', color: 'text-red-500', note: 'Extreme respiratory failure risk', deNote: 'Extremes Risiko Atemstillstand' },
  { s1: 'Alcohol', s2: 'Opioids (Heroin/Oxy)', risk: 'Critical', color: 'text-red-500', note: 'Lethal respiratory depression risk', deNote: 'Tödliches Risiko Atemstillstand' },
  { s1: 'MDMA', s2: 'SSRIs', risk: 'High', color: 'text-red-400', note: 'Serotonin syndrome risk', deNote: 'Risiko Serotonin-Syndrom' },
  { s1: 'Benzos', s2: 'Opioids', risk: 'Critical', color: 'text-red-500', note: 'Fatal overdose and blackout risk', deNote: 'Extremes Risiko Überdosis' },
  { s1: 'Alcohol', s2: 'Ketamine', risk: 'High', color: 'text-red-400', note: 'Severe nausea and choking risk', deNote: 'Übelkeit und Erstickungsgefahr' },
  { s1: 'Cocaine', s2: 'Alcohol', risk: 'Moderate', color: 'text-amber-500', note: 'Increased cardiotoxicity', deNote: 'Erhöhte Herztoxizität' },
  { s1: 'Speed', s2: 'MDMA', risk: 'Moderate', color: 'text-amber-500', note: 'Extreme heart strain', deNote: 'Extreme Herzbelastung' },
  { s1: 'LSD', s2: 'Cannabis', risk: 'Moderate', color: 'text-amber-500', note: 'Intense thought loops', deNote: 'Intensive Gedankenschleifen' },
  { s1: 'Benzos', s2: 'Alcohol', risk: 'Critical', color: 'text-red-500', note: 'Fatal blackouts and overdose', deNote: 'Tödliche Blackouts möglich' },
  { s1: 'Poppers', s2: 'Viagra', risk: 'Critical', color: 'text-red-500', note: 'Fatal blood pressure drop', deNote: 'Tödlicher Blutdruckabfall' },
  { s1: 'Cocaine', s2: 'MDMA', risk: 'Moderate', color: 'text-amber-500', note: 'Masks MDMA, heart strain', deNote: 'Maskiert MDMA Wirkung' },
  { s1: 'Ketamine', s2: 'GHB/GBL', risk: 'Critical', color: 'text-red-500', note: 'Severe respiratory risk', deNote: 'Schwere Atemnot Gefahr' },
];

const UI = {
  en: {
    header: "Something to remember", sub: "Wisdom for your journey", wisdom: "Mixing Wisdom Guide",
    acknowledge: "I take full responsibility for my actions", confirm: "Set sanctuary wisdom", created: "Created in harmony"
  },
  de: {
    header: "Etwas zum Erinnern heute", sub: "Weisheit für deine Reise", wisdom: "Misch-Weisheiten Guide",
    acknowledge: "Ich übernehme volle Verantwortung", confirm: "Weisheit jetzt setzen hier", created: "In Harmonie erschaffen hier"
  }
};

export function StepSomethingToRemember({ onComplete, onBack, isStandAlone = false }: { onComplete: (data: any) => void, onBack?: () => void, isStandAlone?: boolean }) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [acknowledged, setAcknowledge] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.en;

  return (
    <div className="w-full h-full flex flex-col font-headline bg-black relative animate-in fade-in duration-700 overflow-x-hidden">
      {!isStandAlone && onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-[100] pt-4">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className={cn("px-6 shrink-0 text-center", isStandAlone ? "pt-4" : "pt-16")}>
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-6">{t.sub}</p>
      </div>

      <ScrollArea className="flex-1 px-6">
        <div className="space-y-8 pb-40">
          <section className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.wisdom}</h3>
              <Info size={12} className="text-primary/40" />
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {MIXING_WISDOM.map((row, i) => (
                <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-primary/30 group w-full overflow-hidden">
                  <div className="flex justify-between items-start gap-4">
                    <span className="text-xs font-black text-white/90 uppercase tracking-tight flex-1 break-words">{row.s1} + {row.s2}</span>
                    <span className={cn("text-[8px] font-black uppercase px-2 py-1 rounded-md bg-white/5 shrink-0", row.color)}>
                      {row.risk}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-relaxed">
                    {lang === 'de' ? row.deNote : row.note}
                  </p>
                </div>
              ))}
            </div>
            
            {!isStandAlone && (
              <button 
                onClick={() => setAcknowledge(!acknowledged)}
                className={cn(
                  "w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] shadow-lg",
                  acknowledged ? "bg-primary/10 border-primary" : "bg-white/5 border-white/10"
                )}
              >
                <div className={cn(
                  "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                  acknowledged ? "bg-primary border-primary shadow-[0_0_10px_rgba(27,77,62,0.5)]" : "border-white/20"
                )}>
                  {acknowledged && <Check className="w-3.5 h-3.5 text-white" />}
                </div>
                <span className={cn("text-[10px] font-black uppercase tracking-widest text-left", acknowledged ? "text-primary" : "text-white/40")}>
                  {t.acknowledge}
                </span>
              </button>
            )}
          </section>

          <div className="pt-4 text-center opacity-20">
            <p className="text-[10px] font-black text-white uppercase tracking-[0.5em]">{t.created}</p>
          </div>
        </div>
      </ScrollArea>

      {!isStandAlone && (
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-12 pointer-events-none pb-safe">
          <button 
            onClick={() => onComplete({ acknowledged })} 
            disabled={!acknowledged}
            className={cn(
              "pointer-events-auto w-full max-w-sm mx-auto h-20 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3",
              acknowledged ? 'bg-[#1b4d3e] text-white neon-glow active:scale-95' : 'bg-white/10 text-white/10 border-2 border-white/5 cursor-not-allowed opacity-50'
            )}
          >
            {t.confirm}
          </button>
        </div>
      )}
    </div>
  );
}

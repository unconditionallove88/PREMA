
"use client"

import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft } from 'lucide-react';

const SECTIONS = {
  EN: [
    {
      title: 'General health',
      items: [
        { id: 'heart', emoji: '❤️', label: 'Heart / blood pressure' },
        { id: 'epilepsy', emoji: '🧠', label: 'Epilepsy' },
        { id: 'asthma', emoji: '🫁', label: 'Asthma' },
        { id: 'migraines', emoji: '🤕', label: 'Migraines' },
      ],
    },
    {
      title: 'Mental health',
      items: [
        { id: 'adhd', emoji: '🧠', label: 'ADHD' },
        { id: 'anxiety', emoji: '😟', label: 'Anxiety' },
        { id: 'depression', emoji: '😔', label: 'Depression' },
        { id: 'ptsd', emoji: '😰', label: 'PTSD' },
        { id: 'bipolar', emoji: '🎭', label: 'Bipolar disorder' },
        { id: 'schizophrenia', emoji: '👥', label: 'Schizophrenia' },
      ],
    },
    {
      title: 'Chronic & organs',
      items: [
        { id: 'diabetes', emoji: '🩸', label: 'Diabetes' },
        { id: 'liver', emoji: '🧼', label: 'Liver issues' },
        { id: 'kidney', emoji: '💧', label: 'Kidney issues' },
        { id: 'chronic-pain', emoji: '💊', label: 'Chronic pain' },
      ],
    },
  ],
  DE: [
    {
      title: 'Allgemeine Gesundheit',
      items: [
        { id: 'heart', emoji: '❤️', label: 'Herz / Blutdruck' },
        { id: 'epilepsy', emoji: '🧠', label: 'Epilepsie' },
        { id: 'asthma', emoji: '🫁', label: 'Asthma' },
        { id: 'migraines', emoji: '🤕', label: 'Migräne' },
      ],
    },
    {
      title: 'Psychische Gesundheit',
      items: [
        { id: 'adhd', emoji: '🧠', label: 'ADHS' },
        { id: 'anxiety', emoji: '😟', label: 'Angststörung' },
        { id: 'depression', emoji: '😔', label: 'Depression' },
        { id: 'ptsd', emoji: '😰', label: 'PTBS' },
        { id: 'bipolar', emoji: '🎭', label: 'Bipolare Störung' },
        { id: 'schizophrenia', emoji: '👥', label: 'Schizophrenie' },
      ],
    },
    {
      title: 'Chronisch & Organe',
      items: [
        { id: 'diabetes', emoji: '🩸', label: 'Diabetes' },
        { id: 'liver', emoji: '🧼', label: 'Leberprobleme' },
        { id: 'kidney', emoji: '💧', label: 'Nierenprobleme' },
        { id: 'chronic-pain', emoji: '💊', label: 'Chronische Schmerzen' },
      ],
    },
  ]
};

export function Step3SafetyShields({ 
  selected, 
  onComplete,
  onBack
}: { 
  selected: string[], 
  onComplete: (conditions: string[]) => void,
  onBack?: () => void
}) {
  const [current, setCurrent] = useState<string[]>(selected);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');

  useEffect(() => {
    const savedLang = localStorage.getItem('stayonbeat_lang');
    if (savedLang === 'DE' || savedLang === 'EN') {
      setLang(savedLang as 'EN' | 'DE');
    }
  }, []);

  const toggle = (id: string) => {
    if (id === 'none') {
      setCurrent(['none']);
      return;
    }

    setCurrent(prev => {
      const filtered = prev.filter(x => x !== 'none');
      if (filtered.includes(id)) {
        return filtered.filter(x => x !== id);
      }
      return [...filtered, id];
    });
  };

  const isNoneSelected = current.includes('none');

  const content = {
    EN: {
      header: 'Health conditions',
      sub: 'Pre-existing conditions disclosure',
      none: 'None of these apply',
      confirm: 'Continue',
    },
    DE: {
      header: 'Gesundheitszustand',
      sub: 'Offenlegung von Vorerkrankungen',
      none: 'Nichts davon trifft zu',
      confirm: 'Weiter',
    }
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="mt-12 mb-8">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">
          {content[lang].header}
        </h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">
          {content[lang].sub}
        </p>
      </div>

      <div className="flex-1 w-full overflow-y-auto max-h-[50vh] custom-scrollbar pr-2 mb-8 space-y-6">
        {SECTIONS[lang].map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30 px-1 text-left">
              {section.title}
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {section.items.map((item) => {
                const isActive = current.includes(item.id);
                return (
                  <div 
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`flex items-center justify-between p-4 rounded-xl border transition-all h-[72px] cursor-pointer ${
                      isActive 
                        ? 'bg-card border-secondary/50' 
                        : 'bg-card border-border/10 hover:border-border/20'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl">{item.emoji}</span>
                      <span className={`font-black text-xs uppercase tracking-tight ${isActive ? 'text-secondary' : 'text-white/70'}`}>
                        {item.label}
                      </span>
                    </div>
                    
                    <div className="flex items-center bg-card/5 px-4 py-2 rounded-xl border border-border/10 pointer-events-none">
                      <Switch 
                        checked={isActive}
                        className="data-[state=checked]:bg-secondary"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-4 items-center shrink-0">
        <button
          onClick={() => toggle('none')}
          className={`w-full p-5 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all h-[64px] ${
            isNoneSelected
              ? 'bg-secondary/10 border-secondary text-secondary neon-glow'
              : 'bg-card border-border/10 text-white/30'
          }`}
        >
          {content[lang].none}
        </button>

        <button
          onClick={() => onComplete(current)}
          disabled={current.length === 0}
          className={`pill-button w-full max-w-sm h-[64px] uppercase tracking-[0.2em] font-black text-xl transition-all ${
            current.length > 0
              ? 'bg-secondary text-black neon-glow active:scale-95'
              : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5 opacity-50'
          }`}
        >
          {content[lang].confirm}
        </button>
      </div>
    </div>
  );
}

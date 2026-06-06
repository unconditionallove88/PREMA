
"use client"

import { useState } from 'react';

const MEDS = [
  { id: 'ssri', emoji: '💊', label: 'SSRIs', desc: 'e.g. Sertraline, Fluoxetine, Escitalopram' },
  { id: 'snri', emoji: '🧪', label: 'SNRIs', desc: 'e.g. Venlafaxine, Duloxetine' },
  { id: 'adhd', emoji: '🧠', label: 'ADHD MEDS', desc: 'e.g. Ritalin, Vyvanse, Concerta' },
  { id: 'benzo', emoji: '💤', label: 'BENZOS', desc: 'e.g. Xanax, Valium, Diazepam' },
  { id: 'antipsychotic', emoji: '🧬', label: 'ANTIPSYCHOTICS', desc: 'e.g. Quetiapine, Olanzapine' },
  { id: 'maoi', emoji: '⚠️', label: 'MAOIs', desc: 'e.g. Rare/Older Antidepressants' },
];

export function Step3Medications({ selected, onComplete }: { selected: string[], onComplete: (meds: string[]) => void }) {
  const [current, setCurrent] = useState<string[]>(selected);

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

  return (
    <div className="w-full flex flex-col items-center max-w-2xl">
      <div className="text-center mb-12">
        <h2 className="font-headline text-5xl font-black uppercase mb-4 text-white tracking-tighter">
          HEALTH PROFILE
        </h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-sm">
          SELECT ANY MEDICATIONS YOU ARE CURRENTLY TAKING
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full mb-4">
        {MEDS.map((med) => {
          const isActive = current.includes(med.id);
          return (
            <button
              key={med.id}
              onClick={() => toggle(med.id)}
              className={`p-8 rounded-[2rem] border-2 text-left transition-all duration-300 flex flex-col gap-3 group ${
                isActive 
                  ? 'bg-secondary/10 border-secondary shadow-[0_0_25px_rgba(57,255,20,0.3)]' 
                  : 'bg-card border-border/10 hover:border-border/30'
              }`}
            >
              <span className="text-3xl mb-2">{med.emoji}</span>
              <span className={`font-headline font-black text-xl uppercase tracking-tight ${isActive ? 'text-secondary' : 'text-white'}`}>
                {med.label}
              </span>
              <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest leading-tight">
                {med.desc}
              </span>
            </button>
          );
        })}
      </div>

      <button
        onClick={() => toggle('none')}
        className={`w-full p-8 rounded-[2rem] border-2 text-center transition-all duration-300 mb-12 ${
          current.includes('none')
            ? 'bg-secondary/10 border-secondary shadow-[0_0_25px_rgba(62,180,137,0.3)]'
            : 'bg-card border-border/10 hover:border-border/30'
        }`}
      >
        <span className={`font-headline font-black text-xl uppercase tracking-[0.2em] ${current.includes('none') ? 'text-secondary' : 'text-white/40'}`}>
          NONE OF THE ABOVE / NONE OF THESE
        </span>
      </button>

      <button
        onClick={() => onComplete(current)}
        disabled={current.length === 0}
        className={`pill-button w-full max-w-sm py-8 text-2xl font-black uppercase tracking-[0.2em] transition-all ${
          current.length > 0
            ? 'bg-secondary text-black neon-glow active:scale-95'
            : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5'
        }`}
      >
        NEXT STEP
      </button>
    </div>
  );
}

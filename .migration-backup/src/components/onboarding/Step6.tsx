"use client"

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

const ITEMS = [
  'Water Bottle (Filled)',
  'Earplugs / Protection',
  'ID / Identification',
  'Emergency Contact Saved',
  'Powerbank / Charged Phone',
  'Light Snacks / Fuel',
  'Tissues / Hygiene',
];

export function Step6GearCheck({ onComplete }: { onComplete: () => void }) {
  const [checked, setChecked] = useState<string[]>([]);

  const toggle = (item: string) => {
    setChecked(prev => 
      prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]
    );
  };

  const streakBoost = checked.length >= 5;

  return (
    <div className="w-full flex flex-col relative">
      <div className="absolute -top-16 right-0">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${streakBoost ? 'bg-secondary/20 border-secondary text-secondary neon-glow' : 'bg-card/5 border-border/10 text-white/40'}`}>
          <span className="text-xl">🔥</span>
          <span className="font-headline font-bold uppercase text-xs tracking-tighter">Safety Streak</span>
        </div>
      </div>

      <h2 className="font-headline text-4xl font-bold uppercase mb-4">Essentials</h2>
      <p className="text-white/50 mb-12 text-sm uppercase tracking-widest">Check 5+ items to boost your Safety Streak!</p>

      <div className="space-y-4 mb-12">
        {ITEMS.map((item) => (
          <div 
            key={item} 
            className={`p-5 rounded-2xl border flex items-center gap-4 transition-all cursor-pointer ${
              checked.includes(item) ? 'bg-secondary/10 border-secondary/50' : 'bg-card border-border/10'
            }`}
            onClick={() => toggle(item)}
          >
            <Checkbox 
              checked={checked.includes(item)}
              className="w-6 h-6 border-border/20 data-[state=checked]:bg-secondary data-[state=checked]:text-black"
            />
            <Label className="font-headline font-bold uppercase tracking-wide text-sm cursor-pointer flex-1">
              {item}
            </Label>
          </div>
        ))}
      </div>

      <button
        onClick={onComplete}
        className="pill-button w-full bg-secondary text-black text-lg neon-glow font-headline uppercase tracking-wide"
      >
        I'M READY
      </button>
    </div>
  );
}

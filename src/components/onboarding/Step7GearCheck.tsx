"use client"

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Flame, Check, ArrowLeft } from 'lucide-react';

/**
 * @fileOverview Essentials step.
 * Action color: hsl(var(--primary))
 * Languages: EN, DE, PT.
 */

const ITEMS_CONTENT = {
  EN: ['Enough sleep or rest', 'Drink enough water', 'Take electrolytes', 'Healthy snacks', 'Sunglasses', 'Gum', 'Fidget toys', 'Earplugs', 'Vitamins', 'Comfy shoes', 'Tissues', 'Power bank and cable', 'ID and cash or card', 'Hand sanitizer'],
  DE: ['Genug Schlaf oder Ruhe', 'Ausreichend Wasser trinken', 'Elektrolyte einnehmen', 'Gesunde Snacks', 'Sonnenbrille', 'Kaugummi', 'Fidget-Spielzeug', 'Ohrstöpsel', 'Vitamine', 'Bequeme Schuhe', 'Taschentücher', 'Powerbank und Kabel', 'Ausweis und Bargeld/Karte', 'Desinfektionsmittel'],
  PT: ['Sono ou descanso suficiente', 'Beber água suficiente', 'Tomar eletrólitos', 'Lanches saudáveis', 'Óculos de sol', 'Chiclete', 'Brinquedos sensoriais', 'Protetores auriculares', 'Vitaminas', 'Sapatos confortáveis', 'Lenços', 'Power bank e cabo', 'Documento e dinheiro/cartão', 'Álcool em gel']
};

const UI_CONTENT = {
  EN: { header: "Essentials", sub: "Prepare your kit for the party", streak: "Care streak", boost: "Check 5+ items to boost your care streak! 🔥", button: "I'm ready" },
  DE: { header: "Ausrüstungs-Check", sub: "Bereite dein Kit für die Party vor", streak: "Care-Streak", boost: "Prüfe 5+ Artikel um deinen Care-Streak zu steigern! 🔥", button: "Ich bin bereit" },
  PT: { header: "Check-list de equipamentos", sub: "Prepare seu kit para a festa", streak: "Care streak", boost: "Marque 5+ itens para aumentar seu care streak! 🔥", button: "Estou pronto" }
};

export function Step7GearCheck({ onComplete, onBack }: { onComplete: () => void, onBack?: () => void }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT'>('EN');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT'].includes(savedLang)) setLang(savedLang);
  }, []);

  const toggle = (item: string) => setChecked(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
  const streakBoost = checked.length >= 5;
  const t = UI_CONTENT[lang] || UI_CONTENT.EN;
  const items = ITEMS_CONTENT[lang] || ITEMS_CONTENT.EN;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> BACK</button>}
      <div className="mt-12 mb-8 relative w-full"><div className="flex flex-col items-center gap-2"><h2 className="text-[22px] font-black text-foreground leading-tight tracking-tighter">{t.header}</h2><p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest">{t.sub}</p></div><div className={`absolute -top-4 -right-2 flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500 ${streakBoost ? 'bg-primary/10 border-primary text-primary neon-glow' : 'bg-card/5 border-border/10 text-muted-foreground'}`}><Flame className={`w-3.5 h-3.5 ${streakBoost ? 'text-orange-500 fill-orange-500' : 'text-muted-foreground/40'}`} /><span className="font-headline font-black uppercase text-[8px] tracking-[0.1em]">{t.streak}</span></div></div>
      <div className="mb-6"><p className={`text-[10px] font-black uppercase tracking-[0.1em] transition-all duration-500 ${streakBoost ? 'text-primary animate-pulse' : 'text-muted-foreground/60'}`}>{t.boost}</p></div>
      <div className="flex-1 w-full overflow-y-auto max-h-[45vh] custom-scrollbar pr-2 mb-8 space-y-3">
        {items.map((item) => {
          const isChecked = checked.includes(item);
          return (
            <div key={item} className={`flex items-center gap-4 p-4 rounded-[1.25rem] border transition-all duration-200 cursor-pointer h-[64px] ${isChecked ? 'bg-card border-primary/50 shadow-sm' : 'bg-card border-border/10 hover:border-border/20'}`} onClick={() => toggle(item)}><div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300 shrink-0 ${isChecked ? 'bg-primary border-primary' : 'bg-transparent border-border/20'}`}>{isChecked && <Check className="w-3.5 h-3.5 text-primary-foreground" />}</div><Label className="font-headline font-black tracking-tight text-sm cursor-pointer flex-1 text-left text-foreground/90">{item}</Label></div>
          );
        })}
      </div>
      <button onClick={onComplete} className="pill-button w-full max-w-sm bg-primary text-primary-foreground text-xl font-black neon-glow active:scale-95 transition-all h-[64px]">{t.button}</button>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Pill, FlaskConical, Brain, Moon, Dna, ShieldAlert, ArrowLeft } from 'lucide-react';

const MEDS = {
  EN: [
    { id: 'ssri', icon: Pill, label: 'SSRIs', desc: 'e.g. Sertraline, Fluoxetine, Escitalopram' },
    { id: 'snri', icon: FlaskConical, label: 'SNRIs', desc: 'e.g. Venlafaxine, Duloxetine' },
    { id: 'adhd', icon: Brain, label: 'ADHD meds', desc: 'e.g. Ritalin, Vyvanse, Concerta' },
    { id: 'benzo', icon: Moon, label: 'Benzos', desc: 'e.g. Xanax, Valium, Diazepam' },
    { id: 'antipsychotic', icon: Dna, label: 'Antipsychotics', desc: 'e.g. Quetiapine, Olanzapine' },
    { id: 'maoi', icon: ShieldAlert, label: 'MAOIs', desc: 'e.g. Rare/older antidepressants' },
  ],
  DE: [
    { id: 'ssri', icon: Pill, label: 'SSRIs', desc: 'z.B. Sertralin, Fluoxetin, Escitalopram' },
    { id: 'snri', icon: FlaskConical, label: 'SNRIs', desc: 'z.B. Venlafaxine, Duloxetin' },
    { id: 'adhd', icon: Brain, label: 'ADHS Meds', desc: 'z.B. Ritalin, Vyvanse, Concerta' },
    { id: 'benzo', icon: Moon, label: 'Benzos', desc: 'z.B. Xanax, Valium, Diazepam' },
    { id: 'antipsychotic', icon: Dna, label: 'Antipsychotika', desc: 'z.B. Quetiapin, Olanzapin' },
    { id: 'maoi', icon: ShieldAlert, label: 'MAO-Hemmer', desc: 'Seltene/ältere Antidepressiva' },
  ],
  PT: [
    { id: 'ssri', icon: Pill, label: 'ISRS', desc: 'ex: Sertralina, Fluoxetina, Escitalopram' },
    { id: 'snri', icon: FlaskConical, label: 'ISRN', desc: 'ex: Venlafaxina, Duloxetina' },
    { id: 'adhd', icon: Brain, label: 'TDAH', desc: 'ex: Ritalina, Vyvanse, Concerta' },
    { id: 'benzo', icon: Moon, label: 'Benzos', desc: 'ex: Xanax, Valium, Diazepam' },
    { id: 'antipsychotic', icon: Dna, label: 'Antipsicóticos', desc: 'ex: Quetiapina, Olanzapina' },
    { id: 'maoi', icon: ShieldAlert, label: 'IMAO', desc: 'Antidepressivos raros/antigos' },
  ],
  RU: [
    { id: 'ssri', icon: Pill, label: 'СИОЗС', desc: 'напр. Сертралин, Флуоксетин' },
    { id: 'snri', icon: FlaskConical, label: 'СИОЗСН', desc: 'напр. Венлафаксин, Дулоксетин' },
    { id: 'adhd', icon: Brain, label: 'СДВГ', desc: 'напр. Риталин, Страттера' },
    { id: 'benzo', icon: Moon, label: 'Бензо', desc: 'напр. Ксанакс, Валиум' },
    { id: 'antipsychotic', icon: Dna, label: 'Антипсихотики', desc: 'напр. Кветиапин, Оланзапин' },
    { id: 'maoi', icon: ShieldAlert, label: 'ИМАО', desc: 'Редкие препараты' },
  ]
};

const UI = {
  EN: { header: 'Health profile', sub: 'Select any medications you are currently taking', none: 'None of the above', confirm: 'Confirm & continue' },
  DE: { header: 'Gesundheitsprofil', sub: 'Wähle die Medikamente aus, die du gerade nimmst', none: 'Nichts davon trifft zu', confirm: 'Bestätigen & weiter' },
  PT: { header: 'Perfil de saúde', sub: 'Selecione os medicamentos que você toma atualmente', none: 'Nenhum destes se aplica', confirm: 'Confirmar e continuar' },
  RU: { header: 'Профиль здоровья', sub: 'Выберите препараты которые вы принимаете', none: 'Ничего из списка', confirm: 'Подтвердить' }
};

export function Step4Medications({ selected, onComplete, onSkip, onBack }: { selected: string[], onComplete: (meds: string[]) => void, onSkip?: () => void, onBack?: () => void }) {
  const [current, setCurrent] = useState<string[]>(selected);
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.EN;
  const meds = MEDS[lang] || MEDS.EN;

  const toggle = (id: string) => {
    if (id === 'none') { setCurrent(['none']); return; }
    setCurrent(prev => {
      const filtered = prev.filter(x => x !== 'none');
      if (filtered.includes(id)) return filtered.filter(x => x !== id);
      return [...filtered, id];
    });
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> BACK</button>}
      <div className="mt-12 mb-8"><h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{t.header}</h2><p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p></div>
      <div className="flex-1 w-full overflow-y-auto max-h-[50vh] custom-scrollbar pr-2 mb-8 space-y-3">
        {meds.map((med) => {
          const Icon = med.icon;
          const isActive = current.includes(med.id);
          return (
            <div key={med.id} onClick={() => toggle(med.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all h-[72px] cursor-pointer ${isActive ? 'bg-card border-secondary/50' : 'bg-card border-border/10 hover:border-border/20'}`}>
              <div className="flex items-center gap-4 text-left">
                <div className={isActive ? 'text-secondary' : 'text-white/40'}><Icon size={24} /></div>
                <div>
                  <div className={`font-black text-xs uppercase tracking-tight ${isActive ? 'text-secondary' : 'text-white/70'}`}>{med.label}</div>
                  <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest leading-none">{med.desc}</div>
                </div>
              </div>
              <div className="flex items-center bg-card/5 px-4 py-2 rounded-xl border border-border/10 pointer-events-none"><Switch checked={isActive} className="data-[state=checked]:bg-secondary" /></div>
            </div>
          );
        })}
      </div>
      <div className="w-full flex flex-col gap-4 items-center shrink-0">
        <button onClick={() => toggle('none')} className={`w-full p-5 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all h-[64px] ${current.includes('none') ? 'bg-secondary/10 border-secondary text-secondary neon-glow' : 'bg-card border-border/10 text-white/30'}`}>{t.none}</button>
        <button onClick={() => onComplete(current)} disabled={current.length === 0} className={`pill-button w-full max-w-sm h-[64px] uppercase tracking-[0.2em] font-black text-xl transition-all ${current.length > 0 ? 'bg-secondary text-black neon-glow active:scale-95' : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5 opacity-50'}`}>{t.confirm}</button>
      </div>
    </div>
  );
}


import { useState, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { 
  Brain, Wind, Zap, Sun, Cloud, Shield, Orbit, CircleDashed, HeartPulse, Droplets, RefreshCcw, FlaskConical, Activity, ArrowLeft 
} from 'lucide-react';

const LungsIcon = ({ size = 24 }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 3c-2 0-5 3-5 8 0 4 3 9 5 9h1c1 0 2-1 2-2V7c0-1-1-2-2-2H7z" /><path d="M17 3c2 0 5 3 5 8 0 4-3 9-5 9h-1c-1 0-2-1-2-2V7c0-1 1-2 2-2h1z" /><path d="M12 12v9" /><path d="M12 7V3" /></svg>
);

const SECTIONS = {
  EN: [
    { title: 'General health', items: [{ id: 'epilepsy', icon: Brain, label: 'Epilepsy' }, { id: 'asthma', icon: Wind, label: 'Asthma' }, { id: 'migraines', icon: Zap, label: 'Migraines' }] },
    { title: 'Mental health', items: [{ id: 'adhd', icon: Brain, label: 'ADHD' }, { id: 'anxiety', icon: Wind, label: 'Anxiety' }, { id: 'depression', icon: Cloud, label: 'Depression' }, { id: 'ptsd', icon: Shield, label: 'PTSD' }, { id: 'bipolar', icon: Orbit, label: 'Bipolar disorder' }, { id: 'schizophrenia', icon: CircleDashed, label: 'Schizophrenia' }] },
    { title: 'Chronic & organs', items: [{ id: 'circulatory', icon: HeartPulse, label: 'Circulatory system', desc: 'Heart, Blood vessels' }, { id: 'urinary', icon: Droplets, label: 'Urinary system', desc: 'Kidneys, Bladder' }, { id: 'respiratory', icon: LungsIcon, label: 'Respiratory system', desc: 'Lungs' }, { id: 'gi-tract', icon: RefreshCcw, label: 'Gastrointestinal tract', desc: 'Stomach, Intestines' }, { id: 'biliary', icon: FlaskConical, label: 'Biliary system', desc: 'Liver, Gallbladder' }, { id: 'integumentary', icon: Sun, label: 'Integumentary system', desc: 'Skin' }, { id: 'chronic-pain', icon: Activity, label: 'Chronic pain', desc: 'Persistent discomfort' }] },
  ],
  DE: [
    { title: 'Allgemeine Gesundheit', items: [{ id: 'epilepsy', icon: Brain, label: 'Epilepsie' }, { id: 'asthma', icon: Wind, label: 'Asthma' }, { id: 'migraines', icon: Zap, label: 'Migräne' }] },
    { title: 'Psychische Gesundheit', items: [{ id: 'adhd', icon: Brain, label: 'ADHS' }, { id: 'anxiety', icon: Wind, label: 'Angststörung' }, { id: 'depression', icon: Cloud, label: 'Depression' }, { id: 'ptsd', icon: Shield, label: 'PTBS' }, { id: 'bipolar', icon: Orbit, label: 'Bipolare Störung' }, { id: 'schizophrenia', icon: CircleDashed, label: 'Schizophrenie' }] },
    { title: 'Chronic & Organe', items: [{ id: 'circulatory', icon: HeartPulse, label: 'Herz-Kreislauf-System', desc: 'Herz, Blutgefäße' }, { id: 'urinary', icon: Droplets, label: 'Harnsystem', desc: 'Nieren, Blase' }, { id: 'respiratory', icon: LungsIcon, label: 'Atmungssystem', desc: 'Lunge' }, { id: 'gi-tract', icon: RefreshCcw, label: 'Magen-Darm-Trakt', desc: 'Magen, Darm' }, { id: 'biliary', icon: FlaskConical, label: 'Galle & Leber', desc: 'Leber, Gallengänge' }, { id: 'integumentary', icon: Sun, label: 'Haut & Gewebe', desc: 'Haut' }, { id: 'chronic-pain', icon: Activity, label: 'Chronische Schmerzen', desc: 'Anhaltendes Unbehagen' }] },
  ],
  PT: [
    { title: 'Saúde geral', items: [{ id: 'epilepsy', icon: Brain, label: 'Epilepsia' }, { id: 'asthma', icon: Wind, label: 'Asma' }, { id: 'migraines', icon: Zap, label: 'Enxaquecas' }] },
    { title: 'Saúde mental', items: [{ id: 'adhd', icon: Brain, label: 'TDAH' }, { id: 'anxiety', icon: Wind, label: 'Ansiedade' }, { id: 'depression', icon: Cloud, label: 'Depressão' }, { id: 'ptsd', icon: Shield, label: 'TEPT' }, { id: 'bipolar', icon: Orbit, label: 'Transtorno bipolar' }, { id: 'schizophrenia', icon: CircleDashed, label: 'Esquizofrenia' }] },
    { title: 'Crônicos e órgãos', items: [{ id: 'circulatory', icon: HeartPulse, label: 'Sistema circulatório', desc: 'Coração, Vasos' }, { id: 'urinary', icon: Droplets, label: 'Sistema urinário', desc: 'Rins, Bexiga' }, { id: 'respiratory', icon: LungsIcon, label: 'Sistema respiratório', desc: 'Pulmões' }, { id: 'gi-tract', icon: RefreshCcw, label: 'Trato gastrointestinal', desc: 'Estômago, Intestinos' }, { id: 'biliary', icon: FlaskConical, label: 'Sistema biliar', desc: 'Fígado, Vesícula' }, { id: 'integumentary', icon: Sun, label: 'Sistema tegumentar', desc: 'Pele' }, { id: 'chronic-pain', icon: Activity, label: 'Dor crônica', desc: 'Desconforto persistente' }] },
  ],
  RU: [
    { title: 'Общее здоровье', items: [{ id: 'epilepsy', icon: Brain, label: 'Эпилепсия' }, { id: 'asthma', icon: Wind, label: 'Астма' }, { id: 'migraines', icon: Zap, label: 'Мигрень' }] },
    { title: 'Психическое здоровье', items: [{ id: 'adhd', icon: Brain, label: 'СДВГ' }, { id: 'anxiety', icon: Wind, label: 'Тревожность' }, { id: 'depression', icon: Cloud, label: 'Депрессия' }, { id: 'ptsd', icon: Shield, label: 'ПТСР' }, { id: 'bipolar', icon: Orbit, label: 'Биполярное расстройство' }, { id: 'schizophrenia', icon: CircleDashed, label: 'Шизофрения' }] },
    { title: 'Хронические заболевания', items: [{ id: 'circulatory', icon: HeartPulse, label: 'Сердечно-сосудистая система', desc: 'Сердце, Сосуды' }, { id: 'urinary', icon: Droplets, label: 'Мочевыделительная система', desc: 'Почки, Пузырь' }, { id: 'respiratory', icon: LungsIcon, label: 'Дыхательная система', desc: 'Легкие' }, { id: 'gi-tract', icon: RefreshCcw, label: 'ЖКТ', desc: 'Желудок, Кишечник' }, { id: 'biliary', icon: FlaskConical, label: 'Желчевыводящая система', desc: 'Печень, Пузырь' }, { id: 'integumentary', icon: Sun, label: 'Кожная система', desc: 'Кожа' }, { id: 'chronic-pain', icon: Activity, label: 'Хроническая боль', desc: 'Постоянный дискомфорт' }] },
  ]
};

const UI = {
  EN: { header: 'Health conditions', sub: 'Pre-existing conditions disclosure', none: 'None of these apply', confirm: 'Continue' },
  DE: { header: 'Gesundheitszustand', sub: 'Offenlegung von Vorerkrankungen', none: 'Nichts davon trifft zu', confirm: 'Weiter' },
  PT: { header: 'Condições de saúde', sub: 'Divulgação de condições pré-existentes', none: 'Nenhuma destas se aplica', confirm: 'Continuar' },
  RU: { header: 'Состояние здоровья', sub: 'Раскрытие хронических заболеваний', none: 'Ничего из списка', confirm: 'Продолжить' }
};

export function Step3HealthConditions({ selected, onComplete, onBack }: { selected: string[], onComplete: (conditions: string[]) => void, onBack?: () => void }) {
  const [current, setCurrent] = useState<string[]>(selected);
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.EN;
  const sections = SECTIONS[lang] || SECTIONS.EN;

  const toggle = (id: string) => {
    if (id === 'none') { setCurrent(['none']); return; }
    setCurrent(prev => {
      const filtered = prev.filter(x => x !== 'none');
      if (filtered.includes(id)) return filtered.filter(x => x !== id);
      return [...filtered, id];
    });
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> BACK</button>}
      <div className="mt-12 mb-8"><h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{t.header}</h2><p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p></div>
      <div className="flex-1 w-full overflow-y-auto max-h-[50vh] custom-scrollbar pr-2 mb-8 space-y-6">
        {sections.map((section) => (
          <div key={section.title} className="space-y-3">
            <h3 className="font-black text-[10px] uppercase tracking-[0.3em] text-white/30 px-1 text-left">{section.title}</h3>
            <div className="grid grid-cols-1 gap-3">
              {section.items.map((item: any) => {
                const Icon = item.icon;
                const isActive = current.includes(item.id);
                return (
                  <div key={item.id} onClick={() => toggle(item.id)} className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${isActive ? 'bg-card border-secondary/50' : 'bg-card border-border/10 hover:border-border/20'}`}>
                    <div className="flex items-center gap-4 text-left">
                      <div className={isActive ? 'text-secondary' : 'text-white/40'}><Icon size={24} /></div>
                      <div>
                        <div className={`font-black text-xs uppercase tracking-tight ${isActive ? 'text-secondary' : 'text-white/70'}`}>{item.label}</div>
                        {item.desc && <div className="text-[8px] text-white/30 uppercase font-bold tracking-widest leading-none mt-1">{item.desc}</div>}
                      </div>
                    </div>
                    <div className="flex items-center bg-card/5 px-4 py-2 rounded-xl border border-border/10 pointer-events-none ml-2"><Switch checked={isActive} className="data-[state=checked]:bg-secondary" /></div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="w-full flex flex-col gap-4 items-center shrink-0">
        <button onClick={() => toggle('none')} className={`w-full p-5 rounded-[1.5rem] border font-black text-[10px] uppercase tracking-[0.2em] transition-all h-[64px] ${current.includes('none') ? 'bg-secondary/10 border-secondary text-secondary neon-glow' : 'bg-card border-border/10 text-white/30'}`}>{t.none}</button>
        <button onClick={() => onComplete(current)} disabled={current.length === 0} className={`pill-button w-full max-w-sm h-[64px] uppercase tracking-[0.2em] font-black text-xl transition-all ${current.length > 0 ? 'bg-secondary text-black neon-glow active:scale-95' : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5 opacity-50'}`}>{t.confirm}</button>
      </div>
    </div>
  );
}



import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Music, Users, Shield, Radio, Ear, Heart, CircleDot, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Intention Calibration.
 * Optimized with German translations.
 * Unified language identifiers to lowercase.
 */

const POSITIVE_GOALS = [
  { id: 'dance',    icon: Music, label: 'Dance', de: 'Tanzen' },
  { id: 'social',   icon: Users, label: 'Meet people', de: 'Menschen kennenlernen' },
  { id: 'intimacy', icon: Heart, label: 'Find intimacy', de: 'Intimität finden' },

  // New intention entries (short label + optional warm subtitle + German)
  { id: 'be_here_now',     icon: Target,     label: 'Be Here Now',    sub: 'Feel the moment — I am fully present.',           de: 'Im Jetzt sein',        deSub: 'Spüre den Augenblick — ich bin ganz hier.' },
  { id: 'one_with_all',    icon: Users,      label: 'One With All',   sub: \"Feel  shared heartbeat — we're together.\", de: 'Eins mit allen',       deSub: 'Unser Herz schlägt gemeinsam — wir sind verbunden.' },
  { id: 'radiate_love',    icon: Heart,      label: 'Radiate love',   sub: 'Let love flow through me.',                        de: 'Liebe fließen lassen', deSub: 'Lass die Liebe aus dir strömen und andere berühren.' },
  { id: 'forgive_myself',  icon: Heart,      label: 'I Forgive Myself',sub: 'I release the past and free my heart.',            de: 'Ich vergebe mir',      deSub: 'Ich lasse die Vergangenheit los und befreie mein Herz.' },
  { id: 'self_accept',     icon: Heart,      label: 'Self-acceptance', sub: 'Accept myself fully.',                             de: 'Ich bin genug',        deSub: 'Ich akzeptiere mich so, wie ich bin.' },
  { id: 'feeling_joy',     icon: Flame,      label: 'Feeling Joy',    sub: 'Rejoice in everything.',                           de: 'Wähle Freude',         deSub: 'Lade strahlende Freude in jeden Moment ein.' },
  { id: 'let_go',          icon: CircleDot,  label: 'Let Go',         sub: 'Release what holds me back — open to joy.',       de: 'Loslassen',            deSub: 'Lass los, was dich bindet — öffne dich der Freude.' },
  { id: 'respect_myself',  icon: Shield,     label: 'Learn respect',  sub: 'Developing self-respect.',                         de: 'Mich achten',          deSub: 'Behandle dich mit Liebe, Sorgfalt und Respekt.' },
  { id: 'savor_night',     icon: Music,      label: 'Savor the Night',sub: 'Taste each moment — make it a memory.',            de: 'Jeden Moment genießen',deSub: 'Genieße jeden Augenblick — mach Erinnerungen daraus.' },
  { id: 'open_my_heart',   icon: Heart,      label: 'Open My Heart',  sub: 'Live with an open heart.',                         de: 'Öffne mein Herz',      deSub: 'Empfange Zärtlichkeit und Verbindung in mir.' },
  { id: 'gratitude',       icon: Heart,      label: 'Gratitude',      sub: 'Thank the life I have and feel it fill me.',    de: 'Dankbarkeit',          deSub: 'Danke dem Leben — und fühle, wie es dich erfüllt.' },
  { id: 'rest_when_needed',icon: Flame,      label: 'Rest When Needed',sub:'Honor my body — rest whenever it asks.',         de: 'Ruhen wenn nötig',     deSub: 'Achte deinen Körper — ruhe dich aus, wann er es braucht.' }
];

const UI = {
  en: { header: 'Intention', sub: 'What is your main focus?', res: 'The Intention',  confirm: 'Confirm' },
  de: { header: 'Intention', sub: 'Was ist dein Hauptfokus?', res: 'Die Resonanz',  confirm: 'Bestätigen' }
};

export function StepIntentions({ onComplete, onBack }: { onComplete: (goals: string[]) => void, onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const toggleGoal = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const t = UI[lang] || UI.en;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative pt-safe pb-safe">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> BACK</button>}
      <div className="mt-12 mb-8"><h2 className="text-[22px] font-black uppercase mb-2 text-foreground leading-tight tracking-tighter">{t.header}</h2><p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p></div>
      <div className="flex-1 w-full overflow-y-auto max-h-[55vh] custom-scrollbar pr-2 mb-8 space-y-8">
        <div className="space-y-3"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary text-left px-2">{t.res}</h3><div className="grid grid-cols-1 gap-3">{INTENTION_GOALS.map((goal) => (<button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected.includes(goal.id) ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(27,77,62,0.2)]' : 'bg-card border-border/10 hover:border-border/20')}><div className={cn("p-3 rounded-xl", selected.includes(goal.id) ? 'bg-primary text-primary-foreground' : 'bg-card/5 text-muted-foreground/50')}><goal.icon className="w-5 h-5" /></div><span className={cn("font-black text-base uppercase tracking-tight", selected.includes(goal.id) ? 'text-foreground' : 'text-muted-foreground')}>{lang === 'en' ? goal.label : goal.de}</span></button>))}</div></div>
        <div className="space-y-3"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-left px-2">{t.pos}</h3><div className="grid grid-cols-1 gap-3">{POSITIVE_GOALS.map((goal) => (<button key={goal.id} onClick={() => toggleGoal(goal.id)} className={cn("p-5 rounded-[1.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left", selected.includes(goal.id) ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(27,77,62,0.2)]' : 'bg-card border-border/10 hover:border-border/20')}><div className={cn("p-3 rounded-xl", selected.includes(goal.id) ? 'bg-primary text-primary-foreground' : 'bg-card/5 text-muted-foreground/50')}><goal.icon className="w-5 h-5" /></div><span className={cn("font-black text-base uppercase tracking-tight", selected.includes(goal.id) ? 'text-foreground' : 'text-muted-foreground')}>{lang === 'en' ? goal.label : goal.de}</span></button>))}</div></div>
      </div>
      <button onClick={() => onComplete(selected)} disabled={selected.length === 0} className={cn("pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all", selected.length > 0 ? 'bg-primary text-primary-foreground neon-glow active:scale-95' : 'bg-card/10 text-muted-foreground/50 cursor-not-allowed border-2 border-border/5 opacity-50')}>{t.confirm}</button>
    </div>
  );
}

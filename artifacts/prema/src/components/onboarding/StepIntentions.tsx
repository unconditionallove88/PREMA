
import useHaptics from '@/lib/useHaptics';
import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Music, Users, Shield, Heart, CircleDot, Flame, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const POSITIVE_GOALS = [
  { id: 'be_here_now', icon: Target, label: 'Be Here Now', sub: 'Feel the moment — I am fully present.', de: 'Im Jetzt sein', deSub: 'Spüre den Augenblick — ich bin ganz hier.' },
  { id: 'one_with_all', icon: Users, label: 'One With All', sub: "Feel our shared heartbeat — we're together.", de: 'Eins mit allen', deSub: 'Unser Herz schlägt gemeinsam — wir sind verbunden.' },
  { id: 'radiate_love', icon: Heart, label: 'Radiate love', sub: 'Let love flow through me.', de: 'Liebe fließen lassen', deSub: 'Lass die Liebe aus dir strömen und andere berühren.' },
  { id: 'forgive_myself', icon: Heart, label: 'I Forgive Myself', sub: 'I release the past and free my heart.', de: 'Ich vergebe mir', deSub: 'Ich lasse die Vergangenheit los und befreie mein Herz.' },
  { id: 'self_accept', icon: Heart, label: 'Self-acceptance', sub: 'Accept myself fully.', de: 'Ich bin genug', deSub: 'Ich akzeptiere mich so, wie ich bin.' },
  { id: 'feeling_joy', icon: Flame, label: 'Feeling Joy', sub: 'Rejoice in everything.', de: 'Wähle Freude', deSub: 'Lade strahlende Freude in jeden Moment ein.' },
  { id: 'let_go', icon: CircleDot, label: 'Let Go', sub: 'Release what holds you back — open to joy.', de: 'Loslassen', deSub: 'Lass los, was dich bindet — öffne dich der Freude.' },
  { id: 'respect_myself', icon: Shield, label: 'Learn respect', sub: 'Developing self-respect.', de: 'Mich achten', deSub: 'Behandle dich mit Liebe, Sorgfalt und Respekt.' },
  { id: 'savor_night', icon: Music, label: 'Savor the Night', sub: 'Taste each moment — make it a memory.', de: 'Jeden Moment genießen', deSub: 'Genieße jeden Augenblick — mach Erinnerungen daraus.' },
  { id: 'open_my_heart', icon: Heart, label: 'Open My Heart', sub: 'Live with an open heart.', de: 'Öffne mein Herz', deSub: 'Empfange Zärtlichkeit und Verbindung in mir.' },
  { id: 'gratitude', icon: Heart, label: 'Gratitude', sub: 'Thank the life you have and feel it fill you.', de: 'Dankbarkeit', deSub: 'Danke dem Leben — und fühle, wie es dich erfüllt.' },
  { id: 'rest_when_needed', icon: Flame, label: 'Rest When Needed', sub: 'Honor your body — rest whenever it asks.', de: 'Ruhen wenn nötig', deSub: 'Achte deinen Körper — ruhe dich aus, wann er es braucht.' }
];

const UI = {
  en: { header: 'Intention', sub: 'What is your main focus?', confirm: 'Confirm' },
  de: { header: 'Intention', sub: 'Was ist dein Fokus?', confirm: 'Bestätigen' }
};

export function StepIntentions({ onComplete, onBack }: { onComplete: (data: any) => void, onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('prema_lang') || 'en').toLowerCase() as any;
    setLang(saved);
  }, []);

  const { pulse } = useHaptics();
  const [pulseActive, setPulseActive] = useState(false);

  const t = UI[lang] || UI.en;
  const toggle = (id: string) => setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center pt-20 px-6 font-headline bg-background pb-32">
      {onBack && <button onClick={onBack} className="absolute top-6 left-6 text-muted-foreground uppercase text-[10px] font-black tracking-widest"><ArrowLeft className="w-4 h-4 inline mr-2" /> back</button>}
      
      <div className="text-center mb-12">
        <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground mb-2">{t.header}</h2>
        <p className="text-xl font-black uppercase tracking-tighter text-foreground">{t.sub}</p>
      </div>

      <div className="w-full max-w-md space-y-3">
        {POSITIVE_GOALS.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className={cn(
              "group w-full p-5 rounded-2xl border transition-all duration-300 flex items-center gap-4 text-left relative overflow-hidden",
              selected.includes(item.id) ? "bg-primary/10 border-primary shadow-lg" : "bg-card border-border/10 hover:border-border/30"
            )}
          >
            <item.icon className={cn("w-5 h-5 shrink-0 transition-colors", selected.includes(item.id) ? "text-primary" : "text-muted-foreground")} />
            <div className="flex-1">
              <div className="text-xs font-black uppercase tracking-tight text-foreground">{lang === 'de' ? item.de : item.label}</div>
              <p className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                {lang === 'de' ? item.deSub : item.sub}
              </p>
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground/30 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background to-transparent pt-12">
        <button
  onClick={() => {
    if (selected.length === 0) return; // guard — do nothing when nothing selected
    setPulseActive(true);
    setTimeout(() => setPulseActive(false), 180);

    pulse(30);
    onComplete({ intentions: selected });
  }}
  disabled={selected.length === 0}
  aria-disabled={selected.length === 0}
  className={cn(
    "w-full max-w-md mx-auto h-16 rounded-full font-black uppercase text-sm tracking-widest shadow-2xl transition-all flex items-center justify-center gap-2 neon-glow",
    selected.length === 0
      ? "opacity-50 cursor-not-allowed bg-gray-200 text-gray-500" // disabled look
      : (pulseActive ? "scale-95 ring-2 ring-primary/30 bg-primary text-primary-foreground" : "bg-primary text-primary-foreground")
  )}
>
  {t.confirm}
</button>
      </div>
    </div>
  );
}

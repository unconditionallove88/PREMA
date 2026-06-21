import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Heart, Loader2, User, ArrowLeft, Sprout, Sparkles, Moon, BookOpen } from 'lucide-react';
import { Link } from 'wouter';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { playHeartbeat } from '@/lib/intention';
import { cn } from '@/lib/utils';
import { StepSomethingToRemember } from '@/components/onboarding/StepSomethingToRemember';
import { ScrollArea } from '@/components/ui/scroll-area';

type Phase = 'before' | 'during' | 'after' | 'remember';

const PHASE_META: Record<Phase, {
  icon: React.ReactNode;
  label: { en: string; de: string };
  sub: { en: string; de: string };
  poem: { en: string; de: string };
  cta: { en: string; de: string };
  color: string;
  glowColor: string;
  borderActive: string;
  borderIdle: string;
  bgActive: string;
  cardBg: string;
  path?: string;
}> = {
  before: {
    icon: <Sprout size={22} />,
    label: { en: 'BEFORE', de: 'VORHER' },
    sub: { en: 'Preparation', de: 'Vorbereitung' },
    poem: { en: 'You arrive fully prepared.\nEvery intention rooted in love.', de: 'Du kommst vorbereitet.\nJede Absicht in Liebe verwurzelt.' },
    cta: { en: 'Enter Preparation', de: 'Vorbereitung beginnen' },
    color: 'text-primary',
    glowColor: 'rgba(27,77,62,0.35)',
    borderActive: 'border-primary',
    borderIdle: 'border-primary/20',
    bgActive: 'bg-primary/10',
    cardBg: 'bg-primary/5 border-primary/30',
    path: '/before',
  },
  during: {
    icon: <Sparkles size={22} />,
    label: { en: 'DURING', de: 'WÄHREND' },
    sub: { en: 'Your Session', de: 'Deine Session' },
    poem: { en: 'You are held.\nThe journey honours your truth.', de: 'Du bist gehalten.\nDie Reise ehrt deine Wahrheit.' },
    cta: { en: 'Enter Session', de: 'Session betreten' },
    color: 'text-accent',
    glowColor: 'hsl(var(--accent) / 0.35)',
    borderActive: 'border-accent',
    borderIdle: 'border-accent/20',
    bgActive: 'bg-accent/10',
    cardBg: 'bg-accent/5 border-accent/30',
    path: '/dashboard',
  },
  after: {
    icon: <Moon size={22} />,
    label: { en: 'AFTER', de: 'DANACH' },
    sub: { en: 'Recovery', de: 'Erholung' },
    poem: { en: 'Rest now, beloved.\nYou have journeyed with courage.', de: 'Ruh dich aus, Geliebte.\nDu hast mit Mut gereist.' },
    cta: { en: 'Enter Recovery', de: 'Erholung starten' },
    color: 'text-purple-400',
    glowColor: 'rgba(167,139,250,0.35)',
    borderActive: 'border-purple-400',
    borderIdle: 'border-purple-400/20',
    bgActive: 'bg-purple-400/10',
    cardBg: 'bg-purple-400/5 border-purple-400/30',
    path: '/recovery',
  },
  remember: {
    icon: <BookOpen size={22} />,
    label: { en: 'REMEMBER', de: 'ERINNERN' },
    sub: { en: 'Something to Remember', de: 'Nicht vergessen' },
    poem: { en: 'Wisdom carried within.\nKnowledge is your shield.', de: 'Wissen getragen.\nKenntnis ist dein Schutz.' },
    cta: { en: 'Read Wisdom', de: 'Weisheit lesen' },
    color: 'text-amber-400',
    glowColor: 'rgba(251,191,36,0.35)',
    borderActive: 'border-amber-400',
    borderIdle: 'border-amber-400/20',
    bgActive: 'bg-amber-400/10',
    cardBg: 'bg-amber-400/5 border-amber-400/30',
  },
};

const ALL_PHASES: Phase[] = ['before', 'during', 'after', 'remember'];

// Animated circle — like the LoveCircle archetype buttons
function PhaseCircle({
  phase,
  isActive,
  onClick,
}: {
  phase: Phase;
  isActive: boolean;
  onClick: () => void;
}) {
  const meta = PHASE_META[phase];

  return (
    <div className="relative flex items-center justify-center group" style={{ width: 52, height: 52 }}>
      {/* Outer ping ring when active */}
      {isActive && (
        <span
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: meta.glowColor, opacity: 0.4 }}
        />
      )}

      {/* Soft glow halo */}
      {isActive && (
        <div
          className="absolute inset-[-6px] rounded-full blur-[10px] transition-all duration-700"
          style={{ backgroundColor: meta.glowColor, opacity: 0.5 }}
        />
      )}

      <button
        onClick={() => { playHeartbeat(); onClick(); }}
        className={cn(
          'relative z-10 w-[52px] h-[52px] rounded-full border-2 flex items-center justify-center transition-all duration-500',
          isActive
            ? cn('scale-110 shadow-[0_0_24px_var(--glow)]', meta.borderActive, meta.bgActive, meta.color)
            : cn('bg-card/60 hover:scale-105', meta.borderIdle, meta.color, 'opacity-50 hover:opacity-100'),
        )}
        style={{ '--glow': meta.glowColor } as React.CSSProperties}
        aria-label={meta.label.en}
      >
        {meta.icon}
      </button>
    </div>
  );
}

function CenterCard({ phase, lang, onEnter }: { phase: Phase; lang: 'en' | 'de'; onEnter: () => void }) {
  const meta = PHASE_META[phase];

  if (phase === 'remember') {
    return (
      <div className="w-full h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-500">
        <StepSomethingToRemember
          onComplete={() => {}}
          isStandAlone={true}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'w-full max-w-md rounded-[3rem] border-2 p-10 flex flex-col items-center text-center space-y-6 transition-all duration-700 animate-in fade-in slide-in-from-left-4',
        meta.cardBg,
      )}
      style={{ boxShadow: `0 0 80px ${meta.glowColor}` }}
    >
      {/* Ambient glow bubble */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center border-2 relative"
        style={{ borderColor: meta.glowColor, boxShadow: `0 0 30px ${meta.glowColor}` }}
      >
        <div
          className="absolute inset-0 rounded-full animate-ping"
          style={{ backgroundColor: meta.glowColor, opacity: 0.2 }}
        />
        <span className={cn('relative z-10 scale-150', meta.color)}>{meta.icon}</span>
      </div>

      <div className="space-y-1">
        <p className={cn('text-[9px] font-black uppercase tracking-[0.5em]', meta.color)}>
          {meta.sub[lang]}
        </p>
        <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">
          {meta.label[lang]}
        </h2>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line max-w-[240px]">
        "{meta.poem[lang]}"
      </p>

      <button
        onClick={() => { playHeartbeat(); onEnter(); }}
        className={cn(
          'w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 mt-2',
          phase === 'before' && 'bg-primary text-primary-foreground hover:bg-primary/90',
          phase === 'during' && 'bg-accent text-accent-foreground hover:bg-accent/90',
          phase === 'after' && 'bg-purple-500 text-white hover:bg-purple-500/90',
        )}
      >
        {meta.cta[lang]}
      </button>
    </div>
  );
}

export default function SupporterHub() {
  const [, setLocation] = useLocation();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  const [activePhase, setActivePhase] = useState<Phase>('before');

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    const phase = localStorage.getItem('prema_session_phase') as Phase | null;
    if (phase === 'during') setActivePhase('during');
    else if (phase === 'after') setActivePhase('after');
    else setActivePhase('before');
  }, []);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary/30 w-8 h-8" />
      </div>
    );
  }

  const name = profile?.name || (lang === 'de' ? 'SEELE' : 'HEART');

  const handleEnter = (phase: Phase) => {
    const meta = PHASE_META[phase];
    if (meta.path) {
      localStorage.setItem('prema_session_phase', phase);
      setLocation(meta.path);
    }
  };

  return (
    <main className="h-screen bg-background text-foreground font-headline flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-5 py-4 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <button
          onClick={() => setLocation('/dashboard')}
          className="p-2 rounded-full border border-border bg-card hover:border-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>

        <div className="text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
            {lang === 'de' ? 'Unterstützer' : 'Supporter'}
          </p>
          <h1 className="text-sm font-black uppercase tracking-tight text-foreground">
            {lang === 'de' ? `Strahle, ${name}` : `Shine, ${name}`}
          </h1>
        </div>

        <Link href="/profile">
          <button className="p-2 rounded-full border border-border bg-card hover:border-primary transition-colors">
            <User className="w-4 h-4 text-muted-foreground" />
          </button>
        </Link>
      </header>

      {/* Affirmation strip */}
      <div className="py-2 px-6 bg-primary/5 border-b border-primary/10 text-center shrink-0">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/70">
          {lang === 'de' ? '"Du bist geliebt"' : '"You are loved"'}
        </p>
      </div>

      {/* Main layout: Left panel + Center */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left side panel — always visible, vertical circles */}
        <aside className="flex flex-col items-center justify-center gap-7 px-3 py-8 border-r border-border bg-card/30 shrink-0 w-[72px]">
          {ALL_PHASES.map((phase) => (
            <PhaseCircle
              key={phase}
              phase={phase}
              isActive={activePhase === phase}
              onClick={() => setActivePhase(phase)}
            />
          ))}

          {/* Connector line */}
          <div className="absolute top-[120px] bottom-[120px] w-px bg-border/30 left-[35px] -z-0 pointer-events-none" />
        </aside>

        {/* Center — active phase content */}
        <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
          {activePhase === 'remember' ? (
            <div className="w-full max-w-lg h-full animate-in fade-in slide-in-from-left-4 duration-500">
              <ScrollArea className="h-full">
                <StepSomethingToRemember
                  onComplete={() => {}}
                  isStandAlone={true}
                />
              </ScrollArea>
            </div>
          ) : (
            <CenterCard
              key={activePhase}
              phase={activePhase}
              lang={lang}
              onEnter={() => handleEnter(activePhase)}
            />
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-3 text-center border-t border-border shrink-0">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/50">
          {lang === 'de' ? 'In Harmonie erschaffen' : 'Created in harmony'}
        </p>
      </div>
    </main>
  );
}

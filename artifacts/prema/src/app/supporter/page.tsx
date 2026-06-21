import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Heart, Loader2, User, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { playHeartbeat } from '@/lib/intention';
import { cn } from '@/lib/utils';

const PHASES = {
  before: {
    label: { en: 'BEFORE', de: 'VORHER' },
    sub: { en: 'Preparation', de: 'Vorbereitung' },
    poem: { en: 'You arrive fully prepared.\nEvery intention rooted in love.', de: 'Du kommst vollständig vorbereitet.\nJede Absicht in Liebe verwurzelt.' },
    cta: { en: 'Enter Preparation', de: 'Vorbereitung beginnen' },
    icon: '🌱',
    color: 'border-primary/40 bg-primary/5',
    glow: 'shadow-[0_0_80px_hsl(var(--primary)/0.18)]',
    path: '/before',
  },
  during: {
    label: { en: 'DURING', de: 'WÄHREND' },
    sub: { en: 'Your Session', de: 'Deine Session' },
    poem: { en: 'You are held.\nThe journey honours your truth.', de: 'Du bist gehalten.\nDie Reise ehrt deine Wahrheit.' },
    cta: { en: 'Enter Session', de: 'Session betreten' },
    icon: '✦',
    color: 'border-accent/40 bg-accent/5',
    glow: 'shadow-[0_0_80px_hsl(var(--accent)/0.18)]',
    path: '/during',
  },
  after: {
    label: { en: 'AFTER', de: 'DANACH' },
    sub: { en: 'Recovery', de: 'Erholung' },
    poem: { en: 'Rest now, beloved.\nYou have journeyed with courage.', de: 'Ruh dich aus, Geliebte.\nDu hast mit Mut gereist.' },
    cta: { en: 'Enter Recovery', de: 'Erholung starten' },
    icon: '🌙',
    color: 'border-purple-400/40 bg-purple-400/5',
    glow: 'shadow-[0_0_80px_rgba(167,139,250,0.15)]',
    path: '/recovery',
  },
};

type Phase = 'before' | 'during' | 'after';

function PhaseCircle({
  phase,
  lang,
  onClick,
}: {
  phase: Phase;
  lang: 'en' | 'de';
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const info = PHASES[phase];

  return (
    <div className="flex flex-col items-center gap-3 relative">
      <button
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        onClick={() => { playHeartbeat(); onClick(); }}
        className={cn(
          'w-20 h-20 md:w-28 md:h-28 rounded-full border-2 flex items-center justify-center transition-all duration-500 cursor-pointer',
          'bg-card hover:scale-110 active:scale-95',
          phase === 'before' && 'border-primary/30 hover:border-primary hover:bg-primary/10',
          phase === 'during' && 'border-accent/30 hover:border-accent hover:bg-accent/10',
          phase === 'after' && 'border-purple-400/30 hover:border-purple-400 hover:bg-purple-400/10',
        )}
        aria-label={info.label[lang]}
      >
        <span className="text-2xl md:text-3xl select-none">{info.icon}</span>
      </button>

      {/* Label — shows on hover */}
      <div
        className={cn(
          'absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 pointer-events-none',
          hovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
        )}
      >
        <span className={cn(
          'text-[9px] font-black uppercase tracking-[0.2em]',
          phase === 'before' && 'text-primary',
          phase === 'during' && 'text-accent',
          phase === 'after' && 'text-purple-400',
        )}>
          {info.label[lang]}
        </span>
      </div>
    </div>
  );
}

function CenterCard({ phase, lang, onEnter }: { phase: Phase; lang: 'en' | 'de'; onEnter: () => void }) {
  const info = PHASES[phase];

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center text-center rounded-[3rem] border-2 p-10 md:p-14 transition-all duration-700',
        'w-full max-w-sm md:max-w-md',
        info.color,
        info.glow,
      )}
      style={{ minHeight: '400px' }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-[3rem] overflow-hidden pointer-events-none">
        <div className={cn(
          'absolute inset-0 opacity-20 blur-3xl scale-110',
          phase === 'before' && 'bg-primary',
          phase === 'during' && 'bg-accent',
          phase === 'after' && 'bg-purple-400',
        )} />
      </div>

      <div className="relative z-10 space-y-6">
        <div className="text-5xl md:text-6xl select-none">{info.icon}</div>

        <div className="space-y-2">
          <p className={cn(
            'text-[10px] font-black uppercase tracking-[0.4em]',
            phase === 'before' && 'text-primary',
            phase === 'during' && 'text-accent',
            phase === 'after' && 'text-purple-400',
          )}>
            {info.sub[lang]}
          </p>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground leading-none">
            {info.label[lang]}
          </h2>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed italic whitespace-pre-line max-w-[220px] mx-auto">
          "{info.poem[lang]}"
        </p>

        <button
          onClick={() => { playHeartbeat(); onEnter(); }}
          className={cn(
            'mt-4 w-full h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95',
            phase === 'before' && 'bg-primary text-primary-foreground hover:bg-primary/90',
            phase === 'during' && 'bg-accent text-accent-foreground hover:bg-accent/90',
            phase === 'after' && 'bg-purple-500 text-white hover:bg-purple-500/90',
          )}
        >
          {info.cta[lang]}
        </button>
      </div>
    </div>
  );
}

export default function SupporterHub() {
  const [, setLocation] = useLocation();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  const [centerPhase, setCenterPhase] = useState<Phase>('before');

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
    if (phase === 'during' || phase === 'after') setCenterPhase(phase);
  }, []);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary/30 w-8 h-8" />
      </div>
    );
  }

  const name = profile?.name || (lang === 'de' ? 'SEELE' : 'HEART');

  // Which phases appear as circles (not center)?
  const allPhases: Phase[] = ['before', 'during', 'after'];
  const sidePhases = allPhases.filter((p) => p !== centerPhase);
  const leftPhase = sidePhases[0];
  const rightPhase = sidePhases[1];

  return (
    <main className="min-h-screen bg-background text-foreground font-headline flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-border bg-card/80 backdrop-blur-xl flex items-center justify-between sticky top-0 z-50">
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
      <div className="py-3 px-6 bg-primary/5 border-b border-primary/10 text-center">
        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary/70">
          {lang === 'de' ? '"Du bist geliebt"' : '"You are loved"'}
        </p>
      </div>

      {/* Main: center card + side circles */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        {/* Desktop layout: side circle | center card | side circle */}
        <div className="hidden md:flex items-center gap-10 lg:gap-16 w-full max-w-3xl justify-center">
          <div className="shrink-0 mb-8">
            <PhaseCircle
              phase={leftPhase}
              lang={lang}
              onClick={() => setLocation(PHASES[leftPhase].path)}
            />
          </div>

          <CenterCard
            phase={centerPhase}
            lang={lang}
            onEnter={() => {
              localStorage.setItem('prema_session_phase', centerPhase);
              setLocation(PHASES[centerPhase].path);
            }}
          />

          <div className="shrink-0 mb-8">
            <PhaseCircle
              phase={rightPhase}
              lang={lang}
              onClick={() => setLocation(PHASES[rightPhase].path)}
            />
          </div>
        </div>

        {/* Mobile layout: center card + circles below */}
        <div className="md:hidden flex flex-col items-center gap-10 w-full max-w-sm">
          <CenterCard
            phase={centerPhase}
            lang={lang}
            onEnter={() => {
              localStorage.setItem('prema_session_phase', centerPhase);
              setLocation(PHASES[centerPhase].path);
            }}
          />

          <div className="flex items-start gap-16 justify-center">
            <PhaseCircle
              phase={leftPhase}
              lang={lang}
              onClick={() => setLocation(PHASES[leftPhase].path)}
            />
            <PhaseCircle
              phase={rightPhase}
              lang={lang}
              onClick={() => setLocation(PHASES[rightPhase].path)}
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="py-6 text-center border-t border-border">
        <p className="text-[9px] font-black uppercase tracking-[0.6em] text-muted-foreground/60">
          {lang === 'de' ? 'In Harmonie erschaffen' : 'Created in harmony'}
        </p>
      </div>
    </main>
  );
}

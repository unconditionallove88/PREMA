import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Heart, Shield, Sparkles, Wind, Eye, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { playHeartbeat } from "@/lib/intention";

const GUIDANCE = [
  {
    icon: <Shield size={18} />,
    title: "Start slow",
    body: "Begin with a small amount. Wait at least 90 minutes before considering more. Your body will tell you what it needs.",
    color: "text-primary",
    bg: "bg-primary/5 border-primary/15",
  },
  {
    icon: <Wind size={18} />,
    title: "Stay hydrated",
    body: "Sip water steadily — about 500 ml per hour if dancing. Rest in cool spaces every 30–45 minutes.",
    color: "text-sky-400",
    bg: "bg-sky-400/5 border-sky-400/15",
  },
  {
    icon: <Eye size={18} />,
    title: "Stay aware",
    body: "Check in with yourself every hour. Notice your body, your breath, your feelings. You are your own best guardian.",
    color: "text-violet-400",
    bg: "bg-violet-400/5 border-violet-400/15",
  },
  {
    icon: <Heart size={18} />,
    title: "Stay connected",
    body: "Keep your safety network close. If something feels off — for you or someone else — reach out immediately.",
    color: "text-rose-400",
    bg: "bg-rose-400/5 border-rose-400/15",
  },
  {
    icon: <Leaf size={18} />,
    title: "Trust the flow",
    body: "Surrender to the experience with care. Resistance amplifies intensity. Breathe, ground, return to intention.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/5 border-emerald-400/15",
  },
];

export default function DuringPhase() {
  const [, setLocation] = useLocation();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
    localStorage.setItem('prema_session_phase', 'during');
    setTimeout(() => setVisible(true), 120);
  }, []);

  if (!mounted) return null;

  return (
    <main className="h-screen bg-background text-foreground flex flex-col overflow-hidden font-headline">
      {/* Header */}
      <header className="px-5 py-4 border-b border-border/40 bg-card/80 backdrop-blur-xl flex items-center gap-4 shrink-0">
        <button
          onClick={() => setLocation('/supporter')}
          className="p-2 rounded-full border border-border bg-card hover:border-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-primary/60">
            {lang === 'de' ? 'Action Phase' : 'Action Phase'}
          </p>
          <h1 className="text-sm font-semibold tracking-tight text-foreground">
            {lang === 'de' ? 'Zugangs-Leitfaden' : 'Access Guidance'}
          </h1>
        </div>
      </header>

      {/* Soft affirmation */}
      <div className="py-2.5 px-6 bg-primary/5 border-b border-primary/10 text-center shrink-0">
        <p className="text-[9px] font-medium uppercase tracking-[0.45em] text-primary/60">
          {lang === 'de' ? '"Du bist gehalten"' : '"You are held"'}
        </p>
      </div>

      {/* Radiant orb */}
      <div className={cn(
        'flex flex-col items-center pt-8 pb-4 shrink-0 transition-all duration-700',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4',
      )}>
        <div className="relative flex items-center justify-center w-24 h-24">
          <div className="absolute inset-0 rounded-full bg-primary/10 blur-2xl animate-pulse" />
          <div className="absolute inset-2 rounded-full bg-primary/8 blur-xl" />
          <div className="relative z-10 w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-soft">
            <Sparkles size={26} className="text-primary" />
          </div>
        </div>
        <h2 className="mt-4 text-xl font-semibold tracking-tight text-foreground text-center">
          {lang === 'de' ? 'Reise mit Bewusstsein' : 'Journey with awareness'}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground/60 font-light text-center max-w-[220px]">
          {lang === 'de'
            ? 'Fünf Prinzipien für deinen Weg'
            : 'Five principles to carry with you'}
        </p>
      </div>

      {/* Guidance cards */}
      <div className="flex-1 overflow-y-auto px-5 pb-32 space-y-3">
        {GUIDANCE.map((g, i) => (
          <div
            key={i}
            className={cn(
              'rounded-2xl border px-4 py-3.5 flex items-start gap-3 transition-all duration-500',
              g.bg,
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
            )}
            style={{ transitionDelay: `${140 + i * 80}ms` }}
          >
            <span className={cn('mt-0.5 shrink-0', g.color)}>{g.icon}</span>
            <div>
              <p className={cn('text-[11px] font-semibold tracking-wide uppercase mb-0.5', g.color)}>
                {g.title}
              </p>
              <p className="text-xs text-foreground/60 font-light leading-relaxed">{g.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Enter Dashboard CTA */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-5 bg-card/95 backdrop-blur-xl border-t border-border z-40 pb-safe">
        <button
          onClick={() => {
            playHeartbeat();
            setLocation('/dashboard');
          }}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm tracking-wide transition-all active:scale-95 shadow-soft"
        >
          {lang === 'de' ? 'Den Kreis betreten' : 'Enter the Circle'}
        </button>
      </footer>
    </main>
  );
}

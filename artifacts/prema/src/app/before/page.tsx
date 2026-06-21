import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import {
  ArrowLeft, Droplets, Apple, Moon, Loader2,
  FlaskConical, Info, CheckCircle2, ChevronRight,
  Shield, Microscope,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { playHeartbeat } from '@/lib/intention';

const CONTENT = {
  en: {
    title: "Preparation", subtitle: "Radiate from within",
    sections: {
      testing: "Lab Testing",
      essentials: "Essentials",
      nutrition: "Nutrition",
      rest: "Rest",
    },
    button: "I am prepared",
    testing: {
      title: "Test Your Substances",
      sub: "Before anything else — safety first",
      poem: "Know what you carry.\nLove begins with truth.",
      desc: "Anonymous lab testing is the most important step you can take. Know exactly what you're consuming before your session.",
      cta: "Book Anonymous Lab Test",
      skip: "I have already tested my substances",
    },
    essentials: {
      title: "Harm Reduction Kit",
      sub: "Your protection protocol",
      poem: "Prepared with care.\nYou honour yourself.",
      items: [
        { name: "Phone (100% Charged)", why: "Your lifeline to your Circle of Love" },
        { name: "Single-Use Straws", why: "Prevents cross-contamination — never share" },
        { name: "Zinc Supplement", dose: "15–30 mg", why: "Supports immune & neurotransmitter balance" },
        { name: "Magnesium Supplement", dose: "200–400 mg", why: "Reduces muscle tension, supports heart rhythm" },
        { name: "Electrolytes", dose: "As needed", why: "Maintains hydration and mineral balance" },
        { name: "Disinfecting Wipes", why: "Clean surfaces before use" },
        { name: "Credit-Card Plates (×2)", why: "Use dedicated clean surfaces — never banknotes" },
        { name: "Condoms", why: "Protection during intimacy" },
        { name: "Lubricant", why: "Reduces friction, enhances comfort" },
      ],
    },
    nutrition: {
      title: "Physical Intention",
      sub: "Steady fuel for your journey",
      poem: "Nourish the vessel.\nLove flows through a cared body.",
      advice: [
        "Eat a balanced meal 3–4 hours before you head out",
        "Choose complex carbohydrates and lean protein",
        "Avoid heavy, greasy, or processed foods",
        "A light snack 1 hour before is fine",
        "Stay hydrated — sip water steadily throughout the day",
      ],
    },
    rest: {
      title: "Nervous System Calibration",
      sub: "Deep recovery protocol",
      poem: "Rest is resistance.\nSleep is the sacred reset.",
      advice: [
        "Prioritise restful sleep the night before",
        "Aim to be in bed before 23:00",
        "Entering rest early optimises your hormonal balance",
        "Your body stores energy during deep sleep",
        "If short on sleep, a 20-minute nap helps",
      ],
    },
  },
  de: {
    title: "Vorbereitung", subtitle: "Von innen heraus strahlen",
    sections: {
      testing: "Labor-Check",
      essentials: "Essentials",
      nutrition: "Ernährung",
      rest: "Erholung",
    },
    button: "Ich bin bereit",
    testing: {
      title: "Teste deine Substanzen",
      sub: "Erst die Sicherheit — dann alles andere",
      poem: "Wisse, was du trägst.\nLiebe beginnt mit Wahrheit.",
      desc: "Anonymes Labor-Testing ist der wichtigste Schritt. Wisse genau, was du konsumierst, bevor deine Session beginnt.",
      cta: "Anonymen Lab-Test buchen",
      skip: "Ich habe meine Substanzen bereits getestet",
    },
    essentials: {
      title: "Harm-Reduction-Kit",
      sub: "Dein Schutzprotokoll",
      poem: "Vorbereitet mit Sorgfalt.\nDu ehrst dich selbst.",
      items: [
        { name: "Handy (100 % geladen)", why: "Deine Lebensader zu deinem Circle of Love" },
        { name: "Einweg-Röhrchen", why: "Verhindert Kreuzkontamination — niemals teilen" },
        { name: "Zink-Supplement", dose: "15–30 mg", why: "Stärkt Immunfunktion und Neurotransmitter" },
        { name: "Magnesium-Supplement", dose: "200–400 mg", why: "Reduziert Verspannungen, stützt Herzrhythmus" },
        { name: "Elektrolyte", dose: "Nach Bedarf", why: "Erhält Hydration und Mineralbalance" },
        { name: "Desinfektionstücher", why: "Oberflächen vor dem Gebrauch reinigen" },
        { name: "Kreditkarten-Platten (×2)", why: "Dedizierte, saubere Oberflächen verwenden" },
        { name: "Kondome", why: "Schutz bei Intimität" },
        { name: "Gleitmittel", why: "Komfort und Schutz" },
      ],
    },
    nutrition: {
      title: "Physische Resonanz",
      sub: "Stabiler Treibstoff für deine Reise",
      poem: "Nähre das Gefäß.\nLiebe fließt durch einen gepflegten Körper.",
      advice: [
        "Iss 3–4 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit",
        "Wähle komplexe Kohlenhydrate und mageres Protein",
        "Vermeide schwere, fettige oder verarbeitete Speisen",
        "Ein leichter Snack 1 Stunde vorher ist in Ordnung",
        "Bleib hydratisiert — trinke den ganzen Tag über gleichmäßig",
      ],
    },
    rest: {
      title: "Kalibrierung des Nervensystems",
      sub: "Tiefes Erholungsprotokoll",
      poem: "Ruhe ist Widerstand.\nSchlaf ist das heilige Zurücksetzen.",
      advice: [
        "Priorisiere erholsamen Schlaf in der Nacht zuvor",
        "Sei vor 23:00 Uhr im Bett",
        "Frühes Einschlafen optimiert dein Hormongleichgewicht",
        "Dein Körper speichert Energie im Tiefschlaf",
        "Bei wenig Schlaf hilft ein 20-minütiges Nickerchen",
      ],
    },
  },
};

type Section = 'testing' | 'essentials' | 'nutrition' | 'rest';

const CIRCLES: { id: Section; icon: React.ReactNode; colorClass: string }[] = [
  { id: 'testing',   icon: <Microscope size={22} />,  colorClass: 'text-primary border-primary/40 bg-primary/5' },
  { id: 'essentials',icon: <Shield size={22} />,       colorClass: 'text-amber-500 border-amber-400/40 bg-amber-400/5' },
  { id: 'nutrition', icon: <Apple size={22} />,        colorClass: 'text-emerald-500 border-emerald-400/40 bg-emerald-400/5' },
  { id: 'rest',      icon: <Moon size={22} />,         colorClass: 'text-purple-400 border-purple-400/40 bg-purple-400/5' },
];

function LabContent({ t, onBook }: { t: any; onBook: () => void }) {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">{t.sub}</p>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">{t.title}</h3>
      </div>
      <p className="text-sm text-foreground/70 leading-relaxed italic whitespace-pre-line">"{t.poem}"</p>
      <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
      {!confirmed ? (
        <div className="space-y-3">
          <button
            onClick={() => { playHeartbeat(); onBook(); }}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <FlaskConical size={16} /> {t.cta}
          </button>
          <button
            onClick={() => { playHeartbeat(); setConfirmed(true); }}
            className="w-full h-12 border border-border rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            {t.skip}
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-2xl">
          <CheckCircle2 size={20} className="text-primary shrink-0" />
          <p className="text-sm font-semibold text-primary uppercase tracking-wide">Substances confirmed ✓</p>
        </div>
      )}
    </div>
  );
}

function EssentialsContent({ t }: { t: any }) {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (name: string) =>
    setChecked((prev) => prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]);
  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-500">{t.sub}</p>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">{t.title}</h3>
      </div>
      <p className="text-sm text-foreground/70 italic">"{t.poem}"</p>
      <div className="space-y-2">
        {t.items.map((item: any) => {
          const isChecked = checked.includes(item.name);
          return (
            <div
              key={item.name}
              onClick={() => { playHeartbeat(); toggle(item.name); }}
              className={cn(
                'flex items-start gap-3 p-4 rounded-2xl border cursor-pointer transition-all duration-200',
                isChecked ? 'bg-amber-400/10 border-amber-400/40' : 'bg-card border-border hover:border-amber-400/30',
              )}
            >
              <div className={cn(
                'w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-all',
                isChecked ? 'bg-amber-400 border-amber-400' : 'border-border/50',
              )}>
                {isChecked && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-foreground uppercase tracking-tight">
                  {item.name} {item.dose && <span className="text-muted-foreground font-medium normal-case">({item.dose})</span>}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.why}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p className={cn(
        'text-center text-[9px] font-black uppercase tracking-widest transition-all',
        checked.length >= 5 ? 'text-amber-500' : 'text-muted-foreground/40',
      )}>
        {checked.length >= 5 ? `✓ ${checked.length} items checked — well prepared` : `Check 5+ items to boost your care streak`}
      </p>
    </div>
  );
}

function ListContent({ t, color }: { t: any; color: string }) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="space-y-1">
        <p className={cn('text-[10px] font-black uppercase tracking-[0.4em]', color)}>{t.sub}</p>
        <h3 className="text-2xl font-black uppercase tracking-tighter text-foreground">{t.title}</h3>
      </div>
      <p className="text-sm text-foreground/70 italic leading-relaxed">"{t.poem}"</p>
      <div className="space-y-3">
        {t.advice.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-card border border-border">
            <ChevronRight size={14} className={cn('shrink-0 mt-0.5', color)} />
            <p className="text-sm text-foreground/80 leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function BeforePhase() {
  const [, setLocation] = useLocation();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<Section>('testing');
  const [hoveredCircle, setHoveredCircle] = useState<Section | null>(null);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <main className="min-h-screen bg-background text-foreground font-headline flex flex-col">
      {/* Header */}
      <header className="px-6 py-5 border-b border-border bg-card/90 backdrop-blur-xl flex items-center gap-4 sticky top-0 z-50">
        <button
          onClick={() => setLocation('/supporter')}
          className="p-2 rounded-full border border-border bg-card hover:border-primary transition-colors shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-lg font-black uppercase tracking-tighter text-foreground">{t.title}</h1>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">{t.subtitle}</p>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel: 4 navigation circles */}
        <aside className="flex flex-col items-center gap-6 py-10 px-3 border-r border-border bg-card/40 shrink-0 w-16 md:w-20">
          {CIRCLES.map((circle) => {
            const isActive = activeSection === circle.id;
            const isHovered = hoveredCircle === circle.id;
            return (
              <div key={circle.id} className="relative flex flex-col items-center">
                <button
                  onClick={() => { playHeartbeat(); setActiveSection(circle.id); }}
                  onMouseEnter={() => setHoveredCircle(circle.id)}
                  onMouseLeave={() => setHoveredCircle(null)}
                  className={cn(
                    'w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                    isActive
                      ? cn('scale-110 shadow-soft', circle.colorClass)
                      : 'bg-card border-border hover:scale-105 text-muted-foreground hover:text-foreground',
                  )}
                  aria-label={t.sections[circle.id]}
                >
                  <span className={cn('w-4 h-4 md:w-5 md:h-5', isActive && circle.colorClass.split(' ')[0])}>
                    {circle.icon}
                  </span>
                </button>

                {/* Hover tooltip → right side */}
                <div
                  className={cn(
                    'absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50',
                    'bg-card border border-border rounded-xl px-3 py-1.5 shadow-soft',
                    'whitespace-nowrap pointer-events-none transition-all duration-200',
                    isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
                  )}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                    {t.sections[circle.id]}
                  </span>
                </div>

                {/* Active indicator dot */}
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-primary mt-1" />
                )}
              </div>
            );
          })}

          {/* Vertical connector line */}
          <div className="flex-1 w-px bg-border/40 mx-auto -mt-2" />
        </aside>

        {/* Main content area */}
        <ScrollArea className="flex-1">
          <div className="p-6 md:p-10 max-w-2xl mx-auto space-y-6 pb-32">

            {/* Affirmation strip */}
            <div className="text-center py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/60">
                {lang === 'de' ? '"Bereite dich mit Liebe vor"' : '"Prepare with love"'}
              </p>
            </div>

            {/* Section content */}
            {activeSection === 'testing' && (
              <LabContent t={t.testing} onBook={() => setLocation('/laboratory-test')} />
            )}
            {activeSection === 'essentials' && (
              <EssentialsContent t={t.essentials} />
            )}
            {activeSection === 'nutrition' && (
              <ListContent t={t.nutrition} color="text-emerald-500" />
            )}
            {activeSection === 'rest' && (
              <ListContent t={t.rest} color="text-purple-400" />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Bottom CTA */}
      <footer className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-card/90 backdrop-blur-xl border-t border-border z-40 pb-safe">
        <button
          onClick={() => { playHeartbeat(); setLocation('/supporter'); }}
          className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-soft"
        >
          {t.button}
        </button>
      </footer>
    </main>
  );
}

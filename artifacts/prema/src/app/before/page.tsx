import React, { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import {
  ArrowLeft, Apple, Moon, Loader2,
  CheckCircle2, ChevronRight,
  Shield, Microscope, ZapOff,
  FlaskConical, Clock, GlassWater, Watch,
} from "lucide-react";
import { PulseSync } from '@/components/dashboard/PulseSync';
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { playHeartbeat } from '@/lib/intention';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CONTENT = {
  en: {
    title: "Preparation", subtitle: "Radiate from within",
    sections: {
      testing: "Lab Testing",
      essentials: "Essentials Kit",
      nutrition: "Physical Intention",
      rest: "Nervous System",
      alarms: "Care Alarms",
      sync: "Pulse Sync",
    },
    button: "I am prepared",
    testing: {
      title: "Test Your Substances",
      sub: "Before anything else — safety first",
      desc: "Anonymous lab testing is the most important step you can take. Know exactly what you're consuming before your session.",
      cta: "Book Anonymous Lab Test",
      skip: "I have already tested my substances",
      confirmed: "Substances confirmed",
    },
    essentials: {
      title: "Essentials Kit",
      sub: "Your care protocol",
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
      done: "Kit confirmed",
    },
    nutrition: {
      title: "Physical Intention",
      sub: "Steady fuel for your journey",
      advice: [
        "Eat a balanced meal 3–4 hours before you head out",
        "Choose complex carbohydrates and lean protein",
        "Avoid heavy, greasy, or processed foods",
        "A light snack 1 hour before is fine",
        "Stay hydrated — sip water steadily throughout the day",
      ],
      done: "Nutrition confirmed",
    },
    rest: {
      title: "Nervous System Calibration",
      sub: "Deep recovery protocol",
      advice: [
        "Prioritise restful sleep the night before",
        "Aim to be in bed before 23:00",
        "Entering rest early optimises your hormonal balance",
        "Your body stores energy during deep sleep",
        "If short on sleep, a 20-minute nap helps",
      ],
      done: "Rest protocol confirmed",
    },
    alarms: {
      title: "Care Alarms",
      sub: "Connected to Pulse Guardian",
      limit: "Intake Limit",
      limitSub: "Total logged units",
      leave: "Departure Time",
      leaveSub: "Target leave time",
      rest: "Rest Intervals",
      restSub: "Breathing break frequency",
      water: "Hydration Sync",
      waterSub: "Water reminder frequency",
      confirm: "Activate care alarms",
      done: "Care alarms activated",
    },
  },
  de: {
    title: "Vorbereitung", subtitle: "Von innen heraus strahlen",
    sections: {
      testing: "Labor-Check",
      essentials: "Essentials Kit",
      nutrition: "Physische Resonanz",
      rest: "Nervensystem",
      alarms: "Pflege-Alarme",
      sync: "Puls-Sync",
    },
    button: "Ich bin bereit",
    testing: {
      title: "Teste deine Substanzen",
      sub: "Erst die Sicherheit — dann alles andere",
      desc: "Anonymes Labor-Testing ist der wichtigste Schritt. Wisse genau, was du konsumierst, bevor deine Session beginnt.",
      cta: "Anonymen Lab-Test buchen",
      skip: "Ich habe meine Substanzen bereits getestet",
      confirmed: "Substanzen bestätigt",
    },
    essentials: {
      title: "Essentials Kit",
      sub: "Dein Pflege-Protokoll",
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
      done: "Kit bestätigt",
    },
    nutrition: {
      title: "Physische Resonanz",
      sub: "Stabiler Treibstoff für deine Reise",
      advice: [
        "Iss 3–4 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit",
        "Wähle komplexe Kohlenhydrate und mageres Protein",
        "Vermeide schwere, fettige oder verarbeitete Speisen",
        "Ein leichter Snack 1 Stunde vorher ist in Ordnung",
        "Bleib hydratisiert — trinke den ganzen Tag über gleichmäßig",
      ],
      done: "Ernährung bestätigt",
    },
    rest: {
      title: "Kalibrierung des Nervensystems",
      sub: "Tiefes Erholungsprotokoll",
      advice: [
        "Priorisiere erholsamen Schlaf in der Nacht zuvor",
        "Sei vor 23:00 Uhr im Bett",
        "Frühes Einschlafen optimiert dein Hormongleichgewicht",
        "Dein Körper speichert Energie im Tiefschlaf",
        "Bei wenig Schlaf hilft ein 20-minütiges Nickerchen",
      ],
      done: "Erholungsprotokoll bestätigt",
    },
    alarms: {
      title: "Pflege-Alarme",
      sub: "Verbunden mit dem Pulse Guardian",
      limit: "Limit",
      limitSub: "Gesamte Einheiten",
      leave: "Abfahrtzeit",
      leaveSub: "Geplante Abfahrt",
      rest: "Pausen Intervalle",
      restSub: "Atempausen-Frequenz",
      water: "Hydration",
      waterSub: "Wasser-Erinnerung",
      confirm: "Alarme aktivieren",
      done: "Alarme aktiviert",
    },
  },
};

type Section = 'testing' | 'essentials' | 'nutrition' | 'rest' | 'alarms' | 'sync';
const SECTION_ORDER: Section[] = ['testing', 'essentials', 'nutrition', 'rest', 'alarms', 'sync'];

const CIRCLES: {
  id: Section;
  icon: React.ReactNode;
  activeColor: string;
  glowColor: string;
  borderActive: string;
  borderIdle: string;
  bgActive: string;
}[] = [
  {
    id: 'testing',
    icon: <Microscope size={20} />,
    activeColor: 'text-primary',
    glowColor: 'rgba(27,77,62,0.35)',
    borderActive: 'border-primary',
    borderIdle: 'border-primary/20',
    bgActive: 'bg-primary/10',
  },
  {
    id: 'essentials',
    icon: <Shield size={20} />,
    activeColor: 'text-amber-500',
    glowColor: 'rgba(245,158,11,0.35)',
    borderActive: 'border-amber-400',
    borderIdle: 'border-amber-400/20',
    bgActive: 'bg-amber-400/10',
  },
  {
    id: 'nutrition',
    icon: <Apple size={20} />,
    activeColor: 'text-emerald-500',
    glowColor: 'rgba(52,211,153,0.35)',
    borderActive: 'border-emerald-400',
    borderIdle: 'border-emerald-400/20',
    bgActive: 'bg-emerald-400/10',
  },
  {
    id: 'rest',
    icon: <Moon size={20} />,
    activeColor: 'text-purple-400',
    glowColor: 'rgba(167,139,250,0.35)',
    borderActive: 'border-purple-400',
    borderIdle: 'border-purple-400/20',
    bgActive: 'bg-purple-400/10',
  },
  {
    id: 'alarms',
    icon: <ZapOff size={20} />,
    activeColor: 'text-cyan-400',
    glowColor: 'rgba(34,211,238,0.35)',
    borderActive: 'border-cyan-400',
    borderIdle: 'border-cyan-400/20',
    bgActive: 'bg-cyan-400/10',
  },
  {
    id: 'sync',
    icon: <Watch size={20} />,
    activeColor: 'text-sky-400',
    glowColor: 'rgba(56,189,248,0.35)',
    borderActive: 'border-sky-400',
    borderIdle: 'border-sky-400/20',
    bgActive: 'bg-sky-400/10',
  },
];

function LabContent({
  t,
  onBook,
  onConfirm,
  alreadyDone,
}: {
  t: any;
  onBook: () => void;
  onConfirm: () => void;
  alreadyDone: boolean;
}) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="space-y-1.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-primary/60">{t.sub}</p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{t.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground/80 leading-loose font-light">{t.desc}</p>
      {alreadyDone ? (
        <div className="flex items-center gap-3 p-4 bg-primary/10 border border-primary/30 rounded-2xl">
          <CheckCircle2 size={20} className="text-primary shrink-0" />
          <p className="text-sm font-black text-primary uppercase tracking-wide">{t.confirmed} ✓</p>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => { playHeartbeat(); onBook(); }}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <FlaskConical size={16} /> {t.cta}
          </button>
          <button
            onClick={() => { playHeartbeat(); onConfirm(); }}
            className="w-full h-12 border border-border rounded-2xl text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            {t.skip}
          </button>
        </div>
      )}
    </div>
  );
}

function EssentialsContent({ t, alreadyDone, onConfirm }: { t: any; alreadyDone: boolean; onConfirm: () => void }) {
  const [checked, setChecked] = useState<string[]>([]);
  const toggle = (name: string) =>
    setChecked((prev) => prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]);
  const allChecked = checked.length >= t.items.length;

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-amber-500/70">{t.sub}</p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{t.title}</h3>
      </div>
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
                {isChecked && <CheckCircle2 size={11} className="text-white" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground/90 tracking-tight">
                  {item.name} {item.dose && <span className="text-muted-foreground/70 font-light text-xs">· {item.dose}</span>}
                </p>
                <p className="text-[10px] text-muted-foreground/60 font-light mt-0.5 leading-relaxed">{item.why}</p>
              </div>
            </div>
          );
        })}
      </div>

      {alreadyDone ? (
        <div className="flex items-center gap-3 p-4 bg-amber-400/10 border border-amber-400/30 rounded-2xl">
          <CheckCircle2 size={20} className="text-amber-500 shrink-0" />
          <p className="text-sm font-black text-amber-500 uppercase tracking-wide">{t.done} ✓</p>
        </div>
      ) : (
        <button
          onClick={() => { playHeartbeat(); onConfirm(); }}
          disabled={!allChecked}
          className={cn(
            'w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all',
            allChecked
              ? 'bg-amber-400 text-white active:scale-95'
              : 'bg-card border border-border text-muted-foreground cursor-not-allowed opacity-50',
          )}
        >
          {t.done}
        </button>
      )}
    </div>
  );
}

function ListContent({
  t,
  color,
  doneText,
  alreadyDone,
  onConfirm,
}: {
  t: any;
  color: string;
  doneText: string;
  alreadyDone: boolean;
  onConfirm: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      <div className="space-y-1.5">
        <p className={cn('text-[9px] font-medium uppercase tracking-[0.5em] opacity-60', color)}>{t.sub}</p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{t.title}</h3>
      </div>
      <div className="space-y-2">
        {t.advice.map((tip: string, i: number) => (
          <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-2xl bg-card/60 border border-border/50">
            <div className={cn('w-1 h-1 rounded-full mt-2 shrink-0 opacity-50', color.replace('text-', 'bg-'))} />
            <p className="text-sm text-foreground/70 leading-loose font-light">{tip}</p>
          </div>
        ))}
      </div>

      {alreadyDone ? (
        <div className={cn('flex items-center gap-3 p-4 rounded-2xl border', color.replace('text-', 'border-').replace('400', '400/30').replace('500', '500/30'), color.replace('text-', 'bg-').replace('400', '400/10').replace('500', '500/10'))}>
          <CheckCircle2 size={20} className={cn(color, 'shrink-0')} />
          <p className={cn('text-sm font-black uppercase tracking-wide', color)}>{doneText} ✓</p>
        </div>
      ) : (
        <button
          onClick={() => { playHeartbeat(); onConfirm(); }}
          className={cn(
            'w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95',
            color === 'text-emerald-500' && 'bg-emerald-500 text-white',
            color === 'text-purple-400' && 'bg-purple-500 text-white',
          )}
        >
          {doneText}
        </button>
      )}
    </div>
  );
}

function AlarmsContent({ t, alreadyDone, onConfirm }: { t: any; alreadyDone: boolean; onConfirm: () => void }) {
  const [settings, setSettings] = useState({
    intakeLimit: '5', intakeUnit: 'units',
    leaveTime: '04:00',
    restInterval: '60',
    waterInterval: '45',
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <div className="space-y-1.5">
        <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-cyan-400/60">{t.sub}</p>
        <h3 className="text-xl font-semibold tracking-tight text-foreground">{t.title}</h3>
      </div>

      {/* Intake Limit */}
      <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-xl"><ZapOff size={18} className="text-amber-500" /></div>
          <div>
            <p className="text-sm font-black uppercase text-foreground">{t.limit}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.limitSub}</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={settings.intakeLimit} onValueChange={(val) => setSettings({ ...settings, intakeLimit: val })}>
            <SelectTrigger className="w-16 h-9 text-xs font-black rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['0','1','2','3','4','5','6'].map(v => <SelectItem key={v} value={v}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={settings.intakeUnit} onValueChange={(val) => setSettings({ ...settings, intakeUnit: val })}>
            <SelectTrigger className="w-24 h-9 text-xs font-black rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {['units','grams','lines','joints','beers','shots'].map(v => (
                <SelectItem key={v} value={v}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Departure Time */}
      <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-400/10 rounded-xl"><Clock size={18} className="text-blue-400" /></div>
          <div>
            <p className="text-sm font-black uppercase text-foreground">{t.leave}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.leaveSub}</p>
          </div>
        </div>
        <input
          type="time"
          value={settings.leaveTime}
          onChange={(e) => setSettings({ ...settings, leaveTime: e.target.value })}
          className="w-24 h-9 bg-card border border-border rounded-xl px-2 font-black text-foreground text-xs outline-none focus:border-primary transition-all"
        />
      </div>

      {/* Rest Intervals */}
      <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-400/10 rounded-xl"><Moon size={18} className="text-purple-400" /></div>
          <div>
            <p className="text-sm font-black uppercase text-foreground">{t.rest}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.restSub}</p>
          </div>
        </div>
        <Select value={settings.restInterval} onValueChange={(val) => setSettings({ ...settings, restInterval: val })}>
          <SelectTrigger className="w-20 h-9 text-xs font-black rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['30','60','90','120'].map(v => <SelectItem key={v} value={v}>{v} min</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Hydration */}
      <div className="p-5 bg-card border border-border rounded-2xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-400/10 rounded-xl"><GlassWater size={18} className="text-cyan-400" /></div>
          <div>
            <p className="text-sm font-black uppercase text-foreground">{t.water}</p>
            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.waterSub}</p>
          </div>
        </div>
        <Select value={settings.waterInterval} onValueChange={(val) => setSettings({ ...settings, waterInterval: val })}>
          <SelectTrigger className="w-20 h-9 text-xs font-black rounded-xl">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {['20','30','45','60'].map(v => <SelectItem key={v} value={v}>{v} min</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {alreadyDone ? (
        <div className="flex items-center gap-3 p-4 bg-cyan-400/10 border border-cyan-400/30 rounded-2xl">
          <CheckCircle2 size={20} className="text-cyan-400 shrink-0" />
          <p className="text-sm font-black text-cyan-400 uppercase tracking-wide">{t.done} ✓</p>
        </div>
      ) : (
        <button
          onClick={() => { playHeartbeat(); onConfirm(); }}
          className="w-full h-12 bg-cyan-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
        >
          {t.confirm}
        </button>
      )}
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
  const [completed, setCompleted] = useState<Record<Section, boolean>>({
    testing: false,
    essentials: false,
    nutrition: false,
    rest: false,
    alarms: false,
    sync: false,
  });

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

  const markComplete = (section: Section, next?: Section) => {
    setCompleted((prev) => ({ ...prev, [section]: true }));
    if (next) {
      // small delay so the user sees the confirmation briefly
      setTimeout(() => setActiveSection(next), 600);
    }
  };

  const allComplete = SECTION_ORDER.every((s) => completed[s]);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;
  const circle = CIRCLES.find((c) => c.id === activeSection)!;

  return (
    <main className="h-screen bg-background text-foreground font-headline flex flex-col overflow-hidden">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-card/90 backdrop-blur-xl flex items-center gap-4 shrink-0">
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

        {/* Progress dots */}
        <div className="ml-auto flex items-center gap-1.5">
          {SECTION_ORDER.map((s) => (
            <div
              key={s}
              className={cn(
                'w-1.5 h-1.5 rounded-full transition-all duration-300',
                completed[s] ? 'bg-primary scale-125' : 'bg-border',
              )}
            />
          ))}
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left panel: 5 animated circles */}
        <aside className="flex flex-col items-center gap-5 py-8 px-2 border-r border-border bg-card/30 shrink-0 w-[64px]">
          {CIRCLES.map((c) => {
            const isActive = activeSection === c.id;
            const isDone = completed[c.id];

            return (
              <div key={c.id} className="relative flex flex-col items-center">
                {/* Ping animation for active */}
                {isActive && (
                  <span
                    className="absolute inset-0 rounded-full animate-ping pointer-events-none"
                    style={{ backgroundColor: c.glowColor, opacity: 0.35 }}
                  />
                )}
                {/* Soft halo for active */}
                {isActive && (
                  <div
                    className="absolute inset-[-5px] rounded-full blur-[8px] pointer-events-none"
                    style={{ backgroundColor: c.glowColor, opacity: 0.4 }}
                  />
                )}

                <button
                  onClick={() => { playHeartbeat(); setActiveSection(c.id); }}
                  onMouseEnter={() => setHoveredCircle(c.id)}
                  onMouseLeave={() => setHoveredCircle(null)}
                  className={cn(
                    'relative z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500',
                    isActive
                      ? cn('scale-110 border border-current', c.bgActive, c.activeColor)
                      : isDone
                        ? 'text-primary/50 opacity-70 hover:opacity-100 hover:scale-105'
                        : 'text-muted-foreground/30 hover:text-muted-foreground/60 hover:scale-105',
                  )}
                  style={isActive ? { boxShadow: `0 0 16px ${c.glowColor}` } : {}}
                  aria-label={t.sections[c.id]}
                >
                  {isDone ? <CheckCircle2 size={14} className="text-primary/60" /> : <span className="scale-90">{c.icon}</span>}
                </button>

                {/* Hover tooltip */}
                <div
                  className={cn(
                    'absolute left-full ml-3 top-1/2 -translate-y-1/2 z-50',
                    'bg-card border border-border rounded-xl px-3 py-1.5 shadow-soft',
                    'whitespace-nowrap pointer-events-none transition-all duration-200',
                    hoveredCircle === c.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
                  )}
                >
                  <span className="text-[9px] font-black uppercase tracking-widest text-foreground">
                    {t.sections[c.id]}
                  </span>
                </div>

                {/* Active indicator dot */}
                {isActive && <div className="w-1 h-1 rounded-full bg-primary mt-1 relative z-10" />}
              </div>
            );
          })}

          {/* Connector line */}
          <div className="flex-1 w-px bg-border/30 mx-auto" />
        </aside>

        {/* Main content */}
        <ScrollArea className="flex-1">
          <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-5 pb-32">
            {/* Affirmation */}
            <div className="text-center py-2">
              <p className="text-[9px] font-black uppercase tracking-[0.5em] text-primary/60">
                {lang === 'de' ? '"Bereite dich mit Liebe vor"' : '"Prepare with love"'}
              </p>
            </div>

            {activeSection === 'testing' && (
              <LabContent
                t={t.testing}
                alreadyDone={completed.testing}
                onBook={() => setLocation('/laboratory-test')}
                onConfirm={() => markComplete('testing', 'essentials')}
              />
            )}
            {activeSection === 'essentials' && (
              <EssentialsContent
                t={t.essentials}
                alreadyDone={completed.essentials}
                onConfirm={() => markComplete('essentials', 'nutrition')}
              />
            )}
            {activeSection === 'nutrition' && (
              <ListContent
                t={t.nutrition}
                color="text-emerald-500"
                doneText={t.nutrition.done}
                alreadyDone={completed.nutrition}
                onConfirm={() => markComplete('nutrition', 'rest')}
              />
            )}
            {activeSection === 'rest' && (
              <ListContent
                t={t.rest}
                color="text-purple-400"
                doneText={t.rest.done}
                alreadyDone={completed.rest}
                onConfirm={() => markComplete('rest', 'alarms')}
              />
            )}
            {activeSection === 'alarms' && (
              <AlarmsContent
                t={t.alarms}
                alreadyDone={completed.alarms}
                onConfirm={() => markComplete('alarms', 'sync')}
              />
            )}
            {activeSection === 'sync' && (
              <PulseSync onComplete={() => markComplete('sync')} />
            )}
          </div>
        </ScrollArea>
      </div>

      {/* "I am prepared" — only after ALL 5 sections complete */}
      {allComplete && (
        <footer className="fixed bottom-0 left-0 right-0 px-6 py-4 bg-card/95 backdrop-blur-xl border-t border-primary/20 z-40 pb-safe animate-in slide-in-from-bottom duration-500">
          <div className="flex items-center gap-3 mb-3 justify-center">
            <CheckCircle2 size={16} className="text-primary" />
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">
              {lang === 'de' ? 'Alle Schritte abgeschlossen' : 'All steps complete'}
            </p>
          </div>
          <button
            onClick={() => {
              playHeartbeat();
              // Mark session as prepared, During becomes center in Supporter
              localStorage.setItem('prema_session_phase', 'during');
              setLocation('/supporter');
            }}
            className="w-full h-14 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-sm tracking-widest active:scale-95 transition-all shadow-soft"
          >
            {t.button}
          </button>
        </footer>
      )}
    </main>
  );
}

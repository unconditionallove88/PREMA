
'use client';

import { useState, useEffect, useMemo } from 'react';
import { 
  Loader2, 
  Search, 
  Trash2,
  Calendar,
  Microscope,
  Wine, 
  Leaf, 
  FlaskConical, 
  Heart, 
  Droplets, 
  Zap, 
  Eye, 
  Orbit, 
  CheckCircle2,
  X,
  Diamond,
  HeartHandshake,
  Users2,
  ShieldCheck,
  Sparkles,
  Wind,
  Info,
  BookOpen,
  Plus,
  Minus,
  Volume2,
  Skull,
  Mic,
  MicOff,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { AiSafetyChat } from '@/components/chat/AiSafetyChat';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StepSomethingToRemember as WisdomProtocol } from '@/components/onboarding/StepSomethingToRemember';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import { textToSpeech } from '@/ai/flows/text-to-speech';

/**
 * @fileOverview Sovereign Lab Component.
 * Features: Self-Honesty, responsible intake tracking, and Mixing Wisdom warnings.
 * Fixed: Safety Advisor (Supporter) Dialog integration.
 */

const MushroomIcon = ({ className, size = 24 }: { className?: string, size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M12 21v-6" /><path d="M5 15c0-4 3-7 7-7s7 3 7 7" /><path d="M12 8c-2.5 0-4.5 2-4.5 4.5" />
  </svg>
);

const CONTENT = {
  en: {
    title: "Sovereign Lab", advisor: "Open Safety Advisor", search: "Find...",
    diary: "Session Diary", records: "Records", sync: "Sync Truth", intake: "Honest Intake Entry",
    confirm: "Log My Truth", cancel: "Cancel Entry", amount: "Amount", doseLogged: "Truth logged",
    addedToDiary: "added to your session diary", causionTitle: "Pulse Guardian: Caution 🧪",
    poppersHR: (hr: number) => `Your heart rate is ${hr} BPM Poppers will drop your blood pressure sharply Please sit down and breathe before use`,
    responsibility: "I take full responsibility for my actions",
    honestyTitle: "Moment of Truth",
    honestyDesc: "I am honest with myself and I respect my body's limits. This entry is a record of my sovereign choice.",
    affirmBtn: "I Affirm My Truth",
    syncProceed: "Proceed with Love", noResults: "No substances found",
    wisdom: "Mixing Wisdom",
    listening: "Listening...",
    mixingWarningTitle: "Critical Mixing Warning",
    riskHigh: "High Risk Interaction",
    riskCritical: "Critical Biological Threat",
    consequence: "Consequences for health & organs:"
  },
  de: {
    title: "Souveränitäts-Lab", advisor: "Sicherheits-Begleiter", search: "Suchen...",
    diary: "Sitzungs-Tagebuch", records: "Einträge", sync: "Session Wahrheit", intake: "Ehrlicher Eintrag heute",
    confirm: "Meine Wahrheit notieren", cancel: "Abbrechen", amount: "Menge", doseLogged: "Wahrheit notiert",
    addedToDiary: "wurde deinem Tagebuch hinzugefügt", causionTitle: "Pulse Guardian: Vorsicht 🧪",
    poppersHR: (hr: number) => `Dein Puls liegt bei ${hr} BPM Poppers senkt den Blutdruck stark ab Bitte nimm dir einen Moment Zeit, setz dich hin und atme tief durch`,
    responsibility: "Ich übernehme volle Verantwortung heute",
    honestyTitle: "Moment der Wahrheit",
    honestyDesc: "Ich bin ehrlich zu mir selbst und achte meine Grenzen heute. Dieser Eintrag spiegelt meine souveräne Entscheidung wider.",
    affirmBtn: "Ich bestätige meine Wahrheit",
    syncProceed: "Mit Liebe fortfahren", noResults: "Keine Substanzen gefunden",
    wisdom: "Misch-Weisheiten",
    listening: "Höre zu...",
    mixingWarningTitle: "Kritische Misch-Warnung",
    riskHigh: "Hohes Risiko Interaktion",
    riskCritical: "Kritische biologische Bedrohung",
    consequence: "Folgen für Gesundheit & Organe:"
  }
};

const SUBSTANCES = [
  { id: 'alcohol', icon: Wine, name: 'Alcohol', deName: 'Alkohol', aliases: ['beer', 'wine', 'shot', 'vodka', 'whiskey', 'gin', 'rum', 'tequila'], color: 'text-amber-500', isHeavy: false, unit: 'Items', inputType: 'cart' },
  { id: 'cannabis', icon: Leaf, name: 'Cannabis', deName: 'Cannabis', aliases: ['weed', 'pot', 'joint', 'grass', 'hash'], color: 'text-emerald-500', isHeavy: false, unit: 'g', inputType: 'manual' },
  { id: 'mdma', icon: Sparkles, name: 'MDMA', deName: 'MDMA', aliases: ['molly', 'mandy'], color: 'text-purple-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'cocaine', icon: Diamond, name: 'Cocaine', deName: 'Kokain', aliases: ['coke', 'snow', 'blow', 'white'], color: 'text-slate-200', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'ketamine', icon: FlaskConical, name: 'Ketamine', deName: 'Ketamin', aliases: ['k', 'special k', 'kitty'], color: 'text-indigo-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'ecstasy', icon: Heart, name: 'Ecstasy', deName: 'Ecstasy', aliases: ['e', 'beans', 'xtc', 'pills'], color: 'text-pink-500', isHeavy: true, unit: 'pills', inputType: 'manual' },
  { id: 'ghb', icon: Droplets, name: 'GHB/GBL', deName: 'GHB/GBL', aliases: ['g', 'liquid x', 'gina'], color: 'text-blue-400', isHeavy: true, unit: 'ml', inputType: 'manual' },
  { id: 'speed', icon: Zap, name: 'Speed', deName: 'Speed', aliases: ['amphetamines', 'pep'], color: 'text-yellow-400', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'lsd', icon: Eye, name: 'LSD', deName: 'LSD', aliases: ['acid', 'tabs', 'lcd'], color: 'text-cyan-400', isHeavy: false, unit: 'ug', inputType: 'manual' },
  { id: '2cb', icon: Orbit, name: '2C-B', deName: '2C-B', aliases: ['nexus'], color: 'text-orange-400', isHeavy: true, unit: 'mg', inputType: 'manual' },
  { id: 'psilocybin', icon: MushroomIcon, name: 'Psilocybin', deName: 'Psilocybin', aliases: ['mushrooms', 'shrooms'], color: 'text-emerald-400', isHeavy: false, unit: 'g', inputType: 'manual' },
  { id: 'poppers', icon: Wind, name: 'Poppers', deName: 'Poppers', aliases: ['amyl', 'nitrite'], color: 'text-amber-400', isHeavy: true, unit: 'hits', inputType: 'manual' },
  { id: 'heroin', icon: Skull, name: 'Heroin', deName: 'Heroin', aliases: ['h', 'smack', 'junk', 'brown'], color: 'text-red-900', isHeavy: true, unit: 'g', inputType: 'manual' },
  { id: 'fentanyl', icon: Skull, name: 'Fentanyl', deName: 'Fentanyl', aliases: ['fent', 'apaches'], color: 'text-red-600', isHeavy: true, unit: 'mg', inputType: 'manual' },
  { id: 'oxycodone', icon: FlaskConical, name: 'Oxycodone', deName: 'Oxycodon', aliases: ['oxy', 'perc'], color: 'text-indigo-900', isHeavy: true, unit: 'mg', inputType: 'manual' },
  { id: 'tilidine', icon: FlaskConical, name: 'Tilidine', deName: 'Tilidin', aliases: ['tilli'], color: 'text-indigo-600', isHeavy: true, unit: 'mg', inputType: 'manual' },
];

const DANGEROUS_COMBOS = [
  { pair: ['alcohol', 'ghb'], risk: 'Critical', note: { en: 'Extreme respiratory failure risk & fatal blackouts.', de: 'Extremes Risiko für Atemstillstand und tödliche Blackouts.' } },
  { pair: ['ketamine', 'ghb'], risk: 'Critical', note: { en: 'Severe respiratory risk & loss of consciousness.', de: 'Schwere Atemnot und Bewusstlosigkeit.' } },
  { pair: ['alcohol', 'ketamine'], risk: 'High', note: { en: 'Severe nausea, dizziness, and choking risk.', de: 'Starke Übelkeit, Schwindel und Erstickungsgefahr.' } },
  { pair: ['alcohol', 'heroin'], risk: 'Critical', note: { en: 'Lethal respiratory depression risk.', de: 'Tödliches Risiko für Atemdepression.' } },
  { pair: ['alcohol', 'fentanyl'], risk: 'Critical', note: { en: 'Lethal respiratory depression risk.', de: 'Tödliches Risiko für Atemdepression.' } },
  { pair: ['alcohol', 'oxycodone'], risk: 'Critical', note: { en: 'Lethal respiratory depression risk.', de: 'Tödliches Risiko für Atemdepression.' } },
  { pair: ['alcohol', 'tilidine'], risk: 'Critical', note: { en: 'Lethal respiratory depression risk.', de: 'Tödliches Risiko für Atemdepression.' } },
  { pair: ['mdma', 'ssri'], risk: 'High', note: { en: 'Serotonin Syndrome risk - can be fatal.', de: 'Risiko für Serotonin-Syndrom - kann tödlich sein.' } },
  { pair: ['cocaine', 'alcohol'], risk: 'High', note: { en: 'Increases cardiotoxicity and heart strain significantly.', de: 'Erhöht die Herztoxizität und Herzbelastung signifikant.' } },
];

export function Step6SubstanceLab({ 
  userData, 
  onComplete,
  showDiary = false,
  isLocked = false 
}: { 
  userData: any, 
  onComplete: (subs: any[]) => void,
  showDiary?: boolean,
  isLocked?: boolean
}) {
  const { toast } = useToast();
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [activeSubstance, setActiveSubstance] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualValue, setManualValue] = useState('');
  const [alcoholCart, setAlcoholCart] = useState<{type: string, count: number}[]>([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [wisdomOpen, setWisdomOpen] = useState(false);
  const [responsibilityOpen, setResponsibilityOpen] = useState(false);
  const [pendingEntry, setPendingEntry] = useState<any>(null);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activeMixingRisk, setActiveMixingRisk] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedLogs = JSON.parse(localStorage.getItem('stayonbeat_logs') || '[]');
    setSessionLogs(savedLogs);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const activeIntakeText = useMemo(() => {
    return sessionLogs.map(l => l.name).join(', ');
  }, [sessionLogs]);

  const filteredSubstances = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return SUBSTANCES;
    return SUBSTANCES.filter(s => {
      const searchSpace = [s.name, s.deName, ...(s.aliases || [])].map(v => v.toLowerCase());
      return searchSpace.some(v => v.includes(term));
    });
  }, [searchTerm]);

  const handleSelectSubstance = (substance: any) => {
    const currentHR = userData?.sessionStatus?.lastHeartRate || 75;
    if (substance.id === "poppers" && currentHR > 100) {
      toast({ variant: "destructive", title: t.causionTitle, description: t.poppersHR(currentHR) });
    }
    setActiveSubstance(substance);
    if (substance.id === 'alcohol') {
      setAlcoholCart(['Beer', 'Wine', 'Shot', 'Mixer'].map(type => ({ type, count: 0 })));
    }
  };

  const startDictation = (target: 'search' | 'manual') => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Not Supported", description: "Your browser does not support voice dictation." });
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'de' ? 'de-DE' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (target === 'search') setSearchTerm(transcript.trim());
      else {
        const num = transcript.match(/\d+(\.\d+)?/);
        if (num) setManualValue(num[0]);
      }
    };
    recognition.start();
  };

  const handleSaveAttempt = () => {
    if (isLocked) return;
    let entry: any;
    const localizedSub = SUBSTANCES.find(s => s.id === activeSubstance.id);
    const substanceName = lang === 'en' ? localizedSub?.name : localizedSub?.deName;
    
    if (activeSubstance.id === 'alcohol') {
      const activeItems = alcoholCart.filter(c => c.count > 0);
      if (activeItems.length === 0) return;
      entry = { id: 'alcohol', name: substanceName, items: activeItems, timestamp: new Date().toISOString() };
    } else {
      if (!manualValue || parseFloat(manualValue) === 0) return;
      entry = { id: activeSubstance.id, name: substanceName, value: manualValue, unit: activeSubstance.unit, timestamp: new Date().toISOString() };
    }

    // Check for dangerous mixing combos
    const risk = DANGEROUS_COMBOS.find(combo => 
      (combo.pair.includes(entry.id) && sessionLogs.some(log => combo.pair.includes(log.id)))
    );

    setPendingEntry(entry);
    setActiveMixingRisk(risk || null);
    setResponsibilityOpen(true);
  };

  const confirmResponsibility = () => {
    if (!pendingEntry) return;
    const updated = [...sessionLogs, pendingEntry];
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
    setActiveSubstance(null);
    setManualValue('');
    setAlcoholCart([]);
    setPendingEntry(null);
    setActiveMixingRisk(null);
    setResponsibilityOpen(false);
    toast({ title: t.doseLogged, description: `${pendingEntry.name} ${t.addedToDiary}` });
  };

  const removeLog = (index: number) => {
    const updated = sessionLogs.filter((_, i) => i !== index);
    setSessionLogs(updated);
    localStorage.setItem('stayonbeat_logs', JSON.stringify(updated));
  };

  const lastHR = userData?.sessionStatus?.lastHeartRate || 0;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (lastHR > 110 ? 'caution' : 'safe');

  if (!mounted) return null;

  return (
    <div className="flex flex-col h-full bg-black font-headline relative overflow-hidden">
      <header className="px-6 pt-10 pb-4 space-y-4 flex flex-col shrink-0 bg-black/95 backdrop-blur-md z-[60] border-b border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20"><Microscope size={24} className="text-white" /></div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none text-white">{t.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setWisdomOpen(true)} className="px-4 py-2 bg-[#1b4d3e] border border-primary/30 rounded-full flex items-center gap-2 active:scale-95 transition-all shadow-lg"><BookOpen size={14} className="text-primary" /><span className="text-[9px] font-black uppercase text-white tracking-widest">{t.wisdom}</span></button>
            <button onClick={() => setChatOpen(true)} className="p-3 bg-blue-600/10 border border-blue-500/30 rounded-xl active:scale-95 transition-all"><HeartHandshake size={18} className="text-blue-400 animate-pulse" /></button>
          </div>
        </div>
        
        <GuardianStatusBar status={guardianStatus} heartRate={lastHR > 0 ? lastHR : 75} lang={lang} />

        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
          <input type="search" placeholder={isListening ? t.listening : t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-white/5 border border-white/10 h-12 pl-10 pr-12 rounded-2xl focus:border-[#3EB489] text-sm outline-none text-white transition-all"/>
          <button onClick={() => startDictation('search')} className={cn("absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all", isListening ? "text-[#3EB489] animate-pulse" : "text-white/20 hover:text-[#3EB489]")}>{isListening ? <MicOff size={16} /> : <Mic size={16} />}</button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden relative">
        <ScrollArea className="h-full px-6 pt-6 touch-pan-y">
          <div className="pb-40 space-y-8">
            {showDiary && sessionLogs.length > 0 && (
              <div className="space-y-3 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[9px] font-black text-[#10B981] uppercase tracking-[0.3em] flex items-center gap-2"><Calendar className="w-3 h-3" /> {t.diary}</h3>
                  <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest">{sessionLogs.length} {t.records}</span>
                </div>
                <div className="grid gap-2">
                  {sessionLogs.slice().reverse().map((log, i) => (
                    <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/5"><FlaskConical size={16} className="text-[#3EB489]" /></div>
                        <div className="flex flex-col"><span className="text-xs font-black uppercase text-white">{log.name}</span><span className="text-[9px] font-bold text-[#3EB489]">{log.id === 'alcohol' ? log.items.map((it: any) => `${it.count}x ${it.type}`).join(', ') : `${log.value}${log.unit}`}</span></div>
                      </div>
                      <button onClick={() => removeLog(sessionLogs.length - 1 - i)} className="p-2 text-white/10 hover:text-red-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-3 w-full">
              {filteredSubstances.map(s => {
                const active = sessionLogs.some(log => log.id === s.id);
                const localizedName = lang === 'en' ? s.name : s.deName;
                return (
                  <button key={s.id} onClick={() => handleSelectSubstance(s)} className={cn("aspect-square border rounded-3xl flex flex-col items-center justify-center gap-2 transition-all active:scale-95 group relative shadow-lg", active ? "bg-[#3EB489]/10 border-[#3EB489]" : "bg-white/[0.02] border-white/5")}>
                    <div className={cn("p-3 rounded-xl bg-black/40 border border-white/5 group-hover:scale-110 transition-transform", s.color)}><s.icon size={22} /></div>
                    <span className={cn("text-[8px] font-black uppercase tracking-widest text-center px-1 leading-tight", active ? "text-[#3EB489]" : "text-white/40")}>{localizedName}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </div>

      <footer className="shrink-0 h-[100px] bg-black/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-center px-6 z-[70] pb-safe">
        <button onClick={() => onComplete(sessionLogs)} className="w-full py-5 bg-[#3EB489] text-black rounded-full font-black uppercase text-base tracking-[0.1em] neon-glow active:scale-95 transition-all shadow-lg flex items-center justify-center gap-3"><CheckCircle2 size={20} /> {t.sync}</button>
      </footer>

      {activeSubstance && (
        <div className="fixed inset-0 z-[100] bg-black/95 animate-in slide-in-from-bottom duration-500 flex flex-col pt-safe">
          <div className="px-6 py-10 flex flex-col items-center text-center space-y-8 flex-1">
            <button onClick={() => setActiveSubstance(null)} className="absolute top-8 right-8 p-3 bg-white/5 rounded-full border border-white/10"><X size={20} /></button>
            <div className={cn("w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center border-2 border-white/10 shadow-2xl mb-4", activeSubstance.color)}><activeSubstance.icon size={48} /></div>
            <div className="space-y-2"><h2 className="text-4xl font-black uppercase tracking-tighter text-white">{lang === 'en' ? activeSubstance.name : activeSubstance.deName}</h2><p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t.intake}</p></div>
            {activeSubstance.inputType === 'manual' ? (
              <div className="w-full max-w-xs space-y-6"><div className="flex flex-col items-center gap-4 relative"><span className="text-[10px] font-black text-[#10B981] uppercase tracking-widest">{t.amount} ({activeSubstance.unit})</span><div className="relative w-full"><input type="number" step="0.1" value={manualValue} onChange={(e) => setManualValue(e.target.value)} placeholder="0.0" className="w-full h-24 bg-white/5 border-2 border-white/10 rounded-[2rem] text-center text-5xl font-black text-white focus:border-[#3EB489] transition-all outline-none" /><button onClick={() => startDictation('manual')} className={cn("absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all", isListening ? "bg-[#3EB489] text-black animate-pulse shadow-lg" : "bg-white/10 text-white/40 hover:text-[#3EB489]")}>{isListening ? <MicOff size={24} /> : <Mic size={24} />}</button></div></div></div>
            ) : (
              <div className="w-full max-w-md grid grid-cols-2 gap-3">{alcoholCart.map((item, i) => (<div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center gap-3"><span className="text-[10px] font-black uppercase text-white/40">{item.type}</span><div className="flex items-center gap-4"><button onClick={() => setAlcoholCart(prev => prev.map((c, idx) => idx === i ? { ...c, count: Math.max(0, c.count - 1) } : c))} className="p-2 bg-white/5 rounded-lg"><Minus size={14} /></button><span className="text-xl font-black text-white">{item.count}</span><button onClick={() => setAlcoholCart(prev => prev.map((c, idx) => idx === i ? { ...c, count: c.count + 1 } : c))} className="p-2 bg-primary/20 rounded-lg text-primary"><Plus size={14} /></button></div></div>))}</div>
            )}
            <div className="w-full max-sm pt-10"><button onClick={handleSaveAttempt} className="w-full h-20 bg-primary text-white rounded-3xl font-black text-xl uppercase tracking-widest active:scale-95 shadow-lg shadow-primary/20 transition-all">{t.confirm}</button><button onClick={() => setActiveSubstance(null)} className="w-full h-14 mt-4 text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.cancel}</button></div>
          </div>
        </div>
      )}

      <Dialog open={responsibilityOpen} onOpenChange={setResponsibilityOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3.5rem] overflow-hidden flex flex-col font-headline shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Sovereign Responsibility</DialogTitle>
          <div className="p-10 flex flex-col items-center text-center space-y-10">
            {activeMixingRisk ? (
              <div className="w-full space-y-8 animate-in zoom-in-95 duration-500">
                <div className="w-20 h-20 bg-red-600/10 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto shadow-2xl relative"><AlertTriangle size={40} className="text-red-500 animate-pulse" /></div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black uppercase tracking-tighter text-red-500 leading-tight">{t.mixingWarningTitle}</h3>
                  <p className={cn("text-[9px] font-black uppercase tracking-[0.4em]", activeMixingRisk.risk === 'Critical' ? "text-red-600" : "text-amber-500")}>{activeMixingRisk.risk === 'Critical' ? t.riskCritical : t.riskHigh}</p>
                </div>
                <div className="bg-red-600/5 border border-red-600/20 rounded-3xl p-6 text-left space-y-4">
                  <p className="text-[10px] font-black uppercase text-red-400 tracking-widest leading-none">{t.consequence}</p>
                  <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest italic">"{lang === 'en' ? activeMixingRisk.note.en : activeMixingRisk.note.de}"</p>
                </div>
              </div>
            ) : (
              <div className="w-full space-y-6">
                <div className="relative"><div className="absolute inset-0 bg-[#F59E0B]/20 blur-3xl rounded-full animate-pulse" /><div className="w-20 h-20 bg-[#F59E0B]/10 border-2 border-[#F59E0B]/30 rounded-full flex items-center justify-center relative z-10 shadow-2xl mx-auto"><UserCheck size={40} className="text-[#F59E0B]" /></div></div>
                <div className="space-y-4">
                  <p className="text-xl md:text-2xl font-black uppercase tracking-tighter text-white leading-tight">{t.honestyTitle}</p>
                  <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest max-w-xs mx-auto">{t.honestyDesc}</p>
                </div>
              </div>
            )}
            <button onClick={confirmResponsibility} className="w-full h-16 bg-primary text-white rounded-2xl font-black uppercase text-base tracking-widest active:scale-95 transition-all shadow-lg">{t.affirmBtn}</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={chatOpen} onOpenChange={setChatOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Safety Advisor</DialogTitle>
          <AiSafetyChat userProfile={userData} currentIntake={activeIntakeText} />
        </DialogContent>
      </Dialog>

      <Dialog open={wisdomOpen} onOpenChange={setWisdomOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Mixing Wisdom</DialogTitle>
          <WisdomProtocol onComplete={() => setWisdomOpen(false)} isStandAlone={true} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

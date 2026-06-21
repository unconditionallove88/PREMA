
import { useState, useEffect, Suspense } from 'react';
import { Link } from 'wouter';
import { useLocation, useSearch } from 'wouter';
import { 
  Heart, 
  User, 
  Loader2, 
  Microscope, 
  Sun, 
  Moon, 
  Settings2,
  ChevronDown,
  Users2,
  MessageCircleHeart,
  ArrowLeft,
  MapPin,
  ChevronRight,
  Sprout,
  Navigation,
  X,
  Brain,
  Bell,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as SovereignLab } from '@/components/onboarding/Step6SubstanceLab';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import { AssistantPortal as SupporterPortal } from '@/components/chat/AssistantPortal';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { HeartBreath } from '@/components/dashboard/HeartBreath';
import { PulseGuide } from '@/components/dashboard/PulseGuide';
import { SmartAlerts } from '@/components/dashboard/SmartAlerts';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { checkSafetyStatus } from '@/lib/guardian';
import { playHeartbeat } from '@/lib/intention';
import { cn } from '@/lib/utils';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

function SkyIcon() {
  const [icon, setIcon] = useState<React.ReactNode>(null);
  useEffect(() => {
    const hour = new Date().getHours();
    const isDay = hour >= 6 && hour < 18;
    if (icon === null) {
      if (isDay) {
        setIcon(<div className="relative group flex-shrink-0"><Sun className="w-5 h-5 md:w-7 md:h-7 text-yellow-400 fill-yellow-400" /><div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full opacity-30" /></div>);
      } else {
        setIcon(<div className="relative flex items-center justify-center flex-shrink-0"><div className="relative"><Moon className="w-4 h-4 md:w-6 md:h-6 text-slate-100 fill-slate-100/10 rotate-[-15deg]" /></div></div>);
      }
    }
  }, [icon]);
  return icon;
}

const AFFIRMATIONS = {
  EN: ["I respect myself", "I am love", "I accept myself fully", "Unity is presence", "Peace is now", "Love is everywhere", "I am exactly here", "Life is love"],
  DE: ["Ich respektire mich", "Ich bin die Liebe", "Ich akzeptiere mich vollständig", "Einheit ist gegenwärtig", "Frieden ist jetzt", "Liebe ist überall", "Ich bin genau hier", "Leben ist Liebe"]
};

const CONTENT = {
  en: { 
    mesh: "Mesh Active",
    loveChat: "Love Chat",
    holders: "The Holders",
    spectators: "The Spectators",
    supporterMain: "Supporter",
    presence: "Presence",
    anchor: "Prema Anchor",
    anchorSub: "Mesh Context",
    anchorBtn: "Calibrate Anchor",
    footer: "Created in harmony",
    familyAlertTitle: "Presence needed nearby",
    familyAlertSub: "Universal Family Mesh Active",
    walkBtn: "Walk with Care"
  },
  de: { 
    mesh: "Mesh aktiv",
    loveChat: "Wort der Liebe",
    holders: "Die Holder",
    spectators: "Die Spectator",
    supporterMain: "Unterstützer",
    presence: "Präsenz",
    anchor: "Prema Anker",
    anchorSub: "Mesh Kontext",
    anchorBtn: "Anker setzen",
    footer: "In Harmonie erschaffen",
    familyAlertTitle: "Begleitung in der Nähe",
    familyAlertSub: "Universelle Familie Mesh aktiv",
    walkBtn: "Mit Herz begleiten"
  }
};

const LOCATIONS = [
  { id: 'berlin', name: 'Berlin, DE', vibe: 'City Haven' },
  { id: 'fusion', name: 'Fusion Festival, DE', vibe: 'Gathering Resonance' },
  { id: 'london', name: 'London, UK', vibe: 'City Haven' },
  { id: 'ibiza', name: 'Ibiza, ES', vibe: 'Island Resonance' },
  { id: 'portugal', name: 'Alentejo, PT', vibe: 'Nature Resonance' },
  { id: 'lisbon', name: 'Lisbon, PT', vibe: 'City Haven' },
];

function DashboardContent() {
  const [, setLocation] = useLocation();
  const search = useSearch(); const searchParams = new URLSearchParams(search);
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [mounted, setMounted] = useState(false);
  const [affirmation, setAffirmation] = useState("");
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [guideOpen, setGuideOpen] = useState(false);
  
  const [simHeartRate, setSimHeartRate] = useState(75);
  const [activeSubstances, setActiveSubstances] = useState<string[]>([]);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const [labOpen, setLabOpen] = useState(false);
  const [supporterOpen, setSupporterOpen] = useState(false);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [smartOpen, setSmartOpen] = useState(false);
  const [loveChatOpen, setLoveChatOpen] = useState(false);
  const [rhythmOpen, setRhythmOpen] = useState(false);
  const [selectedAnchor, setSelectedAnchor] = useState(LOCATIONS[0]);

  const [emergencyPresenceOpen, setEmergencyPresenceOpen] = useState(false);
  const [familyDistressActive, setFamilyDistressActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de'].includes(savedLang) ? savedLang : 'en';
    setLang(currentLang);
    const pool = AFFIRMATIONS[currentLang.toUpperCase() as keyof typeof AFFIRMATIONS];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);
    // Simulate a nearby Collective Care distress call after 8 seconds
    const timer = setTimeout(() => {
      setFamilyDistressActive(true);
    }, 8000);

    return () => {
      clearTimeout(timer);
    };
  }, [auth]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: firestoreProfile, isLoading: isProfileLoading } = useDoc(userDocRef);

  const safetyStatus = checkSafetyStatus({ heartRate: simHeartRate }, activeSubstances, firestoreProfile?.pulseBaseline?.restingBPM);
  const isLocked = safetyStatus.isLocked;
  const guardianStatus: 'safe' | 'caution' | 'locked' = isLocked ? 'locked' : (simHeartRate > 110 ? 'caution' : 'safe');

  if (!mounted || isUserLoading || isProfileLoading) {
    return (<div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8"><Loader2 className="animate-spin text-primary/20" /></div>);
  }

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col h-screen overflow-hidden font-headline">
      {/* Header Calibration */}
      <div className="px-6 py-6 bg-card/90 backdrop-blur-xl border-b border-border z-50 shrink-0 pt-safe">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 truncate">
              <span className="truncate">{lang === 'de' ? `STRAHLE, ${firestoreProfile?.name || "SEELE"}` : `SHINE, ${firestoreProfile?.name || "HEART"}`}</span>
              <SkyIcon />
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { playHeartbeat(); setAnchorOpen(true); }}
              className="px-4 py-2 bg-primary/10 border border-primary/30 rounded-full flex items-center gap-3 active:scale-95 transition-all group shadow-soft"
            >
              <MapPin size={14} className="text-primary group-hover:animate-bounce" />
              <div className="text-left hidden sm:block">
                <span className="block text-[8px] font-semibold uppercase text-muted-foreground tracking-widest leading-none">{t.anchorSub}</span>
                <span className="text-[10px] font-semibold uppercase text-foreground leading-none">{selectedAnchor.name}</span>
              </div>
            </button>
            <Link href="/profile" className="p-3 bg-card rounded-full border border-border transition-all hover:border-primary group"><User size={20} className="text-muted-foreground group-hover:text-primary" /></Link>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-16 pb-40 touch-pan-y">
          
          {/* Universal Family Distress Alert (Collective Care) */}
          {familyDistressActive && (
            <div className="max-w-2xl mx-auto animate-in slide-in-from-top-4 duration-1000 mb-8">
               <div className="bg-secondary/10 border-2 border-secondary/30 rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center gap-6 shadow-soft relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/10 blur-3xl -z-10" />
                 <div className="w-16 h-16 bg-secondary rounded-2xl flex items-center justify-center shadow-lg animate-pulse shrink-0">
                   <Heart size={32} className="text-primary-foreground" fill="currentColor" />
                 </div>
                 <div className="flex-1 text-center sm:text-left">
                   <h2 className="text-2xl font-semibold uppercase tracking-tight text-foreground leading-none mb-1">{t.familyAlertTitle}</h2>
                   <p className="text-[10px] font-semibold text-secondary uppercase tracking-[0.3em]">{t.familyAlertSub}</p>
                 </div>
                 <button 
                   onClick={() => setLocation('/map?familyDistress=active')}
                   className="w-full sm:w-auto h-16 px-8 bg-card text-secondary rounded-2xl font-semibold uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 active:scale-95 transition-all shadow-soft"
                 >
                   <Navigation size={16} /> {t.walkBtn}
                 </button>
                 <button 
                   onClick={() => setFamilyDistressActive(false)}
                   className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                 >
                   <X size={16} />
                 </button>
               </div>
            </div>
          )}

          <div className="max-w-2xl mx-auto">
            <SmartAlerts userGoals={firestoreProfile?.goals || []} lang={lang} />
          </div>

          {/* Emergency Presence Portal */}
          {(guardianStatus === 'caution' || guardianStatus === 'locked') && (
            <div className="flex justify-center animate-in zoom-in duration-500 py-4">
               <button 
                 onClick={() => { playHeartbeat(); setEmergencyPresenceOpen(true); }}
                 className="w-48 h-48 rounded-full bg-secondary/15 flex flex-col items-center justify-center gap-2 shadow-soft active:scale-95 transition-all border-4 border-secondary/30 animate-pulse"
               >
                 <span className="text-2xl font-semibold uppercase tracking-[0.2em] text-secondary-foreground">{t.presence}</span>
               </button>
            </div>
          )}

          {/* Central Focal Point: The Biological Heart Aura (Golden Proportion) */}
          <div className="space-y-6 text-center relative flex flex-col items-center">
            <div className="relative">
               <div className="absolute inset-0 bg-primary/5 blur-[100px] rounded-full scale-150 -z-10" />
               <Link href="/heart-status">
                 <HeartStatusAura heartRate={simHeartRate} activeSubstances={activeSubstances} lang={lang} />
               </Link>
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-primary px-10 italic max-w-sm mx-auto opacity-80">"{affirmation}"</p>
          </div>


          {/* Settings / Lab Calibration */}
          <div className="pt-20 border-t border-border max-w-2xl mx-auto">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button onClick={() => playHeartbeat()} className="w-full flex items-center justify-center gap-3 py-6 text-[10px] font-semibold uppercase text-muted-foreground hover:text-foreground transition-all tracking-[0.4em]">
                  <Settings2 size={14} /> LAB CALIBRATION <ChevronDown className={cn("transition-transform duration-500", isSimulatorOpen && "rotate-180")} size={14} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-8">
                <GuardianSimulator 
                  heartRate={simHeartRate} 
                  setHeartRate={setSimHeartRate} 
                  substanceCount={activeSubstances.length} 
                  setSubstanceCount={(count) => setActiveSubstances(Array(count).fill('Substance'))} 
                  lang={lang} 
                />
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mt-20 pt-10 border-t border-border text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.6em] text-muted-foreground">{t.footer}</p>
          </div>
        </div>
      </ScrollArea>

      {/* Left Tool Panel — Access Guidance, Guide, PI, Supporter, You Pulse */}
      <div className="fixed left-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <TooltipProvider>
          {[
            { label: 'Access Guidance', icon: <Sparkles size={19} />,       color: 'text-primary',     action: () => setLocation('/during') },
            { label: 'Guide',           icon: <BookOpen size={19} />,        color: 'text-primary',     action: () => { playHeartbeat(); setGuideOpen(true); } },
            { label: 'PI',              icon: <Brain size={19} />,           color: 'text-violet-400',  action: () => { playHeartbeat(); setRhythmOpen(true); } },
            { label: 'Supporter',       icon: <SupporterIcon size={19} />,  color: 'text-emerald-500', action: () => { playHeartbeat(); setSupporterOpen(true); } },
            { label: 'You Pulse',       icon: <Bell size={19} />,            color: 'text-secondary',   action: () => setSmartOpen(true) },
          ].map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={item.action}
                  aria-label={item.label}
                  className={cn(
                    'w-11 h-11 rounded-xl bg-card/80 border border-border/40 flex items-center justify-center shadow-soft transition-all hover:translate-x-1 active:scale-95 backdrop-blur-sm',
                    item.color,
                  )}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span className="text-[10px] font-semibold uppercase tracking-widest">{item.label}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {/* Right Tool Panel — You Create, You Take, You Speak, You See */}
      <div className="fixed right-5 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-40">
        <TooltipProvider>
          {[
            { label: 'You Create', icon: <Sprout size={19} />,                               color: 'text-primary', action: () => { playHeartbeat(); setCoCreationOpen(true); } },
            { label: 'You Take',   icon: <Microscope size={19} />,                            color: 'text-primary', action: () => setLabOpen(true) },
            { label: 'You Speak',  icon: <MessageCircleHeart size={19} />,                    color: 'text-primary', action: () => { playHeartbeat(); setLoveChatOpen(true); } },
            { label: 'You See',    icon: <RadiatingThirdEye size={19} color="currentColor" />, color: 'text-primary', action: () => setLocation('/map') },
          ].map((item) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <button
                  onClick={item.action}
                  aria-label={item.label}
                  className={cn(
                    'w-11 h-11 rounded-xl bg-card/80 border border-border/40 flex items-center justify-center shadow-soft transition-all hover:-translate-x-1 active:scale-95 backdrop-blur-sm',
                    item.color,
                  )}
                >
                  {item.icon}
                </button>
              </TooltipTrigger>
              <TooltipContent side="left">
                <span className="text-[10px] font-semibold uppercase tracking-widest">{item.label}</span>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      {guideOpen && <PulseGuide lang={lang} forceOpen onDismiss={() => setGuideOpen(false)} />}

      {/* Simplified, Scrollable Anchor Dialog */}
      <Dialog open={anchorOpen} onOpenChange={setAnchorOpen}>
        <DialogContent className="bg-card border-border max-md p-0 rounded-[3.5rem] font-headline shadow-soft overflow-hidden flex flex-col h-[80vh] max-h-[80vh]">
          <div className="p-10 shrink-0">
            <DialogTitle className="text-3xl font-semibold uppercase tracking-tight text-foreground mb-2 text-center">{t.anchor}</DialogTitle>
            <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.4em] text-center mb-8">{t.anchorSub}</p>
          </div>
          
          <ScrollArea className="flex-1 px-10">
            <div className="space-y-4 pb-12">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => { playHeartbeat(); setSelectedAnchor(loc); setAnchorOpen(false); }}
                  className={cn(
                    "w-full p-8 rounded-[2.5rem] border-2 flex items-center justify-between group transition-all duration-300",
                    selectedAnchor.id === loc.id ? "bg-primary/10 border-primary shadow-soft" : "bg-card border-border hover:border-primary"
                  )}
                >
                  <div className="text-left">
                    <p className="text-lg font-semibold uppercase text-foreground tracking-tight">{loc.name}</p>
                    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-1">{loc.vibe}</p>
                  </div>
                  <ChevronRight size={20} className={cn("transition-all duration-500", selectedAnchor.id === loc.id ? "text-primary translate-x-2" : "text-muted-foreground")} />
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-10 pt-6 shrink-0 bg-card/90 backdrop-blur-md border-t border-border">
            <button 
              onClick={() => setAnchorOpen(false)}
              className="w-full py-6 bg-primary text-primary-foreground rounded-2xl font-semibold uppercase text-[10px] tracking-widest hover:bg-primary/90 transition-colors"
            >
              {t.anchorBtn}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-card border-border max-w-2xl p-0 rounded-[2.5rem] overflow-hidden flex flex-col h-[95dvh] max-h-[95dvh] top-[50%] -translate-y-[50%] shadow-soft">
          <DialogTitle className="sr-only">Sovereign Lab</DialogTitle>
          <SovereignLab userData={{ ...firestoreProfile, sessionStatus: { isLocked, lastHeartRate: simHeartRate } }} onComplete={(logs) => { setActiveSubstances(logs.map(l => l.name)); setLabOpen(false); }} showDiary={true} isLocked={isLocked} />
        </DialogContent>
      </Dialog>

      <Dialog open={supporterOpen} onOpenChange={setSupporterOpen}>
        <DialogContent className="bg-card border-border max-w-2xl p-0 rounded-[3.5rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%] shadow-soft">
          <DialogTitle className="sr-only">Supporter Portal</DialogTitle>
          <SupporterPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-card border-border max-lg p-0 rounded-[2.5rem] overflow-hidden h-[85dvh] shadow-soft">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={smartOpen} onOpenChange={setSmartOpen}>
        <DialogContent className="bg-card border-border max-w-lg p-8 rounded-[2.5rem] shadow-soft">
          <DialogTitle className="sr-only">You Pulse</DialogTitle>
          <SmartAlerts userGoals={firestoreProfile?.goals || []} lang={lang} />
        </DialogContent>
      </Dialog>

      <Dialog open={loveChatOpen} onOpenChange={setLoveChatOpen}>
        <DialogContent className="bg-card border-border max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] shadow-soft">
          <DialogTitle className="sr-only">Love Chat</DialogTitle>
          <LoveCircleChat />
        </DialogContent>
      </Dialog>

      {emergencyPresenceOpen && (
        <HeartBreath lang={lang} onClose={() => setEmergencyPresenceOpen(false)} />
      )}

      <Dialog open={rhythmOpen} onOpenChange={setRhythmOpen}>
        <DialogContent className="bg-card border-border max-w-md p-0 rounded-[2.5rem] overflow-hidden shadow-soft">
          <DialogTitle className="sr-only">Your Rhythm</DialogTitle>
          <div className="p-10 flex flex-col items-center text-center gap-6 font-headline">
            <div className="w-16 h-16 rounded-[1.5rem] bg-violet-500/10 border border-violet-400/20 flex items-center justify-center shadow-xl">
              <Brain size={32} className="text-violet-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white shining-white">
                {lang === 'de' ? 'Your Rhythm' : 'Your Rhythm'}
              </h2>
              <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.5em]">
                {lang === 'de' ? 'Integrierte Intelligenz' : 'Integrated Intelligence Engine'}
              </p>
            </div>
            <div className="w-full space-y-5 text-left">
              <div className="p-5 bg-card/5 rounded-[1.5rem] border border-border/10 space-y-2">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                  {lang === 'de' ? 'Was es ist' : 'What it is'}
                </p>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                  {lang === 'de'
                    ? 'Your Rhythm ist die zentrale Intelligenz von Prema — sie aggregiert Daten aus allen Tools um deine Session kohärent und sicher zu halten'
                    : 'Your Rhythm is the central intelligence of Prema — it continuously aggregates data from all your tools to keep your session coherent and aligned'}
                </p>
              </div>
              <div className="p-5 bg-card/5 rounded-[1.5rem] border border-border/10 space-y-2">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">
                  {lang === 'de' ? 'Wie es funktioniert' : 'How it works'}
                </p>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                  {lang === 'de'
                    ? 'Es liest deine Herzfrequenz, Substanzlogs, Profil und Sitzungskontext um Schwellenwerte, Pflegeprotokolle und Tool-Antworten anzupassen'
                    : 'It reads your heart rate, substance logs, profile, and session context to calibrate thresholds, care protocols, and tool responses in real time'}
                </p>
              </div>
              <div className="p-5 bg-violet-500/10 rounded-[1.5rem] border border-violet-400/20 space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={10} className="text-violet-400" />
                  <p className="text-[9px] font-black text-violet-400 uppercase tracking-[0.3em]">
                    {lang === 'de' ? 'Kern-Prinzip' : 'Core principle'}
                  </p>
                </div>
                <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-widest italic">
                  "{lang === 'de'
                    ? 'Your Rhythm hält stets das vollständige Bild deiner Session — es ist die unsichtbare Präsenz die dich hält'
                    : 'Your Rhythm holds the full picture of your session at all times — it is the invisible presence that holds you'}"
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default function Dashboard() {
  return (<Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}><DashboardContent /></Suspense>);
}

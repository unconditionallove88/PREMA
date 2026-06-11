'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Heart, 
  User, 
  Loader2, 
  Microscope, 
  Watch, 
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
  X
} from 'lucide-react';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as SovereignLab } from '@/components/onboarding/Step6SubstanceLab';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import { PulseSync } from '@/components/dashboard/PulseSync';
import { AssistantPortal as SupporterPortal } from '@/components/chat/AssistantPortal';
import { HeartBreath } from '@/components/dashboard/HeartBreath';
import { PulseGuide } from '@/components/dashboard/PulseGuide';
import { SmartAlerts } from '@/components/dashboard/SmartAlerts';
import { CoCreation } from '@/components/dashboard/CoCreation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUser, useFirestore, useDoc, useMemoFirebase, useAuth } from '@/firebase';
import { doc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { checkSafetyStatus } from '@/lib/guardian';
import { playHeartbeat } from '@/lib/resonance';
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
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [syncOpen, setSyncOpen] = useState(false);
  const [anchorOpen, setAnchorOpen] = useState(false);
  const [coCreationOpen, setCoCreationOpen] = useState(false);
  const [selectedAnchor, setSelectedAnchor] = useState(LOCATIONS[0]);

  const [showLoveChatOptions, setShowLoveChatOptions] = useState(false);
  const [emergencyPresenceOpen, setEmergencyPresenceOpen] = useState(false);
  const [familyDistressActive, setFamilyDistressActive] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de'].includes(savedLang) ? savedLang : 'en';
    setLang(currentLang);
    const pool = AFFIRMATIONS[currentLang.toUpperCase() as keyof typeof AFFIRMATIONS];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);
    const unsubscribe = onAuthStateChanged(auth, (user) => { if (!user) router.replace("/auth"); });

    // Simulate a nearby Collective Care distress call after 8 seconds
    const timer = setTimeout(() => {
      setFamilyDistressActive(true);
    }, 8000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [auth, router]);

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
                   onClick={() => router.push('/map?familyDistress=active')}
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

          {/* Status Pillar */}
          <div className="space-y-4 max-w-2xl mx-auto">
            <GuardianStatusBar status={guardianStatus} heartRate={simHeartRate} lang={lang} />
            <PulseGuardianBanner lang={lang} variant="banner" onOpenGuide={() => setGuideOpen(true)} />
          </div>

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

          {/* Main Action Portals: Constellation Overhaul */}
          <div className="flex flex-col items-center gap-16">
            
            {/* The Supporter Portal (Primary Interaction) */}
            <div className="flex flex-col items-center gap-6">
              <button 
                onClick={() => { playHeartbeat(); setSupporterOpen(true); }}
                className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-card border-4 border-primary/20 flex flex-col items-center justify-center group hover:bg-card/90 transition-all shadow-soft relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-40" />
                <SupporterIcon size={80} className="text-emerald-500 mb-4 relative z-10 group-hover:scale-110 transition-transform duration-500" />
                <span className="text-xl font-semibold uppercase tracking-widest text-foreground relative z-10">{t.supporterMain}</span>
              </button>
            </div>

            {/* Constellation Toolkit: Circular Portal Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 w-full max-w-sm sm:max-w-2xl px-4">
              <Link href="/map" className="w-full aspect-square rounded-full bg-card border-4 border-border flex flex-col items-center justify-center gap-2 hover:border-primary transition-all group shadow-soft">
                <RadiatingThirdEye size={32} color="#F5B38B" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-primary">The Radar</span>
              </Link>
              <button onClick={() => setLabOpen(true)} className="w-full aspect-square rounded-full bg-card border-4 border-primary/30 flex flex-col items-center justify-center gap-2 hover:border-primary transition-all group shadow-soft">
                <Microscope size={32} className="text-primary" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-primary">The Lab</span>
              </button>
              <button onClick={() => setSyncOpen(true)} className="w-full aspect-square rounded-full bg-card border-4 border-accent/30 flex flex-col items-center justify-center gap-2 hover:border-accent transition-all group shadow-soft">
                <Watch size={32} className="text-accent" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-accent">The Sync</span>
              </button>
              <button onClick={() => { playHeartbeat(); setCoCreationOpen(true); }} className="w-full aspect-square rounded-full bg-card border-4 border-[hsl(var(--primary))]/20 flex flex-col items-center justify-center gap-2 hover:border-[hsl(var(--primary))] transition-all group shadow-soft">
                <Sprout size={32} className="text-primary" />
                <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground group-hover:text-primary">The Voice</span>
              </button>
            </div>

            {/* Love Chat Portal (Social Constellation) */}
            <div className="flex flex-col items-center gap-6 w-full">
              {!showLoveChatOptions ? (
                <button 
                  onClick={() => { playHeartbeat(); setShowLoveChatOptions(true); }}
                  className="w-44 h-44 rounded-full bg-primary/20 border-4 border-primary/40 flex flex-col items-center justify-center group hover:bg-primary/30 transition-all shadow-[0_0_50px_rgba(16,185,129,0.2)]"
                >
                  <MessageCircleHeart size={48} className="text-primary mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{t.loveChat}</span>
                </button>
              ) : (
                <div className="flex gap-8 animate-in zoom-in-95 duration-500">
                  <button 
                    onClick={() => router.push('/heart-status?chat=holders')}
                    className="w-36 h-36 rounded-full bg-card border-4 border-[hsl(var(--primary))] flex flex-col items-center justify-center group hover:bg-[hsl(var(--primary))]/10 transition-all shadow-soft"
                  >
                    <Users2 size={36} className="text-primary mb-2" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-primary">{t.holders}</span>
                  </button>
                  <button 
                    onClick={() => router.push('/heart-status?chat=spectators')}
                    className="w-36 h-36 rounded-full bg-card border-4 border-yellow-400 flex flex-col items-center justify-center group hover:bg-yellow-500/10 transition-all shadow-soft"
                  >
                    <Users2 size={36} className="text-yellow-500 mb-2" />
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-yellow-500">{t.spectators}</span>
                  </button>
                  <button onClick={() => setShowLoveChatOptions(false)} className="self-center p-4 bg-card rounded-full border border-border text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={20} /></button>
                </div>
              )}
            </div>
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

      <PulseGuide lang={lang} forceOpen={guideOpen} onDismiss={() => setGuideOpen(false)} />

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

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-card border-border max-md p-0 rounded-[3.5rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-soft">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto"><PulseSync onComplete={() => setSyncOpen(false)} /></div>
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-card border-border max-lg p-0 rounded-[2.5rem] overflow-hidden h-[85dvh] shadow-soft">
          <DialogTitle className="sr-only">Co-Creation</DialogTitle>
          <CoCreation onComplete={() => setCoCreationOpen(false)} />
        </DialogContent>
      </Dialog>

      {emergencyPresenceOpen && (
        <HeartBreath lang={lang} onClose={() => setEmergencyPresenceOpen(false)} />
      )}
    </main>
  );
}

export default function Dashboard() {
  return (<Suspense fallback={<div className="min-h-screen bg-background text-foreground flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}><DashboardContent /></Suspense>);
}

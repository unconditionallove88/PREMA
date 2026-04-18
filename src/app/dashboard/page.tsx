
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
  Sprout
} from 'lucide-react';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Step6SubstanceLab as SovereignLab } from '@/components/onboarding/Step6SubstanceLab';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import PulseGuardianBanner from '@/components/dashboard/PulseGuardianBanner';
import GuardianStatusBar from '@/components/dashboard/GuardianStatusBar';
import GuardianSimulator from '@/components/dashboard/GuardianSimulator';
import HeartStatusAura from '@/components/dashboard/HeartStatusAura';
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { AssistantPortal as SupporterPortal } from '@/components/chat/AssistantPortal';
import { HeartBreath } from '@/components/dashboard/HeartBreath';
import { SanctuaryGuide } from '@/components/dashboard/SanctuaryGuide';
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
  EN: ["I respect myself", "I love myself", "I accept myself", "Worthy of love", "I am love", "I love everyone", "I forgive myself", "Life is love"],
  DE: ["Ich respektiere mich selbst heute", "Ich liebe mich selbst heute hier", "Ich akzeptiere mich selbst heute hier", "Ich verdiene Liebe heute hier", "Ich bin pure Liebe heute hier", "Ich liebe alle Menschen heute hier", "Ich vergebe mir selbst heute hier", "Leben ist Liebe heute hier"]
};

const CONTENT = {
  en: { 
    mesh: "Mesh Active",
    loveChat: "Love Chat",
    holders: "The Holders",
    spectators: "The Spectators",
    supporterMain: "Supporter",
    presence: "Presence",
    anchor: "Sanctuary Anchor",
    anchorSub: "Mesh Context",
    anchorBtn: "Calibrate Anchor",
    footer: "Created in harmony"
  },
  de: { 
    mesh: "Mesh aktiv heute hier",
    loveChat: "Wort der Liebe heute",
    holders: "Die Holder heute hier",
    spectators: "Die Spectator heute hier",
    supporterMain: "Unterstützer heute hier",
    presence: "Präsenz heute",
    anchor: "Sanctuary Anker heute hier",
    anchorSub: "Mesh Kontext heute hier",
    anchorBtn: "Anker jetzt setzen heute",
    footer: "In Harmonie erschaffen heute hier"
  }
};

const LOCATIONS = [
  { id: 'berlin', name: 'Berlin, DE', vibe: 'City Sanctuary' },
  { id: 'fusion', name: 'Fusion Festival, DE', vibe: 'Gathering Resonance' },
  { id: 'london', name: 'London, UK', vibe: 'City Sanctuary' },
  { id: 'ibiza', name: 'Ibiza, ES', vibe: 'Island Resonance' },
  { id: 'portugal', name: 'Alentejo, PT', vibe: 'Nature Resonance' },
  { id: 'lisbon', name: 'Lisbon, PT', vibe: 'City Sanctuary' },
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

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    const currentLang = ['en', 'de'].includes(savedLang) ? savedLang : 'en';
    setLang(currentLang);
    const pool = AFFIRMATIONS[currentLang.toUpperCase() as keyof typeof AFFIRMATIONS];
    setAffirmation(pool[Math.floor(Math.random() * pool.length)]);
    const unsubscribe = onAuthStateChanged(auth, (user) => { if (!user) router.replace("/auth"); });
    return () => unsubscribe();
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
    return (<div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8"><Loader2 className="animate-spin text-primary/20" /></div>);
  }

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <main className="min-h-screen bg-black text-white flex flex-col h-screen overflow-hidden font-headline">
      <div className="px-6 py-6 bg-black/40 backdrop-blur-xl border-b border-white/5 z-50 shrink-0 pt-safe">
        <header className="flex justify-between items-center max-w-4xl mx-auto w-full gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3 truncate">
              <span className="truncate">{lang === 'de' ? `STRAHLE, ${firestoreProfile?.name || "SEELE"}` : `SHINE, ${firestoreProfile?.name || "SOUL"}`}</span>
              <SkyIcon />
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { playHeartbeat(); setAnchorOpen(true); }}
              className="px-4 py-2 bg-[#1b4d3e] border border-primary/30 rounded-full flex items-center gap-3 active:scale-95 transition-all group shadow-lg"
            >
              <MapPin size={14} className="text-primary group-hover:animate-bounce" />
              <div className="text-left hidden sm:block">
                <span className="block text-[8px] font-black uppercase text-white/30 tracking-widest leading-none">{t.anchorSub}</span>
                <span className="text-[10px] font-black uppercase text-white leading-none">{selectedAnchor.name}</span>
              </div>
            </button>
            <Link href="/profile" className="p-3 bg-white/5 rounded-full border border-white/10 transition-all hover:border-primary group"><User size={20} className="text-white/40 group-hover:text-primary" /></Link>
          </div>
        </header>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-8 space-y-12 pb-40 touch-pan-y">
          
          <div className="space-y-3">
            <GuardianStatusBar status={guardianStatus} heartRate={simHeartRate} lang={lang} />
            <PulseGuardianBanner lang={lang} variant="banner" onOpenGuide={() => setGuideOpen(true)} />
          </div>

          <SmartAlerts userGoals={firestoreProfile?.goals || []} lang={lang} />

          {(guardianStatus === 'caution' || guardianStatus === 'locked') && (
            <div className="flex justify-center animate-in zoom-in duration-500">
               <button 
                 onClick={() => { playHeartbeat(); setEmergencyPresenceOpen(true); }}
                 className="w-40 h-40 rounded-full bg-red-600 flex flex-col items-center justify-center gap-2 shadow-[0_0_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all border-4 border-white animate-pulse"
               >
                 <span className="text-2xl font-black uppercase tracking-[0.2em] text-white">{t.presence}</span>
               </button>
            </div>
          )}

          <div className="space-y-4 text-center relative flex flex-col items-center">
            <Link href="/heart-status">
              <HeartStatusAura heartRate={simHeartRate} activeSubstances={activeSubstances} lang={lang} />
            </Link>
            <p className="text-xs font-bold uppercase tracking-widest text-primary px-10 italic">"{affirmation}"</p>
          </div>

          <div className="flex flex-col items-center gap-12">
            
            <div className="flex flex-col items-center gap-4">
              <button 
                onClick={() => { playHeartbeat(); setSupporterOpen(true); }}
                className="w-48 h-48 md:w-56 md:h-56 rounded-full bg-emerald-500/5 border-4 border-primary flex flex-col items-center justify-center group hover:bg-emerald-500/10 transition-all shadow-[0_0_50px_rgba(16,185,129,0.1)] relative"
              >
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-all" />
                <SupporterIcon size={64} className="text-emerald-500 mb-2 relative z-10" />
                <span className="text-lg font-black uppercase tracking-tight text-white relative z-10">{t.supporterMain}</span>
              </button>
            </div>

            <div className="flex flex-col items-center gap-6 w-full">
              {!showLoveChatOptions ? (
                <button 
                  onClick={() => { playHeartbeat(); setShowLoveChatOptions(true); }}
                  className="w-40 h-40 rounded-full bg-[#1b4d3e] border-4 border-[#10B981] flex flex-col items-center justify-center group hover:bg-[#1b4d3e]/90 transition-all shadow-[0_0_50px_rgba(16,185,129,0.4)]"
                >
                  <MessageCircleHeart size={48} className="text-[#10B981] mb-2" />
                  <span className="text-xs font-black uppercase tracking-widest text-[#10B981]">{t.loveChat}</span>
                </button>
              ) : (
                <div className="flex gap-8 animate-in zoom-in-95 duration-500">
                  <button 
                    onClick={() => router.push('/heart-status?chat=holders')}
                    className="w-32 h-32 rounded-full bg-white/[0.03] border-4 border-[#10B981] flex flex-col items-center justify-center group hover:bg-[#10B981]/10 transition-all shadow-xl"
                  >
                    <Users2 size={32} className="text-[#10B981] mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-[#10B981]">{t.holders}</span>
                  </button>
                  <button 
                    onClick={() => router.push('/heart-status?chat=spectators')}
                    className="w-32 h-32 rounded-full bg-white/[0.03] border-4 border-yellow-400 flex flex-col items-center justify-center group hover:bg-yellow-500/10 transition-all shadow-xl"
                  >
                    <Users2 size={32} className="text-yellow-500 mb-1" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-yellow-500">{t.spectators}</span>
                  </button>
                  <button onClick={() => setShowLoveChatOptions(false)} className="self-center p-3 bg-white/5 rounded-full border border-white/10 text-white/20"><ArrowLeft size={16} /></button>
                </div>
              )}
            </div>

            {/* Sovereign Toolkit Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full max-w-sm sm:max-w-xl px-4">
              <Link href="/map" className="w-full aspect-square rounded-full bg-white/5 border-4 border-blue-500 flex flex-col items-center justify-center gap-1 hover:border-blue-500/60 transition-all group shadow-lg">
                <RadiatingThirdEye size={24} color="#3b82f6" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-blue-400">Radar</span>
              </Link>
              <button onClick={() => setLabOpen(true)} className="w-full aspect-square rounded-full bg-white/5 border-4 border-primary flex flex-col items-center justify-center gap-1 hover:border-primary/60 transition-all group shadow-lg">
                <Microscope size={24} className="text-primary" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-primary">Lab</span>
              </button>
              <button onClick={() => setSyncOpen(true)} className="w-full aspect-square rounded-full bg-white/5 border-4 border-accent flex flex-col items-center justify-center gap-1 hover:border-accent/60 transition-all group shadow-lg">
                <Watch size={24} className="text-accent" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-accent">Sync</span>
              </button>
              <button onClick={() => { playHeartbeat(); setCoCreationOpen(true); }} className="w-full aspect-square rounded-full bg-white/5 border-4 border-[#10B981]/40 flex flex-col items-center justify-center gap-1 hover:border-[#10B981] transition-all group shadow-lg">
                <Sprout size={24} className="text-[#10B981]" />
                <span className="text-[8px] font-black uppercase tracking-widest text-white/40 group-hover:text-[#10B981]">Voice</span>
              </button>
            </div>
          </div>

          <div className="pt-12">
            <Collapsible open={isSimulatorOpen} onOpenChange={setIsSimulatorOpen}>
              <CollapsibleTrigger asChild>
                <button onClick={() => playHeartbeat()} className="w-full flex items-center justify-center gap-2 py-4 text-[9px] font-black uppercase text-white/20 hover:text-white transition-all">
                  <Settings2 size={12} /> LAB CALIBRATION <ChevronDown className={cn("transition-transform", isSimulatorOpen && "rotate-180")} size={12} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="pt-4"><GuardianSimulator heartRate={simHeartRate} setHeartRate={setSimHeartRate} substanceCount={activeSubstances.length} setSubstanceCount={(count) => setActiveSubstances(Array(count).fill('Substance'))} lang={lang} /></CollapsibleContent>
            </Collapsible>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">{t.footer}</p>
          </div>
        </div>
      </ScrollArea>

      <SanctuaryGuide lang={lang} forceOpen={guideOpen} onDismiss={() => setGuideOpen(false)} />

      <Dialog open={anchorOpen} onOpenChange={setAnchorOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] font-headline shadow-2xl overflow-hidden flex flex-col h-auto max-h-[85vh]">
          <div className="p-8 shrink-0">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-white mb-2 text-center">{t.anchor}</DialogTitle>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] text-center mb-8">{t.anchorSub}</p>
          </div>
          
          <ScrollArea className="flex-1 px-8">
            <div className="space-y-3 pb-8">
              {LOCATIONS.map((loc) => (
                <button
                  key={loc.id}
                  onClick={() => { playHeartbeat(); setSelectedAnchor(loc); setAnchorOpen(false); }}
                  className={cn(
                    "w-full p-6 rounded-[2rem] border-2 flex items-center justify-between group transition-all",
                    selectedAnchor.id === loc.id ? "bg-primary/10 border-primary shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20"
                  )}
                >
                  <div className="text-left">
                    <p className="text-sm font-black uppercase text-white">{loc.name}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{loc.vibe}</p>
                  </div>
                  <ChevronRight size={16} className={cn("transition-all", selectedAnchor.id === loc.id ? "text-primary translate-x-1" : "text-white/10")} />
                </button>
              ))}
            </div>
          </ScrollArea>

          <div className="p-8 pt-4 shrink-0 bg-black/80 backdrop-blur-md border-t border-white/5">
            <button 
              onClick={() => setAnchorOpen(false)}
              className="w-full py-4 bg-white/5 border border-white/10 text-white/40 rounded-2xl font-black uppercase text-[10px] tracking-widest"
            >
              {t.anchorBtn}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={labOpen} onOpenChange={setLabOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-[95dvh] max-h-[95dvh] sm:h-[90dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Sovereign Lab</DialogTitle>
          <SovereignLab userData={{ ...firestoreProfile, sessionStatus: { isLocked, lastHeartRate: simHeartRate } }} onComplete={(logs) => { setActiveSubstances(logs.map(l => l.name)); setLabOpen(false); }} showDiary={true} isLocked={isLocked} />
        </DialogContent>
      </Dialog>

      <Dialog open={supporterOpen} onOpenChange={setSupporterOpen}>
        <DialogContent className="bg-black border-white/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85dvh] max-h-[85dvh] top-[50%] -translate-y-[50%]">
          <DialogTitle className="sr-only">Supporter Portal</DialogTitle>
          <SupporterPortal userProfile={firestoreProfile} />
        </DialogContent>
      </Dialog>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto"><WearablesSync onComplete={() => setSyncOpen(false)} /></div>
        </DialogContent>
      </Dialog>

      <Dialog open={coCreationOpen} onOpenChange={setCoCreationOpen}>
        <DialogContent className="bg-black border-white/10 max-lg p-0 rounded-[2rem] overflow-hidden h-[85dvh]">
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
  return (<Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}><DashboardContent /></Suspense>);
}

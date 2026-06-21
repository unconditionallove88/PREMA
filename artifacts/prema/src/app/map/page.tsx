
import { useState, useEffect, Suspense } from 'react';
import { ArrowLeft, Shield, Loader2, PhoneCall, AlertTriangle, Lock, Navigation, CircleDot, Radio, Heart } from 'lucide-react';
import { Link } from 'wouter';
import { useSearch } from 'wouter';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import LoveCircle from '@/components/dashboard/LoveCircle';


const CONTENT = {
  en: {
    loading: "Calibrating Intention",
    here: "I am here 🌿",
    visible: "My heart is open",
    private: "Private",
    respect: "I respect you",
    safeSpace: "Privacy is my space",
    distress: (name: string) => `${name} needs care`,
    finding: (name: string) => `Guided by Mesh to ${name}`,
    currentPulse: (status: string) => `Current Pulse: ${status}`,
    notify: "Notify Awareness",
    meshActive: "Mesh Location Active",
    collectiveCare: "Collective Care Active",
    nearbyHeart: "A heart nearby needs presence",
    helpFamily: "Walk with Care"
  },
  de: {
    loading: "Resonanz wird kalibriert",
    here: "Ich bin hier 🌿",
    visible: "Mein Herz ist offen",
    private: "Privat",
    respect: "Ich achte auf dich",
    safeSpace: "Privatsphäre ist mein Raum",
    distress: (name: string) => `${name} braucht Begleitung`,
    finding: (name: string) => `Mesh leitet dich zu ${name}`,
    currentPulse: (status: string) => `Aktueller Status: ${status}`,
    notify: "Awareness rufen",
    meshActive: "Mesh-Ortung aktiv",
    collectiveCare: "Kollektive Fürsorge aktiv ",
    nearbyHeart: "Ein Herz in der Nähe braucht Begleitung",
    helpFamily: "Mit Herz begleiten"
  }
};

function MapContent() {
  const search = useSearch(); const searchParams = new URLSearchParams(search);
  const { user } = useUser();
  const firestore = useFirestore();
  const [sosActive, setSosActive] = useState(false);
  const [isSharing, setIsSharing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  // Simulation of a nearby distress call (Collective Care)
  const [familyDistress, setFamilyDistress] = useState<{name: string, dist: string} | null>(null);

  const focusName = searchParams.get('focus');
  const focusStatus = searchParams.get('status');
  const isFriendDistress = !!focusName && focusStatus === 'distress';
  const isFindingFriend = !!focusName && !isFriendDistress;

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);
  const isGuardActive = profile?.guardActive || false;

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate a collective care alert after 5 seconds if not focusing on a friend
      if (!focusName) {
        setTimeout(() => {
          setFamilyDistress({ name: "NEARBY_HEART", dist: "15m" });
        }, 5000);
      }
    }, 1200);
    return () => clearTimeout(timer);
  }, [focusName]);

  const t = CONTENT[lang] || CONTENT.en;

  if (isLoading) {
    return (
      <main className="h-screen bg-card flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-emerald-500/10" />
          <Loader2 className="w-10 h-10 animate-spin text-emerald-500 relative z-10" />
        </div>
        <p className="text-emerald-500/40 font-black uppercase tracking-[0.4em] text-[9px] animate-pulse">{t.loading}</p>
      </main>
    );
  }

  return (
    <main className="h-screen bg-card text-white relative overflow-hidden font-headline animate-in fade-in duration-1000">
      <div className="absolute inset-0 bg-card">
        <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="radarGrid" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" fill="hsl(var(--secondary))" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#radarGrid)" />
          </svg>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
          <div className={cn("transition-all duration-1000 scale-90 md:scale-100", !isSharing && "grayscale opacity-30")}>
            <div className="relative flex items-center justify-center w-32 h-32 md:w-40 md:h-40">
              <div className={cn("absolute w-full h-full rounded-full opacity-10 animate-ping", isGuardActive ? "bg-red-500" : "bg-emerald-400")} />
              <div className="relative z-10 bg-card/40 p-4 rounded-full backdrop-blur-md border border-border/5">
                <RadiatingThirdEye size={56} className="md:w-20 md:h-20" color={isGuardActive ? "#ef4444" : "hsl(var(--primary))"} />
              </div>
            </div>
          </div>
          <div className="mt-4 bg-card/60 px-4 py-1.5 rounded-full border border-border/5 inline-block backdrop-blur-sm">
            <span className="text-[9px] font-black uppercase tracking-widest text-white/60">{t.here}</span>
          </div>
        </div>

        {/* Collective Care Simulation Node */}
        {familyDistress && (
          <div className="absolute top-[35%] left-[25%] animate-in zoom-in duration-1000">
            <div className="relative flex flex-col items-center">
              <div className="absolute inset-0 bg-red-600/20 blur-xl rounded-full animate-ping" />
              <div className="w-12 h-12 bg-card/80 rounded-full border-2 border-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                <Heart className="text-red-500 w-6 h-6 animate-pulse-heart" fill="#ef4444" />
              </div>
              <div className="absolute top-14 bg-red-600/90 px-3 py-1 rounded-full border border-border/10 whitespace-nowrap">
                <span className="text-[8px] font-black text-white uppercase">{familyDistress.dist} Presence Needed</span>
              </div>
            </div>
          </div>
        )}

        {/* Simulated Friend Node for focus */}
        {focusName && (
          <div className="absolute top-[30%] right-[20%] animate-in zoom-in duration-1000">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full animate-ping" />
              <div className="w-10 h-10 bg-card/80 rounded-full border-2 border-primary flex items-center justify-center">
                <Radio className="text-primary w-5 h-5 animate-pulse" />
              </div>
              <div className="absolute top-12 left-1/2 -translate-x-1/2 bg-card/60 px-3 py-1 rounded-full border border-border/10 whitespace-nowrap">
                <span className="text-[8px] font-black text-white uppercase">{focusName}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
        <header className="flex justify-between items-center pointer-events-auto w-full max-w-5xl mx-auto shrink-0 animate-in slide-in-from-top-4 duration-700">
          <Link href="/dashboard" className="bg-card/60 backdrop-blur-xl p-4 rounded-full border border-border/10 hover:border-secondary transition-all group active:scale-95 shadow-xl">
            <ArrowLeft className="w-5 h-5 text-white/40 group-hover:text-white" />
          </Link>
          
          <div className="bg-card/60 backdrop-blur-md px-5 py-3 rounded-full border border-border/10 flex items-center gap-4 transition-all hover:border-border/20 shadow-xl">
            <div className="flex items-center gap-2 pr-2 border-r border-border/10">
              {isSharing ? <CircleDot size={14} className="text-secondary" /> : <Lock size={14} className="text-white/20" />}
              <span className={cn("text-[9px] font-black uppercase tracking-widest", isSharing ? "text-secondary" : "text-white/20")}>
                {isSharing ? t.visible : t.private}
              </span>
            </div>
            <Switch checked={isSharing} onCheckedChange={setIsSharing} className="data-[state=checked]:bg-secondary scale-90" />
          </div>
        </header>
        
        <div className="flex-1 flex flex-col justify-end gap-6 w-full max-w-5xl mx-auto pb-10">
          <div className="flex flex-col md:flex-row items-end justify-between gap-6">
            
            <div className="pointer-events-auto">
              <LoveCircle lang={lang} variant="map" />
            </div>

            <div className="w-full md:w-auto pointer-events-auto flex flex-col items-center md:items-end">
              {familyDistress ? (
                <div className="bg-accent/90 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-6 shadow-2xl shadow-[0_0_20px_rgba(167,139,250,0.25)] animate-in slide-in-from-right-4 duration-500 space-y-5 w-full max-w-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-card/20 rounded-2xl flex items-center justify-center border border-border/30 shrink-0">
                      <Heart size={32} className="text-white animate-pulse" fill="currentColor" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase tracking-tighter leading-none text-white">{t.nearbyHeart}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-2">{familyDistress.dist} away • Mesh Triangulated</p>
                    </div>
                  </div>
                  
                  <button 
                    className="w-full h-16 bg-card text-accent rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                  >
                    <Navigation size={16} /> {t.helpFamily}
                  </button>
                </div>
              ) : isFriendDistress ? (
                <div className="bg-red-600/90 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-6 shadow-2xl shadow-red-600/40 animate-in slide-in-from-right-4 duration-500 space-y-5 w-full max-w-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-card/20 rounded-2xl flex items-center justify-center border border-border/30 shrink-0">
                      <AlertTriangle size={32} className="text-white animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-white">{t.distress(focusName)}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-2">{t.currentPulse(focusStatus)}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSosActive(true)}
                      className="flex-1 h-16 bg-card text-red-600 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-3 shadow-lg active:scale-95 transition-all"
                    >
                      <PhoneCall size={16} /> {t.notify}
                    </button>
                    <button className="w-16 h-16 bg-card/10 rounded-2xl flex items-center justify-center border border-border/20 hover:bg-card/20 transition-all">
                      <Navigation size={20} className="text-white" />
                    </button>
                  </div>
                </div>
              ) : isFindingFriend ? (
                <div className="bg-primary/90 backdrop-blur-xl border border-border/20 rounded-[2.5rem] p-6 shadow-2xl animate-in slide-in-from-right-4 duration-500 space-y-5 w-full max-w-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-card/20 rounded-2xl flex items-center justify-center border border-border/30 shrink-0">
                      <Navigation size={32} className="text-white animate-bounce" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tighter leading-none text-white">{t.finding(focusName!)}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mt-2">Guided Walk with Care Active</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4">
                  <button 
                    onClick={() => setSosActive(true)}
                    className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl shadow-red-600/40 active:scale-90 transition-all border-2 border-white mb-2"
                  >
                    <Shield size={28} />
                  </button>
                  <div className="bg-card/60 backdrop-blur-md px-6 py-4 rounded-[2rem] border border-border/5 items-center gap-4 animate-in fade-in duration-1000 flex">
                    <Radio size={14} className="text-secondary animate-pulse" />
                    <div className="text-left">
                      <span className="block text-[9px] font-black uppercase tracking-widest text-secondary">{t.meshActive}</span>
                      <p className="text-[8px] font-bold text-white/30 leading-none uppercase tracking-widest mt-1">Mesh Triangulation Active</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {sosActive && (
        <SOSAlert 
          onClose={() => setSosActive(false)} 
          friendName={focusName || undefined}
          friendStatus={focusStatus || undefined}
        />
      )}
    </main>
  );
}

export default function MapView() {
  return (
    <Suspense fallback={<div className="h-screen bg-card flex items-center justify-center"><Loader2 className="animate-spin text-primary" /></div>}>
      <MapContent />
    </Suspense>
  );
}

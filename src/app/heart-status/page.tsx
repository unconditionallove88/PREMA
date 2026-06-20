
'use client';

import { useState, useEffect, Suspense } from 'react';
import HeartStatusAura from "@/components/dashboard/HeartStatusAura";
import LoveCircle from "@/components/dashboard/LoveCircle";
import { 
  ArrowLeft, 
  Watch, 
  PenLine, 
  Wind, 
  Eye, 
  Loader2,
  Heart
} from "lucide-react";
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoveCircleChat } from '@/components/chat/LoveCircleChat';
import { PartyCircleChat } from '@/components/chat/PartyCircleChat';
import { PulseSync } from '@/components/dashboard/PulseSync';
import { LoveLetter } from '@/components/dashboard/LoveLetter';
import { VisionOfLove } from '@/components/dashboard/VisionOfLove';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import SidePanel from "@/components/ui/SidePanel";

/**
 * @fileOverview Inner Intention Page.
 * Removed possessives and words of lack.
 */

function InnerHeartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const firestore = useFirestore();
  const [heartRate, setHeartRate] = useState(75);
  const [mounted, setMounted] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const [holdersOpen, setHoldersOpen] = useState(false);
  const [witnessesOpen, setWitnessesOpen] = useState(false);
  const [syncOpen, setSyncOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [visionOpen, setVisionOpen] = useState(false);
  const [showBPM, setShowBPM] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    if (searchParams.get('chat') === 'holders') setHoldersOpen(true);
    if (searchParams.get('chat') === 'spectators') setWitnessesOpen(true);

    const interval = setInterval(() => {
      setHeartRate(prev => {
        const drift = Math.random() > 0.5 ? 1 : -1;
        return Math.max(50, Math.min(160, prev + drift));
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [searchParams]);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);
  
  const { data: profile } = useDoc(userDocRef);
  
  const currentBPM = profile?.pulseBaseline?.restingBPM || heartRate;
  const pulseDuration = `${(60 / currentBPM).toFixed(2)}s`;

  if (!mounted) return null;

  const t = {
    en: {
      title: "The Heart",
      sub: "Inside the Ring",
      letters: "Love Letters",
      lettersSub: "Future Self",
      breath: "Breath of Love",
      breathSub: "Ritual Now",
      vision: "Vision of Love",
      visionSub: "Grounding Tool",
      bioPulse: "Biological Pulse",
      bioPulseSub: "Live rhythm",
      footer: "Love Circle"
    },
    de: {
      title: "Das Herz ",
      sub: "Im Aura-Ring ",
      letters: "Liebesbriefe ",
      lettersSub: "Zukünftiges Ich",
      breath: "Atem der Liebe",
      breathSub: "Ritual jetzt hier",
      vision: "Vision der Liebe",
      visionSub: "Erdungs Tool",
      bioPulse: "Biologischer Puls",
      bioPulseSub: "Rhythmus ",
      footer: "Liebe Kreis"
    }
  }[lang];

  const handlePortal = (action) => action();

  return (
    <div className="flex flex-col min-h-screen bg-card p-6 pb-32 font-headline overflow-x-hidden relative">
      <header className="flex items-center gap-4 mb-8 shrink-0 z-10 pt-safe">
        <button 
          onClick={() => router.back()}
          className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tighter text-emerald-700 dark:text-white">{t.title}</h1>
          <p className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.3em]">{t.sub}</p>
        </div>
      </header>

<SidePanel
  onOpenLoveLetters={() => setLetterOpen(true)}
  onOpenBreath={() => handlePortal(() => router.push("/self-care"))}
  onOpenBioPulse={() => { setShowBPM(true); setTimeout(() => setShowBPM(false), 5000); }}
            onOpenVision={() => handlePortal(() => setVisionOpen(true))}
/>
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center gap-12 max-w-xl mx-auto pb-40">
          
          <div className="w-full flex justify-center mt-20 overflow-visible"><LoveCircle lang={lang} variant="map" heartRate={currentBPM} showBPM={showBPM} /></div>

          {/* Emotional Portals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full px-4 md:hidden">
            <button 
              onClick={() => handlePortal(() => setLetterOpen(true))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-purple-500/30 transition-all group relative z-20"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <PenLine size={24} className="text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-violet-600 leading-none">{t.letters}</p>
                <p className="text-[7px] font-bold text-violet-400 uppercase tracking-widest mt-1">{t.lettersSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => router.push('/self-care'))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-emerald-500/30 transition-all group relative z-20"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Wind size={24} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-emerald-700 leading-none">{t.breath}</p>
                <p className="text-[7px] font-bold text-emerald-400 uppercase tracking-widest mt-1">{t.breathSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => setVisionOpen(true))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-blue-500/30 transition-all group relative z-20"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Eye size={24} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-sky-600 leading-none">{t.vision}</p>
                <p className="text-[7px] font-bold text-sky-400 uppercase tracking-widest mt-1">{t.visionSub}</p>
              </div>
            </button>
          </div>

      </ScrollArea>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-card border-border/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto"></div>
        </DialogContent><PulseSync onComplete={() => setSyncOpen(false)} />
      
      </Dialog>

      <Dialog open={holdersOpen} onOpenChange={setHoldersOpen}>
        <DialogContent className="bg-card border-border/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">The Holders</DialogTitle>
          <LoveCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={witnessesOpen} onOpenChange={setWitnessesOpen}>
        <DialogContent className="bg-card border-border/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden flex flex-col h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">The Spectators</DialogTitle>
          <PartyCircleChat />
        </DialogContent>
      </Dialog>

      <Dialog open={letterOpen} onOpenChange={setLetterOpen}>
        <DialogContent className="bg-card border-border/10 max-w-2xl p-0 rounded-[2rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_100px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Love Letter</DialogTitle>
          <LoveLetter onComplete={() => setLetterOpen(false)} />
        </DialogContent>
      </Dialog>

      {visionOpen && <VisionOfLove onClose={() => setVisionOpen(false)} />}
    </div>
  );
}

export default function MyHeartPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-card flex items-center justify-center"><Loader2 className="animate-spin text-primary/20" /></div>}>
      <InnerHeartContent />
    </Suspense>
  );
}

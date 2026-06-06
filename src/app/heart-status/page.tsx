
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
import { WearablesSync } from '@/components/dashboard/WearablesSync';
import { LoveLetter } from '@/components/dashboard/LoveLetter';
import { VisionOfLove } from '@/components/dashboard/VisionOfLove';
import { playHeartbeat } from '@/lib/resonance';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Inner Resonance Page.
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

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
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
      resonance: "Inner Resonance",
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
      title: "Das Herz heute",
      sub: "Im Aura-Ring heute",
      resonance: "Innere Resonanz heute",
      letters: "Liebesbriefe heute",
      lettersSub: "Zukünftiges Ich",
      breath: "Atem der Liebe",
      breathSub: "Ritual jetzt hier",
      vision: "Vision der Liebe",
      visionSub: "Erdungs Tool",
      bioPulse: "Biologischer Puls",
      bioPulseSub: "Rhythmus heute",
      footer: "Liebe Kreis"
    }
  }[lang];

  const handlePortal = (action: () => void) => {
    playHeartbeat();
    action();
  };

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
          <h1 className="text-2xl font-black uppercase tracking-tighter text-white">{t.title}</h1>
          <p className="text-[10px] text-primary font-black uppercase tracking-[0.3em]">{t.sub}</p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center gap-12 max-w-xl mx-auto pb-40">
          
          <LoveCircle lang={lang} variant="map" heartRate={currentBPM} />

          {/* Emotional Portals Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full px-4">
            <button 
              onClick={() => handlePortal(() => setLetterOpen(true))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-purple-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform">
                <PenLine size={24} className="text-purple-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.letters}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.lettersSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => router.push('/self-care'))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-emerald-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <Wind size={24} className="text-emerald-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.breath}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.breathSub}</p>
              </div>
            </button>

            <button 
              onClick={() => handlePortal(() => setVisionOpen(true))}
              className="p-6 rounded-[2.5rem] bg-card/[0.03] border border-border/10 flex flex-col items-center gap-3 hover:border-blue-500/30 transition-all group"
            >
              <div className="w-12 h-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                <Eye size={24} className="text-blue-400" />
              </div>
              <div className="text-center">
                <p className="text-[11px] font-black uppercase text-white leading-none">{t.vision}</p>
                <p className="text-[7px] font-bold text-white/30 uppercase tracking-widest mt-1">{t.visionSub}</p>
              </div>
            </button>
          </div>

          {/* Biometric Resonance Circle */}
          <div className="w-64 h-64 md:w-80 md:h-80 bg-card/[0.02] border border-border/10 rounded-full p-10 relative overflow-hidden flex flex-col items-center justify-center shadow-2xl group mx-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
            
            <div className="flex flex-col items-center gap-1 mb-6 relative z-10">
              <span className="block text-[9px] font-black uppercase text-primary tracking-[0.4em]">{t.bioPulse}</span>
              <span className="text-[7px] font-bold text-white/20 uppercase tracking-widest">{t.bioPulseSub}</span>
            </div>

            <div className="relative mb-6">
               <div 
                 className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150"
                 style={{ animation: `aura-pulse-outer ${pulseDuration} ease-in-out infinite` }}
               />
               <div 
                 className="relative w-24 h-24 bg-card/60 rounded-full border-2 border-primary/30 flex items-center justify-center shadow-2xl backdrop-blur-md cursor-pointer active:scale-95 transition-all"
                 onClick={() => setSyncOpen(true)}
               >
                 <Heart 
                   size={48} 
                   fill="currentColor" 
                   className="text-primary transition-all"
                   style={{ 
                     animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite`,
                     filter: 'blur(6px) drop-shadow(0 0 12px hsl(var(--primary)))'
                   }} 
                 />
               </div>
            </div>

            <div className="flex items-end gap-2 relative z-10">
              <span className="text-5xl font-black text-white leading-none tracking-tighter tabular-nums">{currentBPM}</span>
              <span className="text-[9px] font-black text-primary mb-1 uppercase tracking-widest leading-none">BPM</span>
            </div>
          </div>

          <p className="text-[12px] font-black text-white uppercase tracking-[0.5em] text-center shining-white">{t.footer}</p>
        </div>
      </ScrollArea>

      <Dialog open={syncOpen} onOpenChange={setSyncOpen}>
        <DialogContent className="bg-card border-border/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col h-auto max-h-[85vh] shadow-[0_0_80px_rgba(0,0,0,0.9)]">
          <DialogTitle className="sr-only">Pulse Sync</DialogTitle>
          <div className="flex-1 overflow-y-auto"><WearablesSync onComplete={() => setSyncOpen(false)} /></div>
        </DialogContent>
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

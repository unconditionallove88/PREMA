
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Microscope, 
  Shield, 
  Eye,
  CheckCircle2,
  Users2,
  Wind,
  Sprout,
  Radio,
  Lock,
  HeartHandshake,
  MessageCircleHeart
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { PlaceHolderImages } from '@/lib/placeholder-images';

/**
 * @fileOverview Sanctuary Guide Component (Visual Handover).
 * Redesigned for "Zero-Scroll" pictorial presence.
 * Features high-fidelity placeholder images and compact functional descriptions.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Sovereign location triangulation.", de: "Souveräne Mesh-Ortung." },
    imageId: "guide-radar",
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen" },
    desc: { en: "Your inner circle of love.", de: "Dein innerer Kreis der Liebe." },
    imageId: "love-brother",
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'lab',
    title: { en: "Sovereign Lab", de: "Souveränitäts-Lab" },
    desc: { en: "Intake logic & mixing wisdom.", de: "Aufnahme-Logik & Misch-Wissen." },
    imageId: "guide-lab",
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'lovechat',
    title: { en: "Love Chat", de: "Wort der Liebe" },
    desc: { en: "Private Bonds vs Public Care.", de: "Private Bonds & Offene Kreise." },
    imageId: "love-humanity",
    icon: MessageCircleHeart,
    color: "text-[#10B981]",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'rescode',
    title: { en: "Resonance Code", de: "Resonanz-Wort" },
    desc: { en: "A sacred dispatch word.", de: "Ein heiliges Dispatch-Wort." },
    imageId: "guide-letters",
    icon: Lock,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    id: 'breath',
    title: { en: "Heart Breath", de: "Herz Atem" },
    desc: { en: "Oxytocin love sync ritual.", de: "Oxytocin Liebe Sync Ritual." },
    imageId: "guide-vision",
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/5"
  },
  {
    id: 'cocreation',
    title: { en: "Co-Creation", de: "Ko-Kreation" },
    desc: { en: "Your voice shapes this space.", de: "Deine Stimme formt diesen Raum." },
    imageId: "love-unconditional",
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function SanctuaryGuide({ lang = 'en', forceOpen = false, onDismiss }: { lang?: 'en' | 'de', forceOpen?: boolean, onDismiss?: () => void }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(0);
  const [hasDismissed, setHasDismissed] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('stayonbeat_guide_dismissed');
    if (dismissed && !forceOpen) setHasDismissed(true);
  }, [forceOpen]);

  const handleDismiss = () => {
    localStorage.setItem('stayonbeat_guide_dismissed', 'true');
    setHasDismissed(true);
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  if (hasDismissed && !isOpen) return null;

  const step = STEPS[currentStep];
  const Icon = step.icon;
  const image = PlaceHolderImages.find(img => img.id === step.imageId) || PlaceHolderImages[0];

  return (
    <div className={cn("w-full transition-all duration-1000", !isOpen && "mb-6")}>
      {!isOpen ? (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-all group opacity-60 hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-white/20" size={16} />
            <span className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">{lang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}</span>
          </div>
          <ChevronRight size={14} className="text-white/10 group-hover:text-primary" />
        </button>
      ) : (
        <div className="fixed inset-0 z-[5000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden">
          <header className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center"><Sparkles size={20} className="text-primary animate-pulse" /></div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter text-white">{lang === 'en' ? "Handover" : "Handover"}</h2>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{currentStep + 1} / {STEPS.length}</p>
              </div>
            </div>
            {!forceOpen && <button onClick={() => setIsOpen(false)} className="p-2 bg-white/5 rounded-full border border-white/10 text-white/40"><X size={18} /></button>}
          </header>

          <main className="flex-1 relative z-10 px-6 flex flex-col justify-center items-center overflow-hidden">
            <div className="max-w-xl w-full flex flex-col items-center gap-4 animate-in slide-in-from-bottom-4 duration-700 h-full justify-between py-4">
              <div className="text-center space-y-1">
                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-white/10 mx-auto mb-2", step.bg)}><Icon size={32} className={step.color} /></div>
                <h3 className="text-2xl font-black uppercase tracking-tighter text-white leading-none">{lang === 'en' ? step.title.en : step.title.de}</h3>
                <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">{lang === 'en' ? step.desc.en : step.desc.de}</p>
              </div>

              <div className="flex-1 w-full max-h-[45vh] relative rounded-[2.5rem] overflow-hidden border-2 border-white/5 shadow-2xl">
                <img src={image.imageUrl} alt={image.description} className="w-full h-full object-cover grayscale opacity-60" data-ai-hint={image.imageHint} />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>

              <div className="w-full p-4 sm:p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-1 max-w-sm">
                <div className="flex items-center justify-center gap-2"><Shield size={12} className="text-primary" /><span className="text-[8px] font-black uppercase tracking-[0.3em] text-primary">Guardian Intel</span></div>
                <p className="text-[10px] font-bold text-white/80 leading-relaxed uppercase tracking-widest text-center italic px-2">
                  {lang === 'en' ? "Integrated with central intelligence for absolute care." : "Verbunden mit zentraler Intelligenz für Fürsorge."}
                </p>
              </div>
            </div>
          </main>

          <footer className="shrink-0 p-6 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-1">
                  {STEPS.map((_, i) => (<div key={i} className={cn("h-1 rounded-full transition-all duration-500", i === currentStep ? "w-6 bg-primary" : "w-1 bg-white/10")} />))}
                </div>
                <div className="flex gap-3">
                  {currentStep > 0 && <button onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} className="p-3 bg-white/5 rounded-2xl border border-white/10 text-white/40 active:scale-95"><ChevronLeft size={20} /></button>}
                  {currentStep < STEPS.length - 1 ? (
                    <button onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} className="px-8 py-4 bg-primary text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg active:scale-95">Next <ChevronRight size={16} /></button>
                  ) : (
                    <button onClick={handleDismiss} className="px-8 py-4 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg active:scale-95">Enter <CheckCircle2 size={16} /></button>
                  )}
                </div>
              </div>
              <p className="text-center text-[8px] font-black uppercase tracking-[0.5em] shining-white">Created in harmony</p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}


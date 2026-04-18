
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Microscope, 
  Shield, 
  CheckCircle2,
  Wind,
  Sprout,
  Radio,
  Lock,
  HeartHandshake,
  MessageCircleHeart,
  Users2,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Sanctuary Guide Component (Sovereign Intelligence Handover).
 * Redesigned as a text-focused educational guide with Zero-Scroll presence.
 * Explains Trusted Bonds, Love Chat types, and the Resonance Code.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find my friends", de: "Finde meine Freunde" },
    detail: {
      en: "Tap on the hearts in the Circle of Love or use the Radar map to locate your friends in real-time. The Sovereign Mesh triangulates your group's location for mutual care without central tracking.",
      de: "Tippe auf die Herzen im Circle of Love oder nutze den Radar, um deine Freunde in Echtzeit zu finden. Das Sovereign Mesh ortet deine Gruppe für gegenseitigen Halt ohne zentrale Überwachung."
    },
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen" },
    desc: { en: "My inner circle", de: "Mein innerer Kreis" },
    detail: {
      en: "Trusted Bonds are people who love you unconditionally. Add up to 5 bonds in your Profile section. These are the only people who can see your Mesh location and receive your emergency alerts.",
      de: "Vertraute Bindungen sind Menschen, die dich bedingungslos lieben. Füge bis zu 5 Bonds in deinem Profil hinzu. Nur diese Menschen können deinen Standort sehen und deine Notfall-Alarme empfangen."
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'lab',
    title: { en: "Sovereign Lab", de: "Souveränitäts-Lab" },
    desc: { en: "Log my truth", de: "Meine Wahrheit notieren" },
    detail: {
      en: "Honesty is the foundation of self-love. Recording your intake allows the Pulse Guardian to calibrate your safety thresholds. We use this data only to protect your heart and kidneys in real-time.",
      de: "Ehrlichkeit ist das Fundament der Selbstliebe. Die Aufzeichnung deiner Einnahmen ermöglicht es dem Pulse Guardian, deine Schutzgrenzen zu kalibrieren, um dein Herz und deine Nieren zu schützen."
    },
    icon: Microscope,
    color: "text-[#10B981]",
    bg: "bg-primary/10"
  },
  {
    id: 'lovechat',
    title: { en: "Love Chat", de: "Wort der Liebe" },
    desc: { en: "Words of love", de: "Worte der Liebe" },
    detail: {
      en: "The Holders is a private chat for your inner circle (mutual bonds required). The Spectators is a public, moderated circle of collective care where you can connect with the wider sanctuary community.",
      de: "Die Holder ist ein privater Chat für deinen inneren Kreis (gegenseitige Bindung erforderlich). Die Spectator sind ein öffentlicher, moderierter Raum für Gemeinschaft und gegenseitige Fürsorge."
    },
    icon: MessageCircleHeart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'rescode',
    title: { en: "Resonance Code", de: "Resonanz-Wort" },
    desc: { en: "Sacred dispatch word", de: "Heiliges Notfall Wort" },
    detail: {
      en: "Set your Resonance Code in the Circle of Love settings. Texting this sacred word to your Trusted Bonds instantly alerts them that you need space and support, even if you cannot speak.",
      de: "Setze dein Resonanz-Wort in den Circle of Love Einstellungen. Wenn du dieses Wort an deine Bonds sendest, wissen sie sofort, dass du Halt brauchst, auch wenn du gerade nicht sprechen kannst."
    },
    icon: Lock,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    id: 'breath',
    title: { en: "Heart Breath", de: "Herz Atem heute" },
    desc: { en: "Oxytocin love sync", de: "Oxytocin Liebe Sync" },
    detail: {
      en: "Follow the heart's pulse to synchronize your breathing. This ritual stimulates oxytocin and recalibrates your nervous system. Use it anytime you feel a loss of grounding or intensity.",
      de: "Folge dem Puls des Herzens, um deinen Atem zu synchronisieren. Dieses Ritual stimuliert Oxytocin und kalibriert dein Nervensystem neu. Nutze es immer, wenn du die Erdung verlierst."
    },
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/5"
  },
  {
    id: 'cocreation',
    title: { en: "Co-Creation", de: "Ko-Kreation heute" },
    desc: { en: "Shape the sanctuary", de: "Den Raum gestalten" },
    detail: {
      en: "Your voice shapes this sanctuary. Use the Co-Creation portal to share feedback, feelings, or ideas for new tools. We evolve this space together through honesty and mutual respect.",
      de: "Deine Stimme formt dieses Sanctuary. Nutze das Ko-Kreations-Portal, um Feedback, Gefühle oder Ideen zu teilen. Wir entwickeln diesen Raum gemeinsam durch Ehrlichkeit und Respekt."
    },
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
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [forceOpen]);

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

  const step = STEPS[currentStep] || STEPS[0];
  const Icon = step.icon;

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
        <div className="fixed inset-0 z-[8000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden touch-none">
          <header className="px-6 pt-6 pb-2 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg font-black uppercase tracking-tighter text-white">{lang === 'en' ? "Intelligence Handover" : "Intelligence Handover"}</h2>
                <p className="text-[8px] font-black text-primary uppercase tracking-[0.3em]">{currentStep + 1} / {STEPS.length}</p>
              </div>
            </div>
            {!forceOpen && (
              <button 
                onClick={() => setIsOpen(false)} 
                className="p-2 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </header>

          <main className="flex-1 relative z-10 px-6 flex flex-col justify-center items-center overflow-hidden">
            <div className="max-w-xl w-full flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-700 h-full justify-between py-10">
              
              <div className="text-center space-y-4 shrink-0">
                <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-white/10 mx-auto shadow-2xl", step.bg)}>
                  <Icon size={40} className={step.color} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
                    {lang === 'en' ? step.title.en : step.title.de}
                  </h3>
                  <p className="text-primary text-[10px] font-black uppercase tracking-[0.4em]">
                    {lang === 'en' ? step.desc.en : step.desc.de}
                  </p>
                </div>
              </div>

              <div className="flex-1 w-full flex flex-col justify-center items-center">
                <div className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Icon size={120} className="text-white" />
                  </div>
                  
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_8px_rgba(27,77,62,0.8)]" />
                      <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                        {lang === 'en' ? "Functional Intelligence" : "Funktionale Intelligenz"}
                      </span>
                    </div>
                    
                    <p className="text-lg md:text-xl font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                      {lang === 'en' ? step.detail.en : step.detail.detail}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-2 max-w-sm shrink-0">
                <div className="flex items-center justify-center gap-3">
                  <Shield size={14} className="text-primary" />
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-primary">Guardian Protocol</span>
                </div>
                <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest text-center italic px-2">
                  {lang === 'en' 
                    ? "Every tool is an act of self-respect. Calibrate your awareness through truth." 
                    : "Jedes Tool ist ein Akt des Respekts. Kalibriere dein Bewusstsein durch Wahrheit."
                  }
                </p>
              </div>
            </div>
          </main>

          <footer className="shrink-0 p-8 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1.5 rounded-full transition-all duration-500", 
                        i === currentStep ? "w-8 bg-primary" : "w-1.5 bg-white/10"
                      )} 
                    />
                  ))}
                </div>
                <div className="flex gap-4">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                      className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all hover:text-white"
                    >
                      <ChevronLeft size={24} />
                    </button>
                  )}
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} 
                      className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                      {lang === 'en' ? 'Next' : 'Weiter'} <ChevronRight size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleDismiss} 
                      className="px-10 py-5 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all"
                    >
                      {lang === 'en' ? 'Enter Sanctuary' : 'Eintreten'} <CheckCircle2 size={20} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-center text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">
                {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen hier"}
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

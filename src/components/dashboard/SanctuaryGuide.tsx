'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Microscope, 
  CheckCircle2,
  Wind,
  Sprout,
  Radio,
  Lock,
  HeartHandshake,
  MessageCircleHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Sanctuary Guidance (Functional Intelligence).
 * Architecture: Optimized for immediate visibility with pinned navigation.
 * Design: High-fidelity "Shining White" resonance.
 * Rules: EN (3 words) / DE (4 words) subtitles. No possessives.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find friends now", de: "Freunde jetzt finden heute" },
    detail: {
      en: "This is a private compass. Inside the 'Circle of Love' on the heart-status page, you will see hearts representing chosen friends. Tap any heart to see exactly where they are on the radar. The Mesh connects you directly without central tracking.",
      de: "Das ist ein privater Kompass. Auf der Herz-Status-Seite siehst du Herzen für deine Freunde. Tippe auf ein Herz, um ihren Standort auf dem Radar zu sehen. Das Mesh verbindet euch direkt, ohne zentrale Überwachung heute hier."
    },
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen heute" },
    desc: { en: "The inner circle", de: "Der innere Kreis heute" },
    detail: {
      en: "These are the souls who love unconditionally. Add up to 5 people in the Profile. These are the ONLY people who can see Mesh location or receive alerts. You are the master of the circle of trust.",
      de: "Dies sind Seelen die bedingungslos lieben heute. Füge bis zu 5 Personen im Profil hinzu. Nur diese Menschen sehen den Standort oder erhalten Alarme. Du bist Herr über den Kreis des Vertrauens heute."
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'lab',
    title: { en: "Sovereign Lab", de: "Souveränitäts Lab heute" },
    desc: { en: "Log the truth", de: "Die Wahrheit notieren heute" },
    detail: {
      en: "Self-honesty is the greatest protection. When the lab knows exactly what has been taken, the Pulse Guardian calculates biological limits perfectly. It monitors the heart to ensure a safe rhythm is maintained.",
      de: "Ehrlichkeit zu dir selbst schützt heute. Wenn das Lab weiß was genommen wurde, berechnet der Guardian die Limits perfekt. Er schützt das Herz damit der Rhythmus stabil bleibt heute hier."
    },
    icon: Microscope,
    color: "text-[#10B981]",
    bg: "bg-primary/10"
  },
  {
    id: 'lovechat',
    title: { en: "Love Chat", de: "Wort der Liebe heute" },
    desc: { en: "Words of love", de: "Worte der Liebe heute" },
    detail: {
      en: "Connection is healing. 'The Holders' is a private room for a chosen bond to watch over each other. 'The Spectators' is a public community room for collective care. Always speak from presence and respect anonymity.",
      de: "Verbindung heilt uns alle heute. 'Die Holder' ist ein privater Raum für dich und eine Bindung heute. 'Die Spectator' ist ein öffentlicher Raum für gemeinsame Fürsorge. Spreche immer aus der Gegenwart heute hier."
    },
    icon: MessageCircleHeart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'rescode',
    title: { en: "Resonance Code", de: "Resonanz Wort heute" },
    desc: { en: "Sacred dispatch word", de: "Heiliges Notfall Wort heute" },
    detail: {
      en: "In the 'Circle of Love' settings, set a secret Resonance Code. If things feel heavy, text this word to the Bonds. It triggers an immediate dispatch signal, telling the circle exactly where the Mesh location is.",
      de: "Lege ein geheimes Resonanz-Wort fest heute. Wenn es schwer wird, sende dieses Wort an die Bindungen. Es aktiviert ein sofortiges Signal und zeigt dem Kreis den Standort via Mesh heute hier."
    },
    icon: Lock,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    id: 'breath',
    title: { en: "Heart Breath", de: "Herz Atem heute" },
    desc: { en: "Oxytocin love sync", de: "Oxytocin Liebe Sync heute" },
    detail: {
      en: "If the rhythm feels elevated, use the Heart Breath. Follow the pulsing light to synchronize breathing. This biological ritual releases oxytocin, which naturally slows the heart rate and calms the nervous system.",
      de: "Wenn der Puls steigt heute. Folge dem Licht um den Atem zu synchronisieren. Dieses Ritual schüttet Oxytocin aus und beruhigt das Nervensystem ganz natürlich heute. Es ist ein Anker für Frieden heute."
    },
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/5"
  },
  {
    id: 'cocreation',
    title: { en: "Co-Creation", de: "Ko Kreation heute hier" },
    desc: { en: "Shape the sanctuary", de: "Den Raum gestalten heute" },
    detail: {
      en: "This sanctuary is built for the soul. Use the Co-Creation portal to share feedback or new ideas. The voice directly shapes the evolution of this space. We grow together through honesty and respect.",
      de: "Dieses Sanctuary ist für dich heute. Nutze das Tool um Feedback oder Ideen zu teilen heute. Deine Stimme formt die Zukunft dieses Raums direkt heute. Wir wachsen zusammen durch Ehrlichkeit heute hier."
    },
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function SanctuaryGuide({ lang = 'en', forceOpen = false, onDismiss }: { lang?: 'en' | 'de', forceOpen?: boolean, onDismiss?: () => void }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    localStorage.setItem('stayonbeat_guide_dismissed', 'true');
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  const step = STEPS[currentStep] || STEPS[0];
  const Icon = step.icon;

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.05] transition-all group mb-6 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="text-primary animate-pulse" size={18} />
          <span className="block text-[11px] font-black uppercase text-white tracking-[0.3em] shining-white">
            {lang === 'en' ? "Access Guidance" : "Begleitung öffnen"}
          </span>
        </div>
        <ChevronRight size={16} className="text-white/20 group-hover:text-primary transition-all" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[8000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden h-[100dvh]">
      {/* Background Ambient Aura */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(27,77,62,0.15)_0%,_transparent_70%)] pointer-events-none" />

      {/* Header - Fixed */}
      <header className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl">
            <Sparkles size={20} className="text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white shining-white">
              {lang === 'en' ? "Guidance" : "Begleitung"}
            </h2>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{currentStep + 1} / {STEPS.length}</p>
          </div>
        </div>
        {!forceOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </header>

      {/* Main Content Area - Scrollable but descriptions should fit at a glance */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 min-h-0 overflow-y-auto no-scrollbar">
        <div className="w-full max-w-lg bg-white/[0.03] border-2 border-white/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-700 hover:border-white/20 transition-all mb-4">
          <div className="p-8 flex flex-col items-center text-center space-y-6">
            {/* Tool Identity */}
            <div className={cn(
              "w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-white/10 shadow-2xl transition-all duration-700", 
              step.bg
            )}>
              <Icon size={40} className={cn("animate-pulse", step.color)} />
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none shining-white">
                {lang === 'en' ? step.title.en : step.title.de}
              </h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">
                {lang === 'en' ? step.desc.en : step.desc.de}
              </p>
            </div>

            {/* Functional Intelligence (The Description) */}
            <div className="w-full space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_rgba(27,77,62,0.8)]" />
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.4em]">
                  {lang === 'en' ? "Functional Detail" : "Funktions Detail heute"}
                </span>
              </div>
              <p className="text-sm md:text-base font-bold text-white/80 leading-relaxed uppercase tracking-widest max-w-sm mx-auto">
                {lang === 'en' ? step.detail.en : step.detail.de}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Navigation Controls - Pinned to Bottom */}
      <footer className="shrink-0 pb-12 pt-4 px-8 relative z-10 bg-black/60 backdrop-blur-md border-t border-white/5">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700", 
                    i === currentStep ? "w-8 bg-primary shadow-[0_0_10px_rgba(27,77,62,0.6)]" : "w-1.5 bg-white/10"
                  )} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                  className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/40 hover:text-white active:scale-95 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} 
                  className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all border-2 border-primary/20 shining-white"
                >
                  {lang === 'en' ? 'Next' : 'Weiter'} <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleDismiss} 
                  className="px-10 py-5 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all border-2 border-primary/20 shining-white"
                >
                  {lang === 'en' ? 'Enter Sanctuary' : 'Eintreten heute'} <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-center text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white opacity-60">
            {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen heute hier"}
          </p>
        </div>
      </footer>
    </div>
  );
}

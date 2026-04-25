
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

/**
 * @fileOverview Sanctuary Guide Component (Sovereign Intelligence Handover).
 * Redesigned with Golden Ratio harmony for Zero-Scroll presence on all devices.
 * Purified language: No possessives or words of lack.
 * Fixed: Text fitting for Desktop, iPhone, and Android.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find friends now", de: "Freunde jetzt finden heute" },
    detail: {
      en: "The Radar is a private compass. Tap the hearts inside the 'Circle of Love' to see exactly where friends are located. The Sovereign Mesh connects the group directly without tracking location centrally. It is for staying together.",
      de: "Der Radar ist ein privater Kompass. Tippe auf die Herzen im 'Circle of Love' um Freunde zu finden. Das Mesh verbindet die Gruppe direkt ohne zentrale Ortung heute. Es geht darum zusammen zu bleiben heute hier."
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
      en: "Trusted Bonds are people who love unconditionally. Add up to 5 people in the Profile section. These are the ONLY people who see the Mesh location and receive alerts when support is needed.",
      de: "Vertraute Bindungen sind Menschen die bedingungslos lieben heute. Füge bis zu 5 Personen im Profil hinzu heute. Nur diese Menschen sehen den Standort und empfangen Alarme bei Bedarf heute hier."
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
      en: "The Sovereign Lab is built on self-honesty. By logging intake, the Pulse Guardian calculates biological limits perfectly. Real-time data keeps the heart and kidneys protected. Self-honesty is the most powerful protection.",
      de: "Das Souveränitäts Lab baut auf Ehrlichkeit auf heute. Wenn man notiert was man nimmt schützt der Guardian die Biologie heute. Echtzeitdaten schützen Herz und Nieren heute. Ehrlichkeit ist der beste Schutz heute hier."
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
      en: "There are two circles. 'The Holders' is a private room for the inner circle requiring mutual bonds. 'The Spectators' is a public community room for everyone, monitored for kindness and collective care.",
      de: "Es gibt zwei Kreise heute. 'Die Holder' ist ein privater Raum für den inneren Kreis heute hier. 'Die Spectator' ist ein öffentlicher Raum für alle geerdet in Freundlichkeit und Fürsorge heute hier."
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
      en: "Set the Resonance Code (a secret word) in the Circle of Love. Texting this word to Trusted Bonds triggers immediate help and space, even without words. It is a sacred signal for the network.",
      de: "Setze das Resonanz Wort in den Circle of Love Einstellungen heute. Dieses Wort an die Bonds zu senden bedeutet sofortigen Halt heute. Es ist ein heiliges Signal für das Netzwerk heute hier."
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
      en: "Follow the pulsing heart to synchronize breathing. This ritual releases oxytocin, which naturally lowers the heart rate and calms the nervous system. Use it for grounding and returning to a calm state.",
      de: "Folge dem pulsierenden Herzen um den Atem zu synchronisieren heute. Dieses Ritual schüttet Oxytocin aus und beruhigt das Nervensystem heute. Nutze es um geerdet und zentriert zu bleiben heute hier."
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
      en: "The sanctuary is built for the soul. Use the Co-Creation portal to share joy, friction, or ideas. The voice directly shapes the evolution of this space. We grow together through honesty and respect.",
      de: "Das Sanctuary wird gemeinsam erschaffen heute hier. Nutze das Ko Kreations Tool für Feedback oder neue Ideen heute. Die Stimme formt die Zukunft dieses Raums heute durch gegenseitige Liebe hier."
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
        <div className="fixed inset-0 z-[8000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden touch-none h-[100dvh]">
          {/* Proportional Header */}
          <header className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={24} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tighter text-white">{lang === 'en' ? "Functional Intelligence" : "Funktionale Intelligenz"}</h2>
                <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{currentStep + 1} / {STEPS.length}</p>
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

          {/* Main Proportional Content Area */}
          <main className="flex-1 relative z-10 px-6 flex flex-col justify-center items-center overflow-hidden min-h-0">
            <div className="max-w-xl w-full flex flex-col items-center gap-4 md:gap-8 animate-in slide-in-from-bottom-4 duration-700 h-full justify-between py-4 md:py-6">
              
              {/* Focal Identity */}
              <div className="text-center space-y-2 md:space-y-4 shrink-0">
                <div className={cn("w-16 h-16 md:w-24 md:h-24 rounded-[1.5rem] md:rounded-[2.5rem] flex items-center justify-center border-2 border-white/10 mx-auto shadow-2xl transition-all duration-700", step.bg)}>
                  <Icon size={32} className={cn("animate-pulse md:w-12 md:h-12", step.color)} />
                </div>
                <div className="space-y-0.5 md:space-y-1">
                  <h3 className="text-2xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                    {lang === 'en' ? step.title.en : step.title.de}
                  </h3>
                  <p className="text-primary text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                    {lang === 'en' ? step.desc.en : step.desc.de}
                  </p>
                </div>
              </div>

              {/* Proportional Wisdom Card - Fixed for Universal Screen Fitting */}
              <div className="flex-1 w-full flex flex-col justify-center items-center min-h-0 overflow-hidden">
                <div className="w-full bg-white/[0.03] border-2 border-white/5 rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 relative overflow-hidden shadow-2xl flex flex-col justify-center max-h-full">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Icon size={160} className="text-white" />
                  </div>
                  
                  <div className="relative z-10 space-y-4 md:space-y-6 overflow-y-auto no-scrollbar">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(27,77,62,0.8)]" />
                      <span className="text-[8px] md:text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                        {lang === 'en' ? "Guidance Protocol" : "Anleitung heute hier"}
                      </span>
                    </div>
                    
                    <p className="text-xs sm:text-lg md:text-2xl font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                      {lang === 'en' ? step.detail.en : step.detail.de}
                    </p>
                  </div>
                </div>
              </div>

              {/* Grounding Protocol (Fixed at bottom of main) */}
              <div className="w-full p-4 md:p-6 bg-primary/5 border-2 border-primary/20 rounded-[1.5rem] md:rounded-[2.5rem] space-y-1 md:space-y-2 max-w-sm shrink-0">
                <div className="flex items-center justify-center gap-2 md:gap-3">
                  <Shield size={12} className="text-primary md:w-4 md:h-4" />
                  <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.4em] text-primary">Guardian Intelligence</span>
                </div>
                <p className="text-[9px] md:text-[11px] font-bold text-white/60 leading-relaxed uppercase tracking-widest text-center italic px-2">
                  {lang === 'en' 
                    ? "Every tool is an act of self-respect. Calibrate awareness through truth." 
                    : "Jedes Tool ist ein Akt des Respekts. Calibrierung durch Wahrheit heute."
                  }
                </p>
              </div>
            </div>
          </main>

          {/* Persistent Proportional Footer */}
          <footer className="shrink-0 p-6 md:p-10 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-4 md:gap-8">
              <div className="flex items-center justify-between">
                {/* Progress Indicators */}
                <div className="flex gap-2">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 md:h-2 rounded-full transition-all duration-500", 
                        i === currentStep ? "w-6 md:w-10 bg-primary shadow-[0_0_10px_rgba(27,77,62,0.5)]" : "w-1.5 md:w-2 bg-white/10"
                      )} 
                    />
                  ))}
                </div>
                
                {/* Navigation Controls */}
                <div className="flex gap-3 md:gap-4">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                      className="p-4 md:p-5 bg-white/5 rounded-xl md:rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all hover:text-white"
                    >
                      <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
                    </button>
                  )}
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} 
                      className="px-8 md:px-12 py-4 md:py-6 bg-primary text-white rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-3 md:gap-4 shadow-xl active:scale-95 transition-all border-2 border-primary/20"
                    >
                      {lang === 'en' ? 'Next' : 'Weiter'} <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  ) : (
                    <button 
                      onClick={handleDismiss} 
                      className="px-8 md:px-12 py-4 md:py-6 bg-[#1b4d3e] text-white rounded-xl md:rounded-2xl font-black uppercase text-xs md:text-sm tracking-widest flex items-center gap-3 md:gap-4 shadow-xl active:scale-95 transition-all border-2 border-primary/20"
                    >
                      {lang === 'en' ? 'Enter Sanctuary' : 'Eintreten heute'} <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />
                    </button>
                  )}
                </div>
              </div>
              
              {/* Shining White Resonance */}
              <p className="text-center text-[9px] md:text-[11px] font-black uppercase tracking-[0.6em] shining-white opacity-80">
                {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen heute hier"}
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

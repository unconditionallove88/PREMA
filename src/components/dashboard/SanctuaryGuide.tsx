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
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Sanctuary Guide Component (Sovereign Intelligence Handover).
 * Written with brotherly love and simple human-to-human guidance.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find friends now", de: "Freunde jetzt finden heute" },
    detail: {
      en: "Brother, this is your private compass. Tap the hearts inside the 'Circle of Love' to see exactly where your friends are. The Sovereign Mesh connects the group directly without tracking you centrally. It is just for staying together. Tap any heart to walk with soul.",
      de: "Bruder, das ist dein privater Kompass. Tippe auf die Herzen im 'Circle of Love', um deine Freunde zu finden heute. Das Mesh verbindet euch direkt ohne zentrale Überwachung heute hier. Es geht nur darum, zusammen zu bleiben heute."
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
      en: "These are the souls who love you unconditionally. You can add up to 5 people in the Profile section. These are the ONLY people who see your Mesh location and receive alerts when you need care. You are the master of your own circle of trust.",
      de: "Dies sind die Seelen, die dich bedingungslos lieben heute. Füge bis zu 5 Personen im Profil hinzu heute hier. Nur diese Menschen sehen deinen Standort und empfangen Alarme, wenn du Hilfe brauchst heute."
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
      en: "Self-honesty is your greatest protection. When you tell the lab what you have taken, the Pulse Guardian calculates your biological limits perfectly. It keeps your heart and kidneys protected through data. Honesty with yourself keeps your rhythm steady.",
      de: "Ehrlichkeit zu dir selbst ist dein bester Schutz heute hier. Wenn du notierst, was du nimmst, schützt der Guardian deine Biologie heute perfekt. Echtzeitdaten schützen Herz und Nieren heute hier. Ehrlichkeit bewahrt deinen Rhythmus heute."
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
      en: "We have two spaces for connection. 'The Holders' is a private room for your inner circle where you both agree to care. 'The Spectators' is a public community room where we all watch over each other with kindness. Speak from presence and respect everyone.",
      de: "Es gibt zwei Kreise heute hier. 'Die Holder' ist ein privater Raum für den inneren Kreis heute hier. 'Die Spectator' ist ein öffentlicher Raum für alle, geerdet in Freundlichkeit heute. Spreche aus der Präsenz und achte jeden hier heute."
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
      en: "Set your Resonance Code—a secret word—in the Circle of Love. If you text this word to your Bonds, it triggers immediate help and space, even without other words. It is a sacred signal for the network to find you via Mesh when words are not enough.",
      de: "Setze dein Resonanz Wort in den Einstellungen heute. Dieses Wort an deine Bindungen zu senden bedeutet sofortigen Halt heute. Es ist ein heiliges Signal für das Netzwerk heute hier. Nutze es, wenn Worte nicht mehr reichen heute."
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
      en: "Follow the pulsing heart to synchronize your breathing. This releases oxytocin, which naturally lowers your heart rate and calms your nerves. Use it for grounding and returning to a calm state. It is a biological reset of peace for your soul.",
      de: "Folge dem pulsierenden Herzen, um deinen Atem zu synchronisieren heute. Das schüttet Oxytocin aus und beruhigt dein Nervensystem heute hier. Nutze es, um geerdet zu bleiben heute. Es ist ein Reset für die Seele heute."
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
      en: "This sanctuary is built for you, brother. Use the Co-Creation portal to share joy, friction, or ideas. Your voice directly shapes how this space grows. We grow together through honesty and respect. Every word helps calibrate our collective resonance.",
      de: "Dieses Sanctuary ist für dich gebaut heute hier. Nutze das Ko Kreations Tool für Feedback oder neue Ideen heute. Deine Stimme formt die Zukunft dieses Raums heute hier. Wir wachsen zusammen durch Ehrlichkeit und Respekt heute."
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
        className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-all group opacity-60 hover:opacity-100 mb-6"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="text-white/20" size={16} />
          <span className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">{lang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}</span>
        </div>
        <ChevronRight size={14} className="text-white/10 group-hover:text-primary" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[8000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden touch-none h-[100dvh]">
      {/* Header */}
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

      {/* Main Content */}
      <main className="flex-1 relative z-10 px-6 flex flex-col justify-center items-center overflow-hidden min-h-0 py-4">
        <div className="max-w-xl w-full flex flex-col items-center gap-6 animate-in slide-in-from-bottom-4 duration-700 h-full">
          
          {/* Identity */}
          <div className="text-center space-y-4 shrink-0">
            <div className={cn("w-20 h-20 md:w-28 md:h-28 rounded-[2rem] flex items-center justify-center border-2 border-white/10 mx-auto shadow-2xl transition-all duration-700", step.bg)}>
              <Icon size={40} className={cn("animate-pulse md:w-16 md:h-16", step.color)} />
            </div>
            <div className="space-y-1">
              <h3 className="text-3xl md:text-5xl font-black uppercase tracking-tighter text-white leading-none">
                {lang === 'en' ? step.title.en : step.title.de}
              </h3>
              <p className="text-primary text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em]">
                {lang === 'en' ? step.desc.en : step.desc.de}
              </p>
            </div>
          </div>

          {/* Detailed Instruction Card - Simple and easy to understand */}
          <div className="flex-1 w-full bg-white/[0.03] border-2 border-white/5 rounded-[2.5rem] p-8 md:p-10 relative overflow-hidden shadow-2xl flex flex-col min-h-0">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Icon size={160} className="text-white" />
            </div>
            
            <ScrollArea className="flex-1">
              <div className="relative z-10 space-y-6 pr-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(27,77,62,0.8)]" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">
                    {lang === 'en' ? "Brotherly Guidance" : "Brüderliche Begleitung"}
                  </span>
                </div>
                
                <p className="text-base md:text-xl font-bold text-white/90 leading-relaxed uppercase tracking-widest">
                  {lang === 'en' ? step.detail.en : step.detail.de}
                </p>
              </div>
            </ScrollArea>
          </div>

          {/* Grounding Note */}
          <div className="w-full p-4 bg-primary/5 border border-primary/20 rounded-[1.5rem] shrink-0 text-center">
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">
              {lang === 'en' 
                ? "Self-respect is the focus. Calibrate through truth." 
                : "Selbstrespekt ist der Fokus. Calibrierung durch Wahrheit heute."
              }
            </p>
          </div>
        </div>
      </main>

      {/* Navigation Footer */}
      <footer className="shrink-0 p-8 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
        <div className="max-w-xl mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {/* Progress */}
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500", 
                    i === currentStep ? "w-8 bg-primary shadow-lg" : "w-1.5 bg-white/10"
                  )} 
                />
              ))}
            </div>
            
            {/* Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                  className="p-5 bg-white/5 rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} 
                  className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all border-2 border-primary/20"
                >
                  {lang === 'en' ? 'Next' : 'Weiter'} <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={handleDismiss} 
                  className="px-10 py-5 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-sm tracking-widest flex items-center gap-3 shadow-xl active:scale-95 transition-all border-2 border-primary/20"
                >
                  {lang === 'en' ? 'Enter Sanctuary' : 'Eintreten heute'} <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-center text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white opacity-80">
            {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen heute hier"}
          </p>
        </div>
      </footer>
    </div>
  );
}

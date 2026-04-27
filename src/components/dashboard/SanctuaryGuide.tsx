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
 * @fileOverview Sanctuary Guide (Functional Intelligence).
 * Recalibrated using Golden Ratio (38.2% / 61.8%) architecture.
 * Visibility enhanced with Shining White resonance.
 * Terms "Brotherly" removed; purely functional guidance.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find friends now", de: "Freunde jetzt finden heute" },
    detail: {
      en: "This is a private compass. Inside the 'Circle of Love' on the heart-status page, you will see hearts. These represent your chosen friends. Tap any heart to see exactly where they are on the radar. The Sovereign Mesh connects you directly to them without tracking you centrally. It is just for staying together. Tap any heart to walk with soul.",
      de: "Das ist ein privater Kompass. Auf der Herz-Status-Seite siehst du Herzen im 'Circle of Love'. Diese stehen für deine Freunde. Tippe auf ein Herz, um ihren Standort auf dem Radar zu sehen. Das Mesh verbindet euch direkt, ohne euch zentral zu überwachen. Es dient nur dazu, zusammenzubleiben heute hier."
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
      en: "These are the souls who love you unconditionally. You can add up to 5 people in the Profile section under 'Trusted Bonds'. These are the ONLY people who can see your Mesh location or receive alerts when you need care. You are the master of your own circle of trust. No one else has access to this resonance.",
      de: "Dies sind die Seelen, die dich bedingungslos lieben heute. Du kannst bis zu 5 Personen im Profil hinzufügen. Nur diese Menschen sehen deinen Standort oder erhalten Alarme, wenn du Hilfe brauchst. Du bist der Herr über deinen eigenen Kreis des Vertrauens heute hier."
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
      en: "Self-honesty is your greatest protection. When you tell the lab exactly what you have taken, the Pulse Guardian calculates your biological limits perfectly. It monitors your heart and kidneys to ensure you stay in a safe rhythm. Honesty with yourself is the foundation of your well-being in this sanctuary.",
      de: "Ehrlichkeit zu dir selbst ist dein bester Schutz. Wenn du dem Lab sagst, was du nimmst, berechnet der Guardian deine biologischen Grenzen perfekt. Er schützt Herz und Nieren, damit dein Rhythmus stabil bleibt heute. Ehrlichkeit ist das Fundament für dein Wohlbefinden heute hier."
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
      en: "Connection is healing. 'The Holders' is a private room for you and a chosen bond where you both agree to watch over each other. 'The Spectators' is our public community room where we all practice collective care. Always speak from presence and respect the anonymity of every soul in the circle.",
      de: "Verbindung heilt uns alle heute. 'Die Holder' ist ein privater Raum für dich und eine vertraute Bindung heute. 'Die Spectator' ist unser öffentlicher Raum, in dem wir alle aufeinander achten. Spreche immer aus der Gegenwart und achte die Anonymität jeder Seele hier heute."
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
      en: "In the 'Circle of Love' settings, you can set a secret Resonance Code. If things feel too heavy, simply text this word to your Bonds. It triggers an immediate dispatch signal, telling your circle exactly where you are via Mesh so they can hold space for you. It is a sacred signal when words are not enough.",
      de: "In den Einstellungen kannst du ein geheimes Resonanz-Wort festlegen heute. Wenn es zu schwer wird, sende dieses Wort an deine Bindungen. Es aktiviert ein sofortiges Signal und zeigt deinem Kreis via Mesh, wo du bist, damit sie für dich da sein können heute hier."
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
      en: "If your rhythm feels elevated, use the Heart Breath. Follow the pulsing light to synchronize your breathing. This biological ritual releases oxytocin, which naturally slows your heart rate and calms your nervous system. It is a reset button for peace, always available when you need return to center.",
      de: "Wenn dein Puls steigt, nutze den Herz-Atem heute. Folge dem Licht, um deinen Atem zu synchronisieren. Dieses Ritual schüttet Oxytocin aus und beruhigt dein Nervensystem ganz natürlich heute. Es ist dein Anker für inneren Frieden, jederzeit bereit heute hier."
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
      en: "This sanctuary is built for you. Use the Co-Creation portal to share what works, what feels difficult, or new ideas you have. Your voice directly shapes the evolution of this space. We grow together through honesty and respect. Every word you share helps calibrate our collective resonance.",
      de: "Dieses Sanctuary ist für dich gebaut heute. Nutze das Ko-Kreations-Tool, um Feedback oder Ideen zu teilen heute hier. Deine Stimme formt die Zukunft dieses Raums direkt heute. Wir wachsen zusammen durch Ehrlichkeit und Respekt heute hier."
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
        className="w-full flex items-center justify-between p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] hover:bg-white/[0.05] transition-all group mb-6 shadow-lg hover:shadow-white/5"
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
    <div className="fixed inset-0 z-[8000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden touch-none h-[100dvh]">
      {/* Golden Ratio Header (Upper 38.2% part) */}
      <header className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl">
            <Sparkles size={28} className="text-primary animate-pulse" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-white shining-white">
              {lang === 'en' ? "Guidance" : "Begleitung"}
            </h2>
            <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{currentStep + 1} / {STEPS.length}</p>
          </div>
        </div>
        {!forceOpen && (
          <button 
            onClick={() => setIsOpen(false)} 
            className="p-4 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        )}
      </header>

      {/* Main Content Area - Proportional Split */}
      <main className="flex-1 relative z-10 px-6 flex flex-col justify-center items-center overflow-hidden min-h-0 py-6">
        <div className="max-w-2xl w-full flex flex-col items-center gap-8 animate-in slide-in-from-bottom-4 duration-700 h-full">
          
          {/* Identity Section (Part of the 38.2%) */}
          <div className="text-center space-y-6 shrink-0">
            <div className={cn(
              "w-24 h-24 md:w-32 md:h-32 rounded-[2.5rem] flex items-center justify-center border-2 border-white/10 mx-auto shadow-2xl transition-all duration-700", 
              step.bg
            )}>
              <Icon size={48} className={cn("animate-pulse md:w-20 md:h-20", step.color)} />
            </div>
            <div className="space-y-2">
              <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white leading-none shining-white">
                {lang === 'en' ? step.title.en : step.title.de}
              </h3>
              <p className="text-primary text-[11px] md:text-[12px] font-black uppercase tracking-[0.5em]">
                {lang === 'en' ? step.desc.en : step.desc.de}
              </p>
            </div>
          </div>

          {/* Wisdom Content Card (Targeting 61.8% of available space) */}
          <div className="flex-1 w-full bg-white/[0.03] border-2 border-white/10 rounded-[3rem] p-10 md:p-12 relative overflow-hidden shadow-2xl flex flex-col min-h-0 group hover:border-white/20 transition-all">
            <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-1000">
              <Icon size={200} className="text-white" />
            </div>
            
            <ScrollArea className="flex-1 h-full">
              <div className="relative z-10 space-y-8 pr-6">
                <div className="flex items-center gap-4">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_15px_rgba(27,77,62,0.8)]" />
                  <span className="text-[11px] font-black text-white/40 uppercase tracking-[0.4em]">
                    {lang === 'en' ? "Guidance Detail" : "Begleitung Details"}
                  </span>
                </div>
                
                <p className="text-lg md:text-2xl font-bold text-white/90 leading-relaxed uppercase tracking-widest">
                  {lang === 'en' ? step.detail.en : step.detail.de}
                </p>
              </div>
            </ScrollArea>
          </div>

          {/* Footer Grounding Note */}
          <div className="w-full p-5 bg-primary/5 border border-primary/20 rounded-[2rem] shrink-0 text-center shadow-lg">
            <p className="text-[11px] font-bold text-white/40 uppercase tracking-widest italic">
              {lang === 'en' 
                ? "Self-respect is the focus. Calibrate through truth." 
                : "Selbstrespekt ist der Fokus. Calibrierung durch Wahrheit heute."
              }
            </p>
          </div>
        </div>
      </main>

      {/* Navigation Footer - Golden Spacing */}
      <footer className="shrink-0 p-10 bg-black/90 backdrop-blur-xl border-t border-white/10 relative z-10 pb-safe">
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          <div className="flex items-center justify-between">
            {/* Proportional Progress Bar */}
            <div className="flex gap-3">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-2 rounded-full transition-all duration-700", 
                    i === currentStep ? "w-10 bg-primary shadow-[0_0_15px_rgba(27,77,62,0.6)]" : "w-2 bg-white/10"
                  )} 
                />
              ))}
            </div>
            
            {/* Action Group */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                  className="p-6 bg-white/5 rounded-[2rem] border border-white/10 text-white/40 hover:text-white active:scale-95 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
              )}
              {currentStep < STEPS.length - 1 ? (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }} 
                  className="px-12 py-6 bg-primary text-white rounded-[2rem] font-black uppercase text-base tracking-widest flex items-center gap-4 shadow-2xl active:scale-95 transition-all border-2 border-primary/20 shining-white"
                >
                  {lang === 'en' ? 'Next' : 'Weiter'} <ChevronRight className="w-6 h-6" />
                </button>
              ) : (
                <button 
                  onClick={handleDismiss} 
                  className="px-12 py-6 bg-[#1b4d3e] text-white rounded-[2rem] font-black uppercase text-base tracking-widest flex items-center gap-4 shadow-2xl active:scale-95 transition-all border-2 border-primary/20 shining-white"
                >
                  {lang === 'en' ? 'Enter Sanctuary' : 'Eintreten heute'} <CheckCircle2 className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-center text-[11px] font-black text-white uppercase tracking-[0.6em] shining-white opacity-90">
            {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen heute hier"}
          </p>
        </div>
      </footer>
    </div>
  );
}

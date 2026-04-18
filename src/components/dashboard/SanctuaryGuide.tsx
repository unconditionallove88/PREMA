
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
 * Redesigned with detailed, simple instructions for every tool.
 * Optimized for Zero-Scroll presence on all devices.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Mesh Radar", de: "Mesh Radar" },
    desc: { en: "Find my friends", de: "Finde meine Freunde heute" },
    detail: {
      en: "The Radar is your private compass. Tap on the pulsing hearts inside your 'Circle of Love' or open the Radar map to see exactly where your friends are in the venue. The Sovereign Mesh connects your group directly, so you can find each other easily without the app tracking your location centrally. It is all about staying together and keeping each other safe.",
      de: "Der Radar ist dein privater Kompass. Tippe auf die Herzen im 'Circle of Love' oder nutze den Radar um deine Freunde auf dem Gelände zu finden. Das Mesh verbindet eure Gruppe direkt miteinander heute. So findet ihr euch jederzeit leicht wieder ohne dass die App euch zentral überwacht heute. Es geht darum heute zusammen zu bleiben."
    },
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen heute" },
    desc: { en: "My inner circle", de: "Mein innerer Kreis heute" },
    detail: {
      en: "Trusted Bonds are people who love you unconditionally. You can add up to 5 people in your Profile section. These are the ONLY people who can see your Mesh location and the only ones who will receive your emergency alerts if you need support. They are your personal safety circle who will hold space for you when things feel too intense.",
      de: "Vertraute Bindungen sind Menschen die dich lieben. Du kannst bis zu 5 Personen in deinem Profil hinzufügen heute. Nur diese Menschen können deinen Standort auf dem Mesh sehen heute. Nur sie empfangen deine Notfall Alarme wenn du Halt brauchst heute. Sie sind dein persönlicher Kreis der Fürsorge heute hier."
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'lab',
    title: { en: "Sovereign Lab", de: "Souveränitäts Lab heute" },
    desc: { en: "Log my truth", de: "Meine Wahrheit notieren heute" },
    detail: {
      en: "The Sovereign Lab is built on self-honesty. By logging what you have taken, the Pulse Guardian can calculate your safety limits perfectly. It uses your biometrics and health profile to keep your heart and kidneys safe in real-time. Everything you log is private, encrypted, and stays on your device. Self-honesty is your most powerful protection.",
      de: "Das Souveränitäts Lab baut auf Ehrlichkeit auf. Wenn du notierst was du nimmst kann der Pulse Guardian deine Grenzen berechnen heute. Er nutzt deine Daten um dein Herz und deine Nieren heute zu schützen. Alles was du notierst bleibt privat und verschlüsselt heute. Ehrlichkeit zu dir selbst ist dein bester Schutz heute."
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
      en: "There are two circles of care. 'The Holders' is a private room for your inner circle—you and your friend must both have each other as Trusted Bonds to enter. 'The Spectators' is a public community room for everyone in the sanctuary. It is monitored by the Pulse Guardian to ensure that every message is grounded in kindness and collective care.",
      de: "Es gibt zwei Kreise heute. 'Die Holder' ist ein privater Raum für deinen inneren Kreis heute hier. Dafür müsst ihr euch gegenseitig als Bonds hinzugefügt haben heute. 'Die Spectator' ist ein öffentlicher Raum für alle heute hier. Er wird vom Pulse Guardian bewacht damit alle Nachrichten freundlich bleiben heute."
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
      en: "Set your Resonance Code (a secret word) in the Circle of Love settings. If you text this word to your Trusted Bonds, they will instantly know that you need immediate help and space, even if you cannot speak or find the words. It is your sacred signal to mobilize your network and bring your circle to your exact location.",
      de: "Setze dein Resonanz Wort in den Circle of Love Einstellungen heute. Wenn du dieses Wort an deine Bonds sendest wissen sie sofort Bescheid heute. Es ist ein heiliges Signal wenn du keine Worte findest heute. Deine Bonds wissen dann dass du sofort Halt und Hilfe brauchst heute hier."
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
      en: "Follow the pulsing heart on your screen to synchronize your breathing. This simple ritual is designed to release oxytocin, which naturally lowers your heart rate and calms your nervous system. Use it whenever you feel a loss of grounding or if the sensory input becomes too intense. It is your doorway back to a calm and resonant state.",
      de: "Folge dem pulsierenden Herzen um deinen Atem zu synchronisieren heute. Dieses Ritual schüttet Oxytocin aus und beruhigt dein Nervensystem heute. Nutze es wenn es zu intensiv wird heute hier. Es ist dein Weg zurück in deine Mitte heute um dich geliebt und geerdet zu fühlen heute."
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
      en: "StayOnBeat is built for you and with you. Use the Co-Creation portal to share what you love, what you dislike, or ideas for tools you wish were here. Your feedback directly shapes the evolution of this sanctuary. We grow this space together through honesty, respect, and our shared vision of a healthier and more loving nightlife.",
      de: "StayOnBeat wird mit dir gemeinsam erschaffen heute. Nutze das Ko Kreations Tool für dein Feedback oder neue Ideen heute. Deine Stimme formt die Zukunft dieses Sanctuarys heute hier. Wir lassen diesen Raum gemeinsam wachsen heute durch Ehrlichkeit und gegenseitige Liebe heute hier."
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
                <h2 className="text-lg font-black uppercase tracking-tighter text-white">{lang === 'en' ? "Functional Intelligence" : "Funktionale Intelligenz"}</h2>
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
                        {lang === 'en' ? "Guidance & Instructions" : "Anleitung & Anleitung"}
                      </span>
                    </div>
                    
                    <p className="text-lg md:text-xl font-bold text-white/80 leading-relaxed uppercase tracking-widest">
                      {lang === 'en' ? step.detail.en : step.detail.de}
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
                    : "Jedes Tool ist ein Akt des Respekts. Kalibriere dein Bewusstsein durch Wahrheit heute."
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
              <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] shining-white">
                {lang === 'en' ? "Created in harmony" : "In Harmonie erschaffen heute hier"}
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

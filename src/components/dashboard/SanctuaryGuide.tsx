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
  HeartHandshake
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Sanctuary Guide Component (The Handover).
 * Redesigned for "Zero-Scroll" presence.
 * Expanded with Trusted Bonds, Love Chat Details, and Resonance Code info.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Pulse Mesh Radar", de: "Der Puls-Radar heute" },
    desc: { 
      en: "Your location tracker shared only with those you love using the Sovereign Mesh triangulation protocol", 
      de: "Dein Mesh-Ortungssystem heute hier Nur mit deinen Liebsten geteilt Pulse Guardian überwacht deine Nähe" 
    },
    howItWorks: {
      en: "View friends and awareness hubs on a tactical grid Toggle privacy to go invisible or broadcast distress via Mesh",
      de: "Tippe um Freunde zu sehen Innerhalb des Sovereign Mesh Grids Schalte Privatsphäre nach Bedarf um"
    },
    connection: {
      en: "Pulse Guardian: Analyzes Mesh triangulation to direct awareness staff to your precise tactical grid location",
      de: "Pulse Guardian: Analysiert Standort-Warnungen Und aktiviert die Mesh-Triangulation heute"
    },
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen" },
    desc: { 
      en: "Your inner circle of unconditional love Add people you trust to hold space for your journey", 
      de: "Dein innerer Kreis bedingungsloser Liebe Füge Menschen hinzu denen du vertraust um dich zu begleiten" 
    },
    howItWorks: {
      en: "Invite friends via email to create a Sacred Bond Once confirmed they appear on your Circle of Love ring",
      de: "Lade Freunde per E-Mail ein um ein Band zu knüpfen Sobald bestätigt erscheinen sie in deinem Circle Ring"
    },
    connection: {
      en: "Pulse Guardian: Automatically shares physiological alerts with your Bonds if your resonance reaches critical levels",
      de: "Pulse Guardian: Teilt Warnungen automatisch mit deinen Bindungen falls deine Werte kritisch werden heute"
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'lab',
    title: { en: "Sovereign Lab", de: "Souveränitäts-Lab" },
    desc: { 
      en: "Log your session intake with absolute honesty Pulse Guardian calibrates your safety thresholds in real-time", 
      de: "Notiere deine Aufnahme mit absoluter Ehrlichkeit Pulse Guardian kalibriert deine Limits in Echtzeit heute" 
    },
    howItWorks: {
      en: "Select substances and enter amounts The lab assesses risk interactions against your pharmacological profile",
      de: "Wähle Substanzen und Mengen aus Das Labor bewertet Risiken basierend auf deinem Profil heute hier"
    },
    connection: {
      en: "Pulse Guardian: Automatically recalculates biological limits for every entry logged in the lab",
      de: "Pulse Guardian: Berechnet biologische Grenzwerte Bei jedem Eintrag automatisch neu heute hier"
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'lovechat',
    title: { en: "Love Chat Portals", de: "Wort der Liebe" },
    desc: { 
      en: "Two distinct pathways for connection: The Holders (Private) and The Spectators (Public/Moderated)", 
      de: "Zwei Wege der Verbindung heute hier: Die Holders (Privat) und Die Spectators (Öffentlich/Moderiert)" 
    },
    howItWorks: {
      en: "The Holders requires mutual Sacred Bonds The Spectators is open to all souls but guarded by AI moderation",
      de: "Holders benötigt gegenseitige Bindungen Spectators ist für alle offen aber KI-moderiert heute"
    },
    connection: {
      en: "Pulse Guardian: Monitors communication for safety and provides a fast-track SOS button to awareness staff",
      de: "Pulse Guardian: Überwacht Kommunikation für Sicherheit Und bietet schnellen SOS-Zugang heute hier"
    },
    icon: Users2,
    color: "text-[#10B981]",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'rescode',
    title: { en: "Resonance Code", de: "Resonanz-Wort heute" },
    desc: { 
      en: "A sacred dispatch word known only to you and your bonds to request immediate emotional holding", 
      de: "Ein heiliges Wort das nur du und deine Bindungen kennen um sofortigen emotionalen Halt zu rufen" 
    },
    howItWorks: {
      en: "Set your code in the Circle of Love settings Texting this word instantly alerts your bonds you need care",
      de: "Setze dein Wort im Circle of Love Menü Das Senden dieses Wortes alarmiert deine Bindungen sofort"
    },
    connection: {
      en: "Pulse Guardian: Triggers the high-fidelity broadcast to your circle the moment the code is activated",
      de: "Pulse Guardian: Aktiviert die Mesh-Übertragung Zu deinem Kreis sobald das Wort erkannt wird heute"
    },
    icon: Lock,
    color: "text-amber-400",
    bg: "bg-amber-500/10"
  },
  {
    id: 'breath',
    title: { en: "Heart Breath", de: "Herz Atem heute" },
    desc: { 
      en: "An oxytocin-stimulating ritual designed to recalibrate your nervous system and stimulate connection", 
      de: "Ein Ritual zur Oxytocin-Stimulation Um dein Nervensystem sanft zu kalibrieren heute hier" 
    },
    howItWorks: {
      en: "Follow the rhythmic light to synchronize your breathing and return to a steady physiological state",
      de: "Folge dem rhythmischen Licht Um deinen Atem zu synchronisieren Und in einen stabilen Zustand zu finden"
    },
    connection: {
      en: "Pulse Guardian: Recommends the Heart Breath automatically if elevated heart rate or stress is detected",
      de: "Pulse Guardian: Empfiehlt den Herz Atem automatisch Falls ein erhöhter Puls erkannt wird heute hier"
    },
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/5"
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

  useEffect(() => {
    if (forceOpen) setIsOpen(true);
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

  return (
    <div className={cn("w-full transition-all duration-1000", !isOpen && "mb-6")}>
      {!isOpen ? (
        <button 
          onClick={() => { playHeartbeat(); setIsOpen(true); }}
          className="w-full flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/[0.05] transition-all group opacity-60 hover:opacity-100"
        >
          <div className="flex items-center gap-3">
            <Sparkles className="text-white/20" size={16} />
            <div className="text-left">
              <span className="block text-[9px] font-black uppercase text-white/40 tracking-[0.2em]">
                {lang === 'en' ? "Sanctuary Guide" : "Sanctuary Begleiter"}
              </span>
            </div>
          </div>
          <ChevronRight size={14} className="text-white/10 group-hover:text-primary transition-colors" />
        </button>
      ) : (
        <div className="fixed inset-0 z-[5000] bg-black flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
          
          <header className="px-6 sm:px-8 pt-6 sm:pt-10 pb-4 flex items-center justify-between shrink-0 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Sparkles size={20} className="text-primary animate-pulse" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black uppercase tracking-tighter text-white">
                  {lang === 'en' ? "Handover" : "Handover heute"}
                </h2>
                <p className="text-[8px] sm:text-[9px] font-black text-primary uppercase tracking-[0.3em]">
                  {lang === 'en' ? `Tool ${currentStep + 1} of ${STEPS.length}` : `Tool ${currentStep + 1} von ${STEPS.length}`}
                </p>
              </div>
            </div>
            {!forceOpen && (
              <button onClick={() => setIsOpen(false)} className="p-2 sm:p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white transition-all">
                <X size={18} />
              </button>
            )}
          </header>

          <main className="flex-1 relative z-10 px-6 sm:px-8 flex flex-col justify-center items-center overflow-hidden">
            <div className="max-w-xl w-full flex flex-col items-center gap-4 sm:gap-8 animate-in slide-in-from-bottom-4 duration-700 py-4">
              
              <div className={cn(
                "w-20 h-20 sm:w-24 sm:h-24 rounded-[2rem] flex items-center justify-center border-2 border-white/10 shadow-2xl transition-all duration-700", 
                step.bg
              )}>
                <Icon size={40} className={cn("sm:w-12 sm:h-12", step.color)} />
              </div>

              <div className="text-center space-y-1 sm:space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
                  {lang === 'en' ? step.title.en : step.title.de}
                </h3>
                <p className="text-[11px] sm:text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest max-w-[280px] sm:max-w-[320px] mx-auto">
                  {lang === 'en' ? step.desc.en : step.desc.de}
                </p>
              </div>

              <div className="w-full space-y-3 sm:space-y-4 max-w-sm">
                <div className="text-center space-y-1 sm:space-y-2">
                  <span className="text-[8px] sm:text-[9px] font-black uppercase text-blue-400 tracking-[0.3em]">
                    How it functions
                  </span>
                  <p className="text-[10px] sm:text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest px-2">
                    {lang === 'en' ? step.howItWorks.en : step.howItWorks.de}
                  </p>
                </div>

                <div className="p-5 sm:p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Shield size={14} className="text-primary" />
                    <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-[0.3em] text-primary">
                      Guardian Intelligence
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs font-bold text-white/80 leading-relaxed uppercase tracking-widest italic text-center">
                    {lang === 'en' ? step.connection.en : step.connection.de}
                  </p>
                </div>
              </div>

            </div>
          </main>

          <footer className="shrink-0 p-6 sm:p-8 bg-black/90 backdrop-blur-xl border-t border-white/5 relative z-10 pb-safe">
            <div className="max-w-xl mx-auto flex flex-col gap-4 sm:gap-6">
              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {STEPS.map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "h-1 rounded-full transition-all duration-500", 
                        i === currentStep ? "w-6 sm:w-8 bg-primary" : "w-1 bg-white/10"
                      )} 
                    />
                  ))}
                </div>
                
                <div className="flex gap-3">
                  {currentStep > 0 && (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }}
                      className="p-3 sm:p-4 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10 text-white/40 active:scale-95 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                  )}
                  
                  {currentStep < STEPS.length - 1 ? (
                    <button 
                      onClick={() => { playHeartbeat(); setCurrentStep(prev => prev + 1); }}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-primary text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-3 shadow-lg shadow-primary/20 active:scale-95 transition-all"
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  ) : (
                    <button 
                      onClick={handleDismiss}
                      className="px-6 sm:px-8 py-4 sm:py-5 bg-[#1b4d3e] text-white rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest flex items-center gap-3 shadow-lg active:scale-95 transition-all"
                    >
                      Enter <CheckCircle2 size={16} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-center text-[7px] sm:text-[8px] font-black uppercase tracking-[0.5em] shining-white">
                End-to-End Encrypted Handover
              </p>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

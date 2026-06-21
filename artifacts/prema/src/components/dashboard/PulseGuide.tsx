
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
  Users2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/intention';

/**
 * @fileOverview Guidance (Structured Intelligence).
 * Format: Description, How it functions, Guardian Intelligence.
 * Expanded: Added Collective Care (Universal Family) intelligence.
 * Optimized: Organically fits all information to browsers and mobile screens.
 */

const STEPS = [
  {
    id: 'radar',
    title: { en: "Pulse Mesh Radar", de: "Pulse Mesh Radar" },
    desc: { en: "Find friends now", de: "Freunde jetzt finden" },
    content: {
      en: {
        description: "Your location tracker shared only with those you love using the Sovereign Mesh triangulation protocol",
        functions: "View friends and awareness hubs on a tactical grid Toggle privacy to go invisible or broadcast distress via Mesh",
        intelligence: "Pulse Guardian: Analyzes Mesh triangulation to direct awareness staff to your precise tactical grid location"
      },
      de: {
        description: "Standort-Tracker nur mit vertrauten Menschen geteilt  via Mesh Protokoll",
        functions: "Sehe Freunde und Hubs auf dem Grid Schalte Sichtbarkeit um oder sende Notrufe via Mesh",
        intelligence: "Pulse Guardian: Analysiert die Triangulation um Hilfe präzise zu deinem Standort zu leiten"
      }
    },
    icon: Radio,
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen" },
    desc: { en: "The inner circle", de: "Der innere Kreis" },
    content: {
      en: {
        description: "The inner circle of trusted bonds who hold space for existence unconditionally and without judgment",
        functions: "Add up to 5 people in the Profile These are the only chosen bonds who see location or receive alerts",
        intelligence: "Pulse Guardian: Verifies bond encryption to ensure data sovereignty remains absolute within the chosen circle"
      },
      de: {
        description: "Der innere Kreis der Seelen die dich bedingungslos lieben  ohne jedes Urteil",
        functions: "Füge bis zu 5 Bindungen im Profil hinzu Nur diese sehen den Standort",
        intelligence: "Pulse Guardian: Verifiziert die Verschlüsselung damit die Datensouveränität absolut gewahrt bleibt"
      }
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'family',
    title: { en: "Collective Care", de: "Kollektive Betreuung" },
    desc: { en: "The Universal Family", de: "Die universelle Familie" },
    content: {
      en: {
        description: "A shared protocol that alerts nearby hearts when a heart is in critical danger embodying the principle of brotherly love",
        functions: "Trigger 'Family Presence' to broadcast your location to every nearby user A pulsing invitation to help appears on their radar",
        intelligence: "Pulse Guardian: Decides when a private distress call should evolve into a collective call for love based on stress levels"
      },
      de: {
        description: "Ein Protokoll das Seelen in der Nähe alarmiert wenn Gefahr droht Ein Ausdruck der Nächstenliebe",
        functions: "Aktiviere die 'Familien Präsenz' um deinen Standort zu senden Ein Ruf nach Hilfe erscheint auf deren Radar",
        intelligence: "Pulse Guardian: Entscheidet wann ein privater Notruf zu einem kollektiven Ruf nach Liebe werden sollte"
      }
    },
    icon: Users2,
    color: "text-accent",
    bg: "bg-accent/10"
  },
  {
    id: 'lab',
    title: { en: "Lab", de: "Lab" },
    desc: { en: "Log the truth", de: "Die Wahrheit notieren" },
    content: {
      en: {
        description: "A space for absolute honesty regarding session intake and biological limits in this space",
        functions: "Log substances as they are consumed The lab tracks volume and frequency to provide high-fidelity analysis",
        intelligence: "Pulse Guardian: Calculates specific safety thresholds by cross-referencing the medical profile with active substance logs"
      },
      de: {
        description: "Ein Raum für absolute Ehrlichkeit bezüglich der Aufnahme und biologischer Grenzen",
        functions: "Notiere Substanzen bei der Aufnahme Das Lab trackt Volumen und Frequenz für präzise Analysen",
        intelligence: "Pulse Guardian: Berechnet spezifische Sicherheits-Limits durch Abgleich des Profils mit den aktiven Protokollen"
      }
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'lovechat',
    title: { en: "Love Chat", de: "Das Wort" },
    desc: { en: "Words of love", de: "Worte der Liebe" },
    content: {
      en: {
        description: "Dedicated rooms for private connection and collective care within the circle of humanity",
        functions: "Use 'The Holders' for the inner circle or 'The Spectators' for public community support and care",
        intelligence: "Pulse Guardian: Monitors public chat for dissonance to maintain the frequency of unconditional love"
      },
      de: {
        description: "Eigene Räume für private Verbindung und kollektive Fürsorge im Kreis der Menschheit",
        functions: "Nutze 'Die Holder' für den inneren Kreis oder 'Die Spectator' für gemeinschaftliche Unterstützung",
        intelligence: "Pulse Guardian: Überwacht den öffentlichen Chat auf Dissonanz um die Frequenz der Liebe zu wahren"
      }
    },
    icon: MessageCircleHeart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  
  {
    id: 'breath',
    title: { en: "Heart Breath", de: "Herz Atem" },
    desc: { en: "Oxytocin love sync", de: "Oxytocin Liebe Sync" },
    content: {
      en: {
        description: "A biological ritual designed to synchronize the heart and release oxytocin for nervous system recovery",
        functions: "Follow the pulsing light to inhale and exhale love This practice naturally slows the heart rate",
        intelligence: "Pulse Guardian: Monitors biometric recovery during the ritual to ensure the rhythm returns to a steady baseline"
      },
      de: {
        description: "Ein biologisches Ritual zur Synchronisation des Herzens und Freisetzung von Oxytocin zur Erholung",
        functions: "Folge dem pulsierenden Licht um Liebe ein- und auszuatmen Dies beruhigt das Nervensystem ganz natürlich",
        intelligence: "Pulse Guardian: Überwacht die biometrische Erholung während des Rituals für eine stabile Puls-Basis"
      }
    },
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/5"
  },
  {
    id: 'cocreation',
    title: { en: "Co-Creation", de: "Ko Kreation" },
    desc: { en: "Shape the space", de: "Den Raum gestalten" },
    content: {
      en: {
        description: "The portal through which the human voice directly shapes this space",
        functions: "Share feedback, ideas, or feelings about the tools The input is received with unconditional love",
      },
      de: {
        description: "Das Portal durch welches die menschliche Stimme die Evolution dieses Raums direkt mitgestaltet ",
        functions: "Teile Feedback, Ideen oder Gefühle zu den Tools Die Eingabe wird mit Liebe empfangen",
        intelligence: "Pulse Guardian: Sammelt die kollektive Resonanz um Funktionen zur Förderung des Gemeinwohls zu priorisieren "
      }
    },
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/10"
  }
];

export function PulseGuide({ lang = 'en', forceOpen = false, onDismiss }: { lang?: 'en' | 'de', forceOpen?: boolean, onDismiss?: () => void }) {
  const [isOpen, setIsOpen] = useState(forceOpen);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStep(0);
    }
  }, [forceOpen]);

  const handleDismiss = () => {
    localStorage.setItem('prema_guide_dismissed', 'true');
    setIsOpen(false);
    if (onDismiss) onDismiss();
  };

  const step = STEPS[currentStep] || STEPS[0];
  const Icon = step.icon;
  const currentLang = lang === 'en' ? 'en' : 'de';
  const labels = lang === 'en' ? { desc: "Description", func: "How it functions", intel: "Guardian Intelligence" } : { desc: "Beschreibung", func: "Wie es funktioniert", intel: "Guardian Intelligenz" };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-6 bg-card/[0.03] border border-border/10 rounded-[2rem] hover:bg-card/[0.05] transition-all group mb-6 shadow-lg"
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
    <div className="fixed inset-0 z-[8000] bg-card flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden h-[100dvh]">
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
            className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        )}
      </header>

      {/* Main Content Area - Responsive Organic Fit */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 min-h-0">
        <div className="w-full max-w-lg bg-card/[0.03] border-2 border-border/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-700 hover:border-border/20 transition-all max-h-[75vh]">
          <div className="p-8 pb-4 flex flex-col items-center text-center space-y-4 shrink-0">
            {/* Tool Identity */}
            <div className={cn(
  "w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-border/10 shadow-2xl transition-all duration-700 animate-pulse-bio", 
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
          </div>

          {/* Detailed Structured Intelligence - Scrollable */}
          <ScrollArea className="flex-1 px-8 pb-8">
            <div className="w-full space-y-6 pt-4 border-t border-border/5">
              {/* Description Block */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-card/20" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{labels.desc}</span>
                </div>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">{step.content[currentLang].description}</p>
              </div>

              {/* Functions Block */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-card/20" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{labels.func}</span>
                </div>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">{step.content[currentLang].functions}</p>
              </div>

              {/* Intelligence Block */}
              <div className="space-y-2 p-5 bg-primary/10 rounded-[1.5rem] border border-primary/20">
                <div className="flex items-center gap-2">
                  <Sparkles size={10} className="text-primary" />
                  <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{labels.intel}</span>
                </div>
                <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-widest italic">"{step.content[currentLang].intelligence}"</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </main>

      {/* Navigation Controls - Pinned to Bottom */}
      <footer className="shrink-0 pb-12 pt-4 px-8 relative z-10 bg-card/60 backdrop-blur-md border-t border-border/5">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            {/* Progress Dots */}
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <div 
                  key={i} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700", 
                    i === currentStep ? "w-8 bg-primary shadow-[0_0_10px_rgba(27,77,62,0.6)]" : "w-1.5 bg-card/10"
                  )} 
                />
              ))}
            </div>
            
            <div className="flex gap-3">
              {currentStep > 0 && (
                <button 
                  onClick={() => { playHeartbeat(); setCurrentStep(prev => prev - 1); }} 
                  className="p-4 bg-card/5 rounded-2xl border border-border/10 text-white/40 hover:text-white active:scale-95 transition-all shadow-xl"
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
                  className="px-10 py-5 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-3 shadow-2xl active:scale-95 transition-all border-2 border-primary/20 shining-white"
                >
                  {lang === 'en' ? 'Enter' : 'Eintreten '} <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
          
          <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] shining-white">
            Created in harmony
          </p>
        </div>
      </footer>
    </div>
  );
}

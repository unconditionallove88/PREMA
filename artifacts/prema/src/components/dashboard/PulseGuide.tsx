
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
  Brain,
  Bell,
  PenLine,
  Eye,
  Activity,
  Heart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/intention';
import { RadiatingThirdEye } from '@/components/ui/radiating-third-eye';
import { SupporterIcon } from '@/components/ui/supporter-icon';

const STEPS = [
  /* ── DASHBOARD TOOLS ─────────────────────────────── */
  {
    id: 'you-see',
    title: { en: "You See", de: "You See" },
    desc: { en: "Mesh radar — find friends", de: "Mesh Radar — Freunde finden" },
    content: {
      en: {
        description: "Your location tracker shared only with those you love using the Sovereign Mesh triangulation protocol",
        functions: "View friends and care hubs on a tactical grid. Toggle privacy to go invisible or broadcast a distress signal via Mesh",
        intelligence: "Your Rhythm: Analyzes Mesh triangulation to direct care staff to your precise location on the grid"
      },
      de: {
        description: "Standort-Tracker nur mit vertrauten Menschen geteilt via Mesh Protokoll",
        functions: "Sehe Freunde und Hubs auf dem Grid. Schalte Sichtbarkeit um oder sende Notrufe via Mesh",
        intelligence: "Your Rhythm: Analysiert die Triangulation um Hilfe präzise zu deinem Standort zu leiten"
      }
    },
    iconType: 'eye',
    color: "text-blue-400",
    bg: "bg-blue-500/10"
  },
  {
    id: 'you-speak',
    title: { en: "You Speak", de: "You Speak" },
    desc: { en: "Love Chat — words of care", de: "Love Chat — Worte der Fürsorge" },
    content: {
      en: {
        description: "Dedicated rooms for private connection and collective care within the circle of humanity",
        functions: "Use 'Private' for your inner circle or 'Open' for community support and collective care",
        intelligence: "Your Rhythm: Monitors chats for distress signals to maintain the frequency of unconditional love"
      },
      de: {
        description: "Eigene Räume für private Verbindung und kollektive Fürsorge im Kreis der Menschheit",
        functions: "Nutze 'Privat' für den inneren Kreis oder 'Offen' für gemeinschaftliche Unterstützung",
        intelligence: "Your Rhythm: Überwacht Chats auf Notrufe um die Frequenz der Liebe zu wahren"
      }
    },
    icon: MessageCircleHeart,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'you-take',
    title: { en: "You Take", de: "You Take" },
    desc: { en: "Sovereign Lab — log the truth", de: "Sovereign Lab — die Wahrheit notieren" },
    content: {
      en: {
        description: "A space for absolute honesty regarding session intake and biological limits",
        functions: "Log substances as they are consumed. The lab tracks volume and frequency for high-fidelity safety analysis",
        intelligence: "Your Rhythm: Calculates safety thresholds by cross-referencing your medical profile with active substance logs"
      },
      de: {
        description: "Ein Raum für absolute Ehrlichkeit bezüglich der Aufnahme und biologischer Grenzen",
        functions: "Notiere Substanzen bei der Aufnahme. Das Lab trackt Volumen und Frequenz für präzise Analysen",
        intelligence: "Your Rhythm: Berechnet spezifische Limits durch Abgleich des Profils mit den aktiven Protokollen"
      }
    },
    icon: Microscope,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'you-create',
    title: { en: "You Create", de: "You Create" },
    desc: { en: "Co-Creation — shape the space", de: "Ko-Kreation — den Raum gestalten" },
    content: {
      en: {
        description: "The portal through which the human voice directly shapes this space",
        functions: "Share feedback, ideas, or feelings about the tools. Your input is received with unconditional love and helps this space grow",
        intelligence: "Your Rhythm: Collects collective resonance to prioritise features that serve the greater good"
      },
      de: {
        description: "Das Portal durch welches die menschliche Stimme die Evolution dieses Raums direkt mitgestaltet",
        functions: "Teile Feedback, Ideen oder Gefühle zu den Tools. Die Eingabe wird mit Liebe empfangen",
        intelligence: "Your Rhythm: Sammelt die kollektive Resonanz um Funktionen zur Förderung des Gemeinwohls zu priorisieren"
      }
    },
    icon: Sprout,
    color: "text-primary",
    bg: "bg-primary/10"
  },
  {
    id: 'supporter',
    title: { en: "Supporter", de: "Supporter" },
    desc: { en: "AI care companion", de: "KI Begleitung" },
    content: {
      en: {
        description: "Your personal AI care companion — always present, never judgmental, calibrated to the context of your session",
        functions: "Ask anything — harm reduction guidance, grounding support, substance interactions, or simply someone to talk to",
        intelligence: "Your Rhythm: Tailors Supporter responses based on your active session context, substance logs, and heart data"
      },
      de: {
        description: "Deine persönliche KI Begleitung — immer präsent, niemals urteilend, kalibriert auf den Kontext deiner Session",
        functions: "Frag alles — Harm Reduction Wissen, Erdungs-Unterstützung, Substanz-Wechselwirkungen oder einfach jemanden zum Reden",
        intelligence: "Your Rhythm: Passt Supporter-Antworten basierend auf deinem aktiven Session-Kontext und Herzfrequenz an"
      }
    },
    iconType: 'supporter',
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  {
    id: 'pi',
    title: { en: "PI — Prema Intelligence", de: "PI — Prema Intelligenz" },
    desc: { en: "Central intelligence engine", de: "Zentrale Intelligenz Engine" },
    content: {
      en: {
        description: "PI is the central intelligence of Prema — continuously aggregating data from all tools to keep your journey resonant and aligned",
        functions: "Learn how every tool works together. PI explains Pulse Sync, profile calibration, safety thresholds, and care protocols",
        intelligence: "Your Rhythm: PI IS Your Rhythm — the integrated system that holds the full picture of your session at all times"
      },
      de: {
        description: "PI ist die zentrale Intelligenz von Prema — sammelt kontinuierlich Daten aus allen Tools für deine Sicherheit",
        functions: "Lerne wie alle Tools zusammenwirken. PI erklärt Pulse Sync, Profil-Kalibrierung, Sicherheitslimits und Pflegeprotokolle",
        intelligence: "Your Rhythm: PI IST Your Rhythm — das integrierte System das stets das vollständige Bild deiner Session hält"
      }
    },
    icon: Brain,
    color: "text-violet-400",
    bg: "bg-violet-500/10"
  },
  {
    id: 'you-pulse',
    title: { en: "You Pulse", de: "You Pulse" },
    desc: { en: "Smart care protocols", de: "Smarte Pflege-Protokolle" },
    content: {
      en: {
        description: "Proactive care reminders calibrated to your session — hydration, rest, and breathing intervals delivered at the right moment",
        functions: "Enable Smart Alerts to receive timely hydration and rest notifications. Countdowns show your next break and water reminder",
        intelligence: "Your Rhythm: Adjusts reminder frequency based on your heart rate and active substance logs to avoid overload"
      },
      de: {
        description: "Proaktive Pflege-Erinnerungen kalibriert auf deine Session — Hydration, Ruhe und Atempausen zum richtigen Moment",
        functions: "Aktiviere Smart Alerts für rechtzeitige Erinnerungen. Countdowns zeigen deine nächste Pause und Wasser-Erinnerung",
        intelligence: "Your Rhythm: Passt die Frequenz basierend auf Herzfrequenz und aktiven Substanzlogs an um Überlastung zu vermeiden"
      }
    },
    icon: Bell,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
  /* ── THE HEART — INSIDE ───────────────────────────── */
  {
    id: 'love-letters',
    title: { en: "Love Letters", de: "Liebesbriefe" },
    desc: { en: "Future Self — inside the heart", de: "Zukünftiges Ich — im Herz" },
    content: {
      en: {
        description: "A private space inside The Heart to write messages to your future self — witnessed by the session, sealed with care",
        functions: "Open the Heart (You Speak) and tap Love Letters in the right panel. Write, reflect, and send a message forward in time",
        intelligence: "Your Rhythm: Timestamps each letter to the session and resurfaces them during recovery as integration anchors"
      },
      de: {
        description: "Ein privater Raum im Herz um Nachrichten an dein zukünftiges Ich zu schreiben — bezeugt von der Session",
        functions: "Öffne das Herz (You Speak) und tippe Love Letters im rechten Panel. Schreibe und sende eine Nachricht in die Zukunft",
        intelligence: "Your Rhythm: Stempelt jeden Brief auf die Session und zeigt ihn während der Erholung als Integrationsanker"
      }
    },
    icon: PenLine,
    color: "text-violet-400",
    bg: "bg-violet-500/10"
  },
  {
    id: 'breath-of-love',
    title: { en: "Breath of Love", de: "Atem der Liebe" },
    desc: { en: "Ritual — inside the heart", de: "Ritual — im Herz" },
    content: {
      en: {
        description: "A biological breathing ritual designed to synchronize the heart and release oxytocin for nervous system recovery",
        functions: "Open the Heart (You Speak) and tap Breath of Love. Follow the pulsing light to inhale and exhale — naturally slows the heart",
        intelligence: "Your Rhythm: Monitors biometric recovery during the ritual to ensure rhythm returns to a steady baseline"
      },
      de: {
        description: "Ein biologisches Atemritual zur Synchronisation des Herzens und Freisetzung von Oxytocin",
        functions: "Öffne das Herz (You Speak) und tippe Atem der Liebe. Folge dem Licht — beruhigt das Nervensystem natürlich",
        intelligence: "Your Rhythm: Überwacht die biometrische Erholung während des Rituals für eine stabile Pulsbasis"
      }
    },
    icon: Wind,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'vision-of-love',
    title: { en: "Vision of Love", de: "Vision der Liebe" },
    desc: { en: "Grounding — inside the heart", de: "Erdung — im Herz" },
    content: {
      en: {
        description: "A sensory grounding tool that anchors awareness in the present moment through guided visual focus",
        functions: "Open the Heart (You Speak) and tap Vision of Love. Follow the prompts to anchor five senses in this moment",
        intelligence: "Your Rhythm: Activates vision protocol when heart rate spikes to guide a rapid return to grounded presence"
      },
      de: {
        description: "Ein sensorisches Erdungs-Tool das Bewusstsein durch geführte visuelle Fokussierung im Moment verankert",
        functions: "Öffne das Herz (You Speak) und tippe Vision der Liebe. Folge den Impulsen um fünf Sinne zu verankern",
        intelligence: "Your Rhythm: Aktiviert das Vision-Protokoll bei Herzfrequenz-Spitzen für eine schnelle Rückkehr zur Präsenz"
      }
    },
    icon: Eye,
    color: "text-sky-400",
    bg: "bg-sky-500/10"
  },
  {
    id: 'bio-pulse',
    title: { en: "Bio Pulse", de: "Biologischer Puls" },
    desc: { en: "Live rhythm — inside the heart", de: "Live Rhythmus — im Herz" },
    content: {
      en: {
        description: "Live BPM display synced to your wearable — shows the biological heartbeat overlaid on the Circle of Love",
        functions: "Open the Heart (You Speak) and tap Bio Pulse in the right panel. Your BPM pulses over the central heart for 5 seconds",
        intelligence: "Your Rhythm: Cross-references live BPM against session baselines to detect early signs of physiological stress"
      },
      de: {
        description: "Live BPM-Anzeige synchronisiert mit deinem Wearable — zeigt den biologischen Herzschlag im Liebeskreis",
        functions: "Öffne das Herz (You Speak) und tippe Bio Pulse im rechten Panel. Dein Puls erscheint 5 Sekunden auf dem Herz",
        intelligence: "Your Rhythm: Gleicht Live-BPM mit Session-Basisdaten ab um frühzeitige physiologische Stress-Zeichen zu erkennen"
      }
    },
    icon: Activity,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10"
  },
  /* ── CARE NETWORK ─────────────────────────────────── */
  {
    id: 'bonds',
    title: { en: "Trusted Bonds", de: "Vertraute Bindungen" },
    desc: { en: "The inner circle", de: "Der innere Kreis" },
    content: {
      en: {
        description: "The inner circle of trusted bonds who hold space unconditionally and without judgment",
        functions: "Add up to 5 people in Profile. These are the only bonds who see your location or receive care alerts",
        intelligence: "Your Rhythm: Verifies bond encryption to ensure data sovereignty remains absolute within the chosen circle"
      },
      de: {
        description: "Der innere Kreis der Seelen die dich bedingungslos lieben ohne jedes Urteil",
        functions: "Füge bis zu 5 Bindungen im Profil hinzu. Nur diese sehen deinen Standort",
        intelligence: "Your Rhythm: Verifiziert die Verschlüsselung damit die Datensouveränität absolut gewahrt bleibt"
      }
    },
    icon: HeartHandshake,
    color: "text-rose-400",
    bg: "bg-rose-500/10"
  },
  {
    id: 'collective-care',
    title: { en: "Collective Care", de: "Kollektive Betreuung" },
    desc: { en: "The Universal Family", de: "Die universelle Familie" },
    content: {
      en: {
        description: "A shared protocol that alerts nearby hearts when someone is in critical danger — embodying the principle of brotherly love",
        functions: "Trigger 'Family Presence' to broadcast your location to every nearby user. A pulsing invitation to help appears on their map",
        intelligence: "Your Rhythm: Decides when a private distress call should evolve into a collective call for love based on stress levels"
      },
      de: {
        description: "Ein Protokoll das Seelen in der Nähe alarmiert wenn Gefahr droht — Ausdruck der Nächstenliebe",
        functions: "Aktiviere 'Familien Präsenz' um deinen Standort zu senden. Ein Ruf nach Hilfe erscheint auf deren Radar",
        intelligence: "Your Rhythm: Entscheidet wann ein privater Notruf zu einem kollektiven Ruf nach Liebe werden sollte"
      }
    },
    icon: Users2,
    color: "text-secondary",
    bg: "bg-secondary/10"
  },
];

function StepIcon({ step }: { step: typeof STEPS[0] }) {
  const cls = cn("animate-pulse", step.color);
  if (step.iconType === 'eye') return <RadiatingThirdEye size={40} color="currentColor" className={cls} />;
  if (step.iconType === 'supporter') return <SupporterIcon size={40} className={cls} />;
  const Icon = (step as any).icon;
  return <Icon size={40} className={cls} />;
}

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
  const currentLang = lang === 'en' ? 'en' : 'de';
  const labels = lang === 'en'
    ? { desc: "Description", func: "How it functions", intel: "Your Rhythm Intelligence" }
    : { desc: "Beschreibung", func: "Wie es funktioniert", intel: "Your Rhythm Intelligenz" };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full flex items-center justify-between p-6 bg-card/[0.03] border border-border/10 rounded-[2rem] hover:bg-card/[0.05] transition-all group mb-6 shadow-lg"
      >
        <div className="flex items-center gap-4">
          <Sparkles className="text-primary animate-pulse" size={18} />
          <span className="block text-[11px] font-black uppercase text-white tracking-[0.3em] shining-white">
            {lang === 'en' ? "PI — Tool Guide" : "PI — Tool Begleitung"}
          </span>
        </div>
        <ChevronRight size={16} className="text-white/20 group-hover:text-primary transition-all" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[8000] bg-card flex flex-col animate-in fade-in duration-500 font-headline pt-safe pb-safe overflow-hidden h-[100dvh]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(27,77,62,0.15)_0%,_transparent_70%)] pointer-events-none" />

      <header className="px-8 pt-8 pb-4 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shadow-xl">
            <Brain size={20} className="text-violet-400" />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tighter text-white shining-white">
              {lang === 'en' ? "PI — Prema Intelligence" : "PI — Prema Intelligenz"}
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

      <main className="flex-1 flex flex-col items-center justify-center px-6 relative z-10 min-h-0">
        <div className="w-full max-w-lg bg-card/[0.03] border-2 border-border/10 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-700 hover:border-border/20 transition-all max-h-[75vh]">
          <div className="p-8 pb-4 flex flex-col items-center text-center space-y-4 shrink-0">
            <div className={cn(
              "w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-border/10 shadow-2xl transition-all duration-700",
              step.bg
            )}>
              <StepIcon step={step} />
            </div>

            <div className="space-y-1">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-white leading-none shining-white">
                {currentLang === 'en' ? step.title.en : step.title.de}
              </h3>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.5em]">
                {currentLang === 'en' ? step.desc.en : step.desc.de}
              </p>
            </div>
          </div>

          <ScrollArea className="flex-1 px-8 pb-8">
            <div className="w-full space-y-6 pt-4 border-t border-border/5">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-card/20" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{labels.desc}</span>
                </div>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">{step.content[currentLang].description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-card/20" />
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{labels.func}</span>
                </div>
                <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">{step.content[currentLang].functions}</p>
              </div>

              {step.content[currentLang].intelligence && (
                <div className="space-y-2 p-5 bg-primary/10 rounded-[1.5rem] border border-primary/20">
                  <div className="flex items-center gap-2">
                    <Sparkles size={10} className="text-primary" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{labels.intel}</span>
                  </div>
                  <p className="text-xs font-bold text-white/90 leading-relaxed uppercase tracking-widest italic">"{step.content[currentLang].intelligence}"</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>

      <footer className="shrink-0 pb-12 pt-4 px-8 relative z-10 bg-card/60 backdrop-blur-md border-t border-border/5">
        <div className="max-w-lg mx-auto flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-700",
                    i === currentStep ? "w-8 bg-primary shadow-[0_0_10px_rgba(27,77,62,0.6)]" : "w-1.5 bg-card/10 hover:bg-card/30"
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
                  {lang === 'en' ? 'Enter' : 'Eintreten'} <CheckCircle2 className="w-5 h-5" />
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

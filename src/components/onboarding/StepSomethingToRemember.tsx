
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Info, ShieldAlert, HeartPulse, Brain, Droplets, FlaskConical, X, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';

/**
 * @fileOverview "Something to Remember" (Mixing Wisdom Step).
 * Features: Interactive medical intelligence about substance interactions.
 * Updated: Added 3-MMC, 4-MMC, Monkey Dust, and DMT.
 */

const MIXING_WISDOM = [
  { 
    id: 'alc-ghb', s1: 'Alcohol', s2: 'GHB/GBL', risk: 'Critical', color: 'text-red-500', 
    note: 'Extreme respiratory failure risk', deNote: 'Extremes Risiko Atemstillstand',
    med: {
      en: "Severe depression of the Central Nervous System. Combining these substances exponentially increases the risk of fatal respiratory arrest and rapid loss of consciousness. Blackouts are almost guaranteed and can lead to dangerous aspiration.",
      de: "Schwere Dämpfung des Zentralnervensystems. Diese Kombination erhöht das Risiko für Atemstillstand und Bewusstlosigkeit massiv. Blackouts sind fast garantiert und können zu lebensgefährlichem Ersticken führen."
    }
  },
  { 
    id: 'mmc-ssri', s1: '3-MMC / 4-MMC', s2: 'SSRIs', risk: 'High', color: 'text-red-400', 
    note: 'Serotonin syndrome risk', deNote: 'Risiko Serotonin-Syndrom heute',
    med: {
      en: "Both 3-MMC and 4-MMC act on serotonin release. Mixing with SSRIs/SNRIs significantly increases the risk of Serotonin Syndrome. Symptoms include overheating, rapid heart rate, and potential seizures.",
      de: "Sowohl 3-MMC als auch 4-MMC wirken auf die Serotonin-Freisetzung. Die Mischung mit SSRIs erhöht das Risiko für ein Serotonin-Syndrom erheblich. Symptome sind Überhitzung und Krampfanfälle heute hier."
    }
  },
  { 
    id: 'mdpv-alc', s1: 'Monkey Dust', s2: 'Alcohol', risk: 'Critical', color: 'text-red-500', 
    note: 'Extreme cardiac load risk', deNote: 'Extreme Herzbelastung',
    med: {
      en: "Monkey Dust (MDPV) is a highly potent stimulant. Mixing with alcohol creates massive strain on the heart and can trigger acute psychiatric emergencies or hyperthermia.",
      de: "Monkey Dust ist ein hochpotentes Stimulans. Die Mischung mit Alkohol belastet das Herz massiv und kann akute psychiatrische Notfälle oder Überhitzung auslösen heute hier."
    }
  },
  { 
    id: 'dmt-maoi', s1: 'DMT', s2: 'MAOIs', risk: 'High', color: 'text-red-400', 
    note: 'Uncontrolled potentiation risk', deNote: 'Unkontrollierte Wirkungsverstärkung',
    med: {
      en: "MAO inhibitors prevent the breakdown of DMT, leading to an uncontrolled and potentially overwhelming experience. It can also cause a dangerous spike in blood pressure.",
      de: "MAO-Hemmer verhindern den Abbau von DMT, was zu einer unkontrollierten und überwältigenden Erfahrung führt. Es kann zudem gefährlichen Bluthochdruck verursachen heute hier."
    }
  },
  { 
    id: 'mdma-ssri', s1: 'MDMA', s2: 'SSRIs', risk: 'High', color: 'text-red-400', 
    note: 'Serotonin syndrome risk', deNote: 'Risiko Serotonin-Syndrom',
    med: {
      en: "Increases the risk of Serotonin Syndrome. Symptoms include dangerously high body temperature, confusion, muscle rigidity, and seizures. It can also permanently dull the effects of MDMA while increasing neurotoxicity.",
      de: "Erhöht das Risiko für ein Serotonin-Syndrom. Symptome sind gefährlich hohes Fieber, Verwirrtheit und Krampfanfälle. Es kann zudem die MDMA-Wirkung dauerhaft abschwächen und die Neurotoxizität erhöhen."
    }
  },
  { 
    id: 'benzo-op', s1: 'Benzos', s2: 'Opioids', risk: 'Critical', color: 'text-red-500', 
    note: 'Fatal overdose and blackout risk', deNote: 'Extremes Risiko Überdosis',
    med: {
      en: "A highly lethal combination. Both are potent respiratory depressants. The interaction causes extreme sedation, making it impossible for the user to wake up or clear their airway if breathing stops.",
      de: "Eine hochgefährliche Kombination. Beide dämpfen die Atmung stark. Die Wechselwirkung führt zu einer so tiefen Sedierung, dass ein Aufwachen bei Atemnot unmöglich wird."
    }
  },
  { 
    id: 'coc-alc', s1: 'Cocaine', s2: 'Alcohol', risk: 'Moderate', color: 'text-amber-500', 
    note: 'Increased cardiotoxicity', deNote: 'Erhöhte Herztoxizität',
    med: {
      en: "The liver produces a new substance called Cocaethylene when these are mixed. Cocaethylene is much more toxic to the heart than cocaine alone and significantly increases the risk of sudden cardiac arrest.",
      de: "Die Leber bildet bei dieser Mischung den Stoff Cocaethylen. Dieser ist deutlich herztoxischer als Kokain allein und erhöht das Risiko für einen plötzlichen Herzstillstand erheblich."
    }
  },
];

const UI = {
  en: {
    header: "Something to remember", sub: "Wisdom for your journey", wisdom: "Mixing Wisdom Guide",
    acknowledge: "I take responsibility", confirm: "Set resonant wisdom", created: "Created in harmony",
    medicalTitle: "Biological Impact", medicalSub: "Internal Systems Analysis", close: "Continue Calibration"
  },
  de: {
    header: "Wichtiger Hinweis", sub: "Weisheit für deine Reise", wisdom: "Misch-Weisheiten Guide",
    acknowledge: "Ich übernehme Verantwortung", confirm: "Ich übernehme Verantwortung", created: "In Harmonie erschaffen",
    medicalTitle: "Biologische Auswirkungen", medicalSub: "Analyse der Organsysteme", close: "Kalibrierung fortsetzen"
  }
};

export function StepSomethingToRemember({ onComplete, onBack, isStandAlone = false }: { onComplete: (data: any) => void, onBack?: () => void, isStandAlone?: boolean }) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [acknowledged, setAcknowledge] = useState(false);
  const [selectedPair, setSelectedPair] = useState<any>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.en;

  return (
    <div className="w-full h-full flex flex-col font-headline bg-card relative animate-in fade-in duration-700 overflow-x-hidden">
      {!isStandAlone && onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-[100] pt-4">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className={cn("px-6 shrink-0 text-center", isStandAlone ? "pt-4" : "pt-16")}>
        <h2 className="text-[22px] font-black uppercase mb-1 text-foreground leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-6">{t.sub}</p>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full px-6">
          <div className="space-y-8 pb-40">
            <section className="space-y-4">
              <div className="flex items-center justify-between px-1">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.wisdom}</h3>
                <Info size={12} className="text-primary/40" />
              </div>
              
              <div className="grid grid-cols-1 gap-3">
                {MIXING_WISDOM.map((row) => (
                  <button 
                    key={row.id} 
                    onClick={() => setSelectedPair(row)}
                    className="bg-card border border-border/10 rounded-2xl p-5 flex flex-col gap-3 transition-all hover:border-primary/30 group w-full overflow-hidden text-left active:scale-[0.98]"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <span className="text-xs font-black text-foreground uppercase tracking-tight flex-1 break-words">{row.s1} + {row.s2}</span>
                      <div className="flex items-center gap-2">
                         <span className={cn("text-[8px] font-black uppercase px-2 py-1 rounded-md bg-card/5 shrink-0", row.color)}>
                           {row.risk}
                         </span>
                         <ChevronRight size={12} className="text-muted-foreground group-hover:text-primary transition-colors" />
                      </div>
                    </div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">
                      {lang === 'de' ? row.deNote : row.note}
                    </p>
                  </button>
                ))}
              </div>
              
              {!isStandAlone && (
                <button 
                  onClick={() => setAcknowledge(!acknowledged)}
                  className={cn(
                    "w-full p-6 rounded-2xl border-2 flex items-center gap-4 transition-all active:scale-[0.98] shadow-lg mt-8",
                    acknowledged ? "bg-primary/10 border-primary" : "bg-card/5 border-border/10"
                  )}
                >
                  <div className={cn(
                    "w-6 h-6 rounded-full border flex items-center justify-center shrink-0 transition-all",
                    acknowledged ? "bg-primary border-primary shadow-[0_0_10px_rgba(27,77,62,0.5)]" : "border-border/20"
                  )}>
                    {acknowledged && <Check className="w-3.5 h-3.5 text-foreground" />}
                  </div>
                  <span className={cn("text-[10px] font-black uppercase tracking-widest text-left", acknowledged ? "text-primary" : "text-muted-foreground")}>
                    {t.acknowledge}
                  </span>
                </button>
              )}
            </section>

            <div className="pt-4 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{t.created}</p>
            </div>
          </div>
        </ScrollArea>
      </div>

      <Dialog open={!!selectedPair} onOpenChange={() => setSelectedPair(null)}>
        <DialogContent className="bg-card border-border/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col font-headline shadow-2xl">
          <DialogTitle className="sr-only">{t.medicalTitle}</DialogTitle>
          
              <div className="p-10 flex flex-col items-center text-center space-y-8">
            <div className="relative">
              <div className={cn("absolute inset-0 blur-3xl rounded-full opacity-20", selectedPair?.color.replace('text-', 'bg-'))} />
              <div className="w-20 h-20 bg-card/5 rounded-3xl flex items-center justify-center border-2 border-border/10 relative z-10">
                <ShieldAlert size={40} className={selectedPair?.color} />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">
                {selectedPair?.s1} + {selectedPair?.s2}
              </h3>
              <p className={cn("text-[10px] font-black uppercase tracking-[0.4em]", selectedPair?.color)}>
                {selectedPair?.risk} Intention Interaction
              </p>
            </div>

            <div className="w-full bg-card/[0.03] border border-border/5 rounded-[2rem] p-8 text-left space-y-6">
              <div className="flex items-center gap-3">
                <Brain size={18} className="text-primary/60" />
                <span className="text-[10px] font-black uppercase text-primary/60 tracking-widest">{t.medicalSub}</span>
              </div>
              
              <p className="text-sm font-bold text-foreground leading-relaxed uppercase tracking-widest">
                {lang === 'en' ? selectedPair?.med?.en : selectedPair?.med?.de}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/5">
                 <div className="flex items-center gap-2">
                   <HeartPulse size={14} className="text-red-500" />
                   <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Cardiac Load: High</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <Droplets size={14} className="text-blue-400" />
                   <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Hepatic Strain: High</span>
                 </div>
              </div>
            </div>

            <button 
              onClick={() => setSelectedPair(null)}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-lg"
            >
              {t.close}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {!isStandAlone && (
        <div className="absolute bottom-0 left-0 right-0 p-6 dark:bg-gradient-to-t dark:from-background dark:via-background dark:to-transparent pt-12 pointer-events-none pb-safe">
          <button 
            onClick={() => onComplete({ acknowledged })} 
            disabled={!acknowledged}
            className={cn(
              "pointer-events-auto w-full max-w-sm mx-auto h-20 rounded-full uppercase tracking-[0.2em] font-black text-lg transition-all shadow-2xl flex items-center justify-center gap-3",
              acknowledged ? 'bg-primary text-primary-foreground neon-glow active:scale-95' : 'bg-card/10 text-muted-foreground border-2 border-border/5 cursor-not-allowed opacity-50'
            )}
          >
            {t.confirm}
          </button>
        </div>
      )}
    </div>
  );
}

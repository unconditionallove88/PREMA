
'use client';

import React, { useState, useEffect } from 'react';
import { Heart, Battery, Droplets, Moon, Zap, ArrowRight, Volume2, Loader2, Target, ShieldCheck, Apple, Info, FlaskConical } from 'lucide-react';
import { SupporterIcon } from '@/components/ui/supporter-icon';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { ScrollArea } from '@/components/ui/scroll-area';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { StepPartyGoal } from '@/components/onboarding/StepPartyGoal';
import { Step7GearCheck } from '@/components/onboarding/Step7GearCheck';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview SupporterPortal Component.
 * Features: Interactive Biology Wisdom and Phase Selection.
 */

interface AssistantPortalProps {
  userProfile: any;
}

const i18n = {
  en: {
    title: "StayOnBeat",
    supporter: "Supporter",
    question: "How is your inner state?",
    subtitle: "Select your current phase for tailored guidance and love. 🌿",
    intention: "Your Intention",
    gearCheck: "Gear Check",
    prepWisdom: "Biology & Prep",
    wisdomTitle: "Sanctuary Wisdom",
    closeBtn: "I understand",
    phases: [
      { title: "Before", desc: "Prepare your body & mind" },
      { title: "During", desc: "Stay safe & connected" },
      { title: "After", desc: "Recover & restore" }
    ],
    details: {
      hydration: {
        title: "The Flow of Life",
        why: "Body & Blood",
        desc: "You are 60% water Hydration is the fuel for every cellular reaction in your sanctuary Water keeps blood fluid and circulating freely ensuring nutrients reach your heart without strain",
        kidneys: "Kidney Shield: Your kidneys process every substance Water is their shield helping them flush toxins and maintain mineral harmony"
      },
      nutrition: {
        title: "Physical Resonance",
        why: "Steady Fuel",
        desc: "Eat a balanced meal of complex carbohydrates and lean protein 3 to 4 hours before departure This provides a slow-burn energy source for your muscles and brain",
        energy: "Why it matters: Stable nutrition prevents blood sugar crashes and keeps your physical resonance steady during intense sensory input"
      },
      rest: {
        title: "Nervous System Calibration",
        why: "Deep Recovery",
        desc: "Resting allows your nervous system to calibrate and stores essential glycogen for your journey Sleep prepares your mind for expanded resonance",
        timing: "Circadian Rhythm: Entering rest before 23:00 optimizes your hormonal balance and strengthens your Pulse Baseline for the next day"
      }
    }
  },
  de: {
    title: "StayOnBeat",
    supporter: "Unterstützer heute hier",
    question: "Wie ist dein innerer Zustand?",
    subtitle: "Wähle deine aktuelle Phase für maßgeschneiderte Begleitung. 🌿",
    intention: "Deine Intention heute",
    gearCheck: "Ausrüstungs Check heute",
    prepWisdom: "Biologie & Vorbereitung",
    wisdomTitle: "Sanctuary Weisheit",
    closeBtn: "Ich verstehe",
    phases: [
      { title: "Vorher", desc: "Körper & Geist vorbereiten heute" },
      { title: "Währenddessen", desc: "Sicher & verbunden bleiben heute" },
      { title: "Danach", desc: "Erholen & regenerieren heute" }
    ],
    details: {
      hydration: {
        title: "Der Fluss des Lebens",
        why: "Körper & Blut",
        desc: "Du bestehst zu 60% aus Wasser Hydrierung ist der Treibstoff für jede zelluläre Reaktion in deinem Körper Wasser hält das Blut flüssig und lässt es frei zirkulieren damit Nährstoffe dein Herz ohne Anstrengung erreichen",
        kidneys: "Nierenschutz: Deine Nieren verarbeiten jede Substanz Wasser ist ihr Schutzschild und hilft Giftstoffe auszuspülen und das mineralische Gleichgewicht zu halten"
      },
      nutrition: {
        title: "Physische Resonanz",
        why: "Stabiler Treibstoff",
        desc: "Iss 3 bis 4 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit aus komplexen Kohlenhydraten und Proteinen Dies bietet eine langsame Energiequelle für Muskeln und Gehirn",
        energy: "Warum es zählt: Eine stabile Ernährung verhindert Blutzuckerschwankungen und hält deine physische Resonanz bei intensiven Sinneseindrücken stabil"
      },
      rest: {
        title: "Kalibrierung des Nervensystems",
        why: "Tiefe Erholung heute",
        desc: "Erholung ermöglicht es deinem Nervensystem sich zu kalibrieren und speichert wichtiges Glykogen für deine Reise Schlaf bereitet deinen Geist auf eine erweiterte Resonanz vor",
        timing: "Biorhythmus: Ruhe vor 23:00 Uhr optimiert deinen Hormonhaushalt und stärkt deine Pulse-Basis für den nächsten Tag"
      }
    }
  }
};

export function AssistantPortal({ userProfile }: AssistantPortalProps) {
  const router = useRouter();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [activePhase, setActivePhase] = useState<'root' | 'before' | 'during' | 'after'>('root');
  
  const [intentionOpen, setIntentionOpen] = useState(false);
  const [gearOpen, setGearOpen] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState<any>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = i18n[lang] || i18n.en;

  const handleVoiceResonance = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const text = `${t.supporter}: ${t.question} ${t.subtitle}`;
      const { audioDataUri } = await textToSpeech({ text, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  if (activePhase === 'before') {
    return (
      <div className="h-full bg-black text-white flex flex-col font-headline relative animate-in fade-in duration-500">
        <header className="p-8 pb-4 shrink-0 flex items-center justify-between">
          <button onClick={() => setActivePhase('root')} className="text-white/40 text-[10px] font-black uppercase tracking-widest">Back</button>
          <div className="flex items-center gap-2">
            <SupporterIcon className="text-emerald-500" size={16} />
            <span className="text-xs font-black uppercase tracking-tighter">Before Phase</span>
          </div>
        </header>

        <ScrollArea className="flex-1 px-8 pt-4">
          <div className="space-y-6 pb-20">
            <h2 className="text-3xl font-black uppercase tracking-tighter leading-none">Preparation <br/><span className="text-emerald-500">Protocols</span></h2>
            
            <div className="grid gap-4">
              <button 
                onClick={() => setIntentionOpen(true)}
                className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4 group"
              >
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><Target className="text-emerald-500" /></div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase">{t.intention}</p>
                  <p className="text-[9px] text-white/30 uppercase font-bold">Calibration of focus</p>
                </div>
              </button>

              <button 
                onClick={() => setGearOpen(true)}
                className="p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4 group"
              >
                <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><ShieldCheck className="text-emerald-500" /></div>
                <div className="text-left">
                  <p className="text-sm font-black uppercase">{t.gearCheck}</p>
                  <p className="text-[9px] text-white/30 uppercase font-bold">Sanctuary Kit prep</p>
                </div>
              </button>

              <div className="p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 space-y-4">
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">{t.prepWisdom}</p>
                 <div className="grid grid-cols-1 gap-2">
                    <button 
                      onClick={() => { playHeartbeat(); setSelectedWisdom({...t.details.hydration, icon: <Droplets className="text-blue-400" />}); }}
                      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Droplets size={16} className="text-blue-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Hydration Wisdom</span>
                      </div>
                      <Info size={12} className="text-white/20 group-hover:text-primary" />
                    </button>
                    <button 
                      onClick={() => { playHeartbeat(); setSelectedWisdom({...t.details.nutrition, icon: <Apple className="text-emerald-400" />}); }}
                      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Apple size={16} className="text-emerald-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Nutrition Wisdom</span>
                      </div>
                      <Info size={12} className="text-white/20 group-hover:text-primary" />
                    </button>
                    <button 
                      onClick={() => { playHeartbeat(); setSelectedWisdom({...t.details.rest, icon: <Moon className="text-purple-400" />}); }}
                      className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                    >
                      <div className="flex items-center gap-3">
                        <Moon size={16} className="text-purple-400" />
                        <span className="text-[10px] font-black uppercase tracking-widest">Recovery Wisdom</span>
                      </div>
                      <Info size={12} className="text-white/20 group-hover:text-primary" />
                    </button>
                 </div>
              </div>

              <button 
                onClick={() => router.push('/before')}
                className="p-6 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-between"
              >
                <span className="text-xs font-black uppercase tracking-widest">Full Preparation Guide</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </ScrollArea>

        <Dialog open={intentionOpen} onOpenChange={setIntentionOpen}>
          <DialogContent className="bg-black border-white/10 p-0 max-w-xl h-[80vh]">
            <DialogTitle className="sr-only">Intention</DialogTitle>
            <StepPartyGoal onComplete={() => setIntentionOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={gearOpen} onOpenChange={setGearOpen}>
          <DialogContent className="bg-black border-white/10 p-0 max-w-xl h-[80vh]">
            <DialogTitle className="sr-only">Gear Check</DialogTitle>
            <Step7GearCheck onComplete={() => setGearOpen(false)} />
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedWisdom} onOpenChange={() => setSelectedWisdom(null)}>
          <DialogContent className="bg-black border-white/10 max-md p-0 rounded-[3rem] overflow-hidden flex flex-col font-headline shadow-[0_0_100px_rgba(0,0,0,0.9)]">
            <DialogTitle className="sr-only">{t.wisdomTitle}</DialogTitle>
            <div className="p-10 text-center space-y-8">
              <div className="flex flex-col items-center gap-6">
                <div className="w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-white/10 bg-white/5">
                  {selectedWisdom?.icon && React.cloneElement(selectedWisdom.icon as React.ReactElement, { size: 40 })}
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-black uppercase tracking-tighter text-white">{selectedWisdom?.title}</h3>
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{selectedWisdom?.why}</p>
                </div>
              </div>
              <div className="space-y-6 text-left">
                <div className="p-6 bg-white/[0.03] border border-white/5 rounded-3xl space-y-4">
                  <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">{selectedWisdom?.desc}</p>
                  {selectedWisdom?.kidneys && <p className="text-[11px] font-black text-blue-400/80 leading-relaxed uppercase tracking-widest border-t border-white/5 pt-4">{selectedWisdom.kidneys}</p>}
                  {selectedWisdom?.energy && <p className="text-[11px] font-black text-emerald-400/80 leading-relaxed uppercase tracking-widest border-t border-white/5 pt-4">{selectedWisdom.energy}</p>}
                  {selectedWisdom?.timing && <p className="text-[11px] font-black text-purple-400/80 leading-relaxed uppercase tracking-widest border-t border-white/5 pt-4">{selectedWisdom.timing}</p>}
                </div>
              </div>
              <button onClick={() => { playHeartbeat(); setSelectedWisdom(null); }} className="w-full h-16 bg-[#1b4d3e] text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all shadow-lg">{t.closeBtn}</button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="h-full bg-black text-white flex flex-col font-headline relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <header className="flex items-center justify-between p-8 pb-4 relative z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
            <Heart className="text-emerald-500 fill-emerald-500" size={20} />
          </div>
          <h1 className="text-xl font-black uppercase tracking-tighter">{t.title}</h1>
        </div>
      </header>

      <ScrollArea className="flex-1 px-8 relative z-10 touch-pan-y min-h-0">
        <section className="mb-8 pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <SupporterIcon className="text-emerald-500" size={24} />
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">{t.supporter}</p>
            </div>
            <button onClick={handleVoiceResonance} disabled={isSpeaking} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all disabled:opacity-30">
              {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
            </button>
          </div>
          <h2 className="text-4xl font-black uppercase tracking-tighter leading-none mb-4">
            {t.question.split(' ').slice(0, -1).join(' ')} <br /> <span className="text-emerald-500">{t.question.split(' ').pop()}</span>
          </h2>
          <p className="text-[#10B981] text-sm font-bold leading-relaxed max-w-[280px] uppercase tracking-widest">
            {t.subtitle}
          </p>
        </section>

        <div className="grid gap-4 pb-32">
          {[
            { id: 'before', title: t.phases[0].title, icon: <Battery className="text-emerald-400" size={24} />, desc: t.phases[0].desc, color: "bg-emerald-500/5 hover:bg-emerald-500/10 border-emerald-500/20 hover:border-emerald-500/40" },
            { id: 'during', title: t.phases[1].title, icon: <Zap className="text-amber-400" size={24} />, desc: t.phases[1].desc, color: "bg-amber-500/5 hover:bg-amber-500/10 border-amber-500/20 hover:border-amber-500/40" },
            { id: 'after', title: t.phases[2].title, icon: <Moon className="text-indigo-400" size={24} />, desc: t.phases[2].desc, color: "bg-indigo-500/5 hover:bg-indigo-500/10 border-indigo-500/20 hover:border-indigo-500/40" }
          ].map((phase) => (
            <button 
              key={phase.title}
              onClick={() => {
                if (phase.id === 'before') setActivePhase('before');
                else if (phase.id === 'after') router.push('/recovery');
                else router.push(`/${phase.id}`);
              }}
              className={cn(
                "flex items-center p-6 rounded-[2rem] border-2 transition-all active:scale-[0.98] group text-left",
                phase.color
              )}
            >
              <div className="p-4 rounded-2xl bg-black/40 border border-white/10 group-hover:scale-110 transition-transform mr-5">
                {phase.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black uppercase tracking-tight">{phase.title}</h3>
                <p className="text-[10px] font-black text-[#10B981] uppercase tracking-widest mt-1">{phase.desc}</p>
              </div>
              <ArrowRight size={18} className="text-white/10 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}

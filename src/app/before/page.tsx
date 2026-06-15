
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { ArrowLeft, Droplets, Apple, Moon, Battery, ShieldCheck, Heart, Loader2, Microscope, FlaskConical, Info, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

/**
 * @fileOverview Phase: Before (Preparation Protocol).
 * Updated: Detailed wisdom dialogs for Hydration, Nutrition, Rest, and Essentials.
 */

const CONTENT = {
  en: {
    title: "Preparation", subtitle: "Radiate from within", header: "Ready to shine?",
    description: "I respect you",
    sections: { hydration: "Hydration", nutrition: "Nutrition", rest: "Rest", essentials: "Essentials", testing: "Lab Testing" },
    hydrationAdvice: (liters: number) => `Based on your essence, drink ${liters} liters of water today Add electrolytes to maintain mineral balance`,
    nutritionAdvice: "Eat a solid balanced meal 3 hours before you head out Avoid heavy processed foods",
    restAdvice: "Prioritize restful sleep and be in bed before 23:00 to ensure your body recovers and stores energy",
    essentialsAdvice: "Charge your phone to 100% Check in with your circle and sync your Pulse baseline",
    testingAdvice: "Test your substances anonymously at our contract labs for absolute peace of mind",
    button: "I am prepared",
    testingBtn: "Book Anonymous Test",
    footerAdvice: "Preparation is the first act of self-care Radiate your truth from the inside out",
    wisdomTitle: "Graceful Guidance",
    closeBtn: "I understand",
    details: {
      hydration: {
        title: "The Flow of Life",
        why: "Body & Blood",
        desc: "You are 60% water Hydration is the fuel for every cellular reaction in your body Water keeps blood fluid and circulating freely ensuring nutrients reach your heart without strain",
        kidneys: "Kidney Shield: Your kidneys process every substance Water is their shield helping them flush toxins and maintain mineral harmony"
      },
      nutrition: {
        title: "Physical Intention",
        why: "Steady Fuel",
        desc: "Eat a balanced meal of complex carbohydrates and lean protein 3 to 4 hours before departure This provides a slow-burn energy source for your muscles and brain",
      },
      rest: {
        title: "Nervous System Calibration",
        why: "Deep Recovery",
        timing: "Circadian Rhythm: Entering rest before 23:00 optimizes your hormonal balance and strengthens your Pulse Baseline for the next day"
      },
      essentials: {
        title: "Mesh Connectivity",
        why: "Sovereign Link",
        desc: "A 100% phone charge is your lifeline to the Sovereign Mesh and Circle of Love Connection is your primary safety protocol",
        sync: "Sync Requirement: Verifying your Pulse baseline ensures the Pulse Guardian can accurately detect physiological stress and protect your heart"
      }
    }
  },
  de: {
    title: "Vorbereitung", subtitle: "Von innen heraus strahlen", header: "Bereit zu strahlen?",
    description: "Ich respektiere dich",
    sections: { hydration: "Hydrierung", nutrition: "Erährung", rest: "Erholung", essentials: "Essentials", testing: "Labor-Check" },
    hydrationAdvice: (liters: number) => `Basierend auf deinem Körpergewicht trink  ${liters} Liter Wasser Füge Elektrolyte hinzu`,
    nutritionAdvice: "Iss 3 Stunden vor dem Aufbruch eine ausgewogene Mahlzeit Vermeide schwere Lebensmittel",
    restAdvice: "Priorisiere erholsamen Schlaf und sei vor 23:00 Uhr im Bett damit dein Körper regenerieren kann",
    essentialsAdvice: "Lade dein Handy auf 100% Melde dich bei deinem Circle und kalibriere deine Pulse-Basis",
    testingAdvice: "Teste deine Substanzen anonym in unseren Vertragslaboren für vollkommene Sicherheit",
    button: "Ich bin bereit",
    testingBtn: "Anonymen Test buchen",
    footerAdvice: "Vorbereitung ist der erste Akt der Selbstfürsorge Strahle deine Wahrheit von innen nach außen",
    wisdomTitle: "Anmutige Führung",
    closeBtn: "Ich verstehe",
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
        why: "Tiefe Erholung ",
        desc: "Erholung ermöglicht es deinem Nervensystem sich zu kalibrieren und speichert wichtiges Glykogen für deine Reise Schlaf bereitet deinen Geist auf eine erweiterte Resonanz vor",
        timing: "Biorhythmus: Ruhe vor 23:00 Uhr optimiert deinen Hormonhaushalt und stärkt deine Pulse-Basis für den nächsten Tag"
      },
      Wesentliches: {
        title: "Mesh Verbindung ",
        why: "Souveräner Link ",
        desc: "Ein zu 100% geladenes Handy ist deine Lebensader zum Sovereign Mesh und zum Circle of Love Verbindung ist dein wichtigstes Sicherheitsprotokoll ",
        sync: "Sync-Pflicht: Die Kalibrierung deiner Pulse-Basis stellt sicher dass der Pulse Guardian physischen Stress genau erkennen und dein Herz schützen kann"
      }
    }
  }
};

export default function BeforePhase() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mounted, setMounted] = useState(false);
  const [selectedWisdom, setSelectedWisdom] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center gap-8">
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = CONTENT[lang] || CONTENT.en;
  const weight = profile?.biometrics?.weightKg || 75;
  const hydrationTarget = Math.round(weight * 0.035 * 10) / 10;

  const sections = [
    { 
      id: 'testing',
      title: t.sections.testing, 
      icon: <FlaskConical className="text-primary" size={24} />, 
      advice: t.testingAdvice, 
      color: "border-primary/40 bg-primary/5", 
      action: () => router.push('/laboratory-test') 
    },
    { 
      id: 'hydration',
      title: t.sections.hydration, 
      icon: <Droplets className="text-blue-400" size={24} />, 
      advice: t.hydrationAdvice(hydrationTarget), 
      color: "border-blue-500/20 bg-blue-500/5",
      details: t.details.hydration
    },
    { 
      id: 'nutrition',
      title: t.sections.nutrition, 
      icon: <Apple className="text-emerald-400" size={24} />, 
      advice: t.nutritionAdvice, 
      color: "border-emerald-500/20 bg-emerald-500/5",
      details: t.details.nutrition
    },
    { 
      id: 'rest',
      title: t.sections.rest, 
      icon: <Moon className="text-purple-400" size={24} />, 
      advice: t.restAdvice, 
      color: "border-purple-500/20 bg-purple-500/5",
      details: t.details.rest
    },
    { 
      id: 'essentials',
      title: t.sections.essentials, 
      icon: <Battery className="text-amber-400" size={24} />, 
      advice: t.essentialsAdvice, 
      color: "border-amber-500/20 bg-amber-500/5",
      details: t.details.essentials
    }
  ];

  const handleCardClick = (section: any) => {
    playHeartbeat();
    if (section.action) {
      section.action();
    } else if (section.details) {
      setSelectedWisdom({ ...section.details, icon: section.icon, color: section.color });
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground font-headline pb-32 relative overflow-x-hidden pt-safe">
      <header className="px-6 py-8 border-b border-border bg-card/90 backdrop-blur-xl flex items-center gap-4 sticky top-0 z-50">
        <button onClick={() => router.push("/dashboard")} className="p-3 bg-card border border-border rounded-full"><ArrowLeft className="w-5 h-5 text-muted-foreground" /></button>
        <div>
          <h1 className="text-xl font-semibold uppercase tracking-normal">{t.title}</h1>
          <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.3em]">{t.subtitle}</p>
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="px-6 py-10 max-w-xl mx-auto space-y-10">
          <section className="text-center space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter leading-none">{t.header}</h2>
            <p className="text-primary text-sm font-bold uppercase tracking-widest italic">"{t.description}"</p>
          </section>

          <div className="grid gap-4">
            {sections.map((section, idx) => (
              <div 
                key={idx} 
                onClick={() => handleCardClick(section)}
                className={cn(
                  "p-8 rounded-[2rem] border-2 transition-all group cursor-pointer hover:scale-[1.02]", 
                  section.color, 
                  section.id === 'testing' && "border-primary"
                )}
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-2xl bg-card border border-border shrink-0">{section.icon}</div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold uppercase tracking-tight text-foreground flex items-center gap-2">
                      {section.title}
                      {section.details && <Info size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground leading-relaxed uppercase tracking-wide">{section.advice}</p>
                    {section.id === 'testing' && <span className="inline-block mt-2 px-4 py-2 bg-primary text-primary-foreground text-[9px] font-semibold uppercase tracking-widest rounded-full">{t.testingBtn}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <Dialog open={!!selectedWisdom} onOpenChange={() => setSelectedWisdom(null)}>
        <DialogContent className="bg-card border-border max-md p-0 rounded-[3rem] overflow-hidden flex flex-col font-headline shadow-soft">
          <DialogTitle className="sr-only">{t.wisdomTitle}</DialogTitle>
          
          <div className="p-10 text-center space-y-8">
            <div className="flex flex-col items-center gap-6">
              <div className={cn("w-20 h-20 rounded-[2rem] flex items-center justify-center border-2 border-border shadow-soft transition-all duration-700 bg-card")}>
                {selectedWisdom?.icon && React.cloneElement(selectedWisdom.icon as React.ReactElement<{ size?: number }>, { size: 40 })}
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl font-semibold uppercase tracking-tight text-foreground">{selectedWisdom?.title}</h3>
                <p className="text-[10px] font-semibold text-primary uppercase tracking-[0.4em]">{selectedWisdom?.why}</p>
              </div>
            </div>

            <div className="space-y-6 text-left">
              <div className="p-6 bg-card/90 border border-border rounded-3xl space-y-4">
                <p className="text-sm font-semibold text-muted-foreground leading-relaxed uppercase tracking-widest">
                  {selectedWisdom?.desc}
                </p>
                {selectedWisdom?.kidneys && (
                  <p className="text-[11px] font-black text-blue-400/80 leading-relaxed uppercase tracking-widest border-t border-border/5 pt-4">
                    {selectedWisdom.kidneys}
                  </p>
                )}
                {selectedWisdom?.energy && (
                  <p className="text-[11px] font-black text-emerald-400/80 leading-relaxed uppercase tracking-widest border-t border-border/5 pt-4">
                    {selectedWisdom.energy}
                  </p>
                )}
                {selectedWisdom?.timing && (
                  <p className="text-[11px] font-black text-purple-400/80 leading-relaxed uppercase tracking-widest border-t border-border/5 pt-4">
                    {selectedWisdom.timing}
                  </p>
                )}
                {selectedWisdom?.sync && (
                  <p className="text-[11px] font-black text-amber-400/80 leading-relaxed uppercase tracking-widest border-t border-border/5 pt-4">
                    {selectedWisdom.sync}
                  </p>
                )}
              </div>
            </div>

            <button 
              onClick={() => { playHeartbeat(); setSelectedWisdom(null); }}
              className="w-full h-16 bg-primary text-primary-foreground rounded-2xl font-semibold uppercase text-xs tracking-widest active:scale-95 transition-all shadow-soft"
            >
              {t.closeBtn}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <footer className="fixed bottom-0 left-0 right-0 h-[100px] bg-card/90 backdrop-blur-xl border-t border-border flex items-center justify-center px-6 z-50 pb-safe">
        <button onClick={() => router.push("/dashboard")} className="w-full max-sm py-6 bg-primary text-primary-foreground rounded-full font-semibold uppercase text-lg tracking-[0.1em] shadow-soft active:scale-95 transition-all">{t.button}</button>
      </footer>
    </main>
  );
}

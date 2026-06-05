
"use client";

import { useState, useEffect } from "react";
import { Microscope, ShieldCheck, ArrowLeft, Loader2, CheckCircle2, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { playHeartbeat } from "@/lib/resonance";

/**
 * @fileOverview Anonymous Laboratory Testing Onboarding Step.
 * Allows users to book appointments with contract labs.
 */

const CONTENT = {
  en: {
    header: "Sovereign Lab Check",
    sub: "Test your drugs anonymously",
    desc: "I love and respect my body. Before the party, visit our contract laboratories for high-fidelity anonymous analysis.",
    labsTitle: "Contract Laboratories",
    btn: "Book Anonymous Check",
    confirm: "I value my health",
    anonCode: "Your Anonymous ID",
    steps: [
      "Select a laboratory partner",
      "Generate a zero-identity code",
      "Drop off sample anonymously",
      "View results in the private space"
    ],
    footer: "Created in harmony"
  },
  de: {
    header: "Labor Check heute",
    sub: "Drogen jetzt anonym testen",
    desc: "Ich achte meinen Körper. Besuche vor der Party unsere Vertragslabore für eine hochpräzise, anonyme Analyse.",
    labsTitle: "Partner Laboratorien",
    btn: "Anonymen Check buchen",
    confirm: "Ich schätze meine Gesundheit",
    anonCode: "Deine anonyme ID heute",
    steps: [
      "Wähle einen Labor-Partner",
      "Erstelle einen anonymen Code",
      "Probe anonym abgeben heute",
      "Ergebnisse im privaten Raum sehen"
    ],
    footer: "In Harmonie erschaffen hier"
  }
};

const LABS = [
  { id: 'mitte', name: "Prema Lab Mitte", address: "Torstraße, Berlin" },
  { id: 'xberg', name: "Resonance Lab X-Berg", address: "Skalitzer Str, Berlin" },
];

export function StepLaboratoryTesting({ onComplete, onBack }: { onComplete: () => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [selectedLab, setSelectedLab] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingCode, setBookingCode] = useState<string | null>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const handleBook = () => {
    if (!selectedLab) return;
    setIsBooking(true);
    playHeartbeat();
    setTimeout(() => {
      setBookingCode("SAN-" + Math.random().toString(36).substring(7).toUpperCase());
      setIsBooking(false);
    }, 1500);
  };

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-xl mx-auto px-4 text-center relative pt-safe pb-safe">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft size={16} /> BACK</button>}
      
      <div className="mt-12 mb-8">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <Microscope size={32} className="text-primary" />
        </div>
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">{t.sub}</p>
      </div>

      <div className="bg-[#0a0a0a] border border-white/10 rounded-[2rem] p-8 mb-8 space-y-6 text-left w-full">
        <p className="text-sm font-bold text-white/60 leading-relaxed uppercase tracking-widest italic">
          "{t.desc}"
        </p>
        
        <div className="grid gap-3">
          {t.steps.map((step, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-[10px] font-black text-primary">{i+1}</div>
              <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {!bookingCode ? (
        <div className="w-full space-y-6">
          <div className="grid gap-3">
            {LABS.map((lab) => (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab.id)}
                className={cn(
                  "p-6 rounded-2xl border-2 transition-all text-left",
                  selectedLab === lab.id ? "bg-primary/10 border-primary shadow-lg" : "bg-white/5 border-white/10 hover:border-white/20"
                )}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-black uppercase text-white">{lab.name}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase mt-1 tracking-widest">{lab.address}</p>
                  </div>
                  {selectedLab === lab.id && <CheckCircle2 size={20} className="text-primary" />}
                </div>
              </button>
            ))}
          </div>

          <button 
            onClick={handleBook}
            disabled={!selectedLab || isBooking}
            className={cn(
              "pill-button w-full h-20 text-xl font-black uppercase tracking-widest transition-all",
              selectedLab ? "bg-[#1b4d3e] text-white shadow-2xl" : "bg-white/5 text-white/10 cursor-not-allowed border border-white/5"
            )}
          >
            {isBooking ? <Loader2 className="animate-spin" /> : t.btn}
          </button>
        </div>
      ) : (
        <div className="w-full space-y-8 animate-in zoom-in duration-500">
          <div className="p-8 bg-primary/10 border-2 border-primary rounded-[2.5rem] space-y-4">
            <Lock size={32} className="text-primary mx-auto" />
            <div>
              <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">{t.anonCode}</p>
              <p className="text-4xl font-black text-white tracking-tighter mt-2">{bookingCode}</p>
            </div>
          </div>
          <button 
            onClick={onComplete}
            className="pill-button w-full bg-white text-black text-xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-lg"
          >
            {t.confirm}
          </button>
        </div>
      )}

      <p className="mt-8 text-[8px] font-black text-white/20 uppercase tracking-[0.5em]">{t.footer}</p>
    </div>
  );
}

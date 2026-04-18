
'use client';

import React, { useState, useEffect } from 'react';
import { 
  Sprout, 
  CheckCircle2, 
  Loader2, 
  ExternalLink, 
  Volume2,
  Heart,
  ZapOff,
  Sparkles,
  ShieldCheck,
  CircleDot,
  X
} from 'lucide-react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * @fileOverview Co-Creation Component.
 */

const i18n = {
  en: {
    title: "Co-Creation",
    subtitle: "Your voice shapes this sanctuary",
    types: [
      { key: "love", label: "Pure Love", prompt: "What do you love about this app?", placeholder: "Tell us what brings you joy warm or true to you in this app", icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
      { key: "dislike", label: "Dissonance", prompt: "What do you not like? And why?", placeholder: "Tell us what feels off missing or could be more human and why it matters", icon: ZapOff, color: "text-amber-400", bg: "bg-amber-500/10" },
      { key: "evolution", label: "Evolution", prompt: "What would you add?", placeholder: "A feature a word a feeling you wish was here to help us grow", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10" },
      { key: "favorite", label: "Favorite Tool", prompt: "Which tool do you love the most?", placeholder: "Tell us honestly which tool resonates deepest with your needs", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" },
      { key: "survey", label: "App Survey", prompt: "Help us test the sanctuary", placeholder: "Take our structured survey to help us calibrate the resonance", icon: CircleDot, color: "text-white", bg: "bg-white/10" },
    ],
    send: "Send from the Heart", openSurvey: "Open Sanctuary Survey", sending: "Sending...",
    successTitle: "Heard", successMsg: "Your words have been received with love They will help this space grow",
    shareMore: "Share more", receivedWithLove: "Received with Love"
  },
  de: {
    title: "Ko-Kreation",
    subtitle: "Deine Stimme gestaltet diesen Raum",
    types: [
      { key: "love", label: "Pure Liebe", prompt: "Was liebst du an dieser App?", placeholder: "Was fühlt sich richtig warm oder wahr an in dieser App", icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
      { key: "dislike", label: "Dissonanz", prompt: "Was gefällt dir nicht? Und warum?", placeholder: "Was fühlt sich falsch an fehlt oder könnte menschlicher sein und warum", icon: ZapOff, color: "text-amber-400", bg: "bg-amber-500/10" },
      { key: "evolution", label: "Evolution", prompt: "Was würdest du hinzufügen?", placeholder: "Eine Funktion ein Wort ein Gefühl das du dir hier wünschst", icon: Sparkles, color: "text-blue-400", bg: "bg-blue-500/10" },
      { key: "favorite", label: "Lieblings-Tool", prompt: "Welches Tool liebst du am meisten?", placeholder: "Sag es uns ehrlich Welches Tool hilft dir am meisten", icon: ShieldCheck, color: "text-primary", bg: "bg-primary/10" },
      { key: "survey", label: "App Umfrage", prompt: "Hilf uns das Sanctuary zu testen", placeholder: "Nimm an unserer Umfrage teil um die Resonanz zu kalibrieren", icon: CircleDot, color: "text-white", bg: "bg-white/10" },
    ],
    send: "Von Herzen senden", openSurvey: "Sanctuary Umfrage öffnen", sending: "Wird gesendet...",
    successTitle: "Gehört", successMsg: "Deine Worte wurden mit Liebe empfangen Sie helfen diesem Raum zu wachsen",
    shareMore: "Mehr teilen", receivedWithLove: "Mit Liebe empfangen heute"
  }
};

const SURVEY_LINK = "https://ev32k2sgx09.typeform.com/to/a33evEfp";

export function CoCreation({ onComplete }: { onComplete?: () => void }) {
  const { user } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<"en" | "de">("en");
  const [activeType, setActiveType] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = i18n[lang] || i18n.en;
  const active = t.types[activeType];
  const isSurvey = active.key === 'survey';
  const Icon = active.icon;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSurvey) { window.open(SURVEY_LINK, '_blank'); return; }
    if (!message.trim() || !firestore) return;
    setLoading(true);
    try {
      addDocumentNonBlocking(collection(firestore, "feedback"), {
        userId: user?.uid || "anonymous", language: lang, type: active.key, message: message.trim(), status: "heard", createdAt: serverTimestamp(),
      });
      setSent(true); setMessage("");
    } catch (error) { console.error("Feedback error:", error); } finally { setLoading(false); }
  };

  const handleVoice = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text: t.successMsg, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) { setIsSpeaking(false); }
  };

  return (
    <div className="w-full bg-black flex flex-col font-headline h-full overflow-hidden">
      <header className="px-8 pt-10 pb-6 border-b border-white/5 shrink-0 bg-black/95 backdrop-blur-xl z-50">
        <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/10 border border-primary/20"><Sprout size={24} className="text-primary" /></div>
            <div>
              <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none">{t.title}</h3>
              <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest mt-1">{t.subtitle}</p>
            </div>
          </div>
          {onComplete && <button onClick={onComplete} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40 hover:text-white"><X size={20} /></button>}
        </div>
      </header>

      <ScrollArea className="flex-1">
        <div className="p-8 max-w-2xl mx-auto space-y-10 pb-32">
          {sent ? (
            <div className="w-full min-h-[400px] flex flex-col items-center justify-center p-10 text-center animate-in fade-in zoom-in-95 duration-500 font-headline">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-8 border-2 border-primary/20 shadow-[0_0_40px_rgba(27,77,62,0.1)]"><CheckCircle2 size={48} className="text-primary" /></div>
              <div className="flex items-center justify-center gap-3 mb-4">
                <h3 className="text-white font-black text-3xl uppercase tracking-tighter">{t.successTitle}</h3>
                <button onClick={handleVoice} disabled={isSpeaking} className="p-2 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all disabled:opacity-30">
                  {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <p className="text-white/60 text-base font-bold leading-relaxed max-w-xs mx-auto mb-10">{t.successMsg}</p>
              <button onClick={() => setSent(false)} className="text-[10px] font-black uppercase text-primary tracking-[0.4em] hover:text-white transition-colors underline underline-offset-8">{t.shareMore}</button>
            </div>
          ) : (
            <>
              <div className="flex flex-col items-center text-center space-y-6 py-4 animate-in slide-in-from-bottom-2 duration-500">
                <div className={cn("w-28 h-28 rounded-[2.5rem] flex items-center justify-center border-2 shadow-2xl transition-all duration-700", active.bg, active.color.replace('text-', 'border-').concat('/30'))}><Icon size={56} className={cn("animate-pulse", active.color)} /></div>
                <div className="space-y-2"><h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">{active.prompt}</h2><p className="text-[9px] font-black uppercase tracking-[0.4em] text-white/20">Resonance Phase: {active.label}</p></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {t.types.map((type, i) => {
                  const TypeIcon = type.icon;
                  const isSelected = activeType === i;
                  return (
                    <button key={type.key} onClick={() => { setActiveType(i); setMessage(""); }} className={cn("p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-300 h-24", isSelected ? `${type.bg} ${type.color.replace('text-', 'border-')} shadow-lg` : "bg-white/5 border-white/5 hover:border-white/20")}><TypeIcon size={20} className={isSelected ? type.color : "text-white/20"} /><span className={cn("text-[9px] font-black uppercase tracking-widest text-center leading-none", isSelected ? type.color : "text-white/40")}>{type.label}</span></button>
                  );
                })}
              </div>

              <form onSubmit={handleSend} className="space-y-8">
                {!isSurvey ? (<textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder={active.placeholder} className="w-full h-48 px-8 py-6 rounded-[2.5rem] border-2 border-white/10 bg-white/5 text-white text-lg font-bold outline-none resize-none focus:border-primary transition-all shadow-inner" required />) : (<div className="w-full h-48 px-8 py-10 rounded-[2.5rem] border-2 border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center text-center gap-4"><CircleDot className="text-white/20" size={40} /><p className="text-white/40 text-sm font-bold uppercase tracking-widest leading-relaxed">{active.placeholder}</p></div>)}
                <div className="space-y-6">
                  <button type="submit" disabled={!isSurvey && (loading || !message.trim())} className="w-full h-20 bg-[#1b4d3e] text-white rounded-full font-black text-xl uppercase tracking-widest flex items-center justify-center gap-4 transition-all active:scale-[0.98] shadow-2xl shadow-primary/20 disabled:opacity-30">{isSurvey ? (<><ExternalLink size={24} /> {t.openSurvey}</>) : (loading ? <><Loader2 size={24} className="animate-spin" /> {t.sending}</> : <><CircleDot size={24} /> {t.send}</>)}</button>
                  <div className="flex flex-col items-center gap-2 opacity-40">
                    <p className="text-center text-[10px] text-primary font-black uppercase tracking-[0.5em] shining-white">{t.receivedWithLove}</p>
                    <div className="w-10 h-1 bg-primary/20 rounded-full" />
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

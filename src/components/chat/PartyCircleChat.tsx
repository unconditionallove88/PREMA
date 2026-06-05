'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader2, Flag, Users2, Shield, Wind, CircleDot, Mic, MicOff } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { moderateMessage } from '@/ai/flows/moderate-message';
import { GuardianLogo } from '@/components/ui/guardian-logo';

/**
 * @fileOverview The Spectators (Collective Care).
 * Simplified and harmonized for empathy and ease of communication.
 */

const CONTENT = {
  en: {
    guardianNote: "Pulse Guardian Monitoring",
    title: "The Spectators",
    sub: "Collective Care Circle",
    rulesHeader: "A shared space grounded in kindness Guarded with love",
    rules: [
      "Unconditional Kindness for all",
      "No promotion of substances",
      "Respect each other's anonymity",
      "Speak only from presence",
      "Unity is the focus"
    ],
    enterBtn: "Enter the circle",
    placeholder: "Share kindness now...",
    footer: "Grounded in Presence",
    shiningFooter: "Created in harmony",
    blockedTitle: "Circle Rest",
    blockedDesc: "The Pulse Guardian has paused this connection to restore harmony within the circle 🌿",
    blockedAffirmation: "Rest and stillness",
    violationTitle: "Pulse Guardian: Note",
    violationDesc: "The session is resting",
    errorTitle: "Connection error",
    errorDesc: "Truth not sent",
    listening: "Listening..."
  },
  de: {
    guardianNote: "Pulse Guardian Bewachung",
    title: "Die Spectator",
    sub: "Kreis der Fürsorge",
    rulesHeader: "Ein gemeinsamer Raum der Freundlichkeit Bewacht mit Liebe",
    rules: [
      "Bedingungslose Freundlichkeit für alle",
      "Keine Bewerbung von Substanzen",
      "Respektiere die Anonymität heute",
      "Spreche nur aus Präsenz",
      "Einheit ist der Fokus"
    ],
    enterBtn: "Dem Kreis beitreten",
    placeholder: "Freundlichkeit jetzt teilen...",
    footer: "Geerdet in Präsenz",
    shiningFooter: "In Harmonie erschaffen heute hier",
    blockedTitle: "Circle Pause",
    blockedDesc: "Der Pulse Guardian hat diese Verbindung pausiert um die Harmonie wiederherzustellen 🌿",
    blockedAffirmation: "Ruhe und Stille jetzt",
    violationTitle: "Pulse Guardian: Hinweis",
    violationDesc: "Die Sitzung ruht",
    errorTitle: "Verbindungsfehler",
    errorDesc: "Wahrheit nicht gesendet",
    listening: "Höre zu..."
  }
};

const NATURE_PREFIXES = ['Emerald', 'Golden', 'Mystic', 'Quiet', 'Velvet', 'Silver', 'Primal', 'Crystal'];
const NATURE_NOUNS = ['Leaf', 'Wave', 'Wind', 'Bloom', 'Echo', 'Flame', 'Stone', 'Mist'];

export function PartyCircleChat() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [hasAgreedToRules, setHasAgreedToRules] = useState(false);
  const [isEntering, setIsEntering] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const scrollRef = useRef<HTMLDivElement>(null);

  const natureName = useMemo(() => {
    const prefix = NATURE_PREFIXES[Math.floor(Math.random() * NATURE_PREFIXES.length)];
    const noun = NATURE_NOUNS[Math.floor(Math.random() * NATURE_NOUNS.length)];
    return `${prefix} ${noun}`;
  }, []);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
    const agreed = localStorage.getItem('stayonbeat_spectator_agreed');
    const blocked = localStorage.getItem('stayonbeat_spectator_blocked');
    if (agreed === 'true') setHasAgreedToRules(true);
    if (blocked === 'true') setIsBlocked(true);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const chatQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(
      collection(firestore, 'partyCircle'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const logViolation = async (content: string, reason: string, type: 'AI_FLAGGED' | 'USER_REPORT') => {
    if (!firestore || !user) return;
    addDocumentNonBlocking(collection(firestore, 'moderation_logs'), {
      userId: user.uid, userAlias: natureName, content, reason, type, timestamp: serverTimestamp()
    });
  };

  const handleSend = async () => {
    if (!input.trim() || !user || !firestore || isSending || isBlocked) return;
    const text = input.trim();
    setInput('');
    setIsSending(true);
    try {
      const moderation = await moderateMessage({ text });
      if (!moderation.isSafe) {
        setIsBlocked(true);
        localStorage.setItem('stayonbeat_spectator_blocked', 'true');
        await logViolation(text, moderation.reason || "Dissonance detected", 'AI_FLAGGED');
        toast({ variant: "destructive", title: t.violationTitle, description: t.violationDesc });
        setIsSending(false);
        return;
      }
      addDocumentNonBlocking(collection(firestore, 'partyCircle'), {
        senderId: user.uid, senderAlias: natureName, text: moderation.filteredText || text, createdAt: serverTimestamp(),
      });
    } catch (error) {
      toast({ variant: "destructive", title: t.errorTitle, description: t.errorDesc });
    } finally {
      setIsSending(false);
    }
  };

  const startDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Not Supported", description: "Voice not available" });
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = lang === 'de' ? 'de-DE' : 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(prev => (prev + ' ' + transcript).trim());
    };
    recognition.start();
  };

  const handleEnterChat = () => {
    setIsEntering(true);
    localStorage.setItem('stayonbeat_spectator_agreed', 'true');
    setTimeout(() => { setHasAgreedToRules(true); setIsEntering(false); }, 800);
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 bg-black font-headline overflow-hidden">
        <GuardianLogo size={80} className="animate-pulse" />
        <div className="space-y-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">{t.blockedTitle}</h2>
          <p className="text-white/40 text-base font-bold leading-relaxed uppercase tracking-widest">{t.blockedDesc}</p>
        </div>
      </div>
    );
  }

  if (!hasAgreedToRules) {
    return (
      <div className="flex flex-col h-full bg-black font-headline overflow-hidden">
        <ScrollArea className="flex-1">
          <div className="p-10 flex flex-col items-center justify-center text-center space-y-12 min-h-[70vh]">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/30 shadow-2xl">
              <Users2 size={48} className="text-primary" />
            </div>
            <div className="space-y-3">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{t.title}</h2>
              <p className="text-base font-bold text-white/40 uppercase tracking-widest leading-relaxed italic">{t.rulesHeader}</p>
            </div>
            <div className="w-full space-y-4 text-left max-w-sm">
              {t.rules.map((rule, idx) => (
                <div key={idx} className="p-5 bg-white/[0.02] rounded-[1.5rem] border border-white/10 flex items-center gap-5">
                  <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(27,77,62,0.8)]" />
                  <span className="text-sm font-bold uppercase text-white/80 leading-tight">{rule}</span>
                </div>
              ))}
            </div>
            <div className="pt-4 w-full pb-10">
              <button 
                onClick={handleEnterChat}
                disabled={isEntering}
                className="w-full bg-[#1b4d3e] text-white h-24 rounded-full font-black uppercase tracking-[0.2em] shadow-[0_0_50px_rgba(27,77,62,0.3)] active:scale-95 transition-all flex items-center justify-center px-10 border-2 border-primary/20"
              >
                {isEntering ? <Loader2 className="animate-spin w-8 h-8" /> : <span className="text-xl">{t.enterBtn}</span>}
              </button>
            </div>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden">
      <div className="bg-primary/10 border-b border-primary/30 px-8 py-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <GuardianLogo size={24} />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{t.guardianNote}</span>
        </div>
        <CircleDot size={16} className="text-primary animate-pulse" />
      </div>

      <div className="px-8 py-10 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/30">
            <Users2 size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">{t.title}</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mt-1.5">{t.sub}</p>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 px-8 py-8 touch-pan-y" ref={scrollRef}>
        <div className="space-y-8 max-w-2xl mx-auto pb-10">
          {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-700", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-4 px-4">
                  <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.4em]">{isMe ? 'YOU' : msg.senderAlias.toUpperCase()}</span>
                  {!isMe && <button onClick={() => logViolation(msg.text, `Reported by Heart from ${msg.senderAlias}`, 'USER_REPORT')} className="text-white/10 hover:text-red-500 transition-colors"><Flag size={14} /></button>}
                </div>
                <div className={cn("p-7 rounded-[3rem] text-base font-bold leading-relaxed max-w-[85%] shadow-xl border transition-all duration-500", isMe ? "bg-primary text-white border-primary/40 rounded-tr-none" : "bg-white/[0.03] text-white/80 border-white/5 rounded-tl-none")}>{msg.text}</div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-8 py-12 bg-black border-t border-white/5 shrink-0 pb-safe">
        <div className="relative flex items-center max-w-2xl mx-auto gap-5">
          <div className="relative flex-1">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} placeholder={isListening ? t.listening : t.placeholder} disabled={isSending} className="w-full bg-white/[0.03] border-2 border-white/10 rounded-full py-7 px-10 pr-20 text-lg font-bold focus:border-primary transition-all outline-none disabled:opacity-50 text-white shadow-inner" />
            <button onClick={startDictation} className={cn("absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all duration-500", isListening ? "bg-primary text-white animate-pulse" : "text-white/20 hover:text-primary")}>{isListening ? <MicOff size={28} /> : <Mic size={28} />}</button>
          </div>
          <button onClick={handleSend} disabled={!input.trim() || isSending} className="p-7 bg-[#1b4d3e] text-white rounded-full disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-2xl border-2 border-primary/30">{isSending ? <Loader2 className="w-8 h-8 animate-spin" /> : <Send className="w-8 h-8" />}</button>
        </div>
        <p className="text-center text-[11px] font-black text-white uppercase tracking-[0.6em] mt-8 shining-white">
          {t.shiningFooter}
        </p>
      </div>
    </div>
  );
}
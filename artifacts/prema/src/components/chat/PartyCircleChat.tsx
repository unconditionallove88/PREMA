
import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Loader2, Flag, Users2, CircleDot, Mic, MicOff } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { moderateMessage } from '@/ai/flows/moderate-message';
import { GuardianLogo } from '@/components/ui/guardian-logo';

/**
 * @fileOverview Open Circle — collective care and community kindness.
 */

const CONTENT = {
  en: {
    guardianNote: "Pulse Guardian present",
    title: "Open",
    sub: "Community care circle",
    rulesHeader: "A shared space rooted in kindness and presence",
    rules: [
      "Unconditional kindness for all",
      "No promotion of substances",
      "Respect each other's anonymity",
      "Speak only from presence",
      "Unity is the focus"
    ],
    enterBtn: "Enter the circle",
    placeholder: "Share kindness...",
    footer: "Grounded in presence",
    blockedTitle: "Circle rest",
    blockedDesc: "The Pulse Guardian has gently paused this connection to restore harmony within the circle",
    violationTitle: "Pulse Guardian: Note",
    violationDesc: "The session is resting",
    errorTitle: "Connection error",
    errorDesc: "Message not sent",
    listening: "Listening..."
  },
  de: {
    guardianNote: "Pulse Guardian präsent",
    title: "Offen",
    sub: "Kreis der Fürsorge",
    rulesHeader: "Ein geteilter Raum der Freundlichkeit und Präsenz",
    rules: [
      "Bedingungslose Freundlichkeit für alle",
      "Keine Bewerbung von Substanzen",
      "Respektiere die Anonymität",
      "Spreche nur aus Präsenz",
      "Einheit ist der Fokus"
    ],
    enterBtn: "Dem Kreis beitreten",
    placeholder: "Freundlichkeit teilen...",
    footer: "Geerdet in Präsenz",
    blockedTitle: "Kreis-Pause",
    blockedDesc: "Der Pulse Guardian hat diese Verbindung sanft pausiert, um die Harmonie wiederherzustellen",
    violationTitle: "Pulse Guardian: Hinweis",
    violationDesc: "Die Sitzung ruht",
    errorTitle: "Verbindungsfehler",
    errorDesc: "Nachricht nicht gesendet",
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
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
    if (localStorage.getItem('prema_spectator_agreed') === 'true') setHasAgreedToRules(true);
    if (localStorage.getItem('prema_spectator_blocked') === 'true') setIsBlocked(true);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const chatQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'partyCircle'), orderBy('createdAt', 'asc'), limit(50));
  }, [firestore]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
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
        localStorage.setItem('prema_spectator_blocked', 'true');
        await logViolation(text, moderation.reason || "Dissonance detected", 'AI_FLAGGED');
        toast({ variant: "destructive", title: t.violationTitle, description: t.violationDesc });
        setIsSending(false);
        return;
      }
      addDocumentNonBlocking(collection(firestore, 'partyCircle'), {
        senderId: user.uid, senderAlias: natureName, text: moderation.filteredText || text, createdAt: serverTimestamp(),
      });
    } catch {
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
    localStorage.setItem('prema_spectator_agreed', 'true');
    setTimeout(() => { setHasAgreedToRules(true); setIsEntering(false); }, 600);
  };

  if (isBlocked) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-10 text-center space-y-8 bg-card font-headline">
        <GuardianLogo size={48} className="animate-pulse opacity-60" />
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-foreground tracking-tight">{t.blockedTitle}</h2>
          <p className="text-sm text-muted-foreground font-light leading-relaxed max-w-xs mx-auto">{t.blockedDesc}</p>
        </div>
      </div>
    );
  }

  if (!hasAgreedToRules) {
    return (
      <div className="flex flex-col h-full bg-card font-headline overflow-hidden relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <ScrollArea className="flex-1">
          <div className="px-8 py-14 flex flex-col items-center justify-center text-center space-y-8 min-h-[70vh] relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
              <Users2 size={28} className="text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.title}</h2>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60">{t.sub}</p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-light max-w-xs mx-auto">{t.rulesHeader}</p>
            </div>

            <div className="w-full space-y-1 text-left max-w-xs">
              {t.rules.map((rule, idx) => (
                <div key={idx} className="flex items-center gap-3 px-4 py-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary opacity-50 shrink-0" />
                  <span className="text-sm font-light text-foreground/80 leading-snug">{rule}</span>
                </div>
              ))}
            </div>

            <button
              onClick={handleEnterChat}
              disabled={isEntering}
              className="w-full max-w-xs h-12 bg-primary text-primary-foreground rounded-full font-semibold text-sm tracking-wide active:scale-95 transition-all flex items-center justify-center"
            >
              {isEntering ? <Loader2 className="animate-spin w-4 h-4" /> : t.enterBtn}
            </button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card font-body overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

      {/* Guardian bar */}
      <div className="bg-primary/8 px-5 py-2 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-2.5">
          <GuardianLogo size={16} />
          <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-primary/70">{t.guardianNote}</span>
        </div>
        <CircleDot size={12} className="text-primary animate-pulse" />
      </div>

      {/* Header */}
      <div className="px-5 py-3 flex items-center gap-3 shrink-0 relative z-10">
        <div className="w-8 h-8 bg-primary/10 rounded-xl flex items-center justify-center">
          <Users2 size={16} className="text-primary" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-foreground tracking-tight">{t.title}</h2>
          <p className="text-[9px] text-primary/70 font-medium uppercase tracking-[0.3em]">{t.sub}</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-3 touch-pan-y" ref={scrollRef}>
        <div className="space-y-4 max-w-2xl mx-auto pb-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
            </div>
          )}
          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-500", isMe ? "items-end" : "items-start")}>
                <div className="flex items-center gap-2 px-3">
                  <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-widest">
                    {isMe ? (lang === 'de' ? 'Du' : 'You') : msg.senderAlias}
                  </span>
                  {!isMe && (
                    <button
                      onClick={() => logViolation(msg.text, `Reported by ${msg.senderAlias}`, 'USER_REPORT')}
                      className="text-muted-foreground/20 hover:text-red-400 transition-colors"
                    >
                      <Flag size={11} />
                    </button>
                  )}
                </div>
                <div className={cn(
                  "px-4 py-2.5 rounded-2xl text-sm font-light leading-relaxed max-w-[80%]",
                  isMe
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card/80 text-foreground/90 border border-border/20 rounded-tl-sm"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="px-5 py-4 shrink-0 pb-safe relative z-10">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? t.listening : t.placeholder}
              disabled={isSending}
              className="w-full bg-background/60 border border-border/30 rounded-full py-3 px-5 pr-12 text-sm font-light focus:border-primary transition-all outline-none disabled:opacity-50 text-foreground"
            />
            <button
              onClick={startDictation}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all duration-300",
                isListening ? "bg-primary text-primary-foreground animate-pulse" : "text-muted-foreground/40 hover:text-primary"
              )}
            >
              {isListening ? <MicOff size={15} /> : <Mic size={15} />}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isSending}
            className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            {isSending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
          </button>
        </div>
        <p className="text-center text-[9px] font-medium uppercase tracking-[0.4em] text-muted-foreground/30 mt-3">
          {t.footer}
        </p>
      </div>
    </div>
  );
}

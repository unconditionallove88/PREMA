
import { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Lock, Users, HeartHandshake, Mic, MicOff, Volume2 } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { playHeartbeat } from '@/lib/intention';

/**
 * @fileOverview Private Circle — sacred communication for the inner circle.
 */

const CONTENT = {
  en: {
    title: "Private",
    sub: "Your inner circle",
    desc: "A tender space for those who hold your heart from afar — speak with truth and tenderness",
    items: [
      { title: "Sacred bond", sub: "Shared only with your inner circle", icon: Lock },
      { title: "Mutual holding", sub: "Unity through shared presence", icon: HeartHandshake }
    ],
    button: "Enter the circle",
    createTitle: "Name the bond",
    inviteTitle: "Invite by email",
    createBtn: "Seal bond",
    cancelBtn: "Cancel",
    placeholder: "Speak from the heart...",
    successTitle: "Bond initialized",
    footer: "Created in harmony",
    listening: "Listening..."
  },
  de: {
    title: "Privat",
    sub: "Dein innerer Kreis",
    desc: "Ein zarter Raum für die, die dein Herz aus der Ferne halten — sprich mit Wahrheit und Zartheit",
    items: [
      { title: "Heiliges Band", sub: "Nur mit deinem inneren Kreis", icon: Lock },
      { title: "Gegenseitiges Halten", sub: "Einheit durch geteilte Präsenz", icon: HeartHandshake }
    ],
    button: "Den Kreis betreten",
    createTitle: "Benenne das Band",
    inviteTitle: "Per E-Mail einladen",
    createBtn: "Band versiegeln",
    cancelBtn: "Abbrechen",
    placeholder: "Vom Herzen sprechen...",
    successTitle: "Band initialisiert",
    footer: "In Harmonie erschaffen",
    listening: "Höre zu..."
  }
};

export function LoveCircleChat() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [input, setInput] = useState('');
  const [hasAgreement, setHasAgreement] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const handleVoiceIntention = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const text = `${t.title}. ${t.sub}. ${t.desc}`;
      const { audioDataUri } = await textToSpeech({ text, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const startDictation = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({ variant: "destructive", title: "Not Supported", description: "Your browser does not support voice dictation." });
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

  const chatQuery = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return query(
      collection(firestore, 'users', user.uid, 'loveCircleMessages'),
      orderBy('createdAt', 'asc'),
      limit(50)
    );
  }, [firestore, user?.uid]);

  const { data: messages, isLoading } = useCollection(chatQuery);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !user || !firestore) return;
    const text = input.trim();
    setInput('');
    addDocumentNonBlocking(collection(firestore, 'users', user.uid, 'loveCircleMessages'), {
      senderId: user.uid,
      senderName: user.displayName || 'Heart',
      text,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !firestore || !user) return;
    try {
      await addDocumentNonBlocking(collection(firestore, 'chatGroups'), {
        name: groupName,
        members: [user.uid],
        pendingInvites: inviteEmail ? [inviteEmail] : [],
        createdAt: serverTimestamp()
      });
      toast({ title: t.successTitle });
      setShowCreateGroup(false);
      setGroupName('');
      setInviteEmail('');
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not create bond" });
    }
  };

  if (!hasAgreement) {
    return (
      <div className="flex flex-col h-full bg-card font-headline overflow-hidden relative">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[60%] bg-primary/8 blur-[100px] rounded-full pointer-events-none" />

        <ScrollArea className="flex-1 touch-pan-y">
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-8 py-14 text-center space-y-10 relative z-10">

            <div className="relative">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center shadow-lg">
                <HeartHandshake size={36} className="text-primary" />
              </div>
              <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 pointer-events-none" />
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">{t.title}</h2>
              <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-primary/60">{t.sub}</p>
              <p className="text-sm text-muted-foreground/80 leading-relaxed font-light max-w-xs mx-auto">
                {t.desc}
              </p>
            </div>

            <div className="space-y-2 w-full max-w-xs">
              {t.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 rounded-2xl">
                  <item.icon size={18} className="text-primary shrink-0 opacity-70" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground/90">{item.title}</p>
                    <p className="text-[10px] text-muted-foreground/60 font-light">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 w-full max-w-xs">
              <button
                onClick={() => { playHeartbeat(); setHasAgreement(true); }}
                className="flex-1 h-12 bg-primary text-primary-foreground rounded-full font-semibold text-sm tracking-wide active:scale-95 transition-all"
              >
                {t.button}
              </button>
              <button
                onClick={handleVoiceIntention}
                disabled={isSpeaking}
                className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center hover:bg-primary/20 transition-all disabled:opacity-30"
              >
                {isSpeaking ? <Loader2 size={16} className="animate-spin text-primary" /> : <Volume2 size={16} className="text-primary" />}
              </button>
            </div>

          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card font-body overflow-hidden pb-safe relative">
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-primary/8 to-transparent pointer-events-none" />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between shrink-0 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center">
            <HeartHandshake size={18} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground tracking-tight">{t.title}</h2>
            <p className="text-[9px] text-primary/70 font-medium uppercase tracking-[0.3em]">{t.sub}</p>
          </div>
        </div>
        <button
          onClick={() => setShowCreateGroup(!showCreateGroup)}
          className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-all"
        >
          <Users size={16} className="text-primary" />
        </button>
      </div>

      {showCreateGroup && (
        <div className="px-5 pb-4 animate-in slide-in-from-top-2 shrink-0 relative z-10">
          <form onSubmit={handleCreateGroup} className="space-y-2">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t.createTitle}
              className="w-full bg-background/60 border border-border/30 px-4 py-2.5 rounded-xl text-sm text-foreground font-medium focus:border-primary outline-none transition-all"
              required
            />
            <input
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t.inviteTitle}
              type="email"
              className="w-full bg-background/60 border border-border/30 px-4 py-2.5 rounded-xl text-sm text-foreground font-medium focus:border-primary outline-none transition-all"
            />
            <div className="flex gap-2 pt-1">
              <button type="submit" className="flex-1 h-9 bg-primary text-primary-foreground rounded-xl text-xs font-semibold active:scale-95 transition-all">{t.createBtn}</button>
              <button type="button" onClick={() => setShowCreateGroup(false)} className="flex-1 h-9 bg-card/60 text-muted-foreground rounded-xl text-xs font-medium border border-border/20">{t.cancelBtn}</button>
            </div>
          </form>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 px-5 py-3 touch-pan-y" ref={scrollRef}>
        <div className="space-y-4 max-w-2xl mx-auto pb-6">
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 text-primary/40 animate-spin" />
            </div>
          )}

          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-16 space-y-3 opacity-30">
              <HeartHandshake className="w-10 h-10 mx-auto text-primary" />
              <p className="text-xs text-muted-foreground font-light tracking-wide">
                {lang === 'de' ? 'Noch keine Nachrichten' : 'No messages yet'}
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-1 animate-in slide-in-from-bottom-2 duration-500", isMe ? "items-end" : "items-start")}>
                <span className="text-[9px] font-medium text-muted-foreground/50 uppercase tracking-widest px-3">
                  {isMe ? (lang === 'de' ? 'Du' : 'You') : msg.senderName}
                </span>
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
      <div className="px-5 py-4 shrink-0 relative z-10">
        <div className="flex items-center gap-2 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? t.listening : t.placeholder}
              className="w-full bg-background/60 border border-border/30 rounded-full py-3 px-5 pr-12 text-sm font-light focus:border-primary transition-all outline-none text-foreground"
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
            disabled={!input.trim()}
            className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            <Send size={16} />
          </button>
        </div>
        <p className="text-center text-[9px] font-medium uppercase tracking-[0.4em] text-muted-foreground/30 mt-3">
          {t.footer}
        </p>
      </div>
    </div>
  );
}

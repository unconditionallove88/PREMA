'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Heart, Loader2, Lock, Users, HeartHandshake, Sparkles, Volume2, Mic, MicOff } from 'lucide-react';
import { useFirestore, useUser, useCollection, useMemoFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, query, orderBy, limit, serverTimestamp } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview The Holders (Sacred Communication).
 * Simplified for heart-touching connection using Golden Ratio harmony.
 */

const CONTENT = {
  en: {
    title: "The Holders",
    sub: "Sacred Bond Resonance",
    desc: "A private space for those who hold the heart from afar Connect with truth and tenderness",
    agreementTitle: "Unity Through Presence",
    agreementSub: "Enter the private sanctuary",
    items: [
      { title: "Sacred Bond Resonance", sub: "Shared with the inner circle", icon: Lock },
      { title: "Mutual Holding", sub: "Unity through shared truth", icon: HeartHandshake }
    ],
    button: "Enter the sanctuary",
    createTitle: "NAME THE BOND",
    inviteTitle: "INVITE BY EMAIL",
    createBtn: "Seal Bond",
    cancelBtn: "Cancel",
    placeholder: "Speak from the heart...",
    resonanceStart: "Start a resonance with the holders",
    successTitle: "Bond Initialized",
    successMsg: (name: string) => `The bond of care "${name}" has been created Waiting for resonance`,
    footer: "Created in harmony",
    listening: "Listening..."
  },
  de: {
    title: "Die Holder",
    sub: "Heiliges Band Resonanz",
    desc: "Ein privater Raum für diejenigen, die das Herz aus der Ferne halten Verbinde dich mit Wahrheit heute",
    agreementTitle: "Einheit durch Präsenz",
    agreementSub: "Das private Sanctuary betreten",
    items: [
      { title: "Heiliges Band", sub: "Nur mit dem inneren Kreis", icon: Lock },
      { title: "Gegenseitiges Halten", sub: "Einheit durch geteilte Wahrheit", icon: HeartHandshake }
    ],
    button: "Sancutary jetzt betreten",
    createTitle: "BENENNE DAS BAND",
    inviteTitle: "PER E-MAIL EINLADEN",
    createBtn: "Band versiegeln",
    cancelBtn: "Abbrechen",
    placeholder: "Vom Herzen sprechen heute...",
    resonanceStart: "Starte eine Resonanz mit den Holdern",
    successTitle: "Band initialisiert",
    successMsg: (name: string) => `Das Band der Fürsorge "${name}" wurde erstellt Warte auf Resonanz`,
    footer: "In Harmonie erschaffen heute hier",
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
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const handleVoiceResonance = async () => {
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
      senderName: user.displayName || 'Soul',
      text: text,
      createdAt: serverTimestamp(),
    });
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !firestore || !user) return;
    try {
      const groupsRef = collection(firestore, 'chatGroups');
      await addDocumentNonBlocking(groupsRef, {
        name: groupName,
        members: [user.uid],
        pendingInvites: inviteEmail ? [inviteEmail] : [],
        createdAt: serverTimestamp()
      });
      toast({ title: t.successTitle, description: t.successMsg(groupName) });
      setShowCreateGroup(false);
      setGroupName('');
      setInviteEmail('');
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Could not create bond" });
    }
  };

  if (!hasAgreement) {
    return (
      <div className="flex flex-col h-full bg-black font-headline overflow-hidden">
        <ScrollArea className="flex-1 touch-pan-y">
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-10 text-center space-y-16">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 blur-[100px] rounded-full scale-150" />
              <div className="w-40 h-40 bg-primary/5 rounded-full flex items-center justify-center border-2 border-primary/20 relative z-10 shadow-2xl">
                <HeartHandshake size={64} className="text-primary group-hover:scale-110 transition-transform duration-700" />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <h2 className="text-5xl font-black uppercase tracking-tighter text-white leading-none">{t.title}</h2>
                <button onClick={handleVoiceResonance} disabled={isSpeaking} className="p-3 bg-white/5 rounded-full border border-white/10 hover:border-primary transition-all disabled:opacity-30">
                  {isSpeaking ? <Loader2 className="w-6 h-6 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <p className="text-xl font-bold text-white/40 leading-tight max-sm mx-auto uppercase tracking-widest italic">
                {t.desc}
              </p>
            </div>

            <div className="space-y-4 w-full max-w-sm">
              {t.items.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/10 rounded-[2.5rem] text-left transition-all hover:bg-white/[0.04] group">
                  <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:border-primary/40 transition-all">
                    <item.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-base font-black uppercase tracking-tight text-white">{item.title}</p>
                    <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => { playHeartbeat(); setHasAgreement(true); }}
              className="w-full max-w-sm h-24 bg-[#1b4d3e] text-white text-xl font-black uppercase tracking-widest active:scale-95 transition-all shadow-[0_0_50px_rgba(27,77,62,0.3)] border-2 border-primary/20 rounded-full flex items-center justify-center mb-10"
            >
              {t.button}
            </button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-black font-body overflow-hidden pb-safe">
      <div className="px-8 py-10 border-b border-white/5 bg-black/80 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center border border-primary/20 shadow-lg">
            <HeartHandshake size={32} className="text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white leading-none">{t.title}</h2>
            <p className="text-[10px] text-primary font-black uppercase tracking-[0.4em] mt-1.5">{t.sub}</p>
          </div>
        </div>
        <button 
          onClick={() => setShowCreateGroup(!showCreateGroup)}
          className="p-5 bg-primary/10 text-primary border border-primary/20 rounded-2xl hover:bg-primary/20 transition-all active:scale-95"
        >
          <Users size={24} />
        </button>
      </div>

      {showCreateGroup && (
        <div className="p-8 bg-white/[0.02] border-b border-white/5 animate-in slide-in-from-top-4 shrink-0">
          <form onSubmit={handleCreateGroup} className="space-y-4 max-w-md mx-auto">
            <input 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder={t.createTitle}
              className="w-full bg-black border-2 border-white/10 p-6 rounded-2xl text-white font-black uppercase text-sm focus:border-primary outline-none transition-all shadow-inner"
              required
            />
            <input 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder={t.inviteTitle}
              type="email"
              className="w-full bg-black border-2 border-white/10 p-6 rounded-2xl text-white font-black uppercase text-sm focus:border-primary outline-none transition-all shadow-inner"
            />
            <div className="flex gap-4 pt-2">
              <button type="submit" className="flex-1 bg-primary text-white h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all">{t.createBtn}</button>
              <button type="button" onClick={() => setShowCreateGroup(false)} className="flex-1 bg-white/5 text-white/40 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/5"> {t.cancelBtn} </button>
            </div>
          </form>
        </div>
      )}

      <ScrollArea className="flex-1 px-8 py-10 touch-pan-y" ref={scrollRef}>
        <div className="space-y-10 max-w-2xl mx-auto pb-10">
          {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 text-primary animate-spin" /></div>}
          
          {messages?.length === 0 && !isLoading && (
            <div className="text-center py-24 opacity-20 space-y-8 animate-pulse">
              <HeartHandshake className="w-20 h-20 mx-auto text-primary" />
              <p className="text-sm uppercase font-black tracking-[0.5em] leading-relaxed text-white max-w-[250px] mx-auto">
                {t.resonanceStart}
              </p>
            </div>
          )}

          {messages?.map((msg) => {
            const isMe = msg.senderId === user?.uid;
            return (
              <div key={msg.id} className={cn("flex flex-col gap-3 animate-in slide-in-from-bottom-4 duration-700", isMe ? "items-end" : "items-start")}>
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em] px-4">
                  {isMe ? 'YOU' : msg.senderName.toUpperCase()}
                </span>
                <div className={cn(
                  "p-8 rounded-[3.5rem] text-base font-bold leading-relaxed max-w-[85%] shadow-2xl border transition-all duration-500",
                  isMe 
                    ? "bg-primary text-white border-primary/40 rounded-tr-none" 
                    : "bg-white/[0.03] text-white/90 border-white/10 rounded-tl-none shadow-inner"
                )}>
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <div className="px-8 py-12 bg-black border-t border-white/5 shrink-0">
        <div className="relative flex items-center max-w-2xl mx-auto gap-5">
          <div className="relative flex-1">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? t.listening : t.placeholder}
              className="w-full bg-white/[0.03] border-2 border-white/10 rounded-full py-7 px-10 pr-20 text-lg font-bold focus:border-primary transition-all outline-none text-white shadow-inner"
            />
            <button 
              onClick={startDictation}
              className={cn(
                "absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-2xl transition-all duration-500",
                isListening ? "bg-primary text-white animate-pulse shadow-[0_0_20px_rgba(27,77,62,0.4)]" : "text-white/20 hover:text-primary"
              )}
            >
              {isListening ? <MicOff size={28} /> : <Mic size={28} />}
            </button>
          </div>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-7 bg-[#1b4d3e] text-white rounded-full disabled:opacity-20 transition-all hover:scale-105 active:scale-95 shadow-2xl border-2 border-primary/30"
          >
            <Send className="w-8 h-8" />
          </button>
        </div>
        <div className="mt-8 flex flex-col items-center gap-3">
          <p className="text-[11px] font-black uppercase tracking-[0.6em] shining-white">
            {t.footer}
          </p>
          <div className="flex items-center gap-2 opacity-30">
            <Lock size={10} className="text-primary" />
            <span className="text-[8px] font-black uppercase tracking-widest">Resonance Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}


'use client';

import { useState, useEffect } from 'react';
import { useFirestore, useUser, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { PenLine, Send, Loader2, ShieldCheck, Volume2, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Love Letter Component.
 * Features: Voice dictation for emotional ease.
 */

const CONTENT = {
  en: {
    title: "Love Letter",
    sub: "To your future self",
    prompt: "While you feel this light today write a short note to the you of tomorrow What would you like to tell yourself when things feel heavy",
    placeholder: "Dear me remember that you are loved",
    button: "Seal with Love",
    sealing: "Sealing...",
    successTitle: "Letter Sealed",
    successMsg: "We will keep this safe When you need a reminder of your own strength we will bring it back to you",
    return: "Return to Home",
    footer: "End-to-End Encrypted Note",
    affirmation: "I respect myself",
    listening: "Listening..."
  },
  de: {
    title: "Liebesbrief",
    sub: "An dein zukünftiges Ich",
    prompt: "Während du dieses Licht spürst schreibe eine kurze Notiz an dein Ich von morgen Was möchtest du dir sagen wenn sich die Dinge schwer anfühlen",
    placeholder: "Liebes Ich erinnere dich daran dass du geliebt wirst",
    button: "Mit Liebe versiegeln",
    sealing: "Wird versiegelt...",
    successTitle: "Brief versiegelt",
    successMsg: "Wir werden dies sicher aufbewahren Wenn du eine Erinnerung an deine eigene Stärke brauchst bringen wir sie dir zurück",
    return: "Zurück nach Hause",
    footer: "Ende-zu-Ende verschlüsselte Notiz",
    affirmation: "Ich respektiere mich selbst",
    listening: "Höre zu..."
  }
};

export function LoveLetter({ onComplete }: { onComplete?: () => void }) {
  const { toast } = useToast();
  const firestore = useFirestore();
  const { user } = useUser();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const handleSend = () => {
    if (!message.trim() || !user || !firestore) return;
    setIsSending(true);

    const lettersRef = collection(firestore, 'users', user.uid, 'loveLetters');
    
    addDocumentNonBlocking(lettersRef, {
      content: message,
      createdAt: serverTimestamp(),
      moodAtCreation: 'radiant',
      isRead: false,
    });

    setTimeout(() => {
      setIsSent(true);
      setIsSending(false);
    }, 1500);
  };

  const handleVoice = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const { audioDataUri } = await textToSpeech({ text: t.successMsg, lang: lang as any });
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
      setMessage(prev => (prev + ' ' + transcript).trim());
    };

    recognition.start();
  };

  if (isSent) {
    return (
      <div className="p-10 text-center animate-in zoom-in duration-500 font-headline flex flex-col items-center gap-8 bg-card min-h-[400px] justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full animate-pulse" />
          <div className="w-24 h-24 bg-secondary/10 rounded-full flex items-center justify-center border-2 border-secondary/30 relative z-10">
            <ShieldCheck className="text-secondary w-12 h-12" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-3">
            <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">{t.successTitle}</h3>
            <button onClick={handleVoice} disabled={isSpeaking} className="p-2 bg-card/5 rounded-full border border-border/10 hover:border-primary transition-all disabled:opacity-30">
              {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
            </button>
          </div>
          <p className="text-foreground/60 text-sm font-bold leading-tight max-xs mx-auto uppercase tracking-widest italic">
            "{t.affirmation}"
          </p>
        </div>
        <button 
          onClick={onComplete} 
          className="mt-4 text-[10px] font-black uppercase text-secondary tracking-[0.4em] hover:text-foreground transition-colors"
        >
          {t.return}
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 font-headline flex flex-col h-full bg-card min-h-[500px]">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-4 bg-secondary/20 rounded-2xl border border-secondary/30">
            <PenLine size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tighter text-foreground">{t.title}</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">{t.sub}</p>
          </div>
        </div>
        <button 
          onClick={startDictation}
          className={cn(
            "p-4 rounded-2xl transition-all",
            isListening ? "bg-secondary text-black animate-pulse shadow-lg" : "bg-card/5 text-foreground/20 hover:text-secondary"
          )}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>
      </div>

      <p className="text-xs text-foreground/40 mb-6 leading-relaxed font-bold uppercase tracking-widest">
        {t.prompt}
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isListening ? t.listening : t.placeholder}
        className="w-full flex-1 p-6 bg-card/5 border-2 border-border/10 rounded-[2rem] focus:border-secondary outline-none text-base text-foreground placeholder:text-foreground/10 resize-none transition-all mb-8 font-bold"
      />

      <div className="space-y-4">
        <button
          onClick={handleSend}
          disabled={!message.trim() || isSending}
          className={cn(
            "w-full h-20 rounded-full font-black text-xl uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-4",
            !message.trim() || isSending 
              ? "bg-card/5 text-foreground/10 border-2 border-border/5 cursor-not-allowed"
              : "bg-primary text-foreground neon-glow active:scale-95"
          )}
        >
          {isSending ? <Loader2 className="w-6 h-6 animate-spin" /> : <>{t.button} <Send size={24} /></>}
        </button>
        <p className="text-center text-[8px] font-black text-foreground/20 uppercase tracking-[0.4em]">{t.footer}</p>
      </div>
    </div>
  );
}

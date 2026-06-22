
import { useState, useEffect } from 'react';
import { ArrowLeft, Lock, Heart } from 'lucide-react';
import { LoveCircleChat } from './LoveCircleChat';
import { PartyCircleChat } from './PartyCircleChat';
import { cn } from '@/lib/utils';
import { playHeartbeat } from '@/lib/intention';

type ChatMode = null | 'private' | 'open';

const CONTENT = {
  en: {
    title: "Love Chat",
    sub: "Choose your circle",
    private: "Private",
    privateSub: "Your inner circle",
    privateDesc: "A sacred space for those who hold your heart",
    open: "Open",
    openSub: "Community care",
    openDesc: "A shared circle of kindness, guarded with love",
  },
  de: {
    title: "Wort der Liebe",
    sub: "Wähle deinen Kreis",
    private: "Privat",
    privateSub: "Dein innerer Kreis",
    privateDesc: "Ein heiliger Raum für die, die dein Herz halten",
    open: "Offen",
    openSub: "Gemeinschaftsfürsorge",
    openDesc: "Ein geteilter Kreis der Freundlichkeit, bewacht mit Liebe",
  }
};

export function LoveChatHub() {
  const [mode, setMode] = useState<ChatMode>(null);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const saved = (localStorage.getItem('prema_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(saved)) setLang(saved);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  if (mode === 'private') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <button
          onClick={() => setMode(null)}
          className="absolute top-5 left-5 z-20 p-2.5 rounded-full bg-card/60 backdrop-blur-md border border-border/10 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <LoveCircleChat />
      </div>
    );
  }

  if (mode === 'open') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <button
          onClick={() => setMode(null)}
          className="absolute top-5 left-5 z-20 p-2.5 rounded-full bg-card/60 backdrop-blur-md border border-border/10 text-muted-foreground hover:text-foreground transition-all"
        >
          <ArrowLeft size={16} />
        </button>
        <PartyCircleChat />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-card font-headline overflow-hidden relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center justify-center h-full px-8 py-12 gap-10 relative z-10">
        <div className="text-center space-y-2">
          <p className="text-[9px] font-semibold uppercase tracking-[0.5em] text-primary/60">{t.sub}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-foreground">{t.title}</h2>
        </div>

        <div className="w-full max-w-sm space-y-4">
          <button
            onClick={() => { playHeartbeat(); setMode('private'); }}
            className="w-full group flex items-center gap-5 p-6 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
              <Lock size={22} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-base font-semibold text-foreground tracking-tight">{t.private}</p>
              <p className="text-[10px] text-primary/70 font-medium uppercase tracking-widest">{t.privateSub}</p>
              <p className="text-[11px] text-muted-foreground font-light mt-1 leading-snug">{t.privateDesc}</p>
            </div>
          </button>

          <button
            onClick={() => { playHeartbeat(); setMode('open'); }}
            className="w-full group flex items-center gap-5 p-6 rounded-3xl bg-primary/5 hover:bg-primary/10 transition-all duration-300 active:scale-[0.98]"
          >
            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-all">
              <Heart size={22} className="text-primary" />
            </div>
            <div className="text-left flex-1">
              <p className="text-base font-semibold text-foreground tracking-tight">{t.open}</p>
              <p className="text-[10px] text-primary/70 font-medium uppercase tracking-widest">{t.openSub}</p>
              <p className="text-[11px] text-muted-foreground font-light mt-1 leading-snug">{t.openDesc}</p>
            </div>
          </button>
        </div>

        <p className="text-[10px] font-medium uppercase tracking-[0.4em] text-muted-foreground/40 text-center">
          {lang === 'de' ? 'in Harmonie erschaffen' : 'created in harmony'}
        </p>
      </div>
    </div>
  );
}

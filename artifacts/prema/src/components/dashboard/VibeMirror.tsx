
import { useState, useEffect } from 'react';
import { useFirestore, useUser, updateDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp } from 'firebase/firestore';
import { ChevronDown, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from '@/components/ui/vibe-icons';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

/**
 * @fileOverview Check Your Mood Component.
 * Full EN, DE support.
 * Updated: Natural icons and earthy colors.
 */

const VIBES = [
  { 
    key: "radiant", 
    label: "Radiant", 
    de: "Strahlend", 
    icon: RadiantIcon, 
    affirmation: {
      en: "Your light is shining bright today",
      de: "Dein Licht leuchtet  hell"
    },
    color: "text-[#FFD700]", 
    bg: "bg-primary/10", 
    border: "border-[#FFD700]/30",
    hex: "#FFD700"
  },
  { 
    key: "harmony", 
    label: "In Harmony", 
    de: "In Harmonie", 
    icon: HarmonyIcon, 
    affirmation: {
      en: "You are aligned with your inner rhythm",
      de: "Du bist im Einklang mit deinem Rhythmus"
    },
    color: "text-[#8FBC8F]", 
    bg: "bg-secondary/10", 
    border: "border-[#8FBC8F]/30",
    hex: "#8FBC8F"
  },
  { 
    key: "calm", 
    label: "Calm", 
    de: "Beruhigt", 
    icon: CalmIcon, 
    affirmation: {
      en: "Everything is exactly as it is supposed to be",
      de: "Alles ist genau so wie es sein soll"
    },
    color: "text-[#87CEEB]", 
    bg: "bg-accent/10", 
    border: "border-[#87CEEB]/30",
    hex: "#87CEEB"
  },
  { 
    key: "hazy", 
    label: "Hazy", 
    de: "Verschwommen", 
    icon: HazyIcon, 
    affirmation: {
      en: "It is okay to rest and be still",
      de: "Es ist okay sich auszuruhen"
    },
    color: "text-[#C0C0C0]", 
    bg: "bg-card/10", 
    border: "border-[#C0C0C0]/30",
    hex: "#C0C0C0"
  },
  { 
    key: "overwhelmed", 
    label: "Overwhelmed", 
    de: "Überwältigt", 
    icon: HeldIcon, 
    affirmation: {
      en: "You are held. Your circle is here",
      de: "Du wirst gehalten Dein Kreis ist hier"
    },
    color: "text-[#E2725B]", 
    bg: "bg-primary/10", 
    border: "border-[#E2725B]/30",
    hex: "#E2725B"
  },
];

interface VibeMirrorProps {
  vibe: { current: string; currentEmoji?: string; currentLabel: string; };
  onVibeUpdate?: (newVibe: any) => void;
}

export function VibeMirror({ vibe, onVibeUpdate }: VibeMirrorProps) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const currentTheme = VIBES.find((v) => v.key === vibe?.current) || VIBES[2];
  const CurrentIcon = currentTheme.icon;

  const handleVibeSelect = (selected: typeof VIBES[0]) => {
    setIsSaving(true);
    if (user && firestore) {
      const userRef = doc(firestore, "users", user.uid);
      const labelMap = { en: selected.label, de: selected.de };
      const newVibeData = {
        current: selected.key,
        currentLabel: labelMap[lang],
        lastUpdated: serverTimestamp(),
      };
      updateDocumentNonBlocking(userRef, { vibe: newVibeData });
      onVibeUpdate?.({ ...newVibeData, lastUpdated: new Date().toISOString() });
      setTimeout(() => { setIsSaving(false); setIsOpen(false); }, 400);
    } else setIsSaving(false);
  };

  const UI = {
    en: { header: "Check Your Mood", sub: "I honor my current state", footer: "Processed locally with love" },
    de: { header: "Check dein Befinden", sub: "Ich achte auf meinen Zustand", footer: "Lokal verarbeitet mit Liebe" }
  }[lang];

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)} 
        className={cn(
          "flex items-center gap-3 px-5 py-3 rounded-full border transition-all active:scale-95 group", 
          currentTheme.border, 
          currentTheme.bg,
          "hover:bg-card/5 shadow-lg"
        )}
      >
        <span className="group-hover:scale-110 transition-transform flex items-center justify-center relative z-10">
          <CurrentIcon size={20} color={currentTheme.hex} className={currentTheme.color} />
        </span>
        <span className={cn("text-[10px] font-black uppercase tracking-widest hidden sm:block relative z-10", currentTheme.color)}>
          {lang === 'de' ? currentTheme.de : currentTheme.label}
        </span>
        <ChevronDown size={12} className={cn("opacity-40 relative z-10", currentTheme.color)} />
      </button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="bg-card border-border/10 p-8 rounded-t-[3.5rem] h-auto max-h-[90vh] overflow-y-auto shadow-[0_-30px_100px_rgba(0,0,0,0.8)]">
          <SheetHeader className="mb-10">
            <div className="w-16 h-16 bg-[hsl(var(--primary))]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[hsl(var(--primary))]/20">
              <Heart className="text-primary" size={32} />
            </div>
            <SheetTitle className="text-center text-2xl font-black uppercase tracking-tighter text-white">
              {UI.header}
            </SheetTitle>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.4em] mt-2 text-primary">
              {UI.sub}
            </p>
          </SheetHeader>
          
          <div className="grid grid-cols-1 gap-3 max-w-md mx-auto pb-10">
            {VIBES.map((v) => {
              const VibeIcon = v.icon;
              const isActive = vibe?.current === v.key;
              const label = lang === 'de' ? v.de : v.label;
              return (
                <button 
                  key={v.key} 
                  onClick={() => handleVibeSelect(v)} 
                  disabled={isSaving} 
                  className={cn(
                    "flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all active:scale-[0.98] text-left group relative overflow-hidden", 
                    isActive ? `bg-card/5 ${v.border} shadow-2xl` : "bg-card border-border/5 hover:border-border/20"
                  )}
                >
                  <div className="w-12 flex justify-center group-hover:scale-110 transition-transform relative z-10">
                    <VibeIcon size={40} color={v.hex} className={isActive ? v.color : "text-white/20"} />
                  </div>
                  <div className="flex flex-col relative z-10">
                    <span className={cn("font-black text-base uppercase tracking-tight", isActive ? v.color : "text-white/60")}>
                      {label}
                    </span>
                    <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest leading-none mt-1">
                      {v.affirmation[lang]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="mt-4 pt-6 border-t border-border/5 max-w-md mx-auto">
            <p className="text-center text-[10px] text-primary font-black uppercase tracking-[0.5em]">
              {UI.footer}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

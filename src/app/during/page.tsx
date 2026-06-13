
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser, useFirestore, useDoc, useMemoFirebase } from "@/firebase";
import { doc } from "firebase/firestore";
import { AiSafetyChat } from "@/components/chat/AiSafetyChat";
import { ArrowLeft, Loader2, Heart, Sparkles, Wind } from "lucide-react";
import { cn } from "@/lib/utils";
import { playHeartbeat } from "@/lib/intention";
import { ScrollArea } from "@/components/ui/scroll-area";

/**
 * @fileOverview Phase: During.
 * Hydration-hardened for localized safety advisor.
 */
export default function DuringPhase() {
  const router = useRouter();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [activeIntake, setActiveIntake] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    const logs = JSON.parse(localStorage.getItem('prema_logs') || '[]');
    if (logs.length > 0) {
      const substanceNames = logs.map((l: any) => l.name).join(', ');
      setActiveIntake(substanceNames);
    }
  }, []);

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile, isLoading: isProfileLoading } = useDoc(userDocRef);

  if (!mounted || isUserLoading || isProfileLoading) {
    return (
      <div className="min-h-screen bg-card flex flex-col items-center justify-center gap-8">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 w-32 h-32 bg-primary/10 blur-[60px] rounded-full" />
          <Heart size={64} fill="hsl(var(--primary))" className="relative z-10 animate-pulse-heart text-primary" style={{ filter: 'blur(12px)' }} />
        </div>
        <Loader2 className="animate-spin text-primary/20" />
      </div>
    );
  }

  const t = {
    en: {
      title: "Safety Advisor",
      phase: "Phase: During",
      affirmation: "I love you",
      ritualTitle: "Breath of Love",
      ritualSub: "Honoring my state",
      ritualBtn: "Open Ritual"
    },
    de: {
      title: "Sicherheits-Berater",
      phase: "Phase: Währenddessen",
      affirmation: "Ich liebe dich",
      ritualTitle: "Atem der Liebe",
      ritualSub: "Meinen Zustand achtend",
      ritualBtn: "Ritual öffnen"
    }
  }[lang] || {
    title: "Safety Advisor",
    phase: "Phase: During",
    affirmation: "I love you",
    ritualTitle: "Breath of Love",
    ritualSub: "Honoring my state",
    ritualBtn: "Open Ritual"
  };

  return (
    <main className="h-screen bg-card flex flex-col overflow-hidden font-headline">
      <header className="px-6 py-8 border-b border-border/5 bg-card/80 backdrop-blur-xl flex items-center gap-4 shrink-0">
        <button onClick={() => router.push("/dashboard")} className="p-3 bg-card/5 rounded-full border border-border/10 hover:border-primary transition-all"><ArrowLeft className="w-5 h-5 text-white/40" /></button>
        <div>
          <h1 className="text-xl font-black uppercase tracking-tighter">
            {t.title}
          </h1>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
            {t.phase}
          </p>
        </div>
      </header>

      {/* Radiant Affirmation Pillar */}
      <div className="bg-primary/10 border-b border-primary/20 py-5 px-10 text-center animate-in fade-in duration-1000 shrink-0">
        <p className="text-[13px] font-black uppercase tracking-[0.05em] text-primary leading-tight max-w-[340px] mx-auto italic">
          "{t.affirmation}"
        </p>
      </div>

      <div className="flex-1 flex flex-col min-h-0">
        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6 max-w-2xl mx-auto">
            {/* Breath of Love Advice Banner */}
            <div className="bg-primary/5 border-2 border-primary/20 rounded-[2rem] p-6 flex flex-col gap-4 animate-in slide-in-from-top-2 duration-700">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
                  <Wind className="text-primary" size={24} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black uppercase tracking-tight">{t.ritualTitle}</h3>
                  <p className="text-[9px] font-black uppercase tracking-widest text-primary/60">{t.ritualSub}</p>
                </div>
              </div>
              <button 
                onClick={() => { playHeartbeat(); router.push('/self-care'); }}
                className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg active:scale-95 transition-all"
              >
                {t.ritualBtn}
              </button>
            </div>

            {/* Chat section */}
            <div className="h-[500px] border border-border/5 rounded-[2rem] overflow-hidden bg-card/40">
              <AiSafetyChat userProfile={profile} currentIntake={activeIntake} />
            </div>
          </div>
        </ScrollArea>
      </div>
    </main>
  );
}

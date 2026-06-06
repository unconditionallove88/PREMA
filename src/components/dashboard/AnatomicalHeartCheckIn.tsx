"use client";

import React, { useState, useEffect } from "react";
import { useUser, useFirestore, updateDocumentNonBlocking, useDoc, useMemoFirebase } from "@/firebase";
import { doc, serverTimestamp, arrayUnion } from "firebase/firestore";
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from "@/components/ui/vibe-icons";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview MoodCheckIn Component.
 * Updated: Natural icons and colors.
 */

const CONTENT = {
  en: { title: "Check Your Mood", sub: "How is your mood today?", state: "Current State", calm: "Calm" },
  de: { title: "Check dein Befinden", sub: "Wie ist dein Befinden heute?", state: "Aktueller Zustand", calm: "Beruhigt" }
};

export function AnatomicalHeartCheckIn() {
  const { user } = useUser();
  const firestore = useFirestore();
  const [lang, setLang] = useState<'en' | 'de'>('en');
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user?.uid) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user?.uid]);

  const { data: profile } = useDoc(userDocRef);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const statuses = [
    { id: "radiant", label: { en: "Radiant", de: "Strahlend" }, color: "#FFD700", icon: RadiantIcon },
    { id: "harmony", label: { en: "Harmony", de: "In Harmonie" }, color: "#8FBC8F", icon: HarmonyIcon },
    { id: "calm", label: { en: "Calm", de: "Beruhigt" }, color: "#87CEEB", icon: CalmIcon },
    { id: "hazy", label: { en: "Hazy", de: "Verschwommen" }, color: "#C0C0C0", icon: HazyIcon },
    { id: "overwhelmed", label: { en: "Held", de: "Überwältigt" }, color: "#E2725B", icon: HeldIcon },
  ];

  useEffect(() => {
    if (profile?.vibe?.current) {
      const current = statuses.find(s => s.id === profile.vibe.current);
      if (current) {
        setStatus(current.label[lang]);
      }
    } else {
      setStatus(CONTENT[lang].calm);
    }
  }, [profile?.vibe?.current, lang]);

  const t = CONTENT[lang];

  const handleSelect = (s: typeof statuses[0]) => {
    const localizedLabel = s.label[lang];
    setStatus(localizedLabel);
    if (!userDocRef) return;

    const checkInRecord = {
      state: localizedLabel,
      timestamp: new Date().toISOString(),
      context: "Dashboard Mood Check-in",
      color: s.color
    };

    updateDocumentNonBlocking(userDocRef, {
      vibe: {
        current: s.id,
        currentLabel: localizedLabel,
        lastUpdated: serverTimestamp(),
        history: arrayUnion(checkInRecord)
      }
    });
  };

  const currentStatus = statuses.find(s => s.label[lang] === status) || statuses[2];

  return (
    <div className="flex flex-col items-center p-8 bg-card rounded-[3rem] border border-border/10 shadow-2xl font-headline w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Heart size={24} className="text-primary fill-[hsl(var(--primary))]/20" />
        <h3 className="text-white font-black text-2xl uppercase tracking-tighter leading-none">{t.title}</h3>
      </div>
      <p className="text-primary text-[10px] mb-8 uppercase tracking-[0.4em] font-black text-center">{t.sub}</p>

      <div className="relative w-64 h-80 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="absolute w-full h-full drop-shadow-[0_0_15px_rgba(16,185,129,0.2)]">
          <path
            d="M100 230C100 230 20 180 20 100C20 60 60 20 100 60C140 20 180 60 180 100C180 180 100 230 100 230Z"
            fill="none"
            stroke={currentStatus.color}
            strokeWidth="2"
            strokeDasharray="5 5"
            className="animate-[spin_20s_linear_infinite] transition-colors duration-1000"
            style={{ opacity: 0.4 }}
          />
        </svg>

        <div className="relative z-10 flex flex-col gap-3 items-center">
          {statuses.map((s) => {
            const VibeIcon = s.icon;
            const localizedLabel = s.label[lang];
            const isActive = status === localizedLabel;
            return (
              <button
                key={s.id}
                onClick={() => handleSelect(s)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-500 border-2 flex items-center gap-3 relative overflow-hidden",
                  isActive 
                    ? "bg-card/10 border-border/40 scale-110 shadow-xl" 
                    : "bg-card/40 text-white/20 border-border/5 hover:border-border/20"
                )}
                style={isActive ? { borderColor: s.color, color: s.color } : {}}
              >
                <VibeIcon size={16} color="currentColor" className="currentColor" />
                <span className="relative z-10">{localizedLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-[10px] text-white/20 uppercase tracking-[0.5em] font-black mb-1">{t.state}</p>
        <p 
          className="font-black text-2xl animate-pulse uppercase tracking-tighter transition-colors duration-1000"
          style={{ color: currentStatus.color }}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

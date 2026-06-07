'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, Heart } from 'lucide-react';
import { useFirestore, useUser, setDocumentNonBlocking } from '@/firebase';
import { doc, serverTimestamp, arrayUnion } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { RadiantIcon, HarmonyIcon, CalmIcon, HazyIcon, HeldIcon } from '@/components/ui/vibe-icons';
import type { OnboardingData } from '@/app/onboarding/page';
import NotificationPrompt from '@/components/dashboard/NotificationPrompt';

/**
 * @fileOverview Mood Check-in Onboarding Step.
 * Updated: Natural icons and colors.
 */

interface Step7VibeCheckProps {
  onComplete: (vibe: string[]) => void;
  onBack?: () => void;
  isOnboarding?: boolean;
  finalOnboardingData?: OnboardingData;
}

const VIBE_OPTIONS = [
  { 
    id: 'radiant', label: 'Radiant', de: 'Strahlend',
    icon: RadiantIcon, description: 'Your light shines', deDescription: 'Dein Licht leuchtet hell',
    color: '#FFD700', activeBorder: 'border-[#FFD700] shadow-[0_0_30px_rgba(255,215,0,0.2)]'
  },
  { 
    id: 'harmony', label: 'In Harmony', de: 'In Harmonie',
    icon: HarmonyIcon, description: 'You are Aligned', deDescription: 'Du bist im Einklang',
    color: '#8FBC8F', activeBorder: 'border-[#8FBC8F] shadow-[0_0_20px_rgba(143,188,143,0.3)]' 
  },
  { 
    id: 'calm', label: 'Calm', de: 'Beruhigt',
    icon: CalmIcon, description: 'Everything is Aligned', deDescription: 'Alles ist im Gleichgewicht',
    color: '#87CEEB', activeBorder: 'border-[#87CEEB] shadow-[0_0_20px_rgba(135,206,235,0.3)]' 
  },
  { 
    id: 'hazy', label: 'Hazy', de: 'Verschwommen',
    icon: HazyIcon, description: 'Rest and Stillness', deDescription: 'Ruhe und Stille jetzt',
    color: '#C0C0C0', activeBorder: 'border-[#C0C0C0] shadow-[0_0_20px_rgba(192,192,192,0.3)]' 
  },
  { 
    id: 'overwhelmed', label: 'Overwhelmed', de: 'Überwältigt',
    icon: HeldIcon, description: 'You are Held', deDescription: 'Du wirst jetzt gehalten',
    color: '#E2725B', activeBorder: 'border-[#E2725B] shadow-[0_0_20px_rgba(226,114,91,0.3)]' 
  },
];

const CONTENT = {
  EN: { header: 'How is your mood today?', success: 'Mood calibrated', sub: 'StayOnBeat sees you I am loved', back: 'BACK', footer: 'Processed locally with love', btn: 'CONTINUE WITH LOVE' },
  DE: { header: 'Wie ist deine Stimmung heute?', success: 'Stimmung kalibriert', sub: 'StayOnBeat sieht dich Ich werde geliebt', back: 'ZURÜCK', footer: 'Lokal verarbeitet mit Liebe', btn: 'MIT LIEBE WEITER' }
};

export function Step7VibeCheck({ onComplete, onBack, isOnboarding = false, finalOnboardingData }: Step7VibeCheckProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(false);
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const firestore = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['EN', 'DE'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;

  const handleConfirm = () => {
    if (!selected || !user || !firestore) return;
    setIsSaving(true);
    const selectedVibe = VIBE_OPTIONS.find(v => v.id === selected);
    const label = lang === 'EN' ? selectedVibe?.label : selectedVibe?.de;

    const payload: any = isOnboarding && finalOnboardingData ? {
      uid: user.uid, name: finalOnboardingData.name, trustLevel: "verified_adult",
      vibe: { current: selected, currentLabel: label, lastUpdated: serverTimestamp(), history: [{ value: selected, recordedAt: new Date().toISOString(), context: "onboarding" }] },
      onboardingStatus: "completed", onboardingCompletedAt: serverTimestamp(),
      goals: finalOnboardingData.goals || [], healthConditions: finalOnboardingData.healthConditions || [], medications: finalOnboardingData.medications || []
    } : { vibe: { current: selected, currentLabel: label, lastUpdated: serverTimestamp(), history: arrayUnion({ value: selected, recordedAt: new Date().toISOString(), context: "session_checkin" }) } };

    setDocumentNonBlocking(doc(firestore, 'users', user.uid), payload, { merge: true });
    setIsSaved(true); setIsSaving(false);
    setTimeout(() => { if (isOnboarding) setShowNotificationPrompt(true); else onComplete([selected!]); }, 1500);
  };

  if (showNotificationPrompt) return <NotificationPrompt onClose={() => onComplete([selected!])} />;

  if (isSaved) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <h2 className="text-4xl font-black uppercase tracking-tighter text-primary mb-4">{t.success}</h2>
        <p className="text-muted-foreground text-lg font-bold max-sm leading-tight">"{ lang === 'EN' ? 'Unconditional love always' : 'Bedingungslose Liebe immerzu hier'}'"</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative pt-safe pb-safe">
      {onBack && <button onClick={onBack} disabled={isSaving} className="absolute top-0 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="mt-12 mb-10"><h2 className="text-[28px] font-black uppercase mb-2 text-foreground leading-none tracking-tighter">{t.header}</h2></div>
      <div className="grid grid-cols-1 gap-3 w-full mb-12 overflow-y-auto max-h-[50vh] pr-2 custom-scrollbar">
        {VIBE_OPTIONS.map((vibe) => {
          const VibeIcon = vibe.icon;
          const isSelected = selected === vibe.id;
          const label = lang === 'EN' ? vibe.label : vibe.de;
          const desc = lang === 'EN' ? vibe.description : vibe.deDescription;
          return (
            <button 
              key={vibe.id} 
              onClick={() => setSelected(vibe.id)} 
              disabled={isSaving} 
              className={cn(
                "p-5 rounded-[2.5rem] border-2 flex items-center gap-6 transition-all active:scale-[0.98] text-left relative overflow-hidden", 
                isSelected ? `bg-card/5 ${vibe.activeBorder}` : "bg-card border-border/5 hover:border-border/20"
              )}
            >
              <div className="w-12 flex justify-center relative z-10">
                <VibeIcon size={40} color={isSelected ? vibe.color : "rgba(255,255,255,0.2)"} />
              </div>
              <div className="flex flex-col relative z-10">
                <span 
                  className={cn("font-black text-lg uppercase tracking-tight transition-colors")}
                  style={{ color: isSelected ? vibe.color : 'rgba(255,255,255,0.6)' }}
                >
                  {label}
                </span>
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest leading-none mt-1">{desc}</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-6 w-full shrink-0">
        <button 
          onClick={handleConfirm} 
          disabled={!selected || isSaving} 
          className={cn(
            "pill-button w-full max-w-sm uppercase tracking-[0.2em] font-black text-xl h-[64px] transition-all shadow-lg", 
            selected && !isSaving ? 'bg-primary text-primary-foreground neon-glow' : 'bg-card/10 text-muted-foreground/50 cursor-not-allowed opacity-50'
          )}
        >
          {isSaving ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t.btn}
        </button>
        <p className="text-center text-[10px] text-primary font-black uppercase tracking-[0.5em]">{t.footer}</p>
      </div>
    </div>
  );
}
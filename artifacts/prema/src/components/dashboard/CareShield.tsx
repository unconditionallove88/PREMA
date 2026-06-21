

import React from "react";
import { ShieldAlert, Wind, PhoneCall } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview CareShield Component.
 * An immersive recovery UI that guides the user toward stillness when a session is locked.
 */

interface CareShieldProps {
  reason: 'vitals_high' | 'limit_reached' | 'manual' | string;
  unlockAt: string | number;
  lang: 'en' | 'de';
  onNeedSupport?: () => void;
}

export default function CareShield({ reason, unlockAt, lang, onNeedSupport }: CareShieldProps) {
  const isEn = lang === 'en';
  
  const messages = {
    vitals_high: isEn 
      ? "Your heart is dancing a bit too fast. Let's find a slower rhythm together"
      : "Dein Herz tanzt ein bisschen zu schnell. Lass uns gemeinsam einen ruhigeren Rhythmus finden",
    limit_reached: isEn
      ? "You've reached your safety limit for this session. Your body needs time to integrate"
      : "Du hast dein Sicherheitslimit für diese Sitzung erreicht. Dein Körper braucht Zeit zur Integration",
    manual: isEn
      ? "Safety lock active. Take this time to rest and reconnect with your circle"
      : "Sicherheitssperre aktiv. Nutze diese Zeit, um dich auszuruhen und dich mit deinem Kreis zu verbinden",
  };

  const unlockTime = typeof unlockAt === 'string' ? new Date(unlockAt).getTime() : unlockAt;

  return (
    <div className="w-full min-h-[500px] rounded-[3rem] bg-card border border-[hsl(var(--primary))]/20 p-10 text-center flex flex-col items-center justify-center shadow-2xl relative overflow-hidden font-headline">
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[hsl(var(--primary))]/5 blur-[100px] rounded-full -z-10" />
      
      {/* Pulsing Icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-[hsl(var(--primary))]/20 blur-2xl rounded-full animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-card flex items-center justify-center border-2 border-[hsl(var(--primary))]/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <ShieldAlert size={40} className="text-primary" />
        </div>
      </div>

      <h2 className="text-white font-black text-3xl mb-4 uppercase tracking-tighter">
        {isEn ? "Time for Stillness" : "Zeit für Ruhe"}
      </h2>
      
      <p className="text-white/60 text-base font-bold leading-relaxed mb-10 max-w-[320px]">
        {messages[reason as keyof typeof messages] || messages.vitals_high}
      </p>

      {/* Breathing Exercise Block */}
      <div className="w-full bg-card/5 rounded-3xl p-6 mb-10 flex items-center gap-5 border border-border/10 group transition-all hover:bg-card/10">
        <div className="w-12 h-12 bg-[hsl(var(--primary))]/10 rounded-2xl flex items-center justify-center border border-[hsl(var(--primary))]/20">
          <Wind className="text-primary animate-bounce" size={24} />
        </div>
        <div className="text-left">
          <p className="text-[10px] uppercase tracking-[0.3em] text-primary font-black">
            {isEn ? "Focus on your breath" : "Konzentriere dich auf deinen Atem"}
          </p>
          <p className="text-[9px] text-white/20 font-bold uppercase mt-1 tracking-widest">Inhale peace • Exhale tension</p>
        </div>
      </div>

      {/* SOS Action - Linked to tiered support */}
      <button 
        onClick={onNeedSupport}
        className="w-full py-6 bg-red-600 rounded-[1.5rem] flex items-center justify-center gap-4 text-white font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-xl shadow-red-600/20"
      >
        <PhoneCall size={20} />
        {isEn ? "I Need Support" : "Ich brauche Hilfe"}
      </button>

      <div className="mt-8 flex flex-col items-center gap-2">
        <p className="text-[10px] text-white/20 uppercase tracking-0.4em font-black">
          {isEn ? "Lab resting until" : "Lab ruht bis"}
        </p>
        <div className="px-4 py-1.5 bg-card/5 rounded-full border border-border/10">
          <span className="font-mono text-primary text-sm font-black">
            {new Date(unlockTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}

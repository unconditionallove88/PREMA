

import React from "react";
import { Activity, Shield, AlertCircle } from "lucide-react";

/**
 * @fileOverview Guardian Simulator.
 * Supports EN, DE, PT, RU.
 * Includes "Simulate Limit Lock" for testing protective states.
 */

interface Props {
  heartRate: number;
  setHeartRate: (val: number) => void;
  substanceCount: number;
  setSubstanceCount: (val: number) => void;
  lang?: "en" | "de" | "pt" | "ru";
}

const CONTENT = {
  en: { pulse: "Simulator Pulse", intake: "Sim. Session Intake", simLimit: "Simulate Limit Lock" },
  de: { pulse: "Sim. Puls", intake: "Sim. Aufnahme", simLimit: "Limit-Sperre simulieren" },
  pt: { pulse: "Pulso Simulado", intake: "Sim. Consumo", simLimit: "Simular Limite" },
  ru: { pulse: "Симулятор Пульса", intake: "Sim. Потребление", simLimit: "Симуляция Лимита" }
};

export default function GuardianSimulator({ 
  heartRate, 
  setHeartRate, 
  substanceCount, 
  setSubstanceCount, 
  lang = "en" 
}: Props) {
  const t = CONTENT[lang] || CONTENT.en;

  const handleHrChange = (val: number) => {
    if (Math.abs(val - heartRate) > 10) playHeartbeat();
    setHeartRate(val);
  };

  const handleSubChange = (count: number) => {
    playHeartbeat();
    setSubstanceCount(count);
  };

  const triggerLimitLock = () => {
    playHeartbeat();
    setSubstanceCount(5);
    setHeartRate(145);
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="bg-card/5 border border-border/10 rounded-[2rem] p-6 space-y-6 shadow-xl">
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <label className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
              <Activity size={14} className="text-primary" />
              {t.pulse}
            </label>
            <span className="text-xl font-black tabular-nums" style={{ color: heartRate > 130 ? "#DC2626" : heartRate > 100 ? "#F59E0B" : "hsl(var(--primary))" }}>
              {heartRate} <span className="text-[9px] text-white/20">BPM</span>
            </span>
          </div>
          <input type="range" min={50} max={160} value={heartRate} onChange={(e) => handleHrChange(Number(e.target.value))} className="w-full h-1.5 bg-card/5 rounded-lg appearance-none cursor-pointer accent-[hsl(var(--primary))]" />
        </div>

        <div className="space-y-3">
          <label className="text-white/40 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            {t.intake}
          </label>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => handleSubChange(n)} className="flex-1 py-3 rounded-lg text-[10px] font-black border transition-all active:scale-95" style={{ backgroundColor: substanceCount >= n ? (n >= 5 ? "rgba(220,38,38,0.2)" : n >= 3 ? "rgba(245,158,11,0.2)" : "rgba(16,185,129,0.2)") : "transparent", borderColor: substanceCount >= n ? (n >= 5 ? "#DC2626" : n >= 3 ? "#F59E0B" : "hsl(var(--primary))") : "rgba(255,255,255,0.05)", color: substanceCount >= n ? "white" : "rgba(255,255,255,0.2)" }}>
                {n}
              </button>
            ))}
          </div>
        </div>

        <button 
          onClick={triggerLimitLock}
          className="w-full flex items-center justify-center gap-3 p-4 bg-red-600/10 border border-red-600/20 rounded-xl text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-600/20 transition-all"
        >
          <AlertCircle size={14} />
          {t.simLimit}
        </button>
      </div>
    </div>
  );
}

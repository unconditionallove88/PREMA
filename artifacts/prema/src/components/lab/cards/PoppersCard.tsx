

import React, { useState } from "react";
import { AlertTriangle, Wind, Clock, ShieldAlert } from "lucide-react";

/**
 * @fileOverview High-Fidelity Poppers Information Card.
 * Features aesthetic icons and substance-specific stats.
 */

export default function PoppersCard({ lang = "en" }: { lang?: "en" | "de" }) {
  const [expanded, setExpanded] = useState(false);
  const isEn = lang === "en";

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="bg-card border border-amber-900/40 rounded-[2.5rem] p-8 cursor-pointer transition-all hover:border-amber-700/60 active:scale-[0.98] shadow-2xl group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl -z-10" />
      
      {/* Header */}
      <div className="flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-950/50 flex items-center justify-center border border-amber-900/20 shadow-lg group-hover:scale-110 transition-transform">
          <Wind className="text-amber-500" size={32} />
        </div>
        <div>
          <p className="text-white font-black text-xl uppercase tracking-tighter leading-none">Poppers</p>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-none mt-2">Amyl Nitrite · Inhalant</p>
        </div>
        <span className="ml-auto text-[9px] px-4 py-1.5 rounded-full bg-amber-950/50 text-amber-400 border border-amber-900/40 font-black uppercase tracking-widest">
          MODERATE
        </span>
      </div>

      {/* Quick Stats */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          <Clock size={14} className="text-amber-500" />
          <span>{isEn ? "1–3 min" : "1–3 Min"}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-black uppercase tracking-widest">
          <Wind size={14} className="text-amber-500" />
          <span>{isEn ? "Inhale only" : "Nur inhalieren"}</span>
        </div>
      </div>

      {/* CRITICAL WARNING — Always visible */}
      <div className="flex items-start gap-4 p-5 rounded-2xl bg-red-950/30 border border-red-900/40 mb-2 animate-pulse shadow-inner">
        <ShieldAlert size={20} className="text-red-500 mt-0.5 shrink-0" />
        <p className="text-red-400 text-xs leading-relaxed font-black uppercase tracking-tight">
          {isEn
            ? "NEVER combine with Viagra/Cialis — can be fatal"
            : "NIEMALS mit Viagra/Cialis kombinieren — kann tödlich sein"}
        </p>
      </div>

      {/* Expanded Harm Reduction */}
      {expanded && (
        <div className="space-y-4 mt-6 border-t border-border/5 pt-6 animate-in slide-in-from-top-4 duration-500">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/30 font-black">
            {isEn ? "Harm Reduction" : "Schadensminimierung"}
          </p>
          {[
            isEn ? "Never swallow — inhalation only" : "Niemals schlucken — nur inhalieren",
            isEn ? "Avoid if you have heart conditions" : "Vermeiden bei Herzerkrankungen",
            isEn ? "Keep away from skin and eyes" : "Kontakt mit Haut und Augen vermeiden",
            isEn ? "Use in ventilated spaces only" : "Nur in belüfteten Räumen verwenden",
            isEn ? "Sit down during use" : "Während der Anwendung hinsetzen",
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-4 bg-card/5 p-3 rounded-xl border border-border/5">
              <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-slate-300 text-[11px] font-bold uppercase tracking-wide leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4 text-center">
        <p className="text-[9px] text-white/20 font-black uppercase tracking-[0.4em] group-hover:text-primary transition-colors">
          {expanded ? (isEn ? "Tap to close" : "Tippen zum Schließen") : (isEn ? "Tap for safety tips" : "Tippen für Sicherheitstipps")}
        </p>
      </div>
    </div>
  );
}

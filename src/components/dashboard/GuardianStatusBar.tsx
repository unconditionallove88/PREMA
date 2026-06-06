
"use client";

import React from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * @fileOverview GuardianStatusBar Component.
 * Status color sync: hsl(var(--primary)) (Abundant Green)
 * Purified of mood-dependent notes.
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status: Status;
  heartRate?: number;
  lang?: "en" | "de";
}

export default function GuardianStatusBar({
  status,
  heartRate,
  lang = "en"
}: Props) {
  const config = {
    safe: {
      color: "hsl(var(--primary))", // Wise and abundant green
      icon: <HeartHandshake size={16} />,
      text: {
        en: "Pulse Guardian: You are in a steady rhythm",
        de: "Pulse Guardian: Dein Rhythmus ist sanft und stabil"
      }
    },
    caution: {
      color: "#F59E0B",
      icon: <Sparkles size={16} className="animate-pulse" />,
      text: {
        en: "Pulse Guardian: Elevated vitals detected Grounding light active",
        de: "Pulse Guardian: Erhöhte Werte erkannt Erdungs-Licht aktiv"
      }
    },
    locked: {
      color: "#DC2626",
      icon: <ShieldAlert size={16} />,
      text: {
        en: "Pulse Guardian: Physiological stress detected Focus on the Light",
        de: "Pulse Guardian: Physischer Stress erkannt Fokus auf das Licht"
      }
    },
  };

  const current = config[status] || config.safe;
  const displayText = (current.text as any)[lang] || (current.text as any).en;

  return (
    <div className="w-full flex flex-col gap-1 mb-2 animate-in fade-in slide-in-from-top-2">
      <div
        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-500 shadow-sm"
        style={{
          backgroundColor: `${current.color}15`,
          borderColor: `${current.color}40`,
          color: current.color,
        }}
      >
        <div className="flex-shrink-0">{current.icon}</div>
        <p className="text-[11px] font-black uppercase tracking-wider leading-none">
          {displayText}
          {heartRate !== undefined && ` • ${heartRate} BPM`}
        </p>
      </div>
    </div>
  );
}

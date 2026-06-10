
"use client";

import React from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  heartRate: number;
  activeSubstances: string[];
  lang?: "en" | "de";
}

/**
 * @fileOverview Living Heart Aura Centerpiece.
 * Removed possessives. Affirmation removed as requested.
 */
export default function HeartStatusAura({ 
  heartRate, 
  activeSubstances, 
  lang = "en"
}: Props) {
  const normalizedSubs = activeSubstances.map(s => s.toLowerCase());
  const hasPoppers = normalizedSubs.some(s => s.includes('poppers'));

  const isHighRisk = heartRate > 130 || (hasPoppers && heartRate > 100);
  const isElevated = heartRate > 100 || activeSubstances.length > 2;
  
  const PRIMARY = "hsl(var(--primary))";
  const stateColor = isHighRisk ? "#DC2626" : isElevated ? "#F59E0B" : PRIMARY; 
  
  const loopDuration = isHighRisk ? "2s" : isElevated ? "3.5s" : "5s";

  const labels = {
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  return (
    <div className="flex flex-col items-center justify-center p-4 md:p-8 relative font-headline cursor-pointer group animate-in fade-in duration-1000 active:scale-95 transition-all">
      {/* Immersive Outer Aura Ring */}
      <div 
        className="absolute w-64 h-64 md:w-72 md:h-72 rounded-full blur-[80px] transition-all duration-1000 opacity-20" 
        style={{ 
          backgroundColor: stateColor, 
          animation: `aura-pulse-outer ${loopDuration} ease-in-out infinite` 
        }} 
      />
      
      {/* Tactile Shell */}
      <div 
        className="relative z-10 w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center border-2 transition-all duration-1000 group-hover:scale-105 group-hover:border-primary/40 shadow-2xl" 
        style={{ 
          borderColor: `${stateColor}30`, 
          backgroundColor: `rgba(0,0,0,0.6)`,
          boxShadow: `0 0 60px ${stateColor}15`
        }}
      >
        {/* Pulsing Core Heart */}
        <div 
          className="flex items-center justify-center"
          style={{ 
            animation: `heart-beat-inner ${loopDuration} ease-in-out infinite`
          }}
        >
          <Heart 
            className="w-20 h-20 md:w-24 md:h-24 transition-all duration-700" 
            style={{ 
              color: stateColor, 
              fill: stateColor,
              filter: `blur(12px) drop-shadow(0 0 20px ${stateColor})`,
              opacity: 0.7
            }} 
          />
        </div>
      </div>

      <div className="mt-8 text-center z-10 space-y-1">
        <p className="text-white/30 text-[9px] md:text-[10px] uppercase tracking-[0.6em] font-black group-hover:text-primary transition-colors">
        </p>
      </div>
    </div>
  );
}

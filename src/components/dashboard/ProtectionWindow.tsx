'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Timer, HeartPulse, Beaker, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Protection Window Component.
 * Linguistic purification: Removed "safety" terminology.
 */

interface ProtectionWindowProps {
  status: {
    isLocked: boolean;
    lockReason: string;
    lockedAt: string;
    unlockAt: string;
    lastHeartRate: number;
    activeSubstances: string[];
  };
}

export function ProtectionWindow({ status }: ProtectionWindowProps) {
  const [timeLeft, setTimeLeft] = useState<string>("");

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date().getTime();
      const unlockTime = new Date(status.unlockAt).getTime();
      const diff = unlockTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      );
    };

    const timer = setInterval(calculateTime, 1000);
    calculateTime();
    return () => clearInterval(timer);
  }, [status.unlockAt]);

  const reasonMap: Record<string, string> = {
    "vitals_threshold_exceeded": "Intention Threshold Exceeded",
    "critical_interaction": "Critical Interaction Detected",
    "intake_limit": "Harm Reduction Intake Limit Reached"
  };

  return (
    <div className="w-full bg-red-600/10 border-2 border-red-600/40 rounded-[2.5rem] p-8 shadow-2xl shadow-red-600/10 animate-in fade-in slide-in-from-top-4 duration-700 relative overflow-hidden font-headline">
      {/* Background Pulse */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 to-transparent animate-pulse" />
      
      <div className="relative z-10 space-y-8">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center border-2 border-border/20 shadow-lg animate-alert-pulse">
              <ShieldAlert size={28} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black uppercase tracking-tighter text-white">Intention Active</h2>
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-[0.3em] mt-1">
                {reasonMap[status.lockReason] || "Intention Threshold Reached"}
              </p>
            </div>
          </div>
          <div className="bg-card/40 px-4 py-2 rounded-xl border border-border/10 flex items-center gap-3">
            <Timer size={14} className="text-red-500" />
            <span className="font-mono text-lg font-black text-red-500">{timeLeft}</span>
          </div>
        </div>

        {/* Guidance */}
        <div className="bg-card/5 border border-border/10 rounded-3xl p-6">
          <p className="text-sm font-bold text-white/80 leading-relaxed uppercase tracking-widest">
          </p>
        </div>

        {/* Vital Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card/40 border border-border/5 rounded-2xl p-5 flex items-center gap-4">
            <HeartPulse size={20} className="text-red-500" />
            <div>
              <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest">Last Vitals</span>
              <span className="text-xl font-black text-white">{status.lastHeartRate} BPM</span>
            </div>
          </div>
          <div className="bg-card/40 border border-border/5 rounded-2xl p-5 flex items-center gap-4">
            <Beaker size={20} className="text-amber-500" />
            <div>
              <span className="block text-[8px] font-black text-white/30 uppercase tracking-widest">Active Substances</span>
              <span className="text-sm font-black text-white truncate max-w-[100px]">
                {status.activeSubstances.length} Detected
              </span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <button className="w-full h-16 bg-card text-black rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all">
          View Integration Protocol <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

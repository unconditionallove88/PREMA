

import { useState, useEffect } from 'react';
import { ArrowLeft, Target, Shield, Lock, Navigation, Sparkles } from 'lucide-react';
import { Link } from 'wouter';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { SOSAlert } from '@/components/dashboard/SOSAlert';
import { IntuitionPulse } from '@/components/dashboard/IntuitionPulse';

/**
export default function MapView() {
  const [sosActive, setSosActive] = useState(false);
  const [isSharing, setIsSharing] = useState(true);
  const [showRadarInfo, setShowRadarInfo] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowRadarInfo(false);
    }, 6000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="h-screen bg-card text-white relative overflow-hidden font-headline">
      {/* Map Grid Background */}
      <div className="absolute inset-0 bg-card">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <svg width="100%" height="100%">
            <pattern id="radarGrid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="hsl(var(--secondary))" strokeWidth="0.5" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#radarGrid)" />
          </svg>
        </div>

        {/* User Pointer (Visible if sharing or local) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className={cn(
            "transition-all duration-1000",
            !isSharing && "grayscale opacity-50 scale-75"
          )}>
            <IntuitionPulse />
          </div>
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card/80 px-4 py-1.5 rounded-full border border-border/10成果 whitespace-nowrap">
             <span className="text-[10px] font-black uppercase tracking-widest text-white">I am here</span>
          </div>
        </div>

        {/* Friend Nodes (Only if sharing is active) */}
        {isSharing && (
          <div className="absolute top-[30%] left-[40%] animate-bounce" style={{ animationDuration: '3000ms' }}>
             <div className="w-6 h-6 bg-secondary rounded-full border-[3px] border-white shadow-[0_0_20px_rgba(245,169,133,0.25)]" />
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-card/60 px-3 py-1 rounded-full border border-border/5 whitespace-nowrap">
                <span className="text-[8px] font-black uppercase">Max (Circle)</span>
             </div>
          </div>
        )}

        {/* Awareness Hubs */}
        <div className="absolute bottom-[25%] right-[35%]">
           <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center border-2 border-white shadow-[0_0_30px_rgba(16,185,129,0.5)] animate-pulse">
              <Shield className="w-6 h-6 text-white" />
           </div>
           <div className="absolute top-14 left-1/2 -translate-x-1/2 bg-emerald-600/20 px-4 py-2 rounded-xl border border-emerald-500/40 whitespace-nowrap">
              <span className="text-[10px] font-black uppercase tracking-widest text-primary">Safety Hub A</span>
           </div>
        </div>
      </div>

      {/* UI Overlays */}
      <div className="relative z-10 p-6 flex flex-col h-full pointer-events-none">
        <div className="flex justify-between items-start pointer-events-auto w-full max-w-4xl mx-auto">
          <Link href="/dashboard" className="bg-card/80 backdrop-blur-xl p-4 rounded-full border border-border/10 hover:border-secondary transition-all">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <div className="flex flex-col items-end gap-3">
            <div className="bg-card/80 backdrop-blur-md px-6 py-4 rounded-[2.5rem] border border-border/10 flex items-center gap-6">
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Location Privacy</span>
                <span className={cn("text-xs font-bold flex items-center gap-2", isSharing ? "text-secondary" : "text-white/40")}>
                  {isSharing ? (
                    <><Sparkles size={12} /> Sharing with Circle</>
                  ) : (
                    <><Lock size={12} /> Private Mode</>
                  )}
                </span>
              </div>
              <Switch checked={isSharing} onCheckedChange={setIsSharing} className="data-[state=checked]:bg-secondary" />
            </div>
            
            {!isSharing && (
              <div className="bg-card/5 px-4 py-2 rounded-full border border-border/10 animate-in fade-in slide-in-from-right-4">
                <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">Invisible to awareness</span>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto space-y-4 pointer-events-auto w-full max-w-xl mx-auto">
          <div className="flex justify-start items-end min-h-[120px]">
            {showRadarInfo && (
              <div className="bg-card/90 backdrop-blur-md p-8 rounded-[2.5rem] border border-border/10 max-w-[280px] animate-in fade-in slide-out-to-left duration-1000 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">✨</span>
                  <span className="text-[10px] font-black uppercase text-secondary tracking-widest">I respect my limits</span>
                </div>
                <p className="text-sm font-bold leading-tight text-white/80">I love and respect myself enough to decide when I want to be seen. Privacy is my right. 💚</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => setSosActive(true)} 
            className="w-full bg-red-600 text-white h-24 rounded-full font-black uppercase text-base tracking-widest flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(220,38,38,0.4)] active:scale-95 transition-all"
          >
            <Shield className="w-8 h-8" />
            I Need Help Now
          </button>
        </div>
      </div>

      {sosActive && <SOSAlert onClose={() => setSosActive(false)} />}
    </main>
  );
}

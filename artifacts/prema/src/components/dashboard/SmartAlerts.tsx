
import { useState, useEffect } from 'react';
import { Bell, Droplets, Moon, CheckCircle2, AlertCircle, GlassWater } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

interface SmartAlertsProps {
  userGoals: string[];
  lang?: 'en' | 'de';
}

export function SmartAlerts({ userGoals, lang = 'en' }: SmartAlertsProps) {
  const { toast } = useToast();
  const [enabled, setEnabled] = useState(false);
  const [nextWater, setNextWater] = useState(45); // minutes
  const [nextRest, setNextRest] = useState(90); // minutes
  const [showWaterOverlay, setShowWaterOverlay] = useState(false);

  const CONTENT = {
    en: {
      protocols: "Smart Protocols",
      hydration: "Next Water",
      rest: "Next Break",
      focus: (goals: string) => `Calibrated to: ${goals}`,
      enable: "Enable Smart Alerts",
      disable: "Disable Protocols",
      waterMsg: "Hydration Check: Time for 250ml of water. Stay balanced.",
      restMsg: "Rest Protocol: Take a 10m chill break.",
      footer: "Created in harmony"
    },
    de: {
      protocols: "Smart Protokolle",
      hydration: "Nächstes Wasser",
      rest: "Nächste Pause",
      focus: (goals: string) => `Kalibriert auf: ${goals}`,
      enable: "Smart Alerts aktivieren",
      disable: "Protokolle deaktivieren",
      waterMsg: "Wasser-Check: Zeit für 250ml Wasser. Bleib im Gleichgewicht.",
      restMsg: "Ruhe-Protokoll: Gönn dir 10 Min. Auszeit.",
      footer: "In Harmonie erschaffen hier"
    }
  }[lang];

  useEffect(() => {
    if (!enabled) return;

    const timer = setInterval(() => {
      setNextWater(prev => (prev > 0 ? prev - 1 : 45));
      setNextRest(prev => (prev > 0 ? prev - 1 : 90));
    }, 60000);

    return () => clearInterval(timer);
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;

    if (nextWater === 0) {
      setShowWaterOverlay(true);
      toast({ title: "💧 Hydration Reminder", description: CONTENT.waterMsg });
      setTimeout(() => setShowWaterOverlay(false), 8000);
    }

    if (nextRest === 0) {
      toast({ title: "🌙 Rest Alert", description: CONTENT.restMsg });
    }
  }, [nextWater, nextRest, enabled, toast, CONTENT]);

  return (
    <>
      <div className="p-6 bg-card/[0.02] border border-border/5 rounded-[2rem] font-headline animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-500",
              enabled ? "bg-secondary/20 border-secondary shadow-lg" : "bg-card/5 border-border/10"
            )}>
              <Bell className={cn("w-5 h-5", enabled ? "text-secondary" : "text-white/20")} />
            </div>
            <div>
              <h2 className="text-lg font-black uppercase tracking-tight">{CONTENT.protocols}</h2>
              <p className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{enabled ? 'Active' : 'Standby'}</p>
            </div>
          </div>
          <button
            onClick={() => setEnabled(!enabled)}
            className={cn(
              "px-6 py-3 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
              enabled ? "bg-red-600/10 text-red-500 border border-red-600/20" : "bg-secondary text-black shadow-lg"
            )}
          >
            {enabled ? CONTENT.disable : CONTENT.enable}
          </button>
        </div>

        {enabled && (
          <div className="grid grid-cols-2 gap-3 animate-in fade-in zoom-in-95 duration-500">
            <div className="bg-card/5 border border-border/5 rounded-2xl p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Droplets className="w-3 h-3 text-blue-400" />
                <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">{CONTENT.hydration}</span>
              </div>
              <span className="text-xl font-black text-white">{nextWater}m</span>
            </div>
            <div className="bg-card/5 border border-border/5 rounded-2xl p-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 mb-1">
                <Moon className="w-3 h-3 text-purple-400" />
                <span className="text-[7px] font-black uppercase text-white/40 tracking-widest">{CONTENT.rest}</span>
              </div>
              <span className="text-xl font-black text-white">{nextRest}m</span>
            </div>
          </div>
        )}
      </div>

      {showWaterOverlay && (
        <div className="fixed inset-0 z-[8000] flex flex-col items-center justify-center bg-card/60 backdrop-blur-xl animate-in fade-in duration-500 font-headline">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] rounded-full animate-pulse" />
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-blue-400 flex items-center justify-center bg-card/40 shadow-2xl relative z-10 animate-bounce">
              <GlassWater size={120} className="text-blue-400 drop-shadow-[0_0_30px_#60a5fa]" />
            </div>
          </div>
          <div className="mt-12 text-center space-y-4 px-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{lang === 'de' ? 'TRINK WASSER' : 'DRINK WATER'}</h2>
            <p className="text-lg font-bold text-white/60 uppercase tracking-widest max-w-xs">{CONTENT.waterMsg}</p>
          </div>
          <button 
            onClick={() => setShowWaterOverlay(false)}
            className="mt-12 px-10 py-4 bg-card text-black rounded-full font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
          >
            I am balanced
          </button>
          <p className="mt-12 text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">{CONTENT.footer}</p>
        </div>
      )}
    </>
  );
}

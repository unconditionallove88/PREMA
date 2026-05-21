
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ZapOff, GlassWater, Moon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * @fileOverview Sanctuary Alarms Configuration Step.
 * Connected to Central Intelligence (Pulse Guardian).
 * Languages: EN (3 words), DE (4 words).
 */

const UI = {
  EN: {
    header: "Set sanctuary alarms",
    sub: "Connected to central intelligence",
    limit: "Intake Limit",
    limitSub: "Total logged units",
    leave: "Departure Time",
    leaveSub: "Target leave time",
    rest: "Rest Intervals",
    restSub: "Breathing break frequency",
    water: "Hydration Sync",
    waterSub: "Water reminder frequency",
    confirm: "Activate sanctuary alarms",
    created: "Created in harmony"
  },
  DE: {
    header: "Sanctuary Alarme setzen heute",
    sub: "Verbunden mit zentraler Intelligenz",
    limit: "Intake Limit",
    limitSub: "Gezählte Einheiten heute",
    leave: "Aufbruchs Zeit",
    leaveSub: "Geplante Zeit gehen",
    rest: "Ruhe Intervalle",
    restSub: "Atempausen Frequenz heute",
    water: "Hydrierung Sync",
    waterSub: "Wasser Erinnerung Frequenz",
    confirm: "Sanctuary Alarme jetzt aktivieren",
    created: "In Harmonie erschaffen hier"
  }
};

export function StepSanctuaryAlarms({ onComplete, onBack }: { onComplete: (alarms: any) => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [settings, setSettings] = useState({
    intakeLimit: "5",
    leaveTime: "04:00",
    restInterval: "60",
    waterInterval: "45",
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.EN;

  const handleComplete = () => {
    onComplete(settings);
  };

  return (
    <div className="w-full h-full flex flex-col font-headline bg-black relative animate-in fade-in duration-700">
      {onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-[100] pt-4">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="px-6 shrink-0 pt-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <ZapOff size={28} className="text-primary" />
        </div>
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t.sub}</p>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full px-6">
          <div className="space-y-4 pb-40">
            {/* Intake Limit */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <ZapOff size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-white">{t.limit}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t.limitSub}</p>
                  </div>
                </div>
                <Select value={settings.intakeLimit} onValueChange={(val) => setSettings({...settings, intakeLimit: val})}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/10 rounded-xl font-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 font-headline">
                    {["3", "4", "5", "6", "8"].map(num => (
                      <SelectItem key={num} value={num} className="font-black uppercase">{num} Units</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Departure Time */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-400/10 rounded-xl">
                    <Clock size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-white">{t.leave}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t.leaveSub}</p>
                  </div>
                </div>
                <input 
                  type="time" 
                  value={settings.leaveTime} 
                  onChange={(e) => setSettings({...settings, leaveTime: e.target.value})}
                  className="w-24 h-10 bg-white/5 border border-white/10 rounded-xl px-2 font-black text-white text-xs outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Rest Breaks */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-400/10 rounded-xl">
                    <Moon size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-white">{t.rest}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t.restSub}</p>
                  </div>
                </div>
                <Select value={settings.restInterval} onValueChange={(val) => setSettings({...settings, restInterval: val})}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/10 rounded-xl font-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 font-headline">
                    {["30", "60", "90", "120"].map(min => (
                      <SelectItem key={min} value={min} className="font-black uppercase">{min} Min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hydration */}
            <div className="p-6 bg-[#0a0a0a] border border-white/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <GlassWater size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-white">{t.water}</p>
                    <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest">{t.waterSub}</p>
                  </div>
                </div>
                <Select value={settings.waterInterval} onValueChange={(val) => setSettings({...settings, waterInterval: val})}>
                  <SelectTrigger className="w-24 bg-white/5 border-white/10 rounded-xl font-black text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-white/10 font-headline">
                    {["20", "30", "45", "60"].map(min => (
                      <SelectItem key={min} value={min} className="font-black uppercase">{min} Min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">{t.created}</p>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black to-transparent pt-12 pointer-events-none pb-safe">
        <button 
          onClick={handleComplete}
          className="pointer-events-auto w-full max-w-sm mx-auto h-20 bg-[#1b4d3e] text-white rounded-full font-black text-lg uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
        >
          {t.confirm} <CheckCircle2 size={24} />
        </button>
      </div>
    </div>
  );
}

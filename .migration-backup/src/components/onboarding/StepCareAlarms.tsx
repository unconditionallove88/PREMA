
"use client"

import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ZapOff, GlassWater, Moon, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * @fileOverview Care Alarms Configuration Step.
 * Connected to Central Intelligence (Pulse Guardian).
 * Languages: EN (3 words), DE (4 words).
 */

const UI = {
  EN: {
    header: "Set care alarms",
    sub: "Connected to Pulse Guardian",
    limit: "Intake Limit",
    limitSub: "Total logged units",
    leave: "Departure Time",
    leaveSub: "Target leave time",
    rest: "Rest Intervals",
    restSub: "Breathing break frequency",
    water: "Hydration Sync",
    waterSub: "Water reminder frequency",
    confirm: "Activate care alarms",
    created: "Created in harmony"
  },
  DE: {
    header: "Pflege-Alarme aktivieren",
    sub: "Verbunden mit dem Pulse Guardian",
    limit: "Limit",
    limitSub: "Gesamte Einheiten",
    leave: "Abfahrtzeit",
    leaveSub: "Geplante Abfahrt",
    rest: "Pausen Intervalle",
    restSub: "Atempausen-Frequenz",
    water: "Hydration",
    waterSub: "Wasser-Erinnerung",
    confirm: "Alarme aktivieren",
    created: "In Harmonie erschaffen"
  }
};

export function StepCareAlarms({ onComplete, onBack }: { onComplete: (alarms: any) => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [settings, setSettings] = useState({
    intakeLimit: "5", intakeUnit: "units",
    leaveTime: "04:00",
    restInterval: "60",
    waterInterval: "45",
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = UI[lang] || UI.EN;

  const handleComplete = () => {
    onComplete(settings);
  };

  return (
    <div className="w-full h-full flex flex-col font-headline bg-card relative animate-in fade-in duration-700">
      {onBack && (
        <button onClick={onBack} className="absolute top-0 left-4 text-muted-foreground hover:text-foreground flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-[100] pt-4">
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="px-6 shrink-0 pt-16 text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
          <ZapOff size={28} className="text-primary" />
        </div>
        <h2 className="text-[22px] font-black uppercase mb-1 text-foreground leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-muted-foreground font-black uppercase tracking-[0.2em] text-[10px] mb-8">{t.sub}</p>
      </div>

      <div className="flex-1 min-h-0 relative">
        <ScrollArea className="h-full px-6">
          <div className="space-y-4 pb-40">
            {/* Intake Limit */}
            <div className="p-6 bg-card border border-border/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-xl">
                    <ZapOff size={20} className="text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-foreground">{t.limit}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.limitSub}</p>
                  </div>
                </div>
                <Select value={settings.intakeLimit} onValueChange={(val) => setSettings({...settings, intakeLimit: val})}>
  <SelectTrigger className="w-24 bg-card/5 border-border/10 rounded-xl font-black text-foreground">
    <SelectValue />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="0">0</SelectItem>
    <SelectItem value="1">1</SelectItem>
    <SelectItem value="2">2</SelectItem>
    <SelectItem value="3">3</SelectItem>
    <SelectItem value="4">4</SelectItem>
    <SelectItem value="5">5</SelectItem>
    <SelectItem value="6">6</SelectItem>
  </SelectContent>
</Select>
                <Select value={settings.intakeUnit} onValueChange={(val) => setSettings({...settings, intakeUnit: val})}>
                  <SelectTrigger className="w-32 bg-card/5 border-border/10 rounded-xl font-black text-foreground ml-2">
                    <SelectValue placeholder="Unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="units">Units</SelectItem>
                    <SelectItem value="grams">Grams</SelectItem>
                    <SelectItem value="lines">Lines</SelectItem>
                    <SelectItem value="joints">Joints</SelectItem>
                    <SelectItem value="beers">Beers</SelectItem>
                    <SelectItem value="shots">Shots</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Departure Time */}
            <div className="p-6 bg-card border border-border/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-400/10 rounded-xl">
                    <Clock size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-foreground">{t.leave}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.leaveSub}</p>
                  </div>
                </div>
                <input 
                  type="time" 
                  value={settings.leaveTime} 
                  onChange={(e) => setSettings({...settings, leaveTime: e.target.value})}
                  className="w-24 h-10 bg-card/5 border border-border/10 rounded-xl px-2 font-black text-foreground text-xs outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Rest Breaks */}
            <div className="p-6 bg-card border border-border/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-400/10 rounded-xl">
                    <Moon size={20} className="text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-foreground">{t.rest}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.restSub}</p>
                  </div>
                </div>
                <Select value={settings.restInterval} onValueChange={(val) => setSettings({...settings, restInterval: val})}>
                  <SelectTrigger className="w-24 bg-card/5 border-border/10 rounded-xl font-black text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-border/10 font-headline">
                    {["30", "60", "90", "120"].map(min => (
                      <SelectItem key={min} value={min} className="font-black uppercase">{min} Min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hydration */}
            <div className="p-6 bg-card border border-border/10 rounded-[2rem] flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-cyan-400/10 rounded-xl">
                    <GlassWater size={20} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm font-black uppercase text-foreground">{t.water}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{t.waterSub}</p>
                  </div>
                </div>
                <Select value={settings.waterInterval} onValueChange={(val) => setSettings({...settings, waterInterval: val})}>
                  <SelectTrigger className="w-24 bg-card/5 border-border/10 rounded-xl font-black text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-border/10 font-headline">
                    {["20", "30", "45", "60"].map(min => (
                      <SelectItem key={min} value={min} className="font-black uppercase">{min} Min</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="pt-8 text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{t.created}</p>
            </div>
          </div>
        </ScrollArea>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pt-12 pointer-events-none pb-safe">
        <button 
          onClick={handleComplete}
          className="pointer-events-auto w-full max-w-sm mx-auto h-20 bg-primary text-primary-foreground rounded-full font-black text-lg uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3"
        >
          {t.confirm} <CheckCircle2 size={24} />
        </button>
      </div>
    </div>
  );
}

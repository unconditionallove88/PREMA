
"use client";

import React from "react";
import { X, Activity, Bluetooth, Database, PhoneCall, Sparkles } from "lucide-react";
import { GuardianLogo } from "@/components/ui/guardian-logo";
import { cn } from "@/lib/utils";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * @fileOverview PulseGuardianBanner Component.
 * Fixed: viewGuide button now correctly triggers the onOpenGuide prop to launch SanctuaryGuide.
 * Integrated "Shining White" text.
 */

interface PulseGuardianBannerProps {
  lang?: "en" | "de";
  variant?: "banner" | "icon";
  onOpenGuide?: () => void;
}

const CONTENT = {
  en: {
    title: "Pulse Guardian",
    sub: "Central Intelligence",
    intro: "Pulse Guardian is your sanctuary's central intelligence I continuously aggregate data from all tools to ensure your journey stays resonant and aligned",
    sections: [
      { title: "Pulse Sync Integration", desc: "Reads live vitals from your wearable to monitor physiological stress" },
      { title: "Pulse Lab Awareness", desc: "Automatically recalibrates resonance limits based on your substance intake logs" },
      { title: "Profile Calibration", desc: "Adjusts thresholds based on your health conditions and medications" },
      { title: "Immediate Help Connection", desc: "Triggers care protocols and the Protection Window if thresholds are breached" },
    ],
    footer: "Created in harmony",
    tapInfo: "Integrated Intelligence Engine",
    viewGuide: "View Sanctuary Guide"
  },
  de: {
    title: "Pulse Guardian",
    sub: "Zentrale Intelligenz",
    intro: "Pulse Guardian ist die zentrale Intelligenz deines Raums Ich sammle kontinuierlich Daten aus allen Tools, um sicherzustellen, dass deine Reise resonant und stimmig bleibt",
    sections: [
      { title: "Pulse Sync Integration", desc: "Liest Live-Vitalwerte von deinem Wearable, um physiologischen Stress zu überwachen" },
      { title: "Pulse Lab Bewusstsein", desc: "Kalibriert Resonanzlimits automatisch basierend auf deinen Substanz-Protokollen" },
      { title: "Profil-Kalibrierung", desc: "Passt Schwellenwerte basierend auf deinen Gesundheitszuständen und Medikamenten an" },
      { title: "Sofort-Hilfe Verbindung", desc: "Aktiviert Fürsorgeprotokolle und das Schutzfenster, falls Schwellenwerte überschritten werden" },
    ],
    footer: "In Harmonie erschaffen hier",
    tapInfo: "Integrierte Intelligenz Engine",
    viewGuide: "Sanctuary Begleiter ansehen"
  }
};

export default function PulseGuardianBanner({ 
  lang = "en", 
  variant = "banner",
  onOpenGuide
}: PulseGuardianBannerProps) {
  const [open, setOpen] = React.useState(false);
  const t = CONTENT[lang] || CONTENT.en;

  const handleOpenGuide = () => {
    setOpen(false); // Close the sheet
    if (onOpenGuide) onOpenGuide();
  };

  const InfoContent = () => (
    <div className="w-full max-md mx-auto pb-12 font-headline relative">
      <p className="text-white/60 text-sm font-bold leading-relaxed mb-10 uppercase tracking-wide px-2">
        {t.intro}
      </p>

      <div className="space-y-4 px-2">
        {t.sections.map((item, i) => {
          const Icons = [Bluetooth, Activity, Database, PhoneCall];
          const Colors = ["text-[#EBFB3B]", "text-[#10B981]", "text-blue-400", "text-red-500"];
          const Bgs = ["bg-[#EBFB3B]/10", "bg-[#10B981]/10", "bg-blue-400/10", "bg-red-500/10"];
          const Icon = Icons[i];
          
          return (
            <div key={i} className="flex items-start gap-5 p-6 rounded-[2rem] bg-white/5 border border-white/5 transition-all hover:bg-white/10">
              <div className={cn(Colors[i], "mt-0.5 shrink-0 p-2.5 rounded-xl", Bgs[i])}>
                <Icon size={18} />
              </div>
              <div className="space-y-1">
                <p className="text-white text-xs font-black uppercase tracking-tight">{item.title}</p>
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 px-2">
        <button 
          onClick={handleOpenGuide}
          className="w-full py-5 bg-[#1b4d3e] border-2 border-primary/20 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3"
        >
          <Sparkles size={16} className="text-primary" />
          {t.viewGuide}
        </button>
      </div>

      <div className="mt-12 pt-8 border-t border-white/5 text-center">
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] drop-shadow-[0_0_8px_rgba(255,255,255,0.8)]">
          {t.footer}
        </p>
      </div>
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <SheetTrigger asChild>
              {variant === "banner" ? (
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl mb-6 border border-[#A855F7]/20 bg-[#A855F7]/5 text-left transition hover:border-[#A855F7]/40 active:scale-[0.99]">
                  <GuardianLogo size={24} className="shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#A855F7] text-[10px] font-black uppercase tracking-widest leading-none">{t.title}</p>
                    <p className="text-white/40 text-[9px] mt-1 font-bold uppercase tracking-widest">{t.tapInfo}</p>
                  </div>
                  <span className="text-white/20 text-[10px]">›</span>
                </button>
              ) : (
                <button type="button" className="p-2 bg-[#A855F7]/10 rounded-full border border-[#A855F7]/30 hover:border-[#A855F7] transition-all active:scale-95 flex items-center justify-center group"><GuardianLogo size={28} /></button>
              )}
            </SheetTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="bg-zinc-900 border-white/10 text-[#A855F7] font-bold uppercase text-[9px] tracking-widest px-4 py-2">{t.title}: {t.sub}</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <SheetContent side="top" className="bg-black border-white/10 p-0 rounded-b-[3.5rem] h-[90vh] max-h-[90vh] overflow-hidden flex flex-col shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[5000]">
        <SheetHeader className="p-8 pb-4 shrink-0">
          <div className="flex items-center justify-between max-w-2xl mx-auto w-full">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#A855F7]/10 border border-[#A855F7]/20 flex items-center justify-center shadow-lg"><GuardianLogo size={32} /></div>
              <div>
                <SheetTitle className="text-white font-black text-2xl uppercase tracking-tighter text-left">{t.title}</SheetTitle>
                <p className="text-[9px] text-[#A855F7] font-black uppercase tracking-[0.3em] mt-1.5 text-left">{t.sub}</p>
              </div>
            </div>
          </div>
        </SheetHeader>
        <ScrollArea className="flex-1 px-8 pb-10"><InfoContent /></ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

"use client";

import React from "react";
import { PenLine, Wind, Eye , Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = {
  onOpenLoveLetters: () => void;
  onOpenBreath: () => void;
  onOpenVision: () => void;
};

export default function SidePanel({ onOpenLoveLetters, onOpenBreath, onOpenVision }: Props) {
  const items = [
    { id: "letters", Icon: PenLine, label: "Love Letters", onClick: onOpenLoveLetters, color: "text-violet-500" },
    { id: "pulse", Icon: Activity, label: "Bio Pulse", onClick: () => { const el = document.getElementById("bio-pulse-section"); if (el) el.scrollIntoView({ behavior: "smooth" }); }, color: "text-emerald-500" },
    { id: "breath",  Icon: Wind,    label: "Breath of Love", onClick: onOpenBreath, color: "text-emerald-500" },
    { id: "vision",  Icon: Eye,     label: "Vision of Love", onClick: onOpenVision, color: "text-sky-500" },
  ];

  return (
    <>
      <div className="hidden md:flex fixed right-6 top-1/2 transform -translate-y-1/2 flex-col gap-4 z-40">
        <TooltipProvider>
          {items.map((it) => (
            <Tooltip key={it.id}>
              <TooltipTrigger asChild>
                <button
                  aria-label={it.label}
                  onClick={it.onClick}
                  className={cn(
                    "w-14 h-14 rounded-xl bg-card/60 border border-border/10 flex items-center justify-center shadow-md transition-transform duration-200 ease-out hover:-translate-y-2 active:scale-95",
                    it.color
                  )}
                >
                  <it.Icon size={22} className="pointer-events-none" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="left" align="center">
                <div className="text-xs font-black uppercase tracking-wider">{it.label}</div>
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </div>

      <div className="md:hidden fixed right-4 bottom-6 z-40">
        <div className="flex gap-3 items-center">
          {items.map((it) => (
            <button
              key={it.id}
              aria-label={it.label}
              onClick={it.onClick}
              className={cn(
                "w-12 h-12 rounded-xl bg-card/70 border border-border/10 flex items-center justify-center shadow-sm transition-transform duration-150 hover:-translate-y-1",
                it.color
              )}
            >
              <it.Icon size={18} />
            </button>
          ))}
        </div>
      </div>
    </>
  );
}


import React, { useEffect, useState } from "react";
import { HeartHandshake, AlertTriangle, ShieldAlert, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * GuardianStatusBar
 * - shows a live BPM value (uses prop if provided, otherwise simulates)
 * - colors / text reflect status: "safe" | "caution" | "locked"
 * - accessible and lightweight
 */

type Status = "safe" | "caution" | "locked";

interface Props {
  status?: Status;
  heartRate?: number;
  lang?: "en" | "de";
}

export default function GuardianStatusBar({
  status = "safe",
  heartRate: heartRateProp,
  lang = "en",
}: Props) {
  // internal heartRate state — if a prop is provided we use it as base, otherwise default base
  const base = typeof heartRateProp === "number" ? Math.round(heartRateProp) : 75;
  const [bpm, setBpm] = useState<number>(base);

  // detect light theme to increase contrast in light mode
  const [isLight, setIsLight] = useState(false);
  useEffect(() => {
    const check = () =>
      setIsLight(
        Boolean(
          typeof window !== "undefined" &&
            (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) ||
            document.documentElement.classList.contains("light")
        )
      );
    check();
    try {
      const m = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)");
      const upd = () =>
        setIsLight(Boolean((m && m.matches) || document.documentElement.classList.contains("light")));
      if (m && m.addEventListener) m.addEventListener("change", upd);
      else if (m && m.addListener) m.addListener(upd);
      const observer = new MutationObserver(check);
      observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
      return () => {
        if (m && m.removeEventListener) m.removeEventListener("change", upd);
        else if (m && m.removeListener) m.removeListener(upd);
        observer.disconnect();
      };
    } catch {
      return;
    }
  }, []);

  // Simulate gentle BPM fluctuations when not driven externally.
  useEffect(() => {
    // If parent is controlling heartRate, we still allow small smoothing.
    if (typeof heartRateProp === "number") {
      setBpm(Math.round(heartRateProp));
      const smoothing = setInterval(() => {
        // tiny smoothing noise around the prop value
        const noise = Math.round((Math.random() - 0.5) * 2); // -1..1
        setBpm(() => Math.round((heartRateProp as number) + noise));
      }, 1200);
      return () => clearInterval(smoothing);
    }

    // Otherwise, free simulation around base.
    const interval = setInterval(() => {
      setBpm((prev) => {
        // vary +/- up to 3 bpm per tick but keep within reasonable range
        const delta = Math.round((Math.random() - 0.5) * 6); // -3..3
        const next = Math.max(40, Math.min(140, prev + delta));
        return next;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [heartRateProp, base]);

  // map status/ bpm to color + label (adapts for light mode)
  const statusMap = {
    safe: {
      color: isLight ? "text-emerald-700" : "text-emerald-500",
      ring: isLight ? "ring-emerald-400/50 bg-emerald-50/50" : "ring-emerald-500/20",
      label: lang === "en" ? "Steady rhythm" : "Stetiger Rhythmus",
    },
    caution: {
      color: isLight ? "text-amber-700" : "text-amber-500",
      ring: isLight ? "ring-amber-400/50 bg-amber-50/50" : "ring-amber-500/20",
      label: lang === "en" ? "Caution" : "Vorsicht",
    },
    locked: {
      color: isLight ? "text-rose-700" : "text-rose-500",
      ring: isLight ? "ring-rose-400/50 bg-rose-50/50" : "ring-rose-500/20",
      label: lang === "en" ? "Locked / Alert" : "Alarm",
    },
  } as const;

  // if bpm is outside healthy band, raise caution visually (unless status explicitly set)
  const derivedStatus: Status = status !== undefined ? status : bpm < 50 || bpm > 110 ? "caution" : "safe";

  const map = statusMap[derivedStatus];

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-3xl mx-auto flex items-center justify-between gap-6 p-4 rounded-2xl bg-card/5 border border-border/10 shadow-md"
    >
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center border-2 bg-card/10 shadow-inner transition-all",
            map.ring
          )}
          aria-hidden
        >
          <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", map.color)}>
            <HeartHandshake size={20} />
          </div>
        </div>

        <div className="flex flex-col">
          <div className="text-[11px] font-black uppercase tracking-wider text-white/60">
            {lang === "en" ? "Pulse Guardian" : "Pulse Wächter"}
          </div>
          <div className="text-sm font-bold text-white/90 flex items-center gap-3">
            <span className="text-xs text-white/50 uppercase">{map.label}</span>
            <span className={cn("ml-2 font-mono text-lg tracking-wide", map.color)} aria-label={`${bpm} beats per minute`}>
              {bpm}
              <span className="text-xs ml-1 text-white/50"> BPM</span>
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-xs text-white/40 uppercase tracking-widest">
          {lang === "en" ? (
            <>
              <span className="font-black mr-2">Status</span>
              <span className={cn("px-2 py-1 rounded-full text-[11px] font-bold", map.color, "bg-white/3")}>
                {derivedStatus.toUpperCase()}
              </span>
            </>
          ) : (
            <>
              <span className="font-black mr-2">Status</span>
              <span className={cn("px-2 py-1 rounded-full text-[11px] font-bold", map.color, "bg-white/3")}>
                {derivedStatus.toUpperCase()}
              </span>
            </>
          )}
        </div>

        {/* small helper icons */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-card/5 border border-border/10" title={lang === "en" ? "Guardian intelligence active" : "Guardian Intelligenz aktiv"}>
            <Sparkles size={16} className={cn(map.color)} />
          </div>

          {derivedStatus === "caution" && (
            <div className="p-2 rounded-full bg-card/5 border border-border/10" title={lang === "en" ? "Caution" : "Vorsicht"}>
              <AlertTriangle size={16} className="text-amber-500" />
            </div>
          )}

          {derivedStatus === "locked" && (
            <div className="p-2 rounded-full bg-card/5 border border-border/10" title={lang === "en" ? "Locked" : "Gesperrt"}>
              <ShieldAlert size={16} className="text-rose-500" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { 
  Heart, 
  Users, 
  Star, 
  Flame, 
  User, 
  ShieldCheck, 
  Globe, 
  Infinity, 
  Sparkles,
  Info,
  ExternalLink,
  Radio,
  Navigation
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
} from "@/components/ui/dialog";

/**
 * @fileOverview Organic Circle of Love (Aura Ring Edition).
 * Purified language: removed "my" / "meine".
 */

const ARCHETYPES = [
  { 
    id: 'brother', icon: ShieldCheck, color: "text-blue-200", bg: "bg-blue-500/5", 
    en: "Brother", de: "Brüderliche Liebe", 
    sentence: "Existence is protected and held",
    explanation: "Brotherly love represents the shield and support offered in a circle of trust. It is the unwavering strength found in shared responsibility.",
    practice: "Visualize a protective circle around the group. Breathe into the feeling of safety and mutual support."
  },
  { 
    id: 'mother', icon: Heart, color: "text-rose-200", bg: "bg-rose-500/5", 
    en: "Mother", de: "Mütter", 
    sentence: "Nurturing love surrounds existence",
    explanation: "Motherly love is the foundation of unconditional care and emotional safety. It is the gentle warmth that heals even the deepest unrest.",
    practice: "Place a hand over the heart. Breathe into the warmth of being cared for."
  },
  { 
    id: 'sister', icon: User, color: "text-indigo-200", bg: "bg-indigo-500/5", 
    en: "Sister", de: "Schwester", 
    sentence: "Shared strength in unity",
  },
  { 
    id: 'romantic', icon: Star, color: "text-pink-200", bg: "bg-pink-500/5", 
    en: "Romance", de: "Romantik", 
    sentence: "Hearts beating as one",
    explanation: "Romantic love is the spark of intimacy and deep emotional merging. It is the celebration of two hearts finding a singular rhythm.",
    practice: "Synchronize breathing with the central pulsing heart. Feel the intimacy of the present moment."
  },
  { 
    id: 'erotic', icon: Flame, color: "text-orange-200", bg: "bg-orange-500/5", 
    en: "Erotica", de: "Erotik", 
    sentence: "Passion flows through life",
    explanation: "Erotic love is the life-force and creative fire of existence. It is the energy that drives exploration of the beauty of life.",
    practice: "Feel the warmth in the body. Breathe deeply into the abdomen and imagine light radiating outward."
  },
  { 
    id: 'friend', icon: Users, color: "text-emerald-200", bg: "bg-emerald-500/5", 
    en: "Friendship", de: "Freundschaft", 
    sentence: "Trust is the foundation",
    explanation: "Friendship love is the social mesh that holds everyone together. It is built on trust, honesty, and shared experiences.",
    practice: "Think of a bond that brings joy. Send a mental note of gratitude right now."
  },
  { 
    id: 'human', icon: Globe, color: "text-cyan-200", bg: "bg-cyan-500/5", 
    en: "We are One", de: "Wir sind Eins", 
    sentence: "All are connected now",
    explanation: "Humanity love is the recognition of the collective heartbeat. It is the ultimate expression of unconditional love for all beings.",
    practice: "Imagine a thin golden thread connecting every person in the space and the world beyond."
  },
  { 
    id: 'life', icon: Infinity, color: "text-primary", bg: "bg-primary/5", 
    en: "Life", de: "Leben", 
    sentence: "Existence is a gift",
    explanation: "Life love is the gratitude for the breath in the lungs and the rhythm in the chest. It is love for the experience of being alive.",
    practice: "Take a deep breath and acknowledge the gift of life. Repeat this three times."
  },
];

const MOCK_FRIENDS = [
  { id: 'f1', name: 'GABRIEL', hr: 72, state: 'steady', msg: "Chilling near the bar", dist: "12m" },
  { id: 'f2', name: 'LEANDRO', hr: 115, state: 'elevated', msg: "Dancing intensely", dist: "45m" },
  { id: 'f3', name: 'MARINA', hr: 140, state: 'distress', msg: "Needs a hydration break", dist: "82m" },
];

export default function LoveCircle({ lang = "en", variant = "dashboard", heartRate = 75 }: { lang?: string, variant?: "dashboard" | "map", heartRate?: number }) {
  const router = useRouter();
  const [activeArchetype, setActiveArchetype] = useState(7);
  const [learningArchetype, setLearningArchetype] = useState<any>(null);
  const current = ARCHETYPES[activeArchetype];
  const currentLang = lang.toLowerCase() as 'en' | 'de';

  const pulseDuration = `${(60 / heartRate).toFixed(2)}s`;
  const pulseIntensity = heartRate > 120 ? 0.35 : (heartRate > 90 ? 0.2 : 0.1);
  const pulseOpacity = heartRate > 120 ? 0.5 : (heartRate > 90 ? 0.3 : 0.2);

  const getStateColor = (state: string) => {
    switch(state) {
      case 'distress': return '#DC2626'; // Red
      case 'elevated': return '#F59E0B'; // Yellow
      default: return 'hsl(var(--primary))'; // Green
    }
  };

  const handleFindFriend = (friend: any) => {
    playHeartbeat();
    router.push(`/map?focus=${friend.name}&status=${friend.state}`);
  };

  return (
    <TooltipProvider delayDuration={0}>
      <div className="w-full max-w-[450px] mx-auto flex flex-col items-center gap-8 font-headline">
        <div className="relative aspect-square w-full rounded-full flex items-center justify-center transition-all duration-1000 overflow-visible">
          
          {/* Shining Emerald Aura Ring Glow */}
          <div 
            className="absolute inset-0 rounded-full blur-[100px] transition-all duration-1000" 
            style={{ 
              backgroundColor: 'hsl(var(--primary))',
              opacity: pulseOpacity,
              transform: `scale(${1 + (pulseIntensity * 0.5)})`,
              animation: `tender-aura-ring ${pulseDuration} ease-in-out infinite`
            }} 
          />

          {/* Shining Circle Contour - High Fidelity Shine */}
          <div className="absolute inset-[-12px] rounded-full border-2 border-primary/40 pointer-events-none opacity-60 shadow-[0_0_20px_rgba(27,77,62,0.4),inset_0_0_20px_rgba(27,77,62,0.4)]" />
          
          <style jsx>{`
            @keyframes tender-aura-ring {
              0%, 100% { transform: scale(1); opacity: ${pulseOpacity}; }
              50% { transform: scale(${1 + pulseIntensity}); opacity: ${pulseOpacity * 1.5}; }
            }
          `}</style>

          {/* Archetype Ring */}
          {ARCHETYPES.map((arc, i) => {
            const angle = (i * 360) / ARCHETYPES.length;
            const radius = 42; 
            const isActive = activeArchetype === i;

            return (
              <Tooltip key={arc.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => { playHeartbeat(); setActiveArchetype(i); }}
                    className={cn(
                      "absolute w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 border-2 z-20 group",
                      isActive 
                        ? `${arc.bg} border-primary shadow-[0_0_30px_rgba(27,77,62,0.4)] scale-110` 
                        : "bg-card/40 border-border/5 opacity-40 hover:opacity-100"
                    )}
                    style={{ 
                      left: `${50 + radius * Math.cos((angle * Math.PI) / 180)}%`,
                      top: `${50 + radius * Math.sin((angle * Math.PI) / 180)}%`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <arc.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-foreground/30")} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-card/95 border-border/10 px-4 py-2 rounded-xl text-center space-y-2 max-w-[150px]">
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                    {currentLang === 'de' ? arc.de : arc.en}
                  </p>
                  <p className="text-[8px] text-muted-foreground font-bold uppercase mt-1 italic">"{arc.sentence}"</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setLearningArchetype(arc); }}
                    className="flex items-center gap-1.5 mx-auto text-[7px] font-black text-blue-400 uppercase tracking-widest pt-1 border-t border-border/10 w-full justify-center"
                  >
                    {currentLang === 'de' ? 'Mehr erfahren' : 'Learn Intelligence'} <ExternalLink size={8} />
                  </button>
                </TooltipContent>
              </Tooltip>
            );
          })}

          {/* Unity Core (Mirror Reflection) - Background is Dark Green */}
          <div className="relative w-48 h-48 md:w-56 md:h-56 bg-card rounded-full border-2 border-primary/20 flex items-center justify-center p-4 shadow-2xl z-10 overflow-hidden">
            <div 
              className="absolute inset-0 bg-primary/10 rounded-full transition-all duration-1000"
              style={{ 
                animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite`,
                opacity: 0.2
              }}
            />

            {/* Friend Intention Nodes */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {MOCK_FRIENDS.map((friend, idx) => {
                const fAngle = (idx * 360) / MOCK_FRIENDS.length + 45;
                const fRadius = 34; 
                const fColor = getStateColor(friend.state);
                return (
                  <Tooltip key={friend.id}>
                    <TooltipTrigger asChild>
                      <div 
                        onClick={() => handleFindFriend(friend)}
                        className="absolute flex flex-col items-center gap-1 pointer-events-auto cursor-pointer group/friend"
                        style={{ 
                          left: `${50 + fRadius * Math.cos((fAngle * Math.PI) / 180)}%`,
                          top: `${50 + fRadius * Math.sin((fAngle * Math.PI) / 180)}%`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <div 
                          className="w-10 h-10 rounded-full border-2 flex items-center justify-center relative backdrop-blur-md transition-all duration-1000 group-hover/friend:scale-125 group-hover/friend:border-white"
                          style={{ 
                            backgroundColor: `${fColor}15`,
                            borderColor: `${fColor}40`
                          }}
                        >
                          <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ backgroundColor: fColor, animationDuration: pulseDuration }} />
                          <Heart size={14} fill={fColor} className="text-primary/10" style={{ animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite` }} />
                        </div>
                        <span className="text-[7px] font-black text-muted-foreground uppercase tracking-tighter group-hover/friend:text-foreground">{friend.name}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="bg-card/95 border-border/10 px-4 py-2 rounded-xl text-center">
                      <p className="text-[9px] font-black text-foreground">{friend.name}</p>
                      <p className="text-[8px] font-bold text-muted-foreground uppercase mt-1 italic">"{friend.msg}"</p>
                      <div className="flex items-center justify-center gap-1.5 mt-1 pt-1 border-t border-border/5">
                        <Radio size={8} className="text-blue-400" />
                        <span className="text-[7px] font-black text-blue-400 uppercase tracking-widest">{friend.dist} Mesh</span>
                      </div>
                      <div className="mt-2 flex items-center justify-center gap-1.5 bg-primary/20 py-1 rounded-md">
                        <Navigation size={8} className="text-primary animate-pulse" />
                        <span className="text-[6px] font-black uppercase text-primary">Tap heart to find</span>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <div className="flex flex-col items-center text-center gap-2 relative z-10">
              <div 
                className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10 mb-1 transition-all"
                style={{ 
                  animation: `heart-beat-inner ${pulseDuration} ease-in-out infinite`
                }}
              >
                {/* User's Central Heart - Radiant RED */}
                <Heart 
                  size={48} 
                  fill="#DC2626" 
                  className="text-foreground/20 transition-all duration-700" 
                  style={{ 
                    filter: 'blur(4px) drop-shadow(0 0 15px #DC2626)',
                    opacity: 0.8
                  }} 
                />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/60 leading-none">
                {currentLang === 'de' ? current.de : current.en}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!learningArchetype} onOpenChange={() => setLearningArchetype(null)}>
        <DialogContent className="bg-card border-border/10 max-md p-8 rounded-[3rem] font-headline animate-in zoom-in-95 duration-300">
          <DialogHeader className="mb-6">
            <div className="flex items-center gap-4">
              <div className={cn("p-4 rounded-2xl bg-card/5 border border-border/10", learningArchetype?.color)}>
                {learningArchetype && <learningArchetype.icon size={32} />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-black uppercase tracking-tighter text-foreground">
                  {currentLang === 'de' ? learningArchetype?.de : learningArchetype?.en}
                </DialogTitle>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Wisdom Protocol</p>
              </div>
            </div>
          </DialogHeader>
          <div className="space-y-8">
            <div className="space-y-2">
               <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Explanation</span>
               <p className="text-sm font-bold text-foreground/80 leading-relaxed uppercase tracking-widest">{learningArchetype?.explanation}</p>
            </div>
            <div className="p-6 bg-primary/5 border border-primary/20 rounded-2xl space-y-3">
               <div className="flex items-center gap-3">
                 <Sparkles size={16} className="text-primary" />
                 <span className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">Development Practice</span>
               </div>
               <p className="text-xs font-bold text-foreground leading-relaxed uppercase tracking-wider italic">{learningArchetype?.practice}</p>
            </div>
            <button 
              onClick={() => setLearningArchetype(null)}
              className="w-full py-5 bg-card text-black rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all"
            >
              Continue Calibration
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}

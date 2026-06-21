

import { Link } from 'wouter';
import { Rocket, Shield, Users, Activity, Heart, Smartphone } from 'lucide-react';
import type { OnboardingData } from '@/app/onboarding/page';

/**
 * @fileOverview Legacy Summary Step.
 * Updated: Unified calibration visual.
 */

export function Step7Summary({ data }: { data: OnboardingData }) {
  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000 px-6 font-headline">
      <div className="relative mb-12 flex items-center justify-center">
        <div className="absolute inset-0 bg-primary/10 blur-[80px] rounded-full" />
        <div className="relative w-24 h-24 bg-card border-2 border-primary/30 rounded-full flex items-center justify-center shadow-2xl">
          <Smartphone size={40} className="text-primary animate-pulse" />
        </div>
      </div>
      
      <h2 className="font-headline text-4xl font-black uppercase mb-12 text-center text-white tracking-tighter leading-none">
        DEVICE ALIGNED, <br/>
        <span className="text-primary">{data.name || 'USER'}</span>!
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-12 max-w-2xl">
        {[
          { label: 'Health Profile', icon: Activity, count: data.medications.length },
          { label: 'Circle Bonds', icon: Users, count: 0 },
          { label: 'Truth Logs', icon: Shield, count: data.substances.length },
        ].map((item) => (
          <div key={item.label} className="bg-card border-2 border-border/10 rounded-[2rem] p-8 flex flex-col items-center gap-4 group hover:border-primary transition-all">
            <item.icon className="w-8 h-8 text-primary group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block font-headline font-black uppercase tracking-widest text-[9px] text-white/40 mb-1">{item.label}</span>
              <span className="text-2xl font-headline font-black text-white">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      <Link href="/dashboard" className="w-full max-w-sm">
        <button className="pill-button w-full bg-primary text-white text-lg font-black uppercase tracking-widest neon-glow active:scale-95 transition-all">
          ACCESS DASHBOARD
        </button>
      </Link>
    </div>
  );
}

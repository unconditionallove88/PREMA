"use client"

import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode, ShieldCheck } from 'lucide-react';

export function Step5SafetyNetwork({ onComplete }: { onComplete: () => void }) {
  const [shareLocation, setShareLocation] = useState(false);

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="font-headline text-4xl font-bold uppercase mb-4 text-center">Safety Network</h2>
      <p className="text-white/50 text-center mb-12 text-sm uppercase tracking-widest">Connect with awareness teams on-site</p>

      <div className="w-full max-w-sm space-y-8">
        {/* QR Code Placeholder */}
        <div className="bg-card p-8 rounded-3xl aspect-square flex flex-col items-center justify-center gap-4 shadow-[0_0_30px_rgba(255,255,255,0.1)] group">
          <QrCode className="w-32 h-32 text-black transition-transform group-hover:scale-105" />
          <span className="font-headline font-bold uppercase text-black tracking-widest text-xs">My Code</span>
        </div>

        <div className="bg-card rounded-2xl border border-border/10 p-6 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <Label htmlFor="share-location" className="font-headline font-bold uppercase tracking-wider text-sm">Share Location with Awareness</Label>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Only active during emergency alerts</p>
          </div>
          <Switch 
            id="share-location"
            checked={shareLocation}
            onCheckedChange={setShareLocation}
            className="data-[state=checked]:bg-secondary"
          />
        </div>

        <div className="flex items-center gap-3 text-white/40 justify-center">
          <ShieldCheck className="w-4 h-4 text-secondary" />
          <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted Safety Link</span>
        </div>

        <button
          onClick={onComplete}
          className="pill-button w-full bg-secondary text-black text-lg neon-glow font-headline uppercase tracking-wide"
        >
          CONFIRM NETWORK
        </button>
      </div>
    </div>
  );
}

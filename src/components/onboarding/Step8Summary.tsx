
"use client"

import { useState, useEffect } from 'react';
import { Shield, Users, Activity, Phone, ArrowRight, Heart } from 'lucide-react';
import type { OnboardingData } from '@/app/onboarding/page';

/**
 * @fileOverview Calibration Summary.
 * Color action: hsl(var(--primary))
 * Languages: EN, DE, PT.
 * Updated: Replaced rocket with Device Calibration resonance visual.
 */

const CONTENT = {
  EN: { header: "CALIBRATED,", sub: "PROFILE READY • PROCEED TO FINAL HEART CHECK", health: "Health Profile", links: "Safety Links", lab: "Substance Lab", contact: "Emergency Contact", button: "Final Heart Check", footer: "Created in harmony" },
  DE: { header: "KALIBRIERT,", sub: "PROFIL BEREIT • WEITER ZUM FINALE HEART CHECK", health: "Gesundheitsprofil", links: "Sicherheits-Links", lab: "Substanz-Labor", contact: "Notfallkontakt", button: "Finale Heart Check", footer: "In Harmonie erschaffen hier" },
  PT: { header: "CALIBRADO,", sub: "PERFIL PRONTO • PROSSIGA PARA o CHECK-IN FINAL", health: "Perfil de Saúde", links: "Vínculos de Segurança", lab: "Pulse Lab", contact: "Contato de Emergência", button: "Check-in do Coração", footer: "Criado em harmonia" }
};

export function Step9Summary({ data, onComplete }: { data: OnboardingData, onComplete: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT'>('EN');

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;
  const name = data.name || (lang === 'PT' ? "ALMA" : "USER");

  return (
    <div className="w-full flex flex-col items-center animate-in fade-in zoom-in duration-1000 min-h-[70vh] justify-center font-headline px-6">
      {/* Device Calibration Resonance Visual */}
      <div className="relative mb-16 flex items-center justify-center">
        <div className="absolute inset-0 bg-secondary/10 blur-[100px] rounded-full" />
        
        {/* Pulsing Outer Rings */}
        <div className="absolute w-40 h-40 border-2 border-primary/20 rounded-full animate-ping opacity-20" />
        <div className="absolute w-64 h-64 border border-primary/10 rounded-full animate-ping opacity-10" style={{ animationDelay: '1s' }} />
        
        {/* Central Core */}
        <div className="relative w-32 h-32 bg-card rounded-full border-4 border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(245,169,133,0.25)]">
          <Heart size={64} fill="hsl(var(--primary))" className="text-primary animate-pulse-heart" style={{ filter: 'drop-shadow(0 0 15px hsl(var(--primary)))' }} />
          
          {/* Alignment Markings */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-primary rounded-full" />
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-4 bg-primary rounded-full" />
          <div className="absolute -left-2 top-1/2 -translate-y-1/2 h-1 w-4 bg-primary rounded-full" />
          <div className="absolute -right-2 top-1/2 -translate-y-1/2 h-1 w-4 bg-primary rounded-full" />
        </div>
      </div>

      <div className="text-center mb-16 space-y-4">
        <h2 className="font-headline text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none text-white">
          {t.header} <br/>
          <span className="text-secondary drop-shadow-[0_0_20px_rgba(62,180,137,0.4)]">{name}</span>!
        </h2>
        <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-sm md:text-base">
          {t.sub}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full mb-20 max-w-4xl">
        {[
          { label: t.health, icon: Activity, count: (data.medications?.length || 0) + (data.healthConditions?.length || 0) },
          { label: t.links, icon: Users, count: 1 },
          { label: t.lab, icon: Shield, count: data.substances?.length || 0 },
          { label: t.contact, icon: Phone, count: data.verification ? 1 : 0 },
        ].map((item) => (
          <div key={item.label} className="bg-card border-2 border-border/10 rounded-[2.5rem] p-8 flex flex-col items-center gap-4 group hover:border-secondary transition-all duration-500 hover:scale-105">
            <item.icon className="w-10 h-10 text-secondary group-hover:scale-110 transition-transform" />
            <div className="text-center">
              <span className="block font-headline font-black uppercase tracking-[0.3em] text-[10px] text-white/40 mb-2">{item.label}</span>
              <span className="text-3xl font-headline font-black text-white">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={onComplete} 
        className="pill-button w-full max-w-md bg-primary text-white text-2xl py-10 neon-glow font-headline font-black uppercase tracking-[0.2em] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4"
      >
        {t.button} <ArrowRight className="w-8 h-8" />
      </button>
      
      <footer className="mt-16 text-center">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">
          {t.footer}
        </p>
      </footer>
    </div>
  );
}

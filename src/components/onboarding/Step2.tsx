"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * @fileOverview Identity Calibration step.
 * Languages: EN, DE, PT.
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Let's get to know each other", sub: "Biometric calibration",
    text: "Your data helps us calibrate safety metrics and is stored locally",
    nameLabel: "Username", namePlaceholder: "ENTER NAME", dobLabel: "Date of birth", dobPlaceholder: "DD / MM / YYYY",
    weightLabel: "Weight (KG)", heightLabel: "Height (CM)", underageError: "Error: You must be 18+ to access",
    confirm: "Confirm & continue", skip: "Skip - no changes"
  },
  DE: {
    back: "ZURÜCK", header: "Lass uns einander kennenlernen", sub: "Biometrische Kalibrierung",
    text: "Deine Daten helfen uns, Sicherheitsmetriken zu kalibrieren, und werden lokal gespeichert",
    nameLabel: "Benutzername", namePlaceholder: "NAME EINGEBEN", dobLabel: "Geburtsdatum", dobPlaceholder: "TT / MM / JJJJ",
    weightLabel: "Gewicht (KG)", heightLabel: "Größe (CM)", underageError: "Fehler: Du musst 18+ sein, um beizutreten",
    confirm: "Bestätigen & weiter", skip: "Überspringen - keine Änderungen"
  },
  PT: {
    back: "VOLTAR", header: "Vamos nos conhecer", sub: "Calibração biométrica",
    text: "Seus dados nos ajudam a calibrar métricas de segurança e são armazenados localmente",
    nameLabel: "Nome de usuário", namePlaceholder: "DIGITE SEU NOME", dobLabel: "Data de nascimento", dobPlaceholder: "DD / MM / AAAA",
    weightLabel: "Peso (KG)", heightLabel: "Altura (CM)", underageError: "Erro: Você deve ter 18+ para acessar",
    confirm: "Confirmar e continuar", skip: "Pular - sem alterações"
  }
};

export function Step2WhoAreYou({ initialData, onComplete, onSkip, onBack }: { initialData?: any, onComplete: (profile: any) => void, onSkip?: () => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT'>('EN');
  const [form, setForm] = useState({
    name: initialData?.name || '',
    dob: initialData?.dob || '', 
    weight: initialData?.weight?.toString() || '',
    height: initialData?.height?.toString() || '',
  });

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT'].includes(savedLang)) setLang(savedLang);
  }, []);

  const calculateAge = (dobString: string) => {
    const parts = dobString.split(' / ');
    if (parts.length !== 3 || parts[2].length !== 4) return 0;
    const birthDate = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    const ref = new Date();
    let age = ref.getFullYear() - birthDate.getFullYear();
    if (ref.getMonth() < birthDate.getMonth() || (ref.getMonth() === birthDate.getMonth() && ref.getDate() < birthDate.getDate())) age--;
    return age;
  };

  const handleDobInput = (val: string) => {
    const digits = val.replace(/\D/g, '').substring(0, 8);
    let f = '';
    if (digits.length > 0) {
      f += digits.substring(0, 2);
      if (digits.length > 2) f += ' / ' + digits.substring(2, 4);
      if (digits.length > 4) f += ' / ' + digits.substring(4, 8);
    }
    setForm(p => ({ ...p, dob: f }));
  };

  const t = CONTENT[lang] || CONTENT.EN;
  const weightVal = parseInt(form.weight) || 0;
  const heightVal = parseInt(form.height) || 0;
  const age = calculateAge(form.dob);
  const isFormValid = form.name && form.dob.length === 14 && weightVal >= 30 && heightVal >= 50 && age >= 18;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center max-w-xl font-headline mx-auto px-4 relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="text-center mb-8 mt-12">
        <h2 className="text-[22px] font-black uppercase mb-1 text-white tracking-tighter">{t.header}</h2>
        <p className="text-primary font-black uppercase tracking-[0.3em] text-[10px] mb-4">{t.sub}</p>
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest max-w-[280px] mx-auto leading-relaxed">{t.text}</p>
      </div>
      <div className="w-full space-y-4 mb-10">
        <div className="space-y-2">
          <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-primary block">{t.nameLabel}</Label>
          <Input 
            value={form.name} 
            onChange={(e) => setForm(p => ({...p, name: e.target.value.toUpperCase()}))} 
            className="bg-card border-2 border-border/20 h-16 px-6 rounded-[1rem] focus:border-secondary text-2xl font-black uppercase text-white" 
            placeholder={t.namePlaceholder} 
          />
        </div>
        <div className="space-y-2">
          <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-primary block">{t.dobLabel}</Label>
          <Input 
            type="text" 
            placeholder={t.dobPlaceholder} 
            value={form.dob} 
            onChange={(e) => handleDobInput(e.target.value)} 
            className="bg-card border-2 h-16 px-6 rounded-[1rem] focus:border-secondary text-2xl font-black text-white" 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-primary block">{t.weightLabel}</Label>
            <Input 
              value={form.weight} 
              onChange={(e) => setForm(p => ({...p, weight: e.target.value.replace(/\D/g, '')}))} 
              className="bg-card border-2 h-16 px-6 rounded-[1rem] focus:border-secondary text-2xl font-black text-white" 
              placeholder="70" 
            />
          </div>
          <div className="space-y-2">
            <Label className="uppercase font-black tracking-[0.3em] text-[10px] text-primary block">{t.heightLabel}</Label>
            <Input 
              value={form.height} 
              onChange={(e) => setForm(p => ({...p, height: e.target.value.replace(/\D/g, '')}))} 
              className="bg-card border-2 h-16 px-6 rounded-[1rem] focus:border-secondary text-2xl font-black text-white" 
              placeholder="175" 
            />
          </div>
        </div>
      </div>
      <button 
        onClick={() => onComplete({...form, weight: weightVal, height: heightVal, age})} 
        disabled={!isFormValid} 
        className={`pill-button w-full max-w-sm text-xl font-black uppercase tracking-[0.2em] transition-all h-[64px] ${isFormValid ? 'bg-primary text-white neon-glow active:scale-95' : 'bg-card/10 text-white/10 cursor-not-allowed opacity-50'}`}
      >
        {t.confirm}
      </button>
    </div>
  );
}

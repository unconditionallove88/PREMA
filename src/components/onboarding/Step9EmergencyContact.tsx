"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

/**
 * @fileOverview Emergency Contact step with full multilingual support.
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Emergency contact", sub: "Who do we call in an emergency?",
    nameLabel: "Contact name", phoneLabel: "Phone number",
    disclaimer: "This information is only used if you trigger an SOS alert or are unresponsive. Data is protected by end-to-end encryption.",
    button: "Start session"
  },
  DE: {
    back: "ZURÜCK", header: "Notfallkontakt", sub: "Wen rufen wir im Notfall an?",
    nameLabel: "Name des Kontakts", phoneLabel: "Telefonnummer",
    disclaimer: "Diese Informationen werden nur verwendet, wenn du einen SOS-Alarm auslöst oder nicht ansprechbar bist. Deine Daten sind durch Ende-zu-Ende-Verschlüsselung geschützt.",
    button: "Sitzung starten"
  },
  PT: {
    back: "VOLTAR", header: "Contato de emergência", sub: "Quem devemos chamar em uma emergência?",
    nameLabel: "Nome do contato", phoneLabel: "Número de telefone",
    disclaimer: "Esta informação só é usada se você acionar um alerta de SOS. Os dados são protegidos por criptografia de ponta a ponta.",
    button: "Iniciar sessão"
  },
  RU: {
    back: "НАЗАД", header: "Экстренный контакт", sub: "Кому нам позвонить в экстренном случае?",
    nameLabel: "Имя контакта", phoneLabel: "Номер телефона",
    disclaimer: "Эта информация используется только при активации SOS. Данные защищены сквозным шифрованием.",
    button: "Начать сессию"
  }
};

export function Step9EmergencyContact({ onComplete, onBack }: { onComplete: (contact: { name: string; phone: string }) => void, onBack?: () => void }) {
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');
  const [form, setForm] = useState({ name: '', phone: '' });

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;
  const isValid = form.name.trim().length > 0 && form.phone.length >= 8;

  return (
    <div className="w-full flex flex-col items-center font-headline relative">
      {onBack && <button onClick={onBack} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="text-center mb-16 mt-12"><h2 className="text-5xl font-black uppercase mb-4 text-white tracking-tighter">{t.header}</h2><p className="text-primary font-bold uppercase tracking-[0.2em] text-sm">{t.sub}</p></div>
      <div className="w-full max-w-xl space-y-12 mb-16">
        <div className="space-y-4"><Label className="uppercase font-black tracking-[0.3em] text-sm text-primary block">{t.nameLabel}</Label><Input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} className="bg-card border-2 border-border/20 h-20 px-8 rounded-[1.5rem] focus:border-secondary text-2xl font-black uppercase text-white placeholder:text-white/10" placeholder="E.G. ALEX SMITH" /></div>
        <div className="space-y-4"><Label className="uppercase font-black tracking-[0.3em] text-sm text-primary block">{t.phoneLabel}</Label><Input type="text" value={form.phone} onChange={(e) => setForm(p => ({ ...p, phone: e.target.value.replace(/[^0-9+]/g, '') }))} className="bg-card border-2 border-border/20 h-20 px-8 rounded-[1.5rem] focus:border-secondary text-2xl font-black text-white placeholder:text-white/10" placeholder="+49 123 456789" /></div>
        <div className="flex items-start gap-4 p-6 bg-card/5 rounded-2xl border border-border/10"><ShieldCheck className="w-6 h-6 text-secondary shrink-0" /><p className="text-[10px] font-bold text-white/40 uppercase tracking-widest leading-relaxed">{t.disclaimer}</p></div>
      </div>
      <button onClick={() => onComplete(form)} disabled={!isValid} className={`pill-button w-full max-w-sm py-8 text-2xl font-black uppercase tracking-[0.2em] transition-all ${isValid ? 'bg-secondary text-black neon-glow active:scale-95' : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5'}`}>{t.button}</button>
    </div>
  );
}

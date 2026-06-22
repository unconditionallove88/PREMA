
import { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Mic } from 'lucide-react';
import { Link } from 'wouter';
import type { LegalAgreements } from '@/app/onboarding/page';

/**
 * @fileOverview Foundations of Care (Agreements).
 * Updated: Added Voice Intention agreement.
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Harm Reduction", subtext: "Please read and accept to continue",
    agree: "I accept and continue", understand: "I accept",
    sections: [
      { id: 'harmReduction', title: 'Harm Reduction', text: 'Prema is a tool for harm reduction for substance use and designed to provide information and support. It is not intended to encourage illegal activities.' },
      { id: 'medicalAdvice', title: 'Not medical advice', text: 'The information provided by this app is for educational purposes and does not constitute medical advice or diagnosis.' },
      { id: 'privacy', title: 'Data & Privacy (GDPR)', text: 'Your data is stored locally and anonymously. We never sell or share personal data with third parties. You can delete your data at any time.' },
      { id: 'safetyNetwork', title: 'Your network', text: 'Prema allows you to create a network of trusted contacts who can be notified if you need connection or support.' },
      { id: 'immediateHelp', title: 'Emergency support', text: 'In a medical emergency, do not rely on this app — call 112 (EU) or your local emergency number immediately.' },
    ]
  },
  DE: {
    back: "ZURÜCK", header: "Harm Reduction", subtext: "Bitte lies und stimme zu um fortzufahren",
    agree: "Ich akzeptiere und fahre fort", understand: "Ich akzeptiere",
    sections: [
      { id: 'harmReduction', title: 'Harm Reduction', text: 'Prema ist ein Tool zur Schadensminimierung für Substanzkonsum und bietet Informationen und Unterstützung. Es ist nicht dazu gedacht, illegale Aktivitäten zu fördern.' },
      { id: 'medicalAdvice', title: 'Kein medizinischer Rat', text: 'Die von dieser App bereitgestellten Informationen dienen Bildungszwecken und stellen keine medizinische Beratung dar.' },
      { id: 'privacy', title: 'Daten & Datenschutz (DSGVO)', text: 'Deine Daten werden lokal und anonym gespeichert. Wir verkaufen oder teilen keine persönlichen Daten. Du kannst deine Daten jederzeit löschen.' },
      { id: 'safetyNetwork', title: 'Dein Netzwerk', text: 'Prema ermöglicht es dir, ein Netzwerk aus vertrauenswürdigen Kontakten zu erstellen, die bei Bedarf informiert werden können.' },
      { id: 'immediateHelp', title: 'Notfallhilfe', text: 'Im medizinischen Notfall verlasse dich nicht auf diese App — rufe sofort 112 oder deine lokale Notrufnummer.' },
    ]
  }
};

export function Step1ImportantStuff({ onComplete }: { onComplete: (legal: LegalAgreements) => void }) {
  const [lang, setLang] = useState<'EN' | 'DE'>('EN');
  const [agreements, setAgreements] = useState({
    harmReduction: false, medicalAdvice: false, privacy: false, voice: false, safetyNetwork: false, immediateHelp: false,
  });
  
  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.EN;
  const allAgreed = Object.values(agreements).every(v => v === true);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full max-w-xl font-headline mx-auto px-4 relative">
      <Link href="/auth" className="absolute top-0 left-4 text-white/40 hover:text-white transition-colors flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50">
        <ArrowLeft className="w-4 h-4" /> {t.back}
      </Link>
      <div className="text-center mb-6 mt-12">
        <h2 className="text-[22px] font-black uppercase mb-1 text-white leading-tight tracking-tighter">{t.header}</h2>
        <p className="text-base font-bold uppercase tracking-widest text-white/40">{t.subtext}</p>
      </div>
      <Accordion type="single" collapsible className="w-full space-y-3 mb-10">
        {t.sections.map((item) => (
          <AccordionItem key={item.id} value={item.id} className="border-2 border-border/10 bg-card rounded-[1.5rem] px-5 py-0.5 transition-all data-[state=open]:border-primary">
            <AccordionTrigger className="hover:no-underline font-headline font-black uppercase text-left py-4 text-base tracking-tight flex gap-3">
              {item.id === 'voice' && <Mic size={16} className="text-primary" />}
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <p className="text-white/70 text-sm mb-4 leading-relaxed font-bold">{item.text}</p>
              <div className="flex items-center gap-3 bg-card/5 px-4 py-2 rounded-xl border border-border/10 w-fit">
                <Switch checked={agreements[item.id as keyof typeof agreements]} onCheckedChange={(val) => setAgreements(prev => ({...prev, [item.id]: val}))} className="data-[state=checked]:bg-primary" />
                <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-primary cursor-pointer">{t.understand}</Label>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <button onClick={() => onComplete({ agreedToHarmReduction: agreements.harmReduction, agreedToMedicalDisclaimer: agreements.medicalAdvice, agreedToGDPR: agreements.privacy, agreedToSafetyNetwork: agreements.safetyNetwork, agreedToImmediateHelp: agreements.immediateHelp, termsAcceptedAt: new Date().toISOString(), appVersion: "1.0.0" } as any)} disabled={!allAgreed} className={`pill-button w-full max-w-sm text-lg font-black uppercase tracking-[0.2em] transition-all ${allAgreed ? 'bg-primary text-white neon-glow active:scale-95' : 'bg-card/10 text-white/10 cursor-not-allowed border-2 border-border/5'}`}>{t.agree}</button>
    </div>
  );
}

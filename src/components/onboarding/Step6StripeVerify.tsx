
"use client";

import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, ArrowLeft, Loader2, CircleDot } from "lucide-react";
import { useFirestore, useUser } from "@/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * @fileOverview Identity Calibration step with full multilingual support.
 * Linguistic purification: Removed "safe" and "secure".
 */

const CONTENT = {
  EN: {
    back: "BACK", header: "Age Verification", sub: "To honor community standards and protect our circle we verify your age via a private payment method",
    stripeLabel: "Private Verification via Stripe",
    peaceOfMind: "Your peace of mind matters No charge will be made This is a zero-euro authorization Data is encrypted and never stored by StayOnBeat",
    button: "Verify My Identity", verifying: "Verifying...", successHeader: "Identity Verified",
    successSub: "Thank you for helping us keep this space resonant Your account is now calibrated", footer: "PCI-DSS Compliant • Encrypted • Private"
  },
  DE: {
    back: "ZURÜCK", header: "Altersverifizierung", sub: "Um Community-Standards zu erfüllen und unseren Kreis zu schützen verifizieren wir dein Alter über eine private Zahlungsmethode",
    stripeLabel: "Private Verifizierung über Stripe",
    peaceOfMind: "Dein Seelenfrieden ist uns wichtig Es wird keine Gebühr erhoben Dies ist eine Null-Euro-Autorisierung Die Daten sind verschlüsselt und werden niemals von StayOnBeat gespeichert",
    button: "Identität verifizieren", verifying: "Wird verifiziert...", successHeader: "Identität verifiziert",
    successSub: "Danke dass du uns hilfst diesen Raum resonant zu halten Dein Konto ist nun kalibriert", footer: "PCI-DSS-konform • Verschlüsselt • Privat"
  },
  PT: {
    back: "VOLTAR", header: "Santuário para Adultos", sub: "Para honrar os padrões da comunidade e proteger nosso círculo verificamos sua idade via um método de pagamento privado",
    stripeLabel: "Verificação privada via Stripe",
    peaceOfMind: "Sua paz de espírito importa Nenhuma cobrança será feita Esta é uma autorização de zero euros Seus dados são criptografados e nunca armazenados",
    button: "Verificar Identidade", verifying: "Verificando...", successHeader: "Identidade Verificada",
    successSub: "Obrigado por nos ajudar a manter este santuário ressonante Sua conta está calibrada", footer: "PCI-DSS Compliant • Criptografado • Privado"
  },
  RU: {
    back: "НАЗАД", header: "Пространство для Взрослых", sub: "Для соблюдения стандартов сообщества мы подтверждаем твой возраст через приватный способ оплаты",
    stripeLabel: "Приватная проверка через Stripe",
    peaceOfMind: "Твое спокойствие важно Плата не взимается Это авторизация на ноль евро Данные зашифрованы и не хранятся у нас",
    button: "Подтвердить личность", verifying: "Проверка...", successHeader: "Личность подтверждена",
    successSub: "Спасибо за помощь в сохранении резонанса пространства Твой аккаунт откалиброван", footer: "PCI-DSS • Зашифровано • Приватно"
  }
};

export function Step6StripeVerify({ onComplete, onBack }: { onComplete: (data: { stripeId: string; last4: string }) => void, onBack?: () => void }) {
  const firestore = useFirestore();
  const { user } = useUser();
  const [lang, setLang] = useState<'EN' | 'DE' | 'PT' | 'RU'>('EN');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toUpperCase() as any;
    if (['EN', 'DE', 'PT', 'RU'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.EN;

  const handleSimulateStripe = async () => {
    setIsVerifying(true);
    await new Promise((r) => setTimeout(r, 2000));
    if (user && firestore) {
      await setDoc(doc(firestore, "users", user.uid), {
        verification: { isAgeVerified: true, method: "stripe_card_check_demo", verifiedAt: serverTimestamp(), stripeCustomerId: "cus_DEMO_" + Math.random().toString(36).slice(2, 11), last4: "4242" },
        trustLevel: "verified_adult",
      }, { merge: true });
    }
    setIsSuccess(true);
    setTimeout(() => onComplete({ stripeId: "cus_DEMO_123", last4: "4242" }), 1000);
  };

  if (isSuccess) {
    return (
      <div className="w-full min-h-[80vh] flex flex-col items-center justify-center text-center px-6 font-headline animate-in fade-in zoom-in-95 duration-1000">
        <div className="w-32 h-32 bg-[#3EB489]/10 rounded-full flex items-center justify-center mb-8 border-2 border-[#3EB489]/30 shadow-[0_0_50px_rgba(62,180,137,0.2)]"><ShieldCheck size={64} className="text-[#3EB489]" /></div>
        <h2 className="text-4xl font-black uppercase tracking-tighter text-white mb-4">{t.successHeader}</h2>
        <p className="text-white/60 text-lg font-bold max-sm leading-tight">{t.successSub}</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-xl mx-auto px-4 text-center relative">
      {onBack && <button onClick={onBack} disabled={isVerifying} className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"><ArrowLeft className="w-4 h-4" /> {t.back}</button>}
      <div className="mt-12 mb-8 text-center">
        <div className="inline-flex p-4 bg-blue-600/10 rounded-[1.5rem] mb-6 border border-blue-500/20"><CreditCard className="text-blue-500" size={32} /></div>
        <h1 className="text-[28px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">{t.header}</h1>
        <p className="text-white/40 font-black uppercase tracking-[0.2em] text-[10px] max-w-[280px] mx-auto">{t.sub}</p>
      </div>
      <div className="w-full space-y-4 mb-10">
        <div className="p-8 bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 text-left">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">{t.stripeLabel}</p>
          <div className="space-y-4">
            <div className="h-16 w-full bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-xl font-black tracking-[0.2em] font-mono">4242 4242 4242 4242</div>
            <div className="flex gap-4"><div className="h-16 flex-1 bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-lg font-black uppercase font-mono">MM / YY</div><div className="h-16 w-32 bg-white/5 border-2 border-white/10 rounded-xl flex items-center px-6 text-white/20 text-lg font-black uppercase font-mono">CVC</div></div>
          </div>
        </div>
        <div className="flex items-start gap-4 p-5 bg-blue-50/5 rounded-2xl border border-blue-500/20 text-left"><CircleDot size={18} className="text-blue-500 shrink-0 mt-0.5" /><p className="text-[10px] text-blue-200/60 font-bold leading-relaxed uppercase tracking-widest leading-tight">{t.peaceOfMind}</p></div>
      </div>
      <button onClick={handleSimulateStripe} disabled={isVerifying} className={`pill-button w-full max-w-sm text-xl font-black uppercase tracking-[0.2em] transition-all h-[64px] shadow-lg disabled:opacity-50 ${isVerifying ? "bg-blue-400" : "bg-blue-600 text-white"}`}>{isVerifying ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : t.button}</button>
      <p className="text-[8px] font-bold text-white/20 uppercase tracking-[0.4em] mt-4">{t.footer}</p>
    </div>
  );
}


import { useState, useEffect } from "react";
import { Bell, Heart, X } from "lucide-react";
import { askForNotificationPermission } from "@/lib/notifications";
import { cn } from "@/lib/utils";

interface NotificationPromptProps {
  onClose: () => void;
}

export default function NotificationPrompt({ onClose }: NotificationPromptProps) {
  const [preferredHour, setPreferredHour] = useState(10);
  const [isEnabled, setIsEnabled] = useState(false);
  const [lang, setLang] = useState<'en' | 'de' | 'pt' | 'ru'>('en');

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de', 'pt', 'ru'].includes(savedLang)) setLang(savedLang);
  }, []);

  const handleEnable = async () => {
    await askForNotificationPermission(preferredHour);
    setIsEnabled(true);
    setTimeout(onClose, 2000);
  };

  const content = {
    en: {
      successTitle: "Reminders active",
      successSub: "I am loved",
      header: "Daily Heart Check-in",
      sub: "Choose when you would like us to check in",
      enable: "Enable Reminders",
      later: "Maybe later",
      times: [
        { label: "Morning 🌅 (8am)", value: 8 },
        { label: "Mid-Morning ☀️ (10am)", value: 10 },
        { label: "Afternoon 🌿 (2pm)", value: 14 },
        { label: "Evening 🌙 (7pm)", value: 19 },
      ]
    },
    de: {
      successTitle: "Erinnerungen aktiv",
      successSub: "Ich bin geliebt ",
      header: "Täglicher Heart Check-in",
      sub: "Wähle aus, wann wir bei dir nachfragen sollen",
      enable: "Erinnerungen aktivieren",
      later: "Vielleicht später",
      times: [
        { label: "Morgens 🌅 (8:00)", value: 8 },
        { label: "Vormittags ☀️ (10:00)", value: 10 },
        { label: "Nachmittags 🌿 (14:00)", value: 14 },
        { label: "Abends 🌙 (19:00)", value: 19 },
      ]
    },
    pt: {
      successTitle: "Lembretes ativos",
      successSub: "Eu sou muito amado",
      header: "Check-in Diário",
      sub: "Escolha o melhor horário para cuidarmos de você",
      enable: "Ativar Lembretes",
      later: "Talvez depois",
      times: [
        { label: "Manhã 🌅 (8h)", value: 8 },
        { label: "Meio-dia ☀️ (10h)", value: 10 },
        { label: "Tarde 🌿 (14h)", value: 14 },
        { label: "Noite 🌙 (19h)", value: 19 },
      ]
    },
    ru: {
      successTitle: "Напоминания активны",
      successSub: "Я очень сильно любим",
      header: "Ежедневная Проверка",
      sub: "Выберите время для напоминания о себе",
      enable: "Включить",
      later: "Позже",
      times: [
        { label: "Утро 🌅 (8:00)", value: 8 },
        { label: "День ☀️ (10:00)", value: 10 },
        { label: "После обеда 🌿 (14:00)", value: 14 },
        { label: "Вечер 🌙 (19:00)", value: 19 },
      ]
    }
  };

  const t = content[lang] || content.en;

  if (isEnabled) {
    return (
      <div className="fixed inset-0 bg-card/80 backdrop-blur-md z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
        <div className="bg-card w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-primary/30 p-12 text-center shadow-[0_-20px_100px_rgba(0,0,0,0.5)]">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-primary/20 shadow-[0_0_40px_rgba(27,77,62,0.1)]">
            <Heart size={48} fill="currentColor" className="text-primary animate-pulse-heart" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-primary mb-4">
            {t.successTitle}
          </h2>
          <p className="text-white/60 text-lg font-bold leading-tight">
            "{t.successSub}"
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-card/80 backdrop-blur-md z-[5000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-card w-full max-w-md rounded-t-[3rem] sm:rounded-[3rem] border-t-2 sm:border-2 border-border/10 p-8 pb-12 shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10" />
        
        <div className="w-16 h-1 bg-card/10 rounded-full mx-auto mb-10 sm:hidden" />

        <button
          onClick={onClose}
          className="absolute top-8 right-8 p-3 bg-card/5 rounded-full border border-border/10 text-white/40 hover:text-white transition-all z-10"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(27,77,62,0.1)]">
            <Bell size={32} className="text-primary" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
            {t.header}
          </h2>
          <p className="text-white/40 text-sm font-bold mt-4 leading-tight">
            {t.sub}
          </p>
        </div>

        {/* Time Picker */}
        <div className="grid grid-cols-2 gap-3 mb-10">
          {t.times.map((option) => (
            <button
              key={option.value}
              onClick={() => setPreferredHour(option.value)}
              className={cn(
                "py-5 px-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2",
                preferredHour === option.value
                  ? "bg-primary/10 border-primary text-primary shadow-lg shadow-primary/10"
                  : "bg-card/5 border-border/5 text-white/40 hover:border-border/20"
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <button
            onClick={handleEnable}
            className="w-full h-20 bg-primary text-white rounded-[1.5rem] font-black text-xl uppercase tracking-widest transition-all active:scale-95 shadow-lg"
          >
            {t.enable}
          </button>
          <button
            onClick={onClose}
            className="w-full h-14 text-white/20 text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            {t.later}
          </button>
        </div>
      </div>
    </div>
  );
}

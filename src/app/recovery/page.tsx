
"use client"

import { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  HeartPulse, 
  CheckCircle2, 
  Heart, 
  ShieldCheck, 
  Timer, 
  Droplets, 
  Zap, 
  Coffee, 
  Moon, 
  ExternalLink, 
  Wind, 
  Volume2, 
  Loader2, 
  Sparkles, 
  Stethoscope, 
  BrainCircuit, 
  PhoneCall,
  Calendar,
  ChevronRight,
  Eye,
  Users,
  Trash2
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisionOfLove } from '@/components/dashboard/VisionOfLove';

/**
 * @fileOverview Recovery Protocol Page.
 * Features: On-demand data purge and phone-based storage finalization.
 * Rhythmic Rules: 3 words (EN) / 4 words (DE).
 */

const PRACTITIONERS = [
  { name: "Dr. Aris Prema Hub", specialty: "General Medicine & Harm Reduction", address: "Mitte, Berlin", urgent: true },
  { name: "Mitte Care Center", specialty: "Sexual Health & STD Testing", address: "Prenzlauer Berg, Berlin", urgent: true },
  { name: "Pulse Partner Praxis", specialty: "Internal Medicine", address: "Kreuzberg, Berlin", urgent: false },
];

const CONTENT = {
  en: {
    integrated: "Integrated", 
    recovery: "Recovery", 
    personalProtocol: "Personalized protocol",
    activeProtection: "Active Protection", 
    secureWipe: "Session data wiped",
    protocolGenerated: "Personalized protocol generated", 
    privacyFinalized: "Privacy protocols finalized",
    dataAnalyzed: (count: number) => `Data analyzed: ${count} entries`,
    timeline: "Integration Timeline", 
    noLogs: "No logs detected",
    wipeWarning: "Completing this protocol will permanently wipe session logs and location history from the phone",
    finishBtn: "Complete Session Now", 
    returnBtn: "Return to Home",
    improveBtn: "Help us improve", 
    minutes: "4 minutes · anonymous",
    ritualTitle: "Breath of Love", 
    gpTitle: "GP Consultation", 
    gpDesc: "Contact your General Practitioner for high-fidelity STD testing and post-session health checks",
    mentalTitle: "Mental Integration", 
    mentalDesc: "Guidance for paranoia or intense side-effects Return to harmony through presence",
    emergencyBtn: "Call Emergency Directly",
    footer: "Created in harmony"
  },
  de: {
    integrated: "Integriert", 
    recovery: "Erholung", 
    personalProtocol: "Persönlicher Protokoll heute",
    activeProtection: "Aktiver Schutz heute", 
    secureWipe: "Sitzungsdaten gelöscht heute hier",
    protocolGenerated: "Persönliches Protokoll erstellt heute", 
    privacyFinalized: "Schutzprotokolle abgeschlossen heute hier",
    dataAnalyzed: (count: number) => `Daten analysiert: ${count} Einträge`,
    timeline: "Integrations Zeitachse heute", 
    noLogs: "Keine Sitzungsdaten gefunden",
    wipeWarning: "Der Abschluss dieses Protokolls löscht dauerhaft alle Sitzungsprotokolle und Verläufe vom Telefon",
    finishBtn: "Session jetzt abschließen heute", 
    returnBtn: "Zurück nach Hause heute",
    improveBtn: "Hilf uns verbessern heute", 
    Minuten: "4 Minuten · anonym",
    ritualTitle: "Atem der Liebe heute", 
    ritualDesc: "Führe das Ritual durch um dein Nervensystem sanft zu kalibrieren heute",
    gpTitle: "Praxis Besuch heute", 
    gpDesc: "Kontaktiere deinen Hausarzt für STD Tests und Gesundheitschecks nach der Sitzung",
    mentalTitle: "Mentale Integration heute", 
    mentalDesc: "Begleitung bei Paranoia oder intensiven Nebenwirkungen heute hier",
    emergencyBtn: "Notruf direkt anrufen heute",
    footer: "In Harmonie erschaffen hier"
  }
};

export default function RecoveryView() {
  const router = useRouter();
  const [detoxPlan, setDetoxPlan] = useState<any[]>([]);
  const [timeLeft, setTimeLeft] = useState('02:00:00');
  const [mounted, setMounted] = useState(false);
  const [sessionLogs, setSessionLogs] = useState<any[]>([]);
  const [isFinished, setIsFinished] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const [mentalOpen, setMentalOpen] = useState(false);
  const [gpOpen, setGPOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLang = (localStorage.getItem('prema_lang') || 'en').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    const logs = JSON.parse(localStorage.getItem('prema_logs') || '[]');
    setSessionLogs(logs);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const parts = prev.split(':').map(Number);
        if (parts.length !== 3) return '02:00:00';
        const [h, m, s] = parts;
        let totalSeconds = h * 3600 + m * 60 + s - 1;
        if (totalSeconds <= 0) return '00:00:00';
        const nh = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
        const nm = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
        const ns = (totalSeconds % 60).toString().padStart(2, '0');
        return `${nh}:${nm}:${ns}`;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  useEffect(() => {
    const plan: any[] = [
      { id: 'ritual', time: "Immediate", text: t.ritualTitle, desc: t.ritualDesc, icon: Wind, color: "text-primary", action: () => router.push('/self-care') },
      { id: 'mental', time: "Immediate", text: t.mentalTitle, desc: t.mentalDesc, icon: BrainCircuit, color: "text-purple-400", action: () => setMentalOpen(true) },
      { id: 'h2o', time: "10m", text: "Isotonic Rehydration", desc: "Consume 500ml water with electrolytes to restore mineral balance", icon: Droplets, color: "text-blue-500" },
      { id: 'gp', time: "24h", text: t.gpTitle, desc: t.gpDesc, icon: Stethoscope, color: "text-blue-400", action: () => setGPOpen(true) }
    ];
    setDetoxPlan(plan);
  }, [lang, router, t.ritualTitle, t.ritualDesc, t.mentalTitle, t.mentalDesc, t.gpTitle, t.gpDesc]);

  const handlePurge = () => {
    playHeartbeat();
    localStorage.removeItem('prema_logs');
    localStorage.removeItem('prema_mesh_history');
    setIsFinished(true);
  };

  const handleVoice = async () => {
    if (isSpeaking) return;
    setIsSpeaking(true);
    try {
      const text = isFinished ? t.privacyFinalized : `${t.protocolGenerated}.`;
      const { audioDataUri } = await textToSpeech({ text, lang: lang as any });
      const audio = new Audio(audioDataUri);
      audio.onended = () => setIsSpeaking(false);
      audio.play();
    } catch (e) { setIsSpeaking(false); }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-card text-white font-headline pb-64 pt-safe">
      <div className="bg-card/95 backdrop-blur-xl border-b border-border/5 px-6 py-8 sticky top-0 z-50">
        <div className="max-w-xl mx-auto space-y-6">
          <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 uppercase font-black text-[10px] tracking-widest hover:text-primary transition-colors"><ArrowLeft className="w-4 h-4" /> Back to home</button>
          <div className="flex justify-between items-end">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{isFinished ? t.integrated : t.recovery}</h1>
                <button onClick={handleVoice} disabled={isSpeaking} className="p-2 bg-card/5 rounded-full border border-border/10 hover:border-primary transition-all disabled:opacity-30">
                  {isSpeaking ? <Loader2 className="w-4 h-4 animate-spin text-primary" /> : <Volume2 className="w-4 h-4 text-primary" />}
                </button>
              </div>
              <p className="text-primary text-[10px] font-black uppercase tracking-[0.3em] mt-2">"{isFinished ? t.secureWipe : t.personalProtocol}"</p>
            </div>
            {!isFinished && <span className="font-mono text-primary text-xs font-black">{timeLeft}</span>}
          </div>
        </div>
      </div>

      <ScrollArea className="h-full">
        <div className="px-6 py-10 max-xl mx-auto space-y-12 pb-40">
          {!isFinished && (
            <section className="bg-card/[0.03] border-2 border-border/10 rounded-[2.5rem] p-8 space-y-6">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-red-600/10 rounded-2xl flex items-center justify-center border border-red-600/20"><Trash2 className="text-red-500" size={24} /></div>
                 <div>
                   <p className="text-sm font-black uppercase text-white">The Purge Protocol</p>
                   <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Phone data sovereignty</p>
                 </div>
               </div>
               <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest italic">
                 "{t.wipeWarning}"
               </p>
               <button 
                 onClick={handlePurge}
                 className="w-full py-5 bg-red-600/10 border border-red-600/20 text-red-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-red-600/20 transition-all"
               >
                 {t.finishBtn}
               </button>
            </section>
          )}

          {isFinished && (
             <section className="bg-primary/5 border-2 border-primary/20 rounded-[2.5rem] p-10 text-center animate-in zoom-in duration-700">
               <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/20">
                 <ShieldCheck className="text-primary" size={40} />
               </div>
               <h3 className="text-2xl font-black uppercase tracking-tighter text-white mb-2">{t.privacyFinalized}</h3>
               <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t.secureWipe}</p>
             </section>
          )}

          <div className="bg-red-600/10 border border-red-600/20 p-6 rounded-3xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PhoneCall className="text-red-500" size={24} />
              <p className="text-xs font-black uppercase text-white tracking-widest">{t.emergencyBtn}</p>
            </div>
            <button onClick={() => window.open('tel:112')} className="px-6 py-3 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] tracking-widest active:scale-95 transition-all">Call Now</button>
          </div>

          <section className="space-y-6">
            <div className="flex items-center gap-4 mb-4 px-2"><HeartPulse className="w-6 h-6 text-primary" /><h3 className="text-xl font-black uppercase tracking-tight">{t.timeline}</h3></div>
            <div className="grid gap-4">
              {detoxPlan.map((p) => (
                <div 
                  key={p.id} 
                  onClick={() => p.action?.()}
                  className={cn(
                    "p-8 rounded-[2.5rem] border border-border/10 bg-card/5 flex flex-col gap-4 group transition-all",
                    p.action ? "border-primary/40 bg-primary/5 cursor-pointer hover:bg-primary/10" : "hover:bg-primary/40"
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={cn("p-3 rounded-2xl bg-card/5", p.color)}><p.icon className="w-6 h-6" /></div>
                      <div className="flex flex-col"><span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">{p.time}</span><span className="text-xl font-black uppercase text-white">{p.text}</span></div>
                    </div>
                    {p.action ? <ChevronRight className="w-5 h-5 text-primary animate-pulse" /> : <CheckCircle2 className="w-5 h-5 text-primary/20" />}
                  </div>
                  <p className="text-sm font-bold text-white/60 leading-relaxed pl-2 border-l-2 border-border/10">{p.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </ScrollArea>

      <footer className="fixed bottom-0 left-0 right-0 py-8 bg-card/95 backdrop-blur-xl border-t border-border/5 flex flex-col items-center justify-center px-6 z-50 gap-4 pb-safe">
        {isFinished && (
          <button onClick={() => router.push('/dashboard')} className="w-full max-w-sm py-6 bg-card text-black rounded-full font-black uppercase text-lg tracking-[0.1em] active:scale-95 transition-all shadow-lg">{t.returnBtn}</button>
        )}
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">Created in harmony</p>
      </footer>
    </main>
  );
}


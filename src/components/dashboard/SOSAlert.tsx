'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, addDocumentNonBlocking, setDocumentNonBlocking } from '@/firebase';
import { collection, doc, serverTimestamp } from 'firebase/firestore';
import { 
  Heart, 
  Loader2, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  Wind, 
  Users, 
  PhoneCall,
  CircleDot,
  Radio,
  Sparkles,
  Users2,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { playHeartbeat } from '@/lib/resonance';

/**
 * @fileOverview Immediate Help (SOS) Portal.
 * Expanded: Added Collective Care (Universal Family) protocol.
 */

const CONTENT = {
  en: {
    question: "Do you need help?",
    helping: (name: string) => `Helping ${name}`,
    subtitle: "Choose the pathway that resonates now",
    friendSubtitle: (name: string) => `Choose the pathway of care for ${name}`,
    tabs: { emergency: "Emergency", circle: "Circle", family: "Family", stillness: "Presence" },
    emergency: {
      title: "Awareness Dispatch",
      sub: "Medical & Security",
      desc: "Request professional support to your Mesh Tactical Grid Handled with absolute discretion",
      button: "Notify Awareness Team"
    },
    circle: {
      title: "Circle Broadcast",
      sub: "Mesh Mesh Alert",
      desc: "Instantly alert every member of your Circle of Love via Sovereign Mesh triangulation",
      button: "Notify All Circle Bonds"
    },
    family: {
      title: "Collective Care",
      sub: "Universal Family Presence",
      desc: "Broadcast a call for love to every nearby heart using the app to receive immediate help",
      button: "Alert Nearby Family"
    },
    stillness: {
      title: "Heart Breath",
      sub: "Presence Protocol",
      desc: "I love and respect my need for grounding Shift focus to the physiological sync of the Heart Breath",
      button: "Start Heart Breath Now"
    },
    connecting: "Negotiating Mesh Handshake...",
    honoring: "Honoring the request for care",
    allIsWell: "All is well",
    loved: "I am loved",
    friendLoved: (name: string) => `${name} is loved`,
    takenCareOf: "and being taken care of",
    dispatched: "Mesh help request dispatched",
    meshShared: "Mesh Location Shared",
    privacyActive: "Privacy protocols active",
    returning: (s: number) => `Returning to home in ${s}s`,
    callDirect: "Call Emergency Directly",
    footer: "Created in harmony"
  },
  de: {
    question: "Brauchst du Unterstützung?",
    helping: (name: string) => `${name} braucht Begleitung`,
    subtitle: "Wähle den Weg, der sich jetzt richtig anfühlt",
    friendSubtitle: (name: string) => `Wähle einen Weg der Fürsorge für ${name}`,
    tabs: { emergency: "Notfall", circle: "Kreis", family: "Familie", stillness: "Präsenz" },
    emergency: {
      title: "Awareness-Einsatz",
      sub: "Medizin & Sicherheit",
      desc: "Fordere professionelle Begleitung an dein Mesh Tactical Grid an Diskret und vertraulich",
      button: "Awareness-Team rufen"
    },
    circle: {
      title: "Circle-Broadcasting",
      sub: "Mesh Mesh Alarm",
      desc: "Informiere sofort alle Mitglieder deines Circle of Love via Sovereign Mesh Ortung heute",
      button: "Alle im Kreis informieren"
    },
    family: {
      title: "Kollektive Fürsorge heute",
      sub: "Universelle Familien Präsenz heute",
      desc: "Sende einen Ruf nach Liebe an alle Seelen in der Nähe für sofortige Hilfe heute",
      button: "Familie in der Nähe rufen"
    },
    stillness: {
      title: "Herz Atem heute",
      sub: "Präsenz Protokoll heute",
      desc: "Ich achte auf mein Bedürfnis nach Erdung Lenke den Fokus auf die Synchronisation heute",
      button: "Herz Atem jetzt starten"
    },
    connecting: "Mesh-Verbindung wird aufgebaut...",
    honoring: "Die Anfrage wird liebevoll bearbeitet",
    allIsWell: "Alles ist gut",
    loved: "Ich werde geliebt heute",
    friendLoved: (name: string) => `${name} wird geliebt heute`,
    takenCareOf: "und ist in Sicherheit",
    dispatched: "Mesh-Anfrage wurde versendet",
    meshShared: "Mesh-Ortung geteilt",
    privacyActive: "Schutzprotokolle sind aktiv",
    returning: (s: number) => `Rückkehr zum Dashboard in ${s}s`,
    callDirect: "Notruf direkt anrufen",
    footer: "In Harmonie erschaffen hier"
  }
};

interface SOSAlertProps {
  onClose: () => void;
  onHeartBreath?: () => void;
  friendName?: string;
  friendStatus?: string;
}

export function SOSAlert({ onClose, onHeartBreath, friendName, friendStatus }: SOSAlertProps) {
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const [step, setStep] = useState<'confirm' | 'sending' | 'sent'>('confirm');
  const [countdown, setCountdown] = useState(15);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const isFriendMode = !!friendName;

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    playHeartbeat();
    let timer: NodeJS.Timeout;
    if (step === 'sent' && countdown > 0) {
      timer = setInterval(() => setCountdown(c => c - 1), 1000);
    } else if (step === 'sent' && countdown === 0) {
      onClose();
    }
    return () => clearInterval(timer);
  }, [step, countdown, onClose]);

  const t = CONTENT[lang as keyof typeof CONTENT] || CONTENT.en;

  const handleSendSOS = async (priority: 'urgent' | 'standard' | 'family' | 'grounding') => {
    playHeartbeat();
    
    if (priority === 'grounding') {
      if (onHeartBreath) onHeartBreath();
      else onClose();
      return;
    }

    if (!auth.currentUser || !firestore) return;
    setStep('sending');

    const userUid = auth.currentUser.uid;
    const userRef = doc(firestore, 'users', userUid);

    const logMessage = isFriendMode 
      ? `USER REPORTED DISTRESS FOR FRIEND: ${friendName} (Status: ${friendStatus}) VIA ${priority === 'family' ? 'COLLECTIVE CARE' : 'MESH BROADCAST'}`
      : `User triggered ${priority.toUpperCase()} support alert via Mesh Tactical Grid`;

    addDocumentNonBlocking(collection(firestore, 'users', userUid, 'sosEvents'), {
      triggeredAt: serverTimestamp(),
      status: 'sent',
      priority: priority,
      message: logMessage,
      resolvedAt: null,
      meshData: { triangulated: true, signalStrength: 'high', broadcasted: true }
    });

    if (!isFriendMode && (priority === 'urgent' || priority === 'family')) {
      setDocumentNonBlocking(userRef, { sosActive: true }, { merge: true });
    }

    setTimeout(() => {
      setStep('sent');
    }, 2000);
  };

  if (step === 'sent') {
    return (
      <div className="fixed inset-0 bg-card z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline animate-in fade-in duration-700">
        <div className="absolute inset-0 bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full animate-ping" />
          <Heart size={100} fill="#58c55a" className="text-[#58c55a] animate-pulse-heart drop-shadow-[0_0_40px_rgba(88,197,90,0.5)] relative z-10" />
        </div>
        
        <div className="space-y-6 max-w-sm relative z-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">
            {isFriendMode ? t.friendLoved(friendName!) : t.loved} <br/> <span className="text-[#58c55a]">{t.takenCareOf}</span>
          </h1>
          <div className="bg-card/5 border border-[#58c55a]/20 rounded-[2.5rem] p-8 space-y-4 text-left shadow-2xl">
            <div className="flex items-center gap-4 text-white/80">
              <CheckCircle2 size={18} className="text-[#58c55a]" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">{t.dispatched}</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <Radio size={18} className="text-[#58c55a] animate-pulse" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">{t.meshShared}</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <ShieldCheck size={18} className="text-[#58c55a]" />
              <p className="text-xs font-bold uppercase tracking-widest leading-tight">{t.privacyActive}</p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-6">
          <button onClick={onClose} className="text-white/20 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest underline underline-offset-8">
            {t.returning(countdown)}
          </button>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">
            {t.footer}
          </p>
        </div>
      </div>
    );
  }

  if (step === 'sending') {
    return (
      <div className="fixed inset-0 bg-card/95 z-[4000] flex flex-col items-center justify-center px-8 text-center font-headline">
        <Loader2 size={80} className="text-[#58c55a] animate-spin mb-8" />
        <h1 className="text-3xl font-black uppercase tracking-tighter text-white mb-2">{t.connecting}</h1>
        <p className="text-[#58c55a] font-black uppercase tracking-[0.3em] text-[10px]">
          {t.honoring}
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-card/80 backdrop-blur-md z-[4000] flex items-end sm:items-center justify-center p-0 sm:p-6 animate-in fade-in duration-500 font-headline">
      <div className="bg-card w-full max-w-2xl rounded-t-[3.5rem] sm:rounded-[3.5rem] border-t-2 sm:border-2 border-border/10 flex flex-col h-[95dvh] sm:h-[90vh] max-h-[95dvh] sm:max-h-[90vh] shadow-[0_-20px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
        
        <button 
          onClick={() => { playHeartbeat(); onClose(); }}
          className="absolute top-8 right-8 p-3 bg-card/5 rounded-full border border-border/10 text-white/40 hover:text-white transition-all z-[100]"
        >
          <X size={18} />
        </button>

        <div className="p-10 pb-4 text-center shrink-0">
          <div className="w-16 h-16 bg-red-600/10 border-2 border-red-600/30 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Heart size={32} className="text-[#DC2626]" fill="#DC2626" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">
            {isFriendMode ? t.helping(friendName!) : t.question}
          </h2>
          <p className="text-primary text-[9px] font-black uppercase mt-3 tracking-[0.3em]">
            {isFriendMode ? t.friendSubtitle(friendName!) : t.subtitle}
          </p>
        </div>

        <ScrollArea className="flex-1 px-6">
          <div className="max-w-md mx-auto w-full pb-32">
            <div className="mb-6 p-4 bg-red-600/10 border border-red-600/20 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-red-500" size={20} />
                <span className="text-[10px] font-black uppercase text-white tracking-widest">{t.callDirect}</span>
              </div>
              <button onClick={() => window.open('tel:112')} className="px-4 py-2 bg-red-600 text-white rounded-lg font-black text-[9px] uppercase tracking-widest shadow-lg">Call 112</button>
            </div>

            <Tabs defaultValue="emergency" className="w-full">
              <TabsList className="w-full h-14 bg-card/5 border border-border/10 rounded-full p-1.5 mb-6">
                <TabsTrigger value="emergency" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-red-600 data-[state=active]:text-white">
                  {t.tabs.emergency}
                </TabsTrigger>
                <TabsTrigger value="support" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-black">
                  {t.tabs.circle}
                </TabsTrigger>
                <TabsTrigger value="family" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-accent data-[state=active]:text-white">
                  {t.tabs.family}
                </TabsTrigger>
                {!isFriendMode && (
                  <TabsTrigger value="stillness" className="flex-1 rounded-full text-[9px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    {t.tabs.stillness}
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="emergency" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-red-600/5 border-2 border-red-600/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600/20 rounded-xl">
                      <PhoneCall className="text-red-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">{t.emergency.title}</p>
                      <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">{t.emergency.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    {t.emergency.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('urgent')}
                    className="w-full py-6 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-red-600/20 active:scale-95 transition-all"
                  >
                    {t.emergency.button}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="support" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-amber-500/5 border-2 border-amber-500/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-amber-500/20 rounded-xl">
                      <Users className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">{t.circle.title}</p>
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">{t.circle.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    {t.circle.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('standard')}
                    className="w-full py-6 bg-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    {t.circle.button}
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="family" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                <div className="p-6 bg-accent/5 border-2 border-accent/20 rounded-[2rem] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-accent/20 rounded-xl">
                      <Users2 className="text-accent" size={24} />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase text-white tracking-tight">{t.family.title}</p>
                      <p className="text-[10px] font-bold text-accent uppercase tracking-widest">{t.family.sub}</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                    {t.family.desc}
                  </p>
                  <button 
                    onClick={() => handleSendSOS('family')}
                    className="w-full py-6 bg-accent text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                  >
                    {t.family.button}
                  </button>
                </div>
              </TabsContent>

              {!isFriendMode && (
                <TabsContent value="stillness" className="space-y-4 animate-in fade-in slide-in-from-bottom-2 focus-visible:outline-none">
                  <div className="p-6 bg-primary/5 border-2 border-primary/20 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-primary/20 rounded-xl">
                        <Wind className="text-primary" size={24} />
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white tracking-tight">{t.stillness.title}</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{t.stillness.sub}</p>
                      </div>
                    </div>
                    <p className="text-xs text-white/60 leading-relaxed font-medium uppercase tracking-wide">
                      {t.stillness.desc}
                    </p>
                    <button 
                      onClick={() => handleSendSOS('grounding')}
                      className="w-full py-6 bg-primary text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg active:scale-95 transition-all"
                    >
                      {t.stillness.button}
                    </button>
                  </div>
                </TabsContent>
              )}
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border/5 text-center">
              <button 
                onClick={() => { playHeartbeat(); onClose(); }}
                className="text-primary font-black text-xs uppercase tracking-[0.4em] hover:underline underline-offset-8 transition-all active:scale-95"
              >
                {t.allIsWell}
              </button>
            </div>
          </div>
        </ScrollArea>

        <div className="p-8 pt-4 bg-card/40 backdrop-blur-md border-t border-border/5 text-center shrink-0">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 shining-white">
            {t.footer}
          </p>
        </div>
      </div>
    </div>
  );
}

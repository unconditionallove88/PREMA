"use client"

import { useState, useRef, useEffect } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { QrCode, Scan, ArrowLeft, ShieldAlert, Radio } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

/**
 * @fileOverview Safety Network step.
 * Redesigned to include Sovereign Dispatch permission.
 * Languages: EN, DE.
 */

const CONTENT = {
  en: {
    header: "Safety Network", sub: "Connect with friends and awareness teams",
    shareLocation: "Share location with awareness", shareLocationSub: "Allow on-site teams to find you in an emergency",
    proactive: "Sovereign Dispatch", proactiveSub: "Allow automatic dispatch of awareness team if I am in biological danger",
    revokeInfo: "Access can be revoked at any point You control your data sovereignty",
    radar: "Friend Radar", radarSub: "Sync with the circle to see each other on the map",
    myCode: "My code", scan: "Scan",
    cameraError: "Camera access denied Please enable camera permissions in settings",
    gpsActive: "GPS active", confirm: "Confirm network"
  },
  de: {
    header: "Safety Network", sub: "Verbindung mit Freunden und Awareness-Teams",
    shareLocation: "Standort mit Awareness teilen", shareLocationSub: "Erlaube dem Team dich im Notfall zu finden heute",
    proactive: "Souveräner Einsatz heute", proactiveSub: "Erlaube automatische Hilfe wenn ich in biologischer Gefahr bin",
    revokeInfo: "Der Zugriff kann jederzeit widerrufen werden heute Du kontrollierst deine Daten heute hier",
    radar: "Freunde Radar heute", radarSub: "Synchronisiere mit dem Kreis um euch zu sehen",
    myCode: "Mein Code", scan: "Scannen",
    cameraError: "Kamera Zugriff verweigert Bitte erlaube den Zugriff in den Einstellungen",
    gpsActive: "GPS aktiv heute", confirm: "Netzwerk jetzt bestätigen"
  }
};

export function Step6SafetyNetwork({ 
  onComplete,
  onBack
}: { 
  onComplete: () => void,
  onBack?: () => void
}) {
  const { toast } = useToast();
  const [shareLocation, setShareLocation] = useState(false);
  const [proactiveCare, setProactiveCare] = useState(false);
  const [friendRadar, setFriendRadar] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [showMyCode, setShowMyCode] = useState(false);
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);

    if (scanning) {
      const getCameraPermission = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (error) {
          setScanning(false);
          toast({ variant: 'destructive', title: 'Camera access denied', description: CONTENT[lang].cameraError });
        }
      };
      getCameraPermission();
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    }
  }, [scanning, toast, lang]);

  const t = CONTENT[lang] || CONTENT.en;

  return (
    <div className="w-full min-h-[85vh] flex flex-col items-center justify-center font-headline max-w-2xl px-4 mx-auto text-center relative pt-safe">
      {onBack && (
        <button 
          onClick={onBack}
          className="absolute top-0 left-4 text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest z-50"
        >
          <ArrowLeft className="w-4 h-4" /> BACK
        </button>
      )}

      <div className="mt-12 mb-8 shrink-0">
        <h2 className="text-[22px] font-black uppercase mb-2 text-white leading-tight tracking-tighter">
          {t.header}
        </h2>
        <p className="text-white/40 font-bold tracking-widest text-[10px] max-w-[280px] mx-auto uppercase">
          {t.sub}
        </p>
      </div>

      <div className="flex-1 w-full space-y-4 mb-10 overflow-y-auto max-h-[55vh] custom-scrollbar pr-2 pb-10">
        {/* Proactive Dispatch Option - Prominent Act of Self-Love */}
        <div className="bg-[#1b4d3e]/10 rounded-[2.5rem] border-2 border-[#A855F7] p-6 flex flex-col gap-4 group hover:bg-[#1b4d3e]/20 transition-all text-left shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Radio size={80} className="text-[#A855F7]" />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-1 pr-4">
              <div className="flex items-center gap-2">
                <ShieldAlert size={18} className="text-[#A855F7]" />
                <Label className="text-lg font-black tracking-tight text-white leading-tight uppercase">{t.proactive}</Label>
              </div>
              <p className="text-[10px] text-[#A855F7] font-black uppercase tracking-widest">{t.proactiveSub}</p>
            </div>
            <Switch 
              checked={proactiveCare}
              onCheckedChange={setProactiveCare}
              className="data-[state=checked]:bg-[#A855F7] scale-125"
            />
          </div>
          <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest leading-relaxed border-t border-white/10 pt-4 relative z-10">
            I authorize the Pulse Guardian to share my Mesh location and biological vitals with the Awareness Team if I am in a critical state for more than 10 minutes. They can contact me via the app to assess my presence.
          </p>
        </div>

        <div className="bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 p-6 flex flex-col gap-4 group hover:border-[#3EB489]/30 transition-all text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1 pr-4">
              <Label className="text-base font-black tracking-tight text-white leading-tight uppercase">{t.shareLocation}</Label>
              <p className="text-[10px] text-white/30 font-bold leading-tight">{t.shareLocationSub}</p>
            </div>
            <Switch 
              checked={shareLocation}
              onCheckedChange={setShareLocation}
              className="data-[state=checked]:bg-[#3EB489]"
            />
          </div>
          <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest leading-relaxed border-t border-white/5 pt-4">
            {t.revokeInfo}
          </p>
        </div>

        <div className="bg-[#0a0a0a] rounded-[2rem] border-2 border-white/10 p-6 space-y-6 group hover:border-[#3EB489]/30 transition-all text-left">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-1">
              <Label className="text-base font-black tracking-tight text-white leading-tight uppercase">{t.radar}</Label>
              <p className="text-[10px] text-white/30 font-bold leading-tight">{t.radarSub}</p>
            </div>
            <Switch 
              checked={friendRadar}
              onCheckedChange={setFriendRadar}
              className="data-[state=checked]:bg-[#3EB489]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => { setShowMyCode(!showMyCode); setScanning(false); }}
              className={`flex items-center justify-center gap-3 border-2 p-5 rounded-xl transition-all font-black text-[10px] tracking-widest ${showMyCode ? 'bg-[#3EB489] text-black border-[#3EB489] shadow-[0_0_20px_#3EB489]' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
            >
              <QrCode className="w-4 h-4" /> {t.myCode}
            </button>
            <button 
              onClick={() => { setScanning(!scanning); setShowMyCode(false); }}
              className={`flex items-center justify-center gap-3 border-2 p-5 rounded-xl transition-all font-black text-[10px] tracking-widest ${scanning ? 'bg-[#3EB489] text-black border-[#3EB489] shadow-[0_0_20px_#3EB489]' : 'bg-white/5 border-white/10 text-white hover:border-white/30'}`}
            >
              <Scan className="w-4 h-4" /> {t.scan}
            </button>
          </div>

          {(scanning || showMyCode) && (
            <div className="relative rounded-2xl overflow-hidden border-2 border-[#3EB489] animate-in zoom-in-95 duration-500 bg-black aspect-square max-w-xs mx-auto flex items-center justify-center w-full mt-4">
              {scanning && (
                <>
                  <video ref={videoRef} className="w-full h-full object-cover opacity-60" autoPlay muted />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-48 border-2 border-[#3EB489] rounded-3xl relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-[#3EB489] shadow-[0_0_15px_#3EB489] animate-[bounce_2s_infinite]" />
                    </div>
                  </div>
                </>
              )}
              {showMyCode && (
                <div className="bg-white p-6 rounded-2xl shadow-[0_0_50px_rgba(62,180,137,0.3)]">
                  <QrCode className="w-40 h-40 text-black" />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full shrink-0 flex flex-col items-center gap-6 mt-4 pb-safe">
        <button
          onClick={onComplete}
          className="pill-button w-full max-w-sm bg-[#3EB489] text-black text-xl font-black neon-glow active:scale-95 transition-all h-[64px]"
        >
          {t.confirm}
        </button>
        <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] shining-white">
          Created in harmony
        </p>
      </div>
    </div>
  );
}

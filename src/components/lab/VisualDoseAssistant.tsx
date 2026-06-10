'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  X, 
  Loader2, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  ArrowLeft, 
  ArrowRight,
  Maximize,
  Sparkles,
  Smartphone,
  ChevronRight,
  Scaling,
  Zap,
  CircleDot,
  Minus,
  Plus,
  Heart,
  HelpCircle,
  BookOpen,
  Eye,
  ShieldCheck,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { estimateDose, type EstimateDoseOutput } from '@/ai/flows/estimate-dose-flow';
import { identifyPill, type IdentifyPillOutput } from '@/ai/flows/identify-pill-flow';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { StepSomethingToRemember as WisdomProtocol } from '@/components/onboarding/StepSomethingToRemember';

const SUBSTANCES = [
  { id: 'ketamine', name: 'Ketamine', de: 'Ketamin', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', unit: 'mg', risk: "Dose varies by tolerance." },
  { id: 'cocaine', name: 'Cocaine', de: 'Kokain', color: 'text-white', border: 'border-border/20', bg: 'bg-card/5', unit: 'mg', risk: "Purity varies widely today." },
  { id: 'mdma', name: 'MDMA', de: 'MDMA', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', unit: 'mg', risk: "Redosing increases neurotoxicity risk." },
  { id: '3mmc', name: '3-MMC', de: '3-MMC', color: 'text-orange-300', border: 'border-orange-500/20', bg: 'bg-orange-500/5', unit: 'mg', risk: "High redosing compulsion active." },
  { id: '4mmc', name: '4-MMC', de: '4-MMC', color: 'text-pink-300', border: 'border-pink-500/20', bg: 'bg-pink-500/5', unit: 'mg', risk: "Avoid mixing with stimulants." },
  { id: 'other', name: 'Other', de: 'Andere', color: 'text-white', border: 'border-border/20', bg: 'bg-card/5', unit: 'mg', risk: "Start with lowest dose." },
];

const METHODS = [
  { id: 'key_tip_small', label: { en: 'Key tip (small)', de: 'Messerspitze (klein)' }, icon: '🔑' },
  { id: 'key_tip_large', label: { en: 'Key tip (large)', de: 'Messerspitze (groß)' }, icon: '🔑' },
  { id: 'short_line', label: { en: 'Short line', de: 'Kurze Line heute' }, icon: '➖' },
  { id: 'medium_line', label: { en: 'Medium line', de: 'Mittlere Line heute' }, icon: '➖' },
  { id: 'long_line', label: { en: 'Long line', de: 'Lange Line heute hier' }, icon: '➖' },
  { id: 'bump', label: { en: 'Bump', de: 'Häufchen heute hier' }, icon: '👃' },
];

const CONTENT = {
  en: {
    title: "Visual Dose Assistant",
    pillTitle: "Pill Identifier assistant",
    selectSub: "Select the substance",
    selectMethod: "Choose the method",
    camera: "Visual portion scan",
    pillCamera: "Pill visual scan",
    instr1: "Hold steady now",
    instr2: "Scale with coin",
    results: "Estimation Results",
    pillResults: "Identification Results",
    range: "Estimated portion range",
    confidence: "Confidence Level",
    risk: "Risk Indicator",
    confirm: "Save to Lab",
    logged: "Logged to Lab",
    backHome: "Back to Home",
    discard: "Discard",
    notes: "Optional notes",
    mood: "How is mood?",
    disclaimer: "This is an approximate visual estimate based on typical dose sizes. Actual weight depends on purity, density, and cutting agents. This tool is not a substitute for a precision scale. Always start with a lower dose than estimated.",
    pillDisclaimer: "Visual pill identification is NOT reliable and is NOT a substitute for laboratory testing. AI suggestions are approximate and may be incorrect. Always use a reagent test kit or professional drug checking service before consuming any substance.",
    highRiskWarning: "⚠️ This estimated dose is in the high-risk range. Consider taking significantly less. If you feel unwell, contact a friend immediately or find the nearest medical tent.",
    privacyDisclaimer: "Camera data is processed in real-time and is never stored on our servers or your device. Only your confirmed log entry is saved.",
    notSure: "Identity not sure?",
    notSureBtn: "Access Wisdom Now",
    tryAgain: "Try Again",
    manualBtn: "Enter Manually",
    observation: "Visual Description",
    possibleMatch: "Possible Database Match",
    safetyInfo: "Safety Intelligence",
    warningTitle: "Safety Warning",
    actionTitle: "Recommended Action",
    footer: "Created in harmony"
  },
  de: {
    title: "Dosier Assistent heute",
    pillTitle: "Pille Identifizierer heute",
    selectSub: "Substanz jetzt wählen",
    selectMethod: "Methode jetzt wählen",
    camera: "Portion jetzt scannen",
    pillCamera: "Pille jetzt scannen",
    instr1: "Ruhig halten heute",
    instr2: "Münze als Maß",
    analyzing: "Faktoren werden geprüft",
    results: "Ergebnis der Schätzung",
    pillResults: "Ergebnis der Analyse",
    range: "Geschätzter Bereich heute",
    confidence: "Grad der Sicherheit",
    risk: "Risiko Anzeige heute",
    confirm: "Im Lab speichern",
    logged: "Im Lab notiert",
    backHome: "Zurück zum Home",
    discard: "Verwerfen",
    notes: "Optionale Notizen heute",
    mood: "Wie ist Stimmung?",
    disclaimer: "Dies ist eine ungefähre visuelle Schätzung. Das tatsächliche Gewicht hängt von Reinheit und Dichte ab. Dieses Tool ersetzt keine Waage. Beginne immer mit einer niedrigeren Dosis als geschätzt.",
    pillDisclaimer: "Visuelle Identifizierung ist NICHT zuverlässig und ersetzt keine Labortests. KI-Vorschläge können falsch sein. Nutze immer einen Reagenztest oder professionelle Checks.",
    highRiskWarning: "⚠️ Diese Dosis liegt im Hochrisikobereich. Nimm deutlich weniger. Wenn du dich unwohl fühlst, kontaktiere sofort jemanden oder suche das Sanitätszelt auf.",
    privacyDisclaimer: "Kameradaten werden in Echtzeit verarbeitet und niemals gespeichert. Nur dein bestätigter Eintrag wird gesichert.",
    notSure: "Unsicher was es ist?",
    notSureBtn: "Weisheits Guide jetzt öffnen",
    tryAgain: "Erneut versuchen heute",
    manualBtn: "Manuell eintragen heute",
    observation: "Visuelle Beschreibung heute",
    possibleMatch: "Datenbank Abgleich heute",
    safetyInfo: "Sicherheits Intelligenz heute",
    warningTitle: "Sicherheits Warnung heute",
    actionTitle: "Empfohlene Aktion heute",
    footer: "In Harmonie erschaffen"
  }
};

interface Props {
  initialMode?: 'dose' | 'pill';
  onComplete: (log: any) => void;
  onCancel: () => void;
}

export function VisualDoseAssistant({ initialMode = 'dose', onComplete, onCancel }: Props) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [mode, setMode] = useState<'dose' | 'pill'>(initialMode);
  const [step, setStep] = useState<'substance' | 'method' | 'camera' | 'result' | 'notes' | 'success'>('substance');
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [doseResult, setDoseResult] = useState<EstimateDoseOutput | null>(null);
  const [pillResult, setPillResult] = useState<IdentifyPillOutput | null>(null);
  const [manualValue, setManualValue] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('neutral');
  const [wisdomOpen, setWisdomOpen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('prema_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
    if (mode === 'pill') setStep('camera');
  }, [mode]);

  const t = CONTENT[lang] || CONTENT.en;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera access denied", err);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsLoading(true);
    playHeartbeat();

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx?.drawImage(video, 0, 0);
    
    const dataUri = canvas.toDataURL('image/jpeg', 0.8);
    stopCamera();

    try {
      if (mode === 'dose') {
        const estimation = await estimateDose({
          photoDataUri: dataUri,
          substanceName: selectedSub.name,
          method: selectedMethod?.id
        });
        setDoseResult(estimation);
        setManualValue(Math.round((estimation.estimated_dose.min_mg + estimation.estimated_dose.max_mg) / 2));
      } else {
        const identification = await identifyPill({ photoDataUri: dataUri });
        setPillResult(identification);
      }
      setStep('result');
    } catch (err) {
      setStep('substance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSave = () => {
    playHeartbeat();
    const entry = mode === 'dose' ? {
      id: selectedSub.id,
      name: lang === 'en' ? selectedSub.name : selectedSub.de,
      value: manualValue,
      unit: doseResult?.estimated_dose.unit || 'mg',
      method: selectedMethod?.id || 'visual_scan',
      notes,
      mood,
      timestamp: new Date().toISOString()
    } : {
      id: 'pill_id',
      name: pillResult?.possible_match || 'Identified Pill',
      value: 0,
      unit: 'pill',
      method: 'pill_id_scan',
      notes: `${pillResult?.visual_description}. ${notes}`,
      mood,
      timestamp: new Date().toISOString()
    };
    onComplete(entry);
    setStep('success');
  };

  if (step === 'substance' && mode === 'dose') {
    return (
      <div className="flex flex-col h-full bg-card font-headline pt-safe overflow-hidden">
        <header className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between z-10">
          <button onClick={onCancel} className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40"><X size={20} /></button>
          <div className="flex items-center gap-2"><Sparkles className="text-primary" size={16} /><span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.title}</span></div>
        </header>
        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full px-8 py-6">
            <div className="max-w-md mx-auto space-y-10 pb-20">
              <div className="text-center space-y-2"><h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">{t.selectSub}</h2><p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.camera}</p></div>
              <div className="grid grid-cols-1 gap-3">
                {SUBSTANCES.map((sub) => (
                  <button key={sub.id} onClick={() => { playHeartbeat(); setSelectedSub(sub); setStep('method'); }} className={cn("w-full p-6 rounded-[2.5rem] bg-card/[0.03] border-2 flex items-center justify-between group transition-all active:scale-95", sub.border)}>
                    <div className="flex items-center gap-5">
                      <div className={cn("w-14 h-14 rounded-2xl bg-card/40 border border-border/10 flex items-center justify-center group-hover:scale-110 transition-transform", sub.color)}><Scaling size={28} /></div>
                      <div className="text-left"><span className="block text-xl font-black uppercase tracking-tight text-white">{lang === 'en' ? sub.name : sub.de}</span><p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">{sub.risk}</p></div>
                    </div>
                    <ChevronRight className="text-white/10 group-hover:text-primary transition-all" size={20} />
                  </button>
                ))}
              </div>
              
              <div className="p-5 bg-card/5 border border-border/10 rounded-2xl">
                <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-relaxed text-center italic">
                  {t.privacyDisclaimer}
                </p>
              </div>

              <div className="pt-6 border-t border-border/5"><button onClick={() => setWisdomOpen(true)} className="w-full p-6 rounded-[2rem] bg-card/5 border border-dashed border-border/10 flex items-center justify-center gap-3 group hover:bg-card/10 transition-all"><HelpCircle size={18} className="text-white/20 group-hover:text-primary" /><div className="text-left"><p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t.notSure}</p><p className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none mt-1">{t.notSureBtn}</p></div></button></div>
              <div className="text-center pt-8"><p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white">{t.footer}</p></div>
            </div>
          </ScrollArea>
        </div>
        <Dialog open={wisdomOpen} onOpenChange={setWisdomOpen}><DialogContent className="bg-card border-border/10 max-w-2xl p-0 rounded-[3rem] overflow-hidden h-[85dvh] shadow-2xl"><DialogTitle className="sr-only">Mixing Wisdom</DialogTitle><WisdomProtocol onComplete={() => setWisdomOpen(false)} isStandAlone={true} /></DialogContent></Dialog>
      </div>
    );
  }

  if (step === 'method') {
    return (
      <div className="flex flex-col h-full bg-card font-headline pt-safe">
        <header className="px-8 pt-8 pb-4 shrink-0 flex items-center gap-4"><button onClick={() => setStep('substance')} className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40"><ArrowLeft size={20} /></button><div><h1 className="text-xl font-black uppercase tracking-tighter">{selectedSub?.name}</h1><p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{t.selectMethod}</p></div></header>
        <ScrollArea className="flex-1 px-8 py-10"><div className="max-w-md mx-auto grid grid-cols-2 gap-3">{METHODS.map((m) => (<button key={m.id} onClick={() => { playHeartbeat(); setSelectedMethod(m); setStep('camera'); startCamera(); }} className="p-6 rounded-[2rem] bg-card/[0.03] border-2 border-border/5 flex flex-col items-center gap-3 hover:border-primary/40 transition-all active:scale-95"><span className="text-3xl">{m.icon}</span><span className="text-[10px] font-black uppercase text-center text-white/60 leading-tight">{lang === 'en' ? m.label.en : m.label.de}</span></button>))}</div></ScrollArea>
      </div>
    );
  }

  if (step === 'camera') {
    return (
      <div className="flex flex-col h-full bg-card font-headline relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <canvas ref={canvasRef} className="hidden" />
        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none"><div className="w-full h-full border-2 border-primary/40 rounded-[3rem] relative shadow-[0_0_0_100vw_rgba(0,0,0,0.4)]"><div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-border/20 rounded-2xl flex flex-col items-center justify-center"><Maximize size={32} className="text-white/20 mb-2" /><CircleDot size={12} className="text-primary animate-pulse" /></div></div></div>
        <header className="relative z-10 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent"><button onClick={() => { stopCamera(); mode === 'dose' ? setStep('method') : onCancel(); }} className="p-3 bg-card/10 backdrop-blur-md rounded-full border border-border/20 text-white"><ArrowLeft size={20} /></button><div className="text-right"><span className="block text-[10px] font-black uppercase text-primary">{mode === 'dose' ? selectedSub?.name : 'Pill identifier'}</span><span className="text-[8px] font-bold uppercase text-white/40">{mode === 'dose' ? (lang === 'en' ? selectedMethod?.label.en : selectedMethod?.label.de) : 'Pill identification scan'}</span></div></header>
        <div className="flex-1" /><div className="relative z-10 p-10 space-y-6 text-center bg-gradient-to-t from-black via-black/80 to-transparent">
          <p className="text-[8px] font-bold text-primary uppercase tracking-[0.2em] mb-2">{t.privacyDisclaimer}</p>
          <div className="space-y-1"><p className="text-xl font-black uppercase text-white tracking-tight">{t.instr1}</p><p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t.instr2}</p></div><button onClick={() => { startCamera(); captureAndAnalyze(); }} disabled={isLoading} className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-2xl active:scale-90 transition-all mx-auto">{isLoading ? <Loader2 className="animate-spin text-white" size={32} /> : <div className="w-16 h-16 rounded-full border-2 border-border/40 animate-pulse" />}</button></div>
      </div>
    );
  }

  if (step === 'result') {
    if (mode === 'dose' && doseResult) {
      const isHighRisk = doseResult.risk_level === 'HIGH' || doseResult.risk_level === 'DANGEROUS';
      return (
        <div className="flex flex-col h-full bg-card font-headline">
          <header className="px-8 pt-10 pb-6 border-b border-border/5 shrink-0 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"><Scaling size={24} className="text-primary" /></div><div><h2 className="text-xl font-black uppercase tracking-tighter text-white">{t.results}</h2><p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{selectedSub?.name}</p></div></div><button onClick={() => setStep('camera')} className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40"><X size={20} /></button></header>
          <ScrollArea className="flex-1 px-8 pt-8">
            <div className="max-w-md mx-auto space-y-8 pb-40">
              {isHighRisk && (
                <div className="p-5 bg-red-600/20 border-2 border-red-600 rounded-2xl animate-pulse flex items-start gap-4">
                  <AlertTriangle className="text-red-500 shrink-0 mt-1" />
                  <p className="text-xs font-black uppercase text-white leading-relaxed">{t.highRiskWarning}</p>
                </div>
              )}

              <div className="p-8 bg-card/[0.03] border-2 border-border/10 rounded-[2.5rem] text-center space-y-4">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.range}</span>
                <p className="text-6xl font-black text-white tracking-tighter tabular-nums">{doseResult.estimated_dose.min_mg}–{doseResult.estimated_dose.max_mg}</p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
                  <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase border", doseResult.confidence === 'HIGH' ? "bg-primary/10 border-primary text-primary" : "bg-amber-500/10 border-amber-500 text-amber-500")}>{t.confidence}: {doseResult.confidence}</div>
                  <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase border", isHighRisk ? "bg-red-600/10 border-red-600 text-red-500" : "bg-emerald-500/10 border-emerald-500 text-emerald-500")}>{t.risk}: {doseResult.risk_level}</div>
                </div>
              </div>
              <div className="p-6 bg-card/5 rounded-2xl border border-border/10 flex items-start gap-4"><Info className="text-primary shrink-0" size={18} /><div className="space-y-2"><p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.disclaimer}</p><p className="text-[10px] font-black text-white leading-relaxed uppercase">{doseResult.safety_note}</p></div></div>
              <div className="space-y-4"><div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-white/30 tracking-widest">Calibrate My Dose</span><span className="text-xl font-black text-white">{manualValue} MG</span></div><Slider value={[manualValue]} onValueChange={(val) => setManualValue(val[0])} max={250} step={5} /></div>
              <button onClick={() => setStep('notes')} className="w-full h-20 bg-primary text-white rounded-full font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">{t.confirm} <CheckCircle2 size={24} /></button>
            </div>
          </ScrollArea>
        </div>
      );
    }

    if (mode === 'pill' && pillResult) {
      return (
        <div className="flex flex-col h-full bg-card font-headline">
          <header className="px-8 pt-10 pb-6 border-b border-border/5 shrink-0 flex items-center justify-between"><div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20"><Eye size={24} className="text-accent" /></div><div><h2 className="text-xl font-black uppercase tracking-tighter text-white">{t.pillResults}</h2><p className="text-[9px] font-black text-accent uppercase tracking-[0.4em]">Visual Identification Scan</p></div></div><button onClick={() => { setStep('camera'); startCamera(); }} className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40"><Search size={20} /></button></header>
          <ScrollArea className="flex-1 px-8 pt-8">
            <div className="max-w-md mx-auto space-y-8 pb-40">
              <div className="p-6 bg-amber-500/10 border-2 border-amber-500 rounded-2xl flex items-start gap-4">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" />
                <p className="text-[10px] font-bold text-white leading-relaxed uppercase tracking-tight">{t.pillDisclaimer}</p>
              </div>

              <div className="p-8 bg-card/[0.03] border-2 border-accent/20 rounded-[2.5rem] space-y-6">
                 <div className="text-center space-y-1"><span className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em]">{t.possibleMatch}</span><h3 className="text-3xl font-black text-accent uppercase tracking-tighter">{pillResult.possible_match}</h3></div>
                 <div className="grid grid-cols-1 gap-3">
                   <div className={cn("p-4 rounded-xl border flex flex-col justify-center items-center gap-1", pillResult.confidence === 'HIGH' ? "bg-primary/10 border-primary text-primary" : "bg-amber-500/10 border-amber-500 text-amber-500")}><span className="text-[7px] font-black uppercase tracking-widest">Confidence</span><span className="text-[10px] font-black uppercase">{pillResult.confidence}</span></div>
                   <div className="bg-card/40 p-4 rounded-xl border border-border/5 text-left"><span className="block text-[7px] font-black text-white/20 uppercase tracking-widest mb-1">{t.observation}</span><p className="text-[10px] font-bold text-white uppercase">{pillResult.visual_description}</p></div>
                 </div>
              </div>
              
              <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-2xl space-y-3">
                <div className="flex items-center gap-3 text-red-500"><AlertTriangle size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t.warningTitle}</span></div>
                <p className="text-xs font-bold text-white/80 leading-relaxed uppercase tracking-wide">{pillResult.warning}</p>
              </div>

              <div className="space-y-2">
                <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] px-2">{t.safetyInfo}</span>
                <div className="p-6 bg-card/5 border border-border/10 rounded-2xl">
                  <p className="text-xs font-bold text-white/60 leading-relaxed uppercase tracking-widest">{pillResult.safety_information}</p>
                </div>
              </div>

              <div className="bg-blue-600/10 border-2 border-blue-500/40 p-6 rounded-[2rem] space-y-3 animate-pulse shadow-[0_0_30px_rgba(59,130,246,0.15)]">
                <div className="flex items-center gap-3 text-blue-400"><ShieldCheck size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t.actionTitle}</span></div>
                <p className="text-sm font-black text-white leading-relaxed uppercase tracking-tight italic">"{pillResult.recommended_action}"</p>
              </div>

              <button onClick={() => setStep('notes')} className="w-full h-20 bg-primary text-white rounded-full font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 transition-all">{t.confirm}</button>
            </div>
          </ScrollArea>
        </div>
      );
    }
  }

  if (step === 'notes') {
    return (
      <div className="flex flex-col h-full bg-card font-headline pt-safe">
        <header className="p-8 pb-4 flex items-center justify-between"><button onClick={() => setStep('result')} className="p-3 bg-card/5 rounded-full border border-border/10 text-white/40"><ArrowLeft size={20} /></button><span className="text-[10px] font-black uppercase text-primary">{t.notes}</span></header>
        <div className="flex-1 px-8 py-6 space-y-10 max-w-md mx-auto w-full"><div className="space-y-4"><h2 className="text-3xl font-black uppercase tracking-tighter">{t.mood}</h2><div className="flex justify-between bg-card/5 p-6 rounded-[2rem] border border-border/10">{['😐', '😊', '😵'].map((e, i) => (<button key={i} onClick={() => { playHeartbeat(); setMood(['neutral', 'good', 'strong'][i]); }} className={cn("text-4xl p-4 rounded-2xl transition-all", (mood === 'neutral' && i===0) || (mood === 'good' && i===1) || (mood === 'strong' && i===2) ? "bg-primary/20 scale-110 shadow-lg" : "opacity-40 grayscale")}>{e}</button>))}</div></div><div className="space-y-4"><h2 className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.notes}</h2><textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="E.g. mixed with alcohol..." className="w-full h-32 bg-card/5 border-2 border-border/10 rounded-[2rem] p-6 text-white font-bold outline-none focus:border-primary transition-all resize-none" /></div><button onClick={handleFinalSave} className="w-full h-20 bg-primary text-white rounded-full font-black text-xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all">{t.confirm}</button></div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 font-headline bg-card animate-in zoom-in duration-700">
        <div className="relative"><div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-ping" /><div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/40 relative z-10"><CheckCircle2 size={64} className="text-primary" /></div></div>
        <div className="space-y-4"><h2 className="text-4xl font-black uppercase tracking-tighter text-white">{t.logged}</h2><p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t.analyzing}</p></div>
        <div className="w-full max-w-xs space-y-4"><button onClick={onCancel} className="w-full py-5 bg-card text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">{t.backHome}</button></div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white mt-10">{t.footer}</p>
      </div>
    );
  }

  return null;
}

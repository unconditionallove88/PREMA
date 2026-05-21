
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
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { estimateDose, type EstimateDoseOutput } from '@/ai/flows/estimate-dose-flow';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

/**
 * @fileOverview Visual Dose Assistant (Hybrid Mode).
 * Features: Multi-step selection, AI Vision estimation, and notes.
 * Rhythmic Rules: 3 words (EN) / 4 words (DE).
 */

const SUBSTANCES = [
  { id: 'ketamine', name: 'Ketamine', de: 'Ketamin', color: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/5', unit: 'mg', risk: "Dose varies by tolerance." },
  { id: 'cocaine', name: 'Cocaine', de: 'Kokain', color: 'text-white', border: 'border-white/20', bg: 'bg-white/5', unit: 'mg', risk: "Purity varies widely today." },
  { id: 'mdma', name: 'MDMA', de: 'MDMA', color: 'text-purple-400', border: 'border-purple-500/20', bg: 'bg-purple-500/5', unit: 'mg', risk: "Redosing increases neurotoxicity risk." },
  { id: '3mmc', name: '3-MMC', de: '3-MMC', color: 'text-orange-300', border: 'border-orange-500/20', bg: 'bg-orange-500/5', unit: 'mg', risk: "High redosing compulsion active." },
  { id: '4mmc', name: '4-MMC', de: '4-MMC', color: 'text-pink-300', border: 'border-pink-500/20', bg: 'bg-pink-500/5', unit: 'mg', risk: "Avoid mixing with stimulants." },
  { id: 'other', name: 'Other', de: 'Andere', color: 'text-white', border: 'border-white/20', bg: 'bg-white/5', unit: 'mg', risk: "Start with lowest dose." },
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
    selectSub: "Select the substance",
    selectMethod: "Choose the method",
    camera: "Visual portion scan",
    instr1: "Hold steady now",
    instr2: "Scale with coin",
    analyzing: "Analyzing visual volume",
    results: "Estimation Results",
    range: "Estimated portion range",
    confidence: "Confidence Level",
    risk: "Risk Indicator",
    confirm: "Save to Lab",
    adjust: "Adjust the dose",
    logged: "Logged to Lab",
    viewSession: "View session now",
    setReminder: "Set check-in now",
    backHome: "Back to Home",
    discard: "Discard",
    notes: "Optional notes",
    mood: "How is mood?",
    disclaimer: "Visual estimate only Actual weight may vary Use a scale always",
    footer: "Created in harmony",
    notSure: "Not sure what it is?",
    notSureBtn: "Harm Reduction Info"
  },
  de: {
    title: "Dosier Assistent heute",
    selectSub: "Substanz jetzt wählen",
    selectMethod: "Methode jetzt wählen",
    camera: "Portion jetzt scannen",
    instr1: "Ruhig halten heute",
    instr2: "Münze als Maß",
    analyzing: "Wird jetzt analysiert",
    results: "Ergebnis der Schätzung",
    range: "Geschätzter Bereich heute",
    confidence: "Grad der Sicherheit",
    risk: "Risiko Anzeige heute",
    confirm: "Im Lab speichern",
    adjust: "Dosis jetzt anpassen",
    logged: "Im Lab notiert",
    viewSession: "Session jetzt ansehen",
    setReminder: "Check-in jetzt setzen",
    backHome: "Zurück zum Home",
    discard: "Verwerfen",
    notes: "Optionale Notizen heute",
    mood: "Wie ist Stimmung?",
    disclaimer: "Nur grobe Schätzung Tatsächliche Werte variieren Waage nutzen heute",
    footer: "In Harmonie erschaffen",
    notSure: "Unsicher was es ist?",
    notSureBtn: "Schadensminimierung Info heute"
  }
};

interface Props {
  onComplete: (log: any) => void;
  onCancel: () => void;
}

export function VisualDoseAssistant({ onComplete, onCancel }: Props) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [step, setStep] = useState<'substance' | 'method' | 'camera' | 'result' | 'notes' | 'success'>('substance');
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [selectedMethod, setSelectedMethod] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateDoseOutput | null>(null);
  const [manualValue, setManualValue] = useState<number>(0);
  const [notes, setNotes] = useState('');
  const [mood, setMood] = useState('neutral');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const savedLang = (localStorage.getItem('stayonbeat_lang') || 'EN').toLowerCase() as any;
    if (['en', 'de'].includes(savedLang)) setLang(savedLang);
  }, []);

  const t = CONTENT[lang] || CONTENT.en;

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' },
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
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
    if (!videoRef.current || !canvasRef.current || !selectedSub) return;
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
      const estimation = await estimateDose({
        photoDataUri: dataUri,
        substanceName: selectedSub.name,
        method: selectedMethod?.id
      });
      setResult(estimation);
      setManualValue(Math.round((estimation.minMg + estimation.maxMg) / 2));
      setStep('result');
    } catch (err) {
      setStep('substance');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalSave = () => {
    playHeartbeat();
    onComplete({
      id: selectedSub.id,
      name: lang === 'en' ? selectedSub.name : selectedSub.de,
      value: manualValue,
      unit: 'mg',
      method: selectedMethod?.id || 'visual_scan',
      notes,
      mood,
      timestamp: new Date().toISOString()
    });
    setStep('success');
  };

  if (step === 'substance') {
    return (
      <div className="flex flex-col h-full bg-black font-headline pt-safe overflow-hidden">
        <header className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between z-10 bg-black">
          <button onClick={onCancel} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><X size={20} /></button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.title}</span>
          </div>
        </header>

        <div className="flex-1 min-h-0 relative">
          <ScrollArea className="h-full px-8 py-6">
            <div className="max-w-md mx-auto space-y-10 pb-20">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-black uppercase tracking-tighter text-white leading-none">{t.selectSub}</h2>
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.camera}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {SUBSTANCES.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => { playHeartbeat(); setSelectedSub(sub); setStep('method'); }}
                    className={cn("w-full p-6 rounded-[2.5rem] bg-white/[0.03] border-2 flex items-center justify-between group transition-all active:scale-95", sub.border)}
                  >
                    <div className="flex items-center gap-5">
                      <div className={cn("w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform", sub.color)}>
                        <Scaling size={28} />
                      </div>
                      <div className="text-left">
                        <span className="block text-xl font-black uppercase tracking-tight text-white">{lang === 'en' ? sub.name : sub.de}</span>
                        <p className="text-[8px] font-bold text-white/30 uppercase tracking-widest leading-none mt-1">{sub.risk}</p>
                      </div>
                    </div>
                    <ChevronRight className="text-white/10 group-hover:text-primary transition-all" size={20} />
                  </button>
                ))}
              </div>

              <div className="pt-6 border-t border-white/5">
                <button className="w-full p-6 rounded-[2rem] bg-white/5 border border-dashed border-white/10 flex items-center justify-center gap-3 group hover:bg-white/10 transition-all">
                  <HelpCircle size={18} className="text-white/20 group-hover:text-primary" />
                  <div className="text-left">
                    <p className="text-[10px] font-black uppercase text-white/40 tracking-widest">{t.notSure}</p>
                    <p className="text-[8px] font-bold text-primary uppercase tracking-widest leading-none mt-1">{t.notSureBtn}</p>
                  </div>
                </button>
              </div>
              
              <div className="text-center pt-8">
                <p className="text-[10px] font-black uppercase tracking-[0.6em] shining-white">{t.footer}</p>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
    );
  }

  if (step === 'method') {
    return (
      <div className="flex flex-col h-full bg-black font-headline pt-safe">
        <header className="px-8 pt-8 pb-4 shrink-0 flex items-center gap-4">
          <button onClick={() => setStep('substance')} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><ArrowLeft size={20} /></button>
          <div>
            <h1 className="text-xl font-black uppercase tracking-tighter">{selectedSub?.name}</h1>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.3em]">{t.selectMethod}</p>
          </div>
        </header>

        <ScrollArea className="flex-1 px-8 py-10">
          <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
            {METHODS.map((m) => (
              <button
                key={m.id}
                onClick={() => { playHeartbeat(); setSelectedMethod(m); setStep('camera'); startCamera(); }}
                className="p-6 rounded-[2rem] bg-white/[0.03] border-2 border-white/5 flex flex-col items-center gap-3 hover:border-primary/40 transition-all active:scale-95"
              >
                <span className="text-3xl">{m.icon}</span>
                <span className="text-[10px] font-black uppercase text-center text-white/60 leading-tight">{lang === 'en' ? m.label.en : m.label.de}</span>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (step === 'camera') {
    return (
      <div className="flex flex-col h-full bg-black font-headline relative overflow-hidden">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
          <div className="w-full h-full border-2 border-primary/40 rounded-[3rem] relative shadow-[0_0_0_100vw_rgba(0,0,0,0.4)]">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-white/20 rounded-2xl flex flex-col items-center justify-center">
                <Maximize size={32} className="text-white/20 mb-2" />
                <CircleDot size={12} className="text-primary animate-pulse" />
             </div>
          </div>
        </div>

        <header className="relative z-10 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => { stopCamera(); setStep('method'); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white"><ArrowLeft size={20} /></button>
          <div className="text-right">
            <span className="block text-[10px] font-black uppercase text-primary">{selectedSub?.name}</span>
            <span className="text-[8px] font-bold uppercase text-white/40">{lang === 'en' ? selectedMethod?.label.en : selectedMethod?.label.de}</span>
          </div>
        </header>

        <div className="flex-1" />

        <div className="relative z-10 p-10 space-y-6 text-center bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="space-y-1">
            <p className="text-xl font-black uppercase text-white tracking-tight">{t.instr1}</p>
            <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{t.instr2}</p>
          </div>
          <button 
            onClick={captureAndAnalyze}
            disabled={isLoading}
            className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-2xl active:scale-90 transition-all mx-auto"
          >
            {isLoading ? <Loader2 className="animate-spin text-white" size={32} /> : <div className="w-16 h-16 rounded-full border-2 border-white/40 animate-pulse" />}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const isHighRisk = result?.riskLevel === 'High';
    return (
      <div className="flex flex-col h-full bg-black font-headline">
        <header className="px-8 pt-10 pb-6 border-b border-white/5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20"><Scaling size={24} className="text-primary" /></div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">{t.results}</h2>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{selectedSub?.name}</p>
            </div>
          </div>
          <button onClick={() => setStep('camera')} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><X size={20} /></button>
        </header>

        <ScrollArea className="flex-1 px-8 pt-8">
          <div className="max-w-md mx-auto space-y-8 pb-40">
            <div className="p-8 bg-white/[0.03] border-2 border-white/10 rounded-[2.5rem] text-center space-y-4">
              <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.range}</span>
              <p className="text-6xl font-black text-white tracking-tighter tabular-nums">{result?.minMg}–{result?.maxMg}</p>
              
              <div className="flex items-center justify-center gap-4 pt-4">
                 <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase border", result?.confidence === 'High' ? "bg-primary/10 border-primary text-primary" : "bg-amber-500/10 border-amber-500 text-amber-500")}>
                    {t.confidence}: {result?.confidence}
                 </div>
                 <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase border", isHighRisk ? "bg-red-600/10 border-red-600 text-red-500" : "bg-emerald-500/10 border-emerald-500 text-emerald-500")}>
                    {t.risk}: {result?.riskLevel}
                 </div>
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
              <Info className="text-primary shrink-0" size={18} />
              <p className="text-[9px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">{t.disclaimer}</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center"><span className="text-[10px] font-black uppercase text-white/30 tracking-widest">{t.adjust}</span><span className="text-xl font-black text-white">{manualValue} MG</span></div>
              <Slider value={[manualValue]} onValueChange={(val) => setManualValue(val[0])} max={200} step={5} />
            </div>

            <button onClick={() => setStep('notes')} className="w-full h-20 bg-primary text-white rounded-full font-black text-lg uppercase tracking-widest shadow-2xl active:scale-95 transition-all flex items-center justify-center gap-3">{t.confirm} <CheckCircle2 size={24} /></button>
          </div>
        </ScrollArea>
      </div>
    );
  }

  if (step === 'notes') {
    return (
      <div className="flex flex-col h-full bg-black font-headline pt-safe">
        <header className="p-8 pb-4 flex items-center justify-between">
          <button onClick={() => setStep('result')} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><ArrowLeft size={20} /></button>
          <span className="text-[10px] font-black uppercase text-primary">{t.notes}</span>
        </header>

        <div className="flex-1 px-8 py-6 space-y-10 max-w-md mx-auto w-full">
          <div className="space-y-4">
            <h2 className="text-3xl font-black uppercase tracking-tighter">{t.mood}</h2>
            <div className="flex justify-between bg-white/5 p-6 rounded-[2rem] border border-white/10">
              {['😐', '😊', '😵'].map((e, i) => (
                <button 
                  key={i} 
                  onClick={() => { playHeartbeat(); setMood(['neutral', 'good', 'strong'][i]); }}
                  className={cn("text-4xl p-4 rounded-2xl transition-all", (mood === 'neutral' && i===0) || (mood === 'good' && i===1) || (mood === 'strong' && i===2) ? "bg-primary/20 scale-110 shadow-lg" : "opacity-40 grayscale")}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-white/30">{t.notes}</h2>
            <textarea 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)}
              placeholder="E.g. mixed with alcohol..."
              className="w-full h-32 bg-white/5 border-2 border-white/10 rounded-[2rem] p-6 text-white font-bold outline-none focus:border-primary transition-all resize-none"
            />
          </div>

          <button onClick={handleFinalSave} className="w-full h-20 bg-primary text-white rounded-full font-black text-xl uppercase tracking-widest shadow-2xl active:scale-95 transition-all">{t.confirm}</button>
        </div>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="flex flex-col items-center justify-center h-full p-10 text-center space-y-10 font-headline bg-black animate-in zoom-in duration-700">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full animate-ping" />
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/40 relative z-10">
            <CheckCircle2 size={64} className="text-primary" />
          </div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black uppercase tracking-tighter text-white">{t.logged}</h2>
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{t.analyzing}</p>
        </div>
        <div className="w-full max-w-xs space-y-4">
          <button onClick={onCancel} className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest">{t.backHome}</button>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] shining-white mt-10">{t.footer}</p>
      </div>
    );
  }

  return null;
}

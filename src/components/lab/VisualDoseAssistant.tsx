
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
  Mic,
  Scaling,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { estimateDose, type EstimateDoseOutput } from '@/ai/flows/estimate-dose-flow';
import { playHeartbeat } from '@/lib/resonance';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';

/**
 * @fileOverview Visual Dose Assistant (Hybrid Mode).
 * Features: AI Vision portion estimation with manual calibration.
 * Rhythmic Rules: 3 words (EN) / 4 words (DE).
 */

const SUBSTANCES = [
  { id: 'ketamine', name: 'Ketamine', de: 'Ketamin', color: 'text-indigo-400' },
  { id: '3mmc', name: '3-MMC', de: '3-MMC', color: 'text-orange-300' },
  { id: '4mmc', name: '4-MMC', de: '4-MMC', color: 'text-pink-300' },
  { id: 'cocaine', name: 'Cocaine', de: 'Kokain', color: 'text-slate-200' },
  { id: 'mdma', name: 'MDMA', de: 'MDMA', color: 'text-purple-400' },
];

const CONTENT = {
  en: {
    title: "Visual Dose Assistant",
    select: "Select the substance",
    scan: "Visual portion scan",
    instr1: "Point camera steady",
    instr2: "Dose on surface",
    analyzing: "Analyzing visual volume",
    results: "Estimation Results",
    range: "Estimated portion range",
    confidence: "Confidence Level",
    comparison: "Visual Reference",
    disclaimer: "Approximate visual estimate only Use a scale for accuracy",
    confirm: "Confirm and log",
    adjust: "Adjust the portion",
    logged: "Truth logged now",
    back: "Back to lab",
    restart: "Rescan portion now"
  },
  de: {
    title: "Visueller Dosier Assistent heute",
    select: "Wähle die Substanz heute",
    scan: "Visueller Scan heute hier",
    instr1: "Kamera ruhig halten heute",
    instr2: "Portion auf Oberfläche heute",
    analyzing: "Volumen wird analysiert heute",
    results: "Ergebnisse der Schätzung heute",
    range: "Geschätzter Bereich heute hier",
    confidence: "Grad der Sicherheit heute",
    comparison: "Visueller Vergleich heute hier",
    disclaimer: "Nur eine grobe Schätzung Nutze eine Waage für Präzision",
    confirm: "Bestätigen und notieren heute",
    adjust: "Portion jetzt anpassen heute",
    logged: "Wahrheit jetzt notiert heute",
    back: "Zurück zum Lab heute",
    restart: "Erneut scannen heute hier"
  }
};

interface Props {
  onComplete: (log: any) => void;
  onCancel: () => void;
}

export function VisualDoseAssistant({ onComplete, onCancel }: Props) {
  const [lang, setLang] = useState<'en' | 'de'>('en');
  const [step, setStep] = useState<'select' | 'camera' | 'result'>('select');
  const [selectedSub, setSelectedSub] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<EstimateDoseOutput | null>(null);
  const [manualValue, setManualValue] = useState<number>(0);
  
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

  const handleSelect = (sub: any) => {
    playHeartbeat();
    setSelectedSub(sub);
    setStep('camera');
    startCamera();
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
        substanceName: selectedSub.name
      });
      setResult(estimation);
      setManualValue(Math.round((estimation.minMg + estimation.maxMg) / 2));
      setStep('result');
    } catch (err) {
      console.error("Estimation failed", err);
      setStep('select');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    playHeartbeat();
    onComplete({
      id: selectedSub.id,
      name: lang === 'en' ? selectedSub.name : selectedSub.de,
      value: manualValue,
      unit: 'mg',
      method: result?.method || 'visual_scan',
      timestamp: new Date().toISOString()
    });
  };

  if (step === 'select') {
    return (
      <div className="flex flex-col h-full bg-black font-headline pt-safe">
        <header className="px-8 pt-8 pb-4 shrink-0 flex items-center justify-between">
          <button onClick={onCancel} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><X size={20} /></button>
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{t.title}</span>
          </div>
        </header>

        <ScrollArea className="flex-1 px-8 py-10">
          <div className="max-w-md mx-auto space-y-10">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-black uppercase tracking-tighter text-white leading-none">{t.select}</h2>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.scan}</p>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {SUBSTANCES.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => handleSelect(sub)}
                  className="w-full p-6 rounded-[2.5rem] bg-white/[0.03] border-2 border-white/5 flex items-center justify-between group hover:border-primary/40 transition-all active:scale-95"
                >
                  <div className="flex items-center gap-5">
                    <div className={cn("w-14 h-14 rounded-2xl bg-black/40 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform", sub.color)}>
                      <Scaling size={28} />
                    </div>
                    <span className="text-xl font-black uppercase tracking-tight text-white">{lang === 'en' ? sub.name : sub.de}</span>
                  </div>
                  <ChevronRight className="text-white/10 group-hover:text-primary transition-all" size={20} />
                </button>
              ))}
            </div>
          </div>
        </ScrollArea>
        
        <footer className="p-10 text-center shrink-0">
          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] shining-white">Created in harmony</p>
        </footer>
      </div>
    );
  }

  if (step === 'camera') {
    return (
      <div className="flex flex-col h-full bg-black font-headline relative overflow-hidden">
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-60"
        />
        <canvas ref={canvasRef} className="hidden" />

        <div className="absolute inset-0 border-[40px] border-black/40 pointer-events-none">
          <div className="w-full h-full border-2 border-primary/40 rounded-[3rem] relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-48 border-2 border-white/20 rounded-2xl flex items-center justify-center">
              <div className="absolute inset-0 bg-primary/5 blur-xl animate-pulse" />
              <Maximize size={32} className="text-white/20" />
            </div>
          </div>
        </div>

        <header className="relative z-10 p-8 flex items-center justify-between bg-gradient-to-b from-black/80 to-transparent">
          <button onClick={() => { stopCamera(); setStep('select'); }} className="p-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white"><ArrowLeft size={20} /></button>
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-primary">{selectedSub?.name}</span>
            <span className="text-[8px] font-bold uppercase text-white/40 tracking-widest">{t.scan}</span>
          </div>
        </header>

        <div className="flex-1" />

        <div className="relative z-10 p-10 space-y-8 bg-gradient-to-t from-black to-transparent text-center">
          <div className="space-y-2">
            <p className="text-xl font-black uppercase tracking-tight text-white">{t.instr1}</p>
            <p className="text-[10px] font-black uppercase text-primary tracking-[0.4em]">{t.instr2}</p>
          </div>

          <button 
            onClick={captureAndAnalyze}
            disabled={isLoading}
            className="w-24 h-24 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-2xl active:scale-90 transition-all mx-auto group"
          >
            {isLoading ? <Loader2 className="animate-spin text-white" size={32} /> : <div className="w-16 h-16 rounded-full border-2 border-white/40 group-hover:scale-110 transition-transform" />}
          </button>

          <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.6em] shining-white">Created in harmony</p>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    const isHighConfidence = result?.confidence === 'High';
    const isCritical = manualValue > 100;

    return (
      <div className="flex flex-col h-full bg-black font-headline">
        <header className="px-8 pt-10 pb-6 border-b border-white/5 shrink-0 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Scaling size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tighter text-white">{t.results}</h2>
              <p className="text-[9px] font-black text-primary uppercase tracking-[0.4em]">{selectedSub?.name}</p>
            </div>
          </div>
          <button onClick={() => setStep('camera')} className="p-3 bg-white/5 rounded-full border border-white/10 text-white/40"><X size={20} /></button>
        </header>

        <ScrollArea className="flex-1 px-8 pt-8">
          <div className="max-w-md mx-auto space-y-10 pb-40">
            <div className="p-8 bg-white/[0.03] border-2 border-white/10 rounded-[2.5rem] text-center space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">{t.range}</span>
                <p className="text-6xl font-black text-white tracking-tighter tabular-nums">{result?.minMg}–{result?.maxMg}</p>
                <p className="text-xs font-black text-primary uppercase tracking-widest">MG Range</p>
              </div>

              <div className="flex items-center justify-center gap-6 pt-4 border-t border-white/5">
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">{t.confidence}</span>
                  <div className={cn("px-3 py-1 rounded-full text-[9px] font-black uppercase border", isHighConfidence ? "bg-primary/10 border-primary text-primary" : "bg-amber-500/10 border-amber-500 text-amber-500")}>
                    {result?.confidence}
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Method</span>
                  <div className="px-3 py-1 rounded-full text-[9px] font-black uppercase border border-white/20 text-white/60">
                    {result?.method.replace('_', ' ')}
                  </div>
                </div>
              </div>
            </div>

            {isCritical && (
              <div className="p-6 bg-red-600/10 border-2 border-red-600/30 rounded-2xl flex items-start gap-4 animate-in zoom-in-95 duration-500">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" size={20} />
                <div className="space-y-1">
                  <p className="text-xs font-black uppercase text-red-500 tracking-tight">Portion Alert</p>
                  <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase tracking-widest">{result?.advice}</p>
                </div>
              </div>
            )}

            <div className="space-y-6">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] flex items-center gap-2"><Smartphone size={14} /> {t.adjust}</h3>
                <span className="text-xl font-black text-white tabular-nums">{manualValue} <span className="text-[10px] text-white/20">MG</span></span>
              </div>
              <div className="px-2">
                <Slider 
                  value={[manualValue]} 
                  onValueChange={(val) => setManualValue(val[0])} 
                  max={200} 
                  step={5} 
                  className="py-4"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] px-1">{t.comparison}</h3>
              <div className="grid grid-cols-3 gap-3">
                {[20, 40, 60].map(val => (
                  <div key={val} className="aspect-square bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-primary/20 flex items-center justify-center bg-primary/5">
                      <Zap size={16} className="text-primary/40" />
                    </div>
                    <span className="text-[10px] font-black text-white/40">{val}MG</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-white/5 rounded-2xl border border-white/10 flex items-start gap-4">
              <Info className="text-[#EBFB3B] shrink-0" size={18} />
              <p className="text-[9px] font-bold text-white/40 leading-relaxed uppercase tracking-widest">{t.disclaimer}</p>
            </div>
          </div>
        </ScrollArea>

        <footer className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black via-black to-transparent pointer-events-none pb-safe z-50">
          <div className="max-w-md mx-auto space-y-4 pointer-events-auto">
            <button 
              onClick={handleConfirm}
              className="w-full h-20 bg-[#1b4d3e] text-white rounded-full font-black text-lg uppercase tracking-[0.2em] transition-all shadow-2xl active:scale-95 flex items-center justify-center gap-3 border-2 border-primary/20"
            >
              {t.confirm} <CheckCircle2 size={24} />
            </button>
            <p className="text-center text-[10px] font-black uppercase tracking-[0.5em] shining-white pt-2">{t.footer}</p>
          </div>
        </footer>
      </div>
    );
  }

  return null;
}

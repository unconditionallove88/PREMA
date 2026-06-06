"use client"

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Search, AlertTriangle, Loader2 } from 'lucide-react';
import { substanceInteractionRiskAssessment, type SubstanceInteractionRiskAssessmentOutput } from '@/ai/flows/substance-interaction-risk-assessment';
import type { OnboardingData } from '@/app/onboarding/page';

const SUBSTANCES = [
  'Alcohol', 'MDMA', '3-MMC', 'Cannabis', 'Ketamine', 'LSD', 'Cocaine', 'Psilocybin', 'Speed'
];

export function Step5SubstanceLab({ userData, onComplete }: { userData: OnboardingData, onComplete: (subs: string[]) => void }) {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<SubstanceInteractionRiskAssessmentOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const filtered = SUBSTANCES.filter(s => s.toLowerCase().includes(search.toLowerCase()));

  const toggle = (s: string) => {
    setSelected(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  useEffect(() => {
    if (selected.length === 0) {
      setAssessment(null);
      return;
    }

    const runAssessment = async () => {
      setLoading(true);
      try {
        const res = await substanceInteractionRiskAssessment({
          healthConditions: userData.healthConditions || [],
          medications: userData.medications,
          substancesToTake: selected,
          age: 25, // Fallback if data not available
          weightKg: userData.weight || 70,
        });
        setAssessment(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(runAssessment, 1000);
    return () => clearTimeout(timer);
  }, [selected, userData]);

  const riskColor = assessment?.overallRiskLevel === 'Critical' || assessment?.overallRiskLevel === 'High' 
    ? 'bg-red-600' 
    : assessment?.overallRiskLevel === 'Medium' 
      ? 'bg-yellow-500' 
      : 'bg-secondary';

  return (
    <div className="w-full flex flex-col items-center">
      <h2 className="font-headline text-4xl font-black uppercase mb-8">Substance Lab</h2>
      
      <div className="relative w-full mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
        <Input 
          placeholder="SEARCH SUBSTANCES..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-2 border-border/20 h-16 pl-14 rounded-2xl focus:border-secondary uppercase font-black tracking-widest text-xs text-white"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-12 justify-center">
        {filtered.map(s => (
          <button
            key={s}
            onClick={() => toggle(s)}
            className={`px-8 py-4 rounded-full border-2 transition-all font-headline font-black uppercase text-xs tracking-wider ${
              selected.includes(s) 
                ? 'bg-secondary border-secondary text-black shadow-[0_0_15px_rgba(57,255,20,0.5)]' 
                : 'bg-transparent border-border/20 text-white/60 hover:border-border/50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="w-full max-w-md bg-card rounded-[2.5rem] border-2 border-border/10 p-10 mb-12">
        <div className="flex justify-between items-center mb-6">
          <span className="font-headline font-black uppercase tracking-[0.3em] text-xs text-white/30">Risk Profile</span>
          {loading && <Loader2 className="w-5 h-5 animate-spin text-secondary" />}
        </div>
        
        <div className="w-full h-4 bg-card/5 rounded-full overflow-hidden mb-8 border border-border/10">
          <div 
            className={`h-full transition-all duration-500 ${riskColor}`}
            style={{ width: assessment ? (assessment.overallRiskLevel === 'Critical' ? '100%' : assessment.overallRiskLevel === 'High' ? '75%' : assessment.overallRiskLevel === 'Medium' ? '40%' : '15%') : '0%' }}
          />
        </div>

        {assessment && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3 text-lg font-black uppercase tracking-tight">
              <AlertTriangle className={`w-6 h-6 ${riskColor.replace('bg-', 'text-')}`} />
              <span className={riskColor.replace('bg-', 'text-')}>{assessment.overallRiskLevel} Risk</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed font-bold">{assessment.summary}</p>
          </div>
        )}
      </div>

      <button
        onClick={() => onComplete(selected)}
        className="pill-button w-full max-w-sm bg-secondary text-black text-2xl py-8 neon-glow font-headline font-black uppercase tracking-[0.2em]"
      >
        VALIDATE MIX
      </button>
    </div>
  );
}

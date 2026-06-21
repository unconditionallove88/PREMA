

import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { StepIntentions } from '@/components/onboarding/StepIntentions';
import { StepSomethingToRemember } from '@/components/onboarding/StepSomethingToRemember';
import { StepCareAlarms } from '@/components/onboarding/StepCareAlarms';
import { Step7EssentialsCheck } from '@/components/onboarding/Step7EssentialsCheck';
import type { OnboardingData } from '@/app/onboarding/page';

export default function SessionCheckIn() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    setMounted(true);
    const profileStr = localStorage.getItem('prema_profile');
    
    if (profileStr) {
      setData(JSON.parse(profileStr));
    } else {
      const defaultProfile: OnboardingData = {
        name: 'HEART',
        dob: '',
        weight: 75,
        height: 175,
        medications: [],
        substances: [],
        healthConditions: [],
        goals: [],
      };
      setData(defaultProfile);
      localStorage.setItem('prema_profile', JSON.stringify(defaultProfile));
    }
    
    localStorage.removeItem('prema_logs');
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateProfile = (updates: Partial<OnboardingData>) => {
    if (!data) return;
    const final = { ...data, ...updates };
    setData(final);
    localStorage.setItem('prema_profile', JSON.stringify(final));
  };

  if (!mounted || !data) return null;

  return (
    <main className="min-h-screen bg-card text-foreground px-6 py-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-xl">
        {step === 1 && (
          <StepIntentions 
            onBack={() => setLocation('/auth')}
            onComplete={(goals) => {
              updateProfile({ goals });
              nextStep();
            }} 
          />
        )}

        {step === 2 && (
          <StepSomethingToRemember
            onBack={prevStep}
            onComplete={(wisdom) => {
              updateProfile({ careBoundaries: wisdom });
              nextStep();
            }}
          />
        )}

        {step === 3 && (
          <StepCareAlarms
            onBack={prevStep}
            onComplete={(alarms) => {
              updateProfile({ careAlarms: alarms });
              nextStep();
            }}
          />
        )}

        {step === 4 && (
          <Step7EssentialsCheck 
            onBack={prevStep}
            onComplete={() => {
              localStorage.setItem('prema_session_phase', 'before');
              setLocation('/supporter');
            }} 
          />
        )}
      </div>
    </main>
  );
}

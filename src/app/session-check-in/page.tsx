
"use client"

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { StepPartyGoal } from '@/components/onboarding/StepPartyGoal';
import { StepSomethingToRemember } from '@/components/onboarding/StepSomethingToRemember';
import { StepCareAlarms } from '@/components/onboarding/StepCareAlarms';
import { Step7GearCheck } from '@/components/onboarding/Step7GearCheck';
import type { OnboardingData } from '@/app/onboarding/page';

/**
 * @fileOverview Mandatory session check-in flow for returning users.
 * Includes: Detailed Intention, Mixing Wisdom, Alarms, and Gear Check.
 */
export default function SessionCheckIn() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<OnboardingData | null>(null);

  useEffect(() => {
    setMounted(true);
    const profileStr = localStorage.getItem('stayonbeat_profile');
    
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
      localStorage.setItem('stayonbeat_profile', JSON.stringify(defaultProfile));
    }
    
    localStorage.removeItem('stayonbeat_logs');
  }, []);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateProfile = (updates: Partial<OnboardingData>) => {
    if (!data) return;
    const final = { ...data, ...updates };
    setData(final);
    localStorage.setItem('stayonbeat_profile', JSON.stringify(final));
  };

  if (!mounted || !data) return null;

  return (
    <main className="min-h-screen bg-black text-white px-6 py-4 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-xl">
        {step === 1 && (
          <StepPartyGoal 
            onBack={() => router.push('/auth')}
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
          <Step7GearCheck 
            onBack={prevStep}
            onComplete={() => {
              router.push('/dashboard');
            }} 
          />
        )}
      </div>
    </main>
  );
}

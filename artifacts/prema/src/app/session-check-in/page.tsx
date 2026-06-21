import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { StepIntentions } from '@/components/onboarding/StepIntentions';
import type { OnboardingData } from '@/app/onboarding/page';

export default function SessionCheckIn() {
  const [, setLocation] = useLocation();
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
        <StepIntentions
          onBack={() => setLocation('/auth')}
          onComplete={(goals) => {
            updateProfile({ goals });
            localStorage.setItem('prema_session_phase', 'before');
            setLocation('/supporter');
          }}
        />
      </div>
    </main>
  );
}

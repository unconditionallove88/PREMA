
"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Step1ImportantStuff } from '@/components/onboarding/Step1';
import { Step2WhoAreYou } from '@/components/onboarding/Step2';
import { StepSimpleIntention } from '@/components/onboarding/StepSimpleIntention';
import { Step3HealthConditions } from '@/components/onboarding/Step3HealthConditions';
import { Step4Medications } from '@/components/onboarding/Step4Medications';
import { Step6StripeVerify } from '@/components/onboarding/Step6StripeVerify';
import { Step9Summary } from '@/components/onboarding/Step8Summary';
import { PulseGuide } from '@/components/dashboard/PulseGuide';
import { safeStringify } from '@/lib/safe-storage';
import { useAuth, useFirestore } from '@/firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

export type LegalAgreements = {
  agreedToHarmReduction: boolean;
  agreedToMedicalDisclaimer: boolean;
  agreedToGDPR: boolean;
  agreedToSafetyNetwork: boolean;
  agreedToImmediateHelp: boolean;
  termsAcceptedAt: string;
  appVersion: string;
};

export type OnboardingData = {
  name: string;
  dob: string;
  weight: number;
  height: number;
  age?: number;
  medications: string[];
  substances: { name: string; dose: string }[];
  healthConditions: string[];
  goals: string[];
  simpleIntention?: string;
  legalAgreements?: LegalAgreements;
  verification?: { stripeCustomerId: string; last4: string; method: string; isAgeVerified: boolean };
  careBoundaries?: any;
  careAlarms?: any;
};

export default function Onboarding() {
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    name: '',
    dob: '',
    weight: 0,
    height: 0,
    medications: [],
    substances: [],
    healthConditions: [],
    goals: [],
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const updateAndPersist = (updates: Partial<OnboardingData>) => {
    const final = { ...data, ...updates };
    setData(final);
    try {
      localStorage.setItem('prema_profile', safeStringify(final));
    } catch (e) {
      console.error("Could not save to localStorage:", e);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      const user = auth.currentUser;
      if (user && firestore) {
        await setDoc(doc(firestore, 'users', user.uid), {
          uid: user.uid,
          name: data.name,
          trustLevel: "verified_adult",
          onboardingStatus: "completed",
          onboardingCompletedAt: serverTimestamp(),
          simpleIntention: data.simpleIntention || null,
          healthConditions: data.healthConditions || [],
          medications: data.medications || [],
          biometrics: {
            weightKg: data.weight,
            heightCm: data.height,
            ageGroup: data.age && data.age >= 18 ? "adult" : "unknown"
          },
          legal: {
            harmReductionAccepted: data.legalAgreements?.agreedToHarmReduction,
            gdprAccepted: data.legalAgreements?.agreedToGDPR,
            termsAcceptedAt: data.legalAgreements?.termsAcceptedAt
          }
        }, { merge: true });
      }
      setStep(8); // Interactive guide
    } catch (error) {
      console.error("Onboarding completion error:", error);
    }
  };

  const handleFinalRedirect = async () => {
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-card text-foreground flex flex-col items-center pt-safe pb-safe">
      <div className="w-full max-w-2xl py-8 md:py-16 relative">
        {step === 1 && (
          <Step1ImportantStuff onComplete={(legal) => { updateAndPersist({ legalAgreements: legal }); nextStep(); }} />
        )}
        
        {step === 2 && (
          <Step2WhoAreYou onBack={prevStep} onComplete={(profile) => { updateAndPersist(profile); nextStep(); }} />
        )}

        {step === 3 && (
          <StepSimpleIntention onBack={prevStep} onComplete={(intention) => { updateAndPersist({ simpleIntention: intention }); nextStep(); }} />
        )}
        
        {step === 4 && (
          <Step3HealthConditions selected={data.healthConditions} onBack={prevStep} onComplete={(conditions) => { updateAndPersist({ healthConditions: conditions }); nextStep(); }} />
        )}
        
        {step === 5 && (
          <Step4Medications selected={data.medications} onBack={prevStep} onComplete={(meds) => { updateAndPersist({ medications: meds }); nextStep(); }} />
        )}

        {step === 6 && (
          <Step6StripeVerify
            onBack={prevStep}
            onComplete={(stripeData) => {
              updateAndPersist({
                verification: {
                  isAgeVerified: true,
                  method: "stripe_card_check_demo",
                  stripeCustomerId: stripeData.stripeId,
                  last4: stripeData.last4,
                },
              });
              setStep(7);
            }}
          />
        )}

        {step === 7 && (
          <Step9Summary 
            data={data}
            onComplete={handleOnboardingComplete} 
          />
        )}

        {step === 8 && (
          <PulseGuide forceOpen={true} onDismiss={handleFinalRedirect} />
        )}
      </div>
    </main>
  );
}



import { useLocation } from "wouter";
import { StepLaboratoryTesting } from "@/components/onboarding/StepLaboratoryTesting";

export default function LaboratoryTestPage() {
  const [, setLocation] = useLocation();
  return (
    <main className="min-h-screen bg-card flex items-center justify-center p-6 pt-safe pb-safe">
      <StepLaboratoryTesting 
        onBack={() => window.history.back()} 
        onComplete={() => setLocation('/dashboard')} 
      />
    </main>
  );
}

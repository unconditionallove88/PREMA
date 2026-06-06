
"use client";

import { useRouter } from "next/navigation";
import { StepLaboratoryTesting } from "@/components/onboarding/StepLaboratoryTesting";

export default function LaboratoryTestPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen bg-card flex items-center justify-center p-6 pt-safe pb-safe">
      <StepLaboratoryTesting 
        onBack={() => router.back()} 
        onComplete={() => router.push('/dashboard')} 
      />
    </main>
  );
}

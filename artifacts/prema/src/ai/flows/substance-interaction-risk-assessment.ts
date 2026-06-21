export type SubstanceInteractionRiskAssessmentInput = {
  healthConditions: string[];
  medications: string[];
  substancesToTake: string[];
  age: number;
  weightKg: number;
  lang?: 'en' | 'de';
};
export type SubstanceInteractionRiskAssessmentOutput = {
  overallRiskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  summary: string;
  interactions: Array<{ substances: string[]; risk: string; description: string }>;
  recommendations: string[];
};

export async function substanceInteractionRiskAssessment(
  input: SubstanceInteractionRiskAssessmentInput
): Promise<SubstanceInteractionRiskAssessmentOutput> {
  const res = await fetch('/api/ai/substance-interaction', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    return {
      overallRiskLevel: 'Low',
      summary: 'Risk assessment is temporarily unavailable.',
      interactions: [],
      recommendations: ['Consult a harm reduction professional for personalized advice.'],
    };
  }
  return res.json();
}

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
  _input: SubstanceInteractionRiskAssessmentInput
): Promise<SubstanceInteractionRiskAssessmentOutput> {
  return {
    overallRiskLevel: 'Low',
    summary: 'AI risk assessment is not available in this build.',
    interactions: [],
    recommendations: ['Consult a harm reduction professional for personalized advice.'],
  };
}

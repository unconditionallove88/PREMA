export type EstimateDoseInput = { photoDataUri: string; substanceName: string; method?: string };
export type EstimateDoseOutput = {
  estimated_dose: { min_mg: number; max_mg: number; unit: 'mg' | 'ml' };
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  safety_note: string;
};

export async function estimateDose(_input: EstimateDoseInput): Promise<EstimateDoseOutput> {
  return {
    estimated_dose: { min_mg: 0, max_mg: 0, unit: 'mg' },
    confidence: 'LOW',
    reasoning: 'AI features are not available in this build.',
    safety_note: 'Please use a scale for accurate dosing.',
  };
}

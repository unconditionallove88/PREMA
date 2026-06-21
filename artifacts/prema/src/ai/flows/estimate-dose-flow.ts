export type EstimateDoseInput = { photoDataUri: string; substanceName: string; method?: string };
export type EstimateDoseOutput = {
  estimated_dose: { min_mg: number; max_mg: number; unit: 'mg' | 'ml' };
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  safety_note: string;
};

export async function estimateDose(input: EstimateDoseInput): Promise<EstimateDoseOutput> {
  const res = await fetch('/api/ai/estimate-dose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    return {
      estimated_dose: { min_mg: 0, max_mg: 0, unit: 'mg' },
      confidence: 'LOW',
      reasoning: 'Dose estimation is temporarily unavailable.',
      safety_note: 'Always use a scale for accurate dosing.',
    };
  }
  return res.json();
}

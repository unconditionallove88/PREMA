export type IdentifyPillInput = { photoDataUri: string };
export type IdentifyPillOutput = {
  visual_description: string;
  possible_match: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  safety_information: string;
  warning: string;
  recommended_action: string;
};

export async function identifyPill(input: IdentifyPillInput): Promise<IdentifyPillOutput> {
  const res = await fetch('/api/ai/identify-pill', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    return {
      visual_description: 'Pill identification is temporarily unavailable.',
      possible_match: 'Unknown',
      confidence: 'LOW',
      safety_information: 'Please use a drug checking service.',
      warning: 'Never rely on visual identification alone.',
      recommended_action: 'Use a reagent test kit or drug checking service.',
    };
  }
  return res.json();
}

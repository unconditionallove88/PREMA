export type IdentifyPillInput = { photoDataUri: string };
export type IdentifyPillOutput = {
  visual_description: string;
  possible_match: string;
  confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  safety_information: string;
  warning: string;
  recommended_action: string;
};

export async function identifyPill(_input: IdentifyPillInput): Promise<IdentifyPillOutput> {
  return {
    visual_description: 'AI features are not available in this build.',
    possible_match: 'Unknown',
    confidence: 'LOW',
    safety_information: 'Please use a drug checking service.',
    warning: 'Never rely on visual identification alone.',
    recommended_action: 'Use a reagent test kit or drug checking service.',
  };
}

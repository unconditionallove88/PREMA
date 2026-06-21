export type GenerateSubstanceVideoInput = { substanceName: string };
export type GenerateSubstanceVideoOutput = { videoDataUri: string };

export async function generateSubstanceEducationVideo(
  _input: GenerateSubstanceVideoInput
): Promise<GenerateSubstanceVideoOutput> {
  return { videoDataUri: '' };
}

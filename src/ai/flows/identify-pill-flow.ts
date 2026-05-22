
'use server';
/**
 * @fileOverview A Genkit flow for identifying pills based on visual characteristics.
 *
 * - identifyPill - Analyzes a photo of a pill to suggest possible substances and risks.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyPillInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a pill, as a data URI. Expected format: 'data:image/jpeg;base64,...'"),
});
export type IdentifyPillInput = z.infer<typeof IdentifyPillInputSchema>;

const IdentifyPillOutputSchema = z.object({
  visual_characteristics: z.object({
    shape: z.string(),
    color: z.string(),
    imprint: z.string().nullable(),
    size_estimate: z.string(),
    texture: z.string(),
  }),
  possible_substance: z.string(),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
  typical_dose_range: z.object({
    min_mg: z.number(),
    max_mg: z.number(),
  }),
  common_risks: z.array(z.string()),
  safety_warning: z.string().describe("Mandatory safety warning."),
  lab_test_recommendation: z.string().describe("Always recommend reagent or lab testing."),
});
export type IdentifyPillOutput = z.infer<typeof IdentifyPillOutputSchema>;

export async function identifyPill(input: IdentifyPillInput): Promise<IdentifyPillOutput> {
  return identifyPillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'identifyPillPrompt',
  input: { schema: IdentifyPillInputSchema },
  output: { schema: IdentifyPillOutputSchema },
  prompt: `You are a harm reduction AI assistant. Your task is to analyze a photo of a pill and provide identification based on visual characteristics only.

Analyze:
1. Shape (round, square, diamond, heart, etc.)
2. Color (primary and secondary)
3. Logo or imprint (if visible)
4. Size (approximate, relative to any reference object)
5. Surface texture (smooth, speckled, pressed, etc.)

Based on these characteristics, suggest:
- Possible substance
- Typical dose range
- Key risks

CRITICAL RULES:
- Always state clearly that visual identification is NOT reliable and NOT a substitute for lab testing.
- Never confirm with certainty what a pill contains.
- Always recommend reagent testing or professional drug checking services.
- If the image is unclear or the pill is not recognizable, say so clearly.
- Never encourage drug use. Always prioritize user safety.

Photo: {{media url=photoDataUri}}`,
});

const identifyPillFlow = ai.defineFlow(
  {
    name: 'identifyPillFlow',
    inputSchema: IdentifyPillInputSchema,
    outputSchema: IdentifyPillOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

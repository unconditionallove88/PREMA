'use server';
/**
 * @fileOverview A Genkit flow for identifying pills based on visual characteristics.
 *
 * - identifyPill - Analyzes a photo of a pill to suggest possible substances and risks.
 * - IdentifyPillInput - The input type (photo data URI).
 * - IdentifyPillOutput - The return type matching the strict safety schema.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const IdentifyPillInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of a pill, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:image/jpeg;base64,...'"),
});
export type IdentifyPillInput = z.infer<typeof IdentifyPillInputSchema>;

const IdentifyPillOutputSchema = z.object({
  visual_description: z.string().describe("What you observe: shape, color, imprint, size, texture."),
  possible_match: z.string().describe("Matches with commonly known pill appearances in databases (include uncertainty language)."),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]).describe("Confidence in the visual analysis."),
  safety_information: z.string().describe("General safety information relevant to the most likely substance category."),
  warning: z.string().describe("Mandatory safety warning (never confirm with certainty)."),
  recommended_action: z.string().describe("Always recommend reagent testing or drug checking services."),
});
export type IdentifyPillOutput = z.infer<typeof IdentifyPillOutputSchema>;

export async function identifyPill(input: IdentifyPillInput): Promise<IdentifyPillOutput> {
  return identifyPillFlow(input);
}

const identifyPillFlow = ai.defineFlow(
  {
    name: 'identifyPillFlow',
    inputSchema: IdentifyPillInputSchema,
    outputSchema: IdentifyPillOutputSchema,
  },
  async (input) => {
    const { output } = await ai.generate({
      prompt: [
        { text: `You are a harm reduction safety assistant.

A user has submitted an image of an unknown pill for visual analysis. 
Your role is to help them stay safe, not to encourage drug use.

Analyze the pill's visual characteristics only:
- Shape
- Color
- Any visible imprint, logo, or marking
- Approximate size
- Surface texture

Based on these visual characteristics:
1. Describe what you observe (visual description only)
2. Note if this matches any commonly known pill appearances in harm reduction databases
3. Provide general safety information relevant to the most likely substance category
4. Always recommend professional drug checking services

STRICT RULES:
- Never confirm with certainty what a pill contains
- Never provide instructions on how to use a substance
- Always include a safety warning
- Always recommend reagent testing or drug checking services
- If the image is unclear, say so and do not guess
- Frame all responses from a harm reduction and safety perspective` },
        { media: { url: input.photoDataUri } },
      ],
      output: { schema: IdentifyPillOutputSchema },
    });
    return output!;
  }
);

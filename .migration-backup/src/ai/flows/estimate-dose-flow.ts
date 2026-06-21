
'use server';
/**
 * @fileOverview A Genkit flow for estimating substance dose portions using Gemini Vision.
 *
 * - estimateDose - Analyzes a photo of a powder dose to estimate milligram range.
 * - EstimateDoseInput - The input type (photo data URI, substance, and method).
 * - EstimateDoseOutput - The estimated range, confidence, and risk assessment.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimateDoseInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the dose, as a data URI. Expected format: 'data:image/jpeg;base64,...'"),
  substanceName: z.string().describe("The name of the substance being estimated."),
  method: z.string().optional().describe("The method of portioning (e.g., key_tip_small, long_line)."),
});
export type EstimateDoseInput = z.infer<typeof EstimateDoseInputSchema>;

const EstimateDoseOutputSchema = z.object({
  estimated_dose: z.object({
    min_mg: z.number().describe("Minimum estimated weight in mg or ml."),
    max_mg: z.number().describe("Maximum estimated weight in mg or ml."),
    unit: z.enum(["mg", "ml"]).describe("The unit of measurement."),
  }),
  confidence: z.enum(["LOW", "MEDIUM", "HIGH"]),
  risk_level: z.enum(["SAFE", "MODERATE", "HIGH", "DANGEROUS"]),
  safety_note: z.string().describe("Short safety note (max 2 sentences)."),
  recommendation: z.string().describe("What the user should do next."),
  low_confidence_reason: z.string().nullable().describe("Reason for low confidence if applicable."),
});
export type EstimateDoseOutput = z.infer<typeof EstimateDoseOutputSchema>;

export async function estimateDose(input: EstimateDoseInput): Promise<EstimateDoseOutput> {
  return estimateDoseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'estimateDosePrompt',
  input: { schema: EstimateDoseInputSchema },
  output: { schema: EstimateDoseOutputSchema },
  prompt: `You are a specialized harm reduction visual analysis agent. 
Analyze the provided image which contains a portion of {{{substanceName}}} in powder or crystal form.

Context:
- Substance: {{{substanceName}}}
- Method provided by user: {{{method}}}

Your job:
1. Analyze the image to estimate the approximate volume or size of the substance visible.
2. Based on the substance and method provided, return an estimated dose range.
3. Return a confidence level: LOW / MEDIUM / HIGH.
4. Return a risk level: SAFE / MODERATE / HIGH / DANGEROUS.
5. Return a short safety note (max 2 sentences) relevant to this substance and dose.

IMPORTANT RULES:
- Never claim to identify the substance from the image. The user has already told you what it is.
- Always return a RANGE (min_mg and max_mg), never a single exact number.
- If confidence is LOW, say so clearly and recommend manual entry.
- Never encourage drug use. Always prioritize safety.
- If the image is unclear, dark, or does not show a substance, return confidence: LOW and explain why.

Photo: {{media url=photoDataUri}}`,
});

const estimateDoseFlow = ai.defineFlow(
  {
    name: 'estimateDoseFlow',
    inputSchema: EstimateDoseInputSchema,
    outputSchema: EstimateDoseOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

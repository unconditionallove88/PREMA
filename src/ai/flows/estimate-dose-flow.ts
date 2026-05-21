
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
  minMg: z.number().describe("The estimated minimum weight in milligrams."),
  maxMg: z.number().describe("The estimated maximum weight in milligrams."),
  confidence: z.enum(['Low', 'Medium', 'High']).describe("Confidence level of the estimation."),
  riskLevel: z.enum(['Low', 'Moderate', 'High']).describe("The risk level of the estimated dose."),
  advice: z.string().describe("Contextual safety advice for this dose size."),
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
Analyze the provided image which contains a portion of {{substanceName}} in powder or crystal form.

Context:
- Substance: {{substanceName}}
- Method provided by user: {{method}}

Instructions:
1. Use common reference objects in the image (a coin, key, or finger) to determine scale.
2. Provide a conservative milligram range (min-max) based on the volume and typical density of {{substanceName}}.
3. Evaluate confidence based on lighting and scale visibility.
4. Risk Assessment: 
   - Low: Typical starter dose.
   - Moderate: Noticeable effects, requires caution.
   - High: Potential danger or strong side effects.
5. Provide a one-line advice (under 15 words) in Sentence case.

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

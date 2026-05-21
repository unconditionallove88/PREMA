
'use server';
/**
 * @fileOverview A Genkit flow for estimating substance dose portions using Gemini Vision.
 *
 * - estimateDose - Analyzes a photo of a powder dose to estimate milligram range.
 * - EstimateDoseInput - The input type (photo data URI and substance name).
 * - EstimateDoseOutput - The estimated range and confidence.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const EstimateDoseInputSchema = z.object({
  photoDataUri: z.string().describe("A photo of the dose, as a data URI. Expected format: 'data:image/jpeg;base64,...'"),
  substanceName: z.string().describe("The name of the substance being estimated."),
});
export type EstimateDoseInput = z.infer<typeof EstimateDoseInputSchema>;

const EstimateDoseOutputSchema = z.object({
  minMg: z.number().describe("The estimated minimum weight in milligrams."),
  maxMg: z.number().describe("The estimated maximum weight in milligrams."),
  confidence: z.enum(['Low', 'Medium', 'High']).describe("Confidence level of the estimation."),
  method: z.enum(['key_tip', 'short_line', 'long_line', 'bump', 'surface']).describe("The identified method of portioning."),
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
Analyze the provided image which contains a portion of {{substanceName}} (powder or crystal form) on a surface like a key, a credit card, or a flat surface.

Your goal is to estimate the visual volume and weight in milligrams (mg).

Instructions:
1. Identify the portion method (key tip, line, bump, etc.).
2. Use common reference objects in the image (the key itself, a card, or a human finger) to determine scale.
3. Provide a conservative milligram range (min-max).
4. If the dose looks unusually large for {{substanceName}}, set confidence to 'Low' and advise using a scale.
5. NEVER provide a single number; always a range.
6. The substance is already known: {{substanceName}}.

Photo: {{media url=photoDataUri}}

Linguistic Rule: Use standard Sentence case for the advice. Keep the advice under 20 words.`,
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

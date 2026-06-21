'use server';
/**
 * @fileOverview A Genkit flow for generating short educational videos about substance neurotransmitter interactions using Veo.
 *
 * - generateSubstanceVideo - A function that triggers the Veo video generation process.
 * - GenerateSubstanceVideoInput - The input type (substance name).
 * - GenerateSubstanceVideoOutput - The return type (video data URI).
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateSubstanceVideoInputSchema = z.object({
  substanceName: z.string().describe('The name of the substance to generate an educational animation for.'),
});
export type GenerateSubstanceVideoInput = z.infer<typeof GenerateSubstanceVideoInputSchema>;

const GenerateSubstanceVideoOutputSchema = z.object({
  videoDataUri: z.string().describe('The base64 data URI of the generated educational video.'),
});
export type GenerateSubstanceVideoOutput = z.infer<typeof GenerateSubstanceVideoOutputSchema>;

export async function generateSubstanceVideo(input: GenerateSubstanceVideoInput): Promise<GenerateSubstanceVideoOutput> {
  return generateSubstanceVideoFlow(input);
}

const generateSubstanceVideoFlow = ai.defineFlow(
  {
    name: 'generateSubstanceVideoFlow',
    inputSchema: GenerateSubstanceVideoInputSchema,
    outputSchema: GenerateSubstanceVideoOutputSchema,
  },
  async (input) => {
    const prompt = `A short, clean, 2D minimalist medical animation showing how ${input.substanceName} interacts with neurotransmitters in a stylized brain. Focus on glowing pulses of light moving through neural pathways. Scientific, educational, and safe. High contrast on black background. No faces, no realistic organs, just abstract molecular paths.`;

    let { operation } = await ai.generate({
      model: googleAI.model('veo-3.0-generate-preview'),
      prompt: prompt,
      config: {
        aspectRatio: '16:9',
      },
    });

    if (!operation) {
      throw new Error('Failed to initiate video generation.');
    }

    // Polling for operation completion
    while (!operation.done) {
      operation = await ai.checkOperation(operation);
      if (!operation.done) {
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    if (operation.error) {
      throw new Error('Video generation failed: ' + operation.error.message);
    }

    const videoPart = operation.output?.message?.content.find((p) => !!p.media);
    if (!videoPart || !videoPart.media?.url) {
      throw new Error('Failed to retrieve generated video.');
    }

    // Fetch and convert to base64
    const fetch = (await import('node-fetch')).default;
    const response = await fetch(`${videoPart.media.url}&key=${process.env.GEMINI_API_KEY}`);
    
    if (!response.ok) {
      throw new Error('Failed to download video from storage.');
    }

    const buffer = await response.arrayBuffer();
    const base64Video = Buffer.from(buffer).toString('base64');

    return {
      videoDataUri: `data:video/mp4;base64,${base64Video}`,
    };
  }
);

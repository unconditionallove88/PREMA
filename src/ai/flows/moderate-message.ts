
'use server';

/**
 * @fileOverview A Genkit flow for moderating chat messages in "The Spectators" space.
 * Features: Slang detection for substances (including cathinones and DMT), illegal activity monitoring.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ModerationInputSchema = z.object({
  text: z.string().describe('The message content to moderate'),
});

const ModerationOutputSchema = z.object({
  isSafe: z.boolean().describe('Whether the message is safe to post'),
  reason: z.string().optional().describe('Reason for rejection if unsafe'),
  filteredText: z.string().describe('The original text, or a sanitized version'),
});

export type ModerationInput = z.infer<typeof ModerationInputSchema>;
export type ModerationOutput = z.infer<typeof ModerationOutputSchema>;

export async function moderateMessage(input: ModerationInput): Promise<ModerationOutput> {
  return moderateMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'moderateMessagePrompt',
  input: { schema: ModerationInputSchema },
  output: { schema: ModerationOutputSchema },
  prompt: `You are the Pulse Guardian AI Moderator for "The Spectators" community chat.
The community is based on "Unconditional Love" and "Collective Care"

Your primary objective is to maintain a safe space. You must scan for and immediately flag:
1. ILLEGAL ACTIVITIES: Selling, buying, or promoting substances
2. MASKED DRUG NAMES (SLANG):
   - 3-MMC / 4-MMC: "meow meow", "meuw meuw", "3m", "4m", "drone", "m-cat", "bubbles"
   - Monkey Dust: "mdpv", "dust", "zombie dust"
   - DMT: "dimitri", "spirit molecule"
   - GHB / GBL: "G", "Gina", "Liquid X", "Blue Nitro"
   - MDMA / Ecstasy: "Molly", "M", "Mandy", "E", "XTC", "Beans"
   - Cocaine: "C", "Coke", "Snow", "White", "Blow", "Charlie"
   - Ketamine: "K", "Special K", "Kitty", "Horse", "Wonk"
3. HATE SPEECH: Any homophobia, racism, sexism, or discrimination
4. AGGRESSION: Bullying, unkindness, or divisive political rhetoric

Message to evaluate: "{{{text}}}"

If the message is unsafe, set isSafe to false and provide a reason grounded in care
If it is safe, set isSafe to true
Use standard Sentence case for the reason`,
});

const moderateMessageFlow = ai.defineFlow(
  {
    name: 'moderateMessageFlow',
    inputSchema: ModerationInputSchema,
    outputSchema: ModerationOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);

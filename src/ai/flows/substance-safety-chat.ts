
'use server';
/**
 * @fileOverview A Genkit flow for answering substance safety questions.
 * Languages: en, de.
 * Updated to include guidelines for 3-MMC, 4-MMC, Monkey Dust, and DMT.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {retryWithBackoff} from '@/lib/ai-retry';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  content: z.string(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

const AiSafetyChatInputSchema = z.object({
  substance: z.string().describe('Active session intake context.'),
  question: z.string().describe('The user\'s specific safety question.'),
  history: z.array(ChatMessageSchema).optional().describe('Previous chat history.'),
  userProfile: z.object({
    medications: z.array(z.string()),
    healthConditions: z.array(z.string()),
  }),
  lang: z.enum(['en', 'de']).optional().default('en'),
});
export type AiSafetyChatInput = z.infer<typeof AiSafetyChatInputSchema>;

const AiSafetyChatOutputSchema = z.object({
  answer: z.string().describe('The safety advice provided by the AI.'),
});
export type AiSafetyChatOutput = z.infer<typeof AiSafetyChatOutputSchema>;

export async function aiSafetyChat(input: AiSafetyChatInput): Promise<AiSafetyChatOutput> {
  return retryWithBackoff(() => aiSafetyChatFlow(input));
}

const prompt = ai.definePrompt({
  name: 'aiSafetyChatPrompt',
  input: {schema: AiSafetyChatInputSchema},
  output: {schema: AiSafetyChatOutputSchema},
  prompt: `You are the StayOnBeat Safety Advisor, the voice of the Pulse Guardian.

Context from Pulse Lab:
- Current Session Intake: {{{substance}}}
- User Meds: {{#each userProfile.medications}}{{{this}}}, {{/each}}
- Conditions: {{#each userProfile.healthConditions}}{{{this}}}, {{/each}}

User Question: {{{question}}}

LANGUAGE REQUIREMENT:
Respond exclusively in the language code: {{{lang}}}.

CRITICAL GUIDELINES:
1. If mixing (Alcohol + GHB/Cathinones, Stimulant + Stimulant, SSRIs + MDMA/3-MMC/4-MMC, DMT + MAOIs), provide an immediate **CRITICAL WARNING** in all-caps.
2. Reference their specific Pulse Lab intake.
3. Mention the Pulse Guardian protocol monitoring heart rate and body temperature.
4. For Monkey Dust (MDPV), warn about the high risk of overheating and paranoia.
5. For 3-MMC/4-MMC, emphasize hydration and redosing risks.
6. Limit responses to 4 concise bullet points. 
7. Keep total response under 100 words.`,
});

const aiSafetyChatFlow = ai.defineFlow(
  {
    name: 'aiSafetyChatFlow',
    inputSchema: AiSafetyChatInputSchema,
    outputSchema: AiSafetyChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

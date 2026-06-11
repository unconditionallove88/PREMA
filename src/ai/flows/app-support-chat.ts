'use server';
/**
 * @fileOverview A Genkit flow for handling app feedback, support queries, and Q&A.
 *
 * - appSupportChat - A function that handles user feedback and support questions.
 * - AppSupportChatInput - The input type for the appSupportChat function.
 * - AppSupportChatOutput - The return type for the appSupportChat function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChatMessageSchema = z.object({
  role: z.enum(['user', 'ai']),
  content: z.string(),
});

const AppSupportChatInputSchema = z.object({
  question: z.string().describe('The user\'s feedback or support question.'),
  history: z.array(ChatMessageSchema).optional().describe('Previous chat history for context.'),
});
export type AppSupportChatInput = z.infer<typeof AppSupportChatInputSchema>;

const AppSupportChatOutputSchema = z.object({
  answer: z.string().describe('The support response or feedback acknowledgment.'),
});
export type AppSupportChatOutput = z.infer<typeof AppSupportChatOutputSchema>;

export async function appSupportChat(input: AppSupportChatInput): Promise<AppSupportChatOutput> {
  return appSupportChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'appSupportChatPrompt',
  input: {schema: AppSupportChatInputSchema},
  output: {schema: AppSupportChatOutputSchema},
  prompt: `You are the PREMA Support & Community Assistant. 
Your primary goal is to help users understand app features, collect feedback for improvements, and provide technical support.

App Context:
- PREMA is a harm reduction tool for healthier nightlife.
- Key features: Substance Lab (dose logging/risk analysis), The Pulse (GPS/safety hubs/connections), Aftercare (recovery plans), The Circle of Love (Community & Support).
- Core value: Privacy and safety.

Current Question/Feedback: {{{question}}}

{{#if history}}
Previous Conversation:
{{#each history}}
- {{role}}: {{{content}}}
{{/each}}
{{/if}}

Guidelines:
1. Be helpful, professional, and concise.
2. If the user provides feedback or a feature request, acknowledge it and explain that it will be used to improve the app.
3. If they ask about safety, prioritize direct answers.
4. Use standard Sentence case. 
5. Use **BOLD ALL-CAPS** for **IMPORTANT ACTIONS** or **APP SECTIONS**.
6. Keep the response under 100 words.`,
});

const appSupportChatFlow = ai.defineFlow(
  {
    name: 'appSupportChatFlow',
    inputSchema: AppSupportChatInputSchema,
    outputSchema: AppSupportChatOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

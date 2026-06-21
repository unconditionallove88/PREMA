export type ChatMessage = { role: 'user' | 'ai'; content: string };
export type AppSupportChatInput = { question: string; history?: ChatMessage[] };
export type AppSupportChatOutput = { answer: string };

export async function appSupportChat(_input: AppSupportChatInput): Promise<AppSupportChatOutput> {
  return { answer: 'AI features are not available in this build.' };
}

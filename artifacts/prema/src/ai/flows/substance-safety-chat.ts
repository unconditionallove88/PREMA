export type ChatMessage = { role: 'user' | 'ai'; content: string };
export type AiSafetyChatInput = {
  substance: string;
  question: string;
  history?: ChatMessage[];
  userProfile: { medications: string[]; healthConditions: string[] };
  lang?: 'en' | 'de';
};
export type AiSafetyChatOutput = { answer: string };

export async function aiSafetyChat(_input: AiSafetyChatInput): Promise<AiSafetyChatOutput> {
  return { answer: 'AI features are not available in this build.' };
}

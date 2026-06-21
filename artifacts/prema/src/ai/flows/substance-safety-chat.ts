export type ChatMessage = { role: 'user' | 'ai'; content: string };
export type AiSafetyChatInput = {
  substance: string;
  question: string;
  history?: ChatMessage[];
  userProfile: { medications: string[]; healthConditions: string[] };
  lang?: 'en' | 'de';
};
export type AiSafetyChatOutput = { answer: string };

export async function aiSafetyChat(input: AiSafetyChatInput): Promise<AiSafetyChatOutput> {
  const res = await fetch('/api/ai/safety-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { answer: 'Safety chat is temporarily unavailable.' };
  return res.json();
}

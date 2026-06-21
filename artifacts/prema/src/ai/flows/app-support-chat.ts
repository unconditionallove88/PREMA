export type ChatMessage = { role: 'user' | 'ai'; content: string };
export type AppSupportChatInput = { question: string; history?: ChatMessage[] };
export type AppSupportChatOutput = { answer: string };

export async function appSupportChat(input: AppSupportChatInput): Promise<AppSupportChatOutput> {
  const res = await fetch('/api/ai/app-support-chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });
  if (!res.ok) return { answer: 'Support chat is temporarily unavailable.' };
  return res.json();
}

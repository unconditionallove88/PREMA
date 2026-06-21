export type ModerationInput = { text: string };
export type ModerationOutput = { isSafe: boolean; reason?: string; filteredText: string };

export async function moderateMessage(input: ModerationInput): Promise<ModerationOutput> {
  try {
    const res = await fetch('/api/ai/moderate-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) return { isSafe: true, filteredText: input.text };
    return res.json();
  } catch {
    return { isSafe: true, filteredText: input.text };
  }
}

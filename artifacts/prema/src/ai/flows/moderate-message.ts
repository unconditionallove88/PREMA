export type ModerationInput = { text: string };
export type ModerationOutput = { isSafe: boolean; reason?: string; filteredText: string };

export async function moderateMessage(input: ModerationInput): Promise<ModerationOutput> {
  return { isSafe: true, filteredText: input.text };
}

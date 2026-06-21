export type TtsInput = { text: string; lang?: 'en' | 'de' | 'pt' | 'ru' };
export type TtsOutput = { audioDataUri: string };

export async function textToSpeech(_input: TtsInput): Promise<TtsOutput> {
  return { audioDataUri: '' };
}

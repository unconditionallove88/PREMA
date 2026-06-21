export type TtsInput = { text: string; lang?: 'en' | 'de' | 'pt' | 'ru' };
export type TtsOutput = { audioDataUri: string };

export async function textToSpeech(input: TtsInput): Promise<TtsOutput> {
  try {
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!res.ok) return { audioDataUri: '' };
    return res.json();
  } catch {
    return { audioDataUri: '' };
  }
}


'use server';
/**
 * @fileOverview A Genkit flow for text-to-speech resonance.
 *
 * - textToSpeech - A function that converts text to a playable audio data URI.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';
import wav from 'wav';

const TtsInputSchema = z.object({
  text: z.string().describe('The text to convert to speech.'),
  lang: z.enum(['en', 'de', 'pt', 'ru']).optional().default('en'),
});

const TtsOutputSchema = z.object({
  audioDataUri: z.string().describe('The base64 data URI of the generated audio.'),
});

export async function textToSpeech(input: z.infer<typeof TtsInputSchema>): Promise<z.infer<typeof TtsOutputSchema>> {
  return textToSpeechFlow(input);
}

const textToSpeechFlow = ai.defineFlow(
  {
    name: 'textToSpeechFlow',
    inputSchema: TtsInputSchema,
    outputSchema: TtsOutputSchema,
  },
  async (input) => {
    const voiceMap = {
      en: 'Algenib',
      de: 'Achernar',
      pt: 'Castor',
      ru: 'Rigel'
    };

    const { media } = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceMap[input.lang] || 'Algenib' },
          },
        },
      },
      prompt: input.text,
    });

    if (!media) {
      throw new Error('No audio resonance returned');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );

    return {
      audioDataUri: 'data:audio/wav;base64,' + (await toWav(audioBuffer)),
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    let bufs = [] as any[];
    writer.on('error', reject);
    writer.on('data', function (d: Buffer) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

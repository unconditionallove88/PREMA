
'use server';
/**
 * @fileOverview A Genkit flow for assessing substance interaction risks.
 * Languages: en, de.
 * Updated to include risks for 3-MMC, 4-MMC, Monkey Dust, and DMT.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {retryWithBackoff} from '@/lib/ai-retry';

const SubstanceInteractionRiskAssessmentInputSchema = z.object({
  healthConditions: z.array(z.string()).describe('A list of the user\'s current health conditions.'),
  medications: z.array(z.string()).describe('A list of medications the user is currently taking.'),
  substancesToTake: z.array(z.string()).describe('A list of substances the user plans to take.'),
  age: z.number().int().min(18).describe('The user\'s age.'),
  weightKg: z.number().positive().describe('The user\'s weight in kilograms.'),
  lang: z.enum(['en', 'de']).optional().default('en'),
});
export type SubstanceInteractionRiskAssessmentInput = z.infer<typeof SubstanceInteractionRiskAssessmentInputSchema>;

const SubstanceInteractionRiskAssessmentOutputSchema = z.object({
  overallRiskLevel: z.enum(['Low', 'Medium', 'High', 'Critical']).describe('Overall risk level.'),
  summary: z.string().describe('A concise summary of the risk assessment.'),
  detailedExplanation: z.string().describe('A detailed explanation of potential interactions.'),
  harmReductionRecommendations: z.array(z.string()).describe('Actionable harm reduction strategies.'),
  drugInteractions: z.array(z.object({
    drug1: z.string(),
    drug2: z.string(),
    severity: z.enum(['Minor', 'Moderate', 'Major']),
    effect: z.string(),
  })).describe('Specific drug-drug or drug-medication interactions found.'),
});
export type SubstanceInteractionRiskAssessmentOutput = z.infer<typeof SubstanceInteractionRiskAssessmentOutputSchema>;

export async function substanceInteractionRiskAssessment(input: SubstanceInteractionRiskAssessmentInput): Promise<SubstanceInteractionRiskAssessmentOutput> {
  return retryWithBackoff(() => substanceInteractionRiskAssessmentFlow(input));
}

const prompt = ai.definePrompt({
  name: 'substanceInteractionRiskAssessmentPrompt',
  input: {schema: SubstanceInteractionRiskAssessmentInputSchema},
  output: {schema: SubstanceInteractionRiskAssessmentOutputSchema},
  prompt: `You are an expert in pharmacology, toxicology, and harm reduction.

User's Health Profile:
- Age: {{{age}}}
- Weight: {{{weightKg}}} kg
- Conditions: {{#each healthConditions}}{{{this}}}, {{/each}}
- Medications: {{#each medications}}{{{this}}}, {{/each}}

Substances: {{#each substancesToTake}}{{{this}}}, {{/each}}

LANGUAGE REQUIREMENT:
Respond exclusively in the language code: {{{lang}}}. 

Specific Risks to Check (CRITICAL):
- SSRIs/SNRIs + 3-MMC/4-MMC/MDMA: Critical Serotonin Syndrome risk.
- Monkey Dust (MDPV) + Alcohol/Stimulants: Extreme cardiovascular risk and hyperthermia.
- DMT + MAOIs: Dangerous potentiation and hypertensive crisis risk.
- Alcohol + GHB/Benzos: Extreme respiratory failure risk.
- Stimulant + Stimulant: Cardiovascular emergency risk.

Response Format:
- Use standard Sentence case for descriptions.
- Use **BOLD ALL-CAPS** strictly for **CRITICAL WARNINGS**.
- Summary must be under 30 words.`,
});

const substanceInteractionRiskAssessmentFlow = ai.defineFlow(
  {
    name: 'substanceInteractionRiskAssessmentFlow',
    inputSchema: SubstanceInteractionRiskAssessmentInputSchema,
    outputSchema: SubstanceInteractionRiskAssessmentOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

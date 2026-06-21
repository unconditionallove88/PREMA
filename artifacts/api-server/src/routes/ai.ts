import { Router, type IRouter, type Request, type Response } from "express";

const router: IRouter = Router();

let genaiClient: any = null;

async function getClient() {
  if (genaiClient) return genaiClient;
  const apiKey = process.env["GOOGLE_GENAI_API_KEY"] || process.env["GOOGLE_API_KEY"];
  if (!apiKey) return null;
  try {
    const { GoogleGenAI } = await import("@google/genai");
    genaiClient = new GoogleGenAI({ apiKey });
    return genaiClient;
  } catch {
    return null;
  }
}

async function generate(client: any, prompt: string, systemInstruction?: string): Promise<string> {
  const config: any = {};
  if (systemInstruction) config.systemInstruction = systemInstruction;
  const result = await client.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
    config,
  });
  return result.text ?? "";
}

function noAI(res: Response) {
  return res.status(503).json({ error: "AI service not configured. Set GOOGLE_GENAI_API_KEY." });
}

router.post("/ai/safety-chat", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return noAI(res);
  try {
    const { substance, question, history = [], userProfile, lang = "en" } = req.body;
    const system = lang === "de"
      ? `Du bist ein Schadensminimierungs-Berater bei einem Musikfestival. Substanz: ${substance}. Profil: ${JSON.stringify(userProfile)}. Kurze, sachliche Sicherheitshinweise auf Deutsch.`
      : `You are a harm reduction advisor at a music festival. Substance: ${substance}. Profile: ${JSON.stringify(userProfile)}. Give concise, factual safety advice.`;
    const historyText = history.map((m: any) => `${m.role === "ai" ? "Assistant" : "User"}: ${m.content}`).join("\n");
    const prompt = historyText ? `${historyText}\nUser: ${question}` : question;
    const answer = await generate(client, prompt, system);
    res.json({ answer });
  } catch (err: any) {
    req.log.error({ err }, "AI safety-chat error");
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ai/app-support-chat", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return noAI(res);
  try {
    const { question, history = [] } = req.body;
    const system = "You are a compassionate support assistant for the Prema harm reduction app. Help users with app features and provide emotional support.";
    const historyText = history.map((m: any) => `${m.role === "ai" ? "Assistant" : "User"}: ${m.content}`).join("\n");
    const prompt = historyText ? `${historyText}\nUser: ${question}` : question;
    const answer = await generate(client, prompt, system);
    res.json({ answer });
  } catch (err: any) {
    req.log.error({ err }, "AI app-support-chat error");
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ai/moderate-message", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return res.json({ isSafe: true, filteredText: req.body.text });
  try {
    const { text } = req.body;
    const raw = await generate(client, `Is this message safe for a harm reduction community? Respond with JSON only: {"isSafe": boolean, "reason": string|null, "filteredText": string}. Message: "${text}"`);
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    res.json({ isSafe: parsed.isSafe ?? true, reason: parsed.reason, filteredText: parsed.filteredText ?? text });
  } catch {
    res.json({ isSafe: true, filteredText: req.body.text });
  }
});

router.post("/ai/estimate-dose", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return noAI(res);
  try {
    const { photoDataUri, substanceName, method } = req.body;
    const base64 = photoDataUri.split(",")[1];
    const mimeType = photoDataUri.split(";")[0].split(":")[1];
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { inlineData: { mimeType, data: base64 } },
        { text: `Estimate the dose of ${substanceName} in this image${method ? ` (${method})` : ""}. Respond with JSON only: {"estimated_dose": {"min_mg": number, "max_mg": number, "unit": "mg"}, "confidence": "LOW"|"MEDIUM"|"HIGH", "reasoning": string, "safety_note": string}` },
      ],
    });
    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    res.json(parsed);
  } catch (err: any) {
    req.log.error({ err }, "AI estimate-dose error");
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ai/identify-pill", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return noAI(res);
  try {
    const { photoDataUri } = req.body;
    const base64 = photoDataUri.split(",")[1];
    const mimeType = photoDataUri.split(";")[0].split(":")[1];
    const result = await client.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        { inlineData: { mimeType, data: base64 } },
        { text: `Analyze this pill for harm reduction. JSON only: {"visual_description": string, "possible_match": string, "confidence": "LOW"|"MEDIUM"|"HIGH", "safety_information": string, "warning": string, "recommended_action": string}. Always warn that visual ID is unreliable.` },
      ],
    });
    const raw = result.text ?? "{}";
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    res.json(parsed);
  } catch (err: any) {
    req.log.error({ err }, "AI identify-pill error");
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ai/substance-interaction", async (req: Request, res: Response) => {
  const client = await getClient();
  if (!client) return noAI(res);
  try {
    const { healthConditions, medications, substancesToTake, age, weightKg, lang = "en" } = req.body;
    const system = lang === "de"
      ? "Du bist ein Schadensminimierungsexperte. Analysiere Wechselwirkungen und antworte mit JSON."
      : "You are a harm reduction expert. Analyze substance interactions and respond with JSON only.";
    const prompt = `Age: ${age}, Weight: ${weightKg}kg. Substances: ${substancesToTake.join(", ")}. Medications: ${medications.join(", ")}. Conditions: ${healthConditions.join(", ")}. JSON: {"overallRiskLevel": "Low"|"Medium"|"High"|"Critical", "summary": string, "interactions": [{"substances": string[], "risk": string, "description": string}], "recommendations": string[]}`;
    const raw = await generate(client, prompt, system);
    const parsed = JSON.parse(raw.replace(/```json\n?|\n?```/g, "").trim());
    res.json(parsed);
  } catch (err: any) {
    req.log.error({ err }, "AI substance-interaction error");
    res.status(500).json({ error: "AI request failed" });
  }
});

router.post("/ai/tts", (_req: Request, res: Response) => {
  res.status(501).json({ error: "Text-to-speech is not yet supported in this build." });
});

export default router;

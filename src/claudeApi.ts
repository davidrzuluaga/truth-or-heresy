import AsyncStorage from "@react-native-async-storage/async-storage";
import { Question, HeresyName } from "./types";

export const API_KEY_STORAGE_KEY = "@truth_or_heresy_api_key";

// ─── Key helpers ──────────────────────────────────────────────────────────────

export async function getApiKey(): Promise<string | null> {
  try {
    // Prefer env variable if set (useful during dev)
    const envKey = process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY;
    if (envKey && envKey.startsWith("sk-")) return envKey;
    return await AsyncStorage.getItem(API_KEY_STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function saveApiKey(key: string): Promise<void> {
  await AsyncStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(
  question: Question,
  isCorrect: boolean,
  userChoice: "truth" | "heresy",
  selectedHeresy: HeresyName | null
): string {
  const correctLabel = question.isTruth
    ? "orthodox Christian teaching (Truth)"
    : `the heresy of ${question.correctHeresy}`;

  const userLabel =
    userChoice === "truth"
      ? "Truth (orthodox doctrine)"
      : `Heresy — specifically ${selectedHeresy}`;

  const resultLine = isCorrect
    ? `✅ The player got it RIGHT! They correctly identified it as: ${userLabel}.`
    : `❌ The player got it WRONG. They answered "${userLabel}" but the correct answer is: ${correctLabel}.`;

  return `You are a fun, engaging theology tutor for a mobile quiz game called "Truth or Heresy?". Your tone is clever, slightly dramatic, and never dry.

THE STATEMENT SHOWN TO THE PLAYER:
"${question.statement}"

RESULT:
${resultLine}

Write a SHORT explanation (MAX 160 words, plain text, NO markdown) that:
1. ${isCorrect ? "Opens with a punchy celebration of their correct answer." : "Opens with a gentle, witty roast of their wrong answer before revealing the truth."}
2. Explains why this statement is ${question.isTruth ? "solid orthodox teaching" : `the specific heresy of ${question.correctHeresy}`}.
3. Drops one memorable historical note — a council, a heretic's name, a fun fact from church history.
4. Ends with a single light-hearted tip or fun fact to help them remember for next time.

Keep it punchy, vivid, and under 160 words. Write for a casual Christian who finds theology interesting but hates stuffy textbooks. Plain text only, no bullet points.`;
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function fetchExplanation(
  question: Question,
  isCorrect: boolean,
  userChoice: "truth" | "heresy",
  selectedHeresy: HeresyName | null,
  apiKey: string,
  signal?: AbortSignal
): Promise<string> {
  const prompt = buildPrompt(question, isCorrect, userChoice, selectedHeresy);

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!response.ok) {
    let message = `HTTP ${response.status}`;
    try {
      const err = await response.json();
      message = err?.error?.message ?? message;
    } catch {
      /* ignore */
    }
    throw new Error(message);
  }

  const data = await response.json();
  const text: string = data?.content?.[0]?.text ?? "";
  if (!text) throw new Error("Empty response from Claude API.");
  return text.trim();
}

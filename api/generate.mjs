const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama3-8b-8192";

function parseJsonArrayEnv(name) {
  try {
    const raw = process.env[name] || "[]";
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return [...new Set(arr.map(x => String(x).trim()).filter(Boolean))];
  } catch {
    return [];
  }
}

function getGeminiKeys() {
  return parseJsonArrayEnv("GEMINI_API_KEYS_JSON");
}

function getGroqKeys() {
  const single = String(process.env.GROQ_API_KEY || "").trim();
  return single ? [single] : [];
}

function hashString(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

function rotateFromIndex(arr, start) {
  if (!arr.length) return [];
  const idx = start % arr.length;
  return [...arr.slice(idx), ...arr.slice(0, idx)];
}

function extractJson(text) {
  const cleaned = String(text || "")
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  const first = cleaned.indexOf("{");
  const last = cleaned.lastIndexOf("}");

  if (first !== -1 && last !== -1 && last > first) {
    return cleaned.slice(first, last + 1);
  }

  return cleaned;
}

function safeString(value, fallback = "") {
  const s = String(value || "").trim();
  return s || fallback;
}

function estimateAnalytics(topic) {
  const len = Math.max(8, String(topic || "").length);
  const reach = 7000 + len * 190 + Math.floor(Math.random() * 12000);
  const likes = Math.max(900, Math.floor(reach * (0.07 + Math.random() * 0.08)));

  return {
    reach: Math.round(reach),
    likes: Math.round(likes)
  };
}

function buildPrompt({ topic, category }) {
  return `
You are an expert viral Instagram caption strategist for Indian creators.

User topic: "${topic}"
Category: "${category}"

Return ONLY valid JSON in this exact format:
{
  "caption": "string",
  "tip": "string"
}

Rules:
- Write a viral Hinglish Instagram caption
- Keep it natural, catchy, human-like
- 2 to 4 short lines maximum
- Add 3 to 6 relevant hashtags at the end of the caption
- Tip should be exactly one practical growth tip for better engagement
- No markdown
- No code block
- No extra explanation
- Return JSON only
`;
}

function buildFallback(topic) {
  return {
    caption:
`Aaj ki vibe: ${topic} ✨
Jo feel hua, wahi share kar diya.
Simple moments hi kabhi kabhi sabse zyada hit karte hain.
#viral #hinglish #instagram #creator`,
    tip: "Best result ke liye evening 7-9 PM me post karo aur first 15 minutes me comments ka reply zaroor do.",
    analytics: estimateAnalytics(topic),
    type: "Fallback AI"
  };
}

function buildProviderPool(seed) {
  const gemini = rotateFromIndex(getGeminiKeys(), seed).map((key, i) => ({
    provider: "gemini",
    key,
    label: `Gemini Pool ${i + 1}`
  }));

  const groq = rotateFromIndex(getGroqKeys(), seed).map((key, i) => ({
    provider: "groq",
    key,
    label: `Groq Backup ${i + 1}`
  }));

  if (!groq.length) return gemini;
  if (gemini.length <= 3) return [...gemini, ...groq];

  return [
    ...gemini.slice(0, 3),
    ...groq,
    ...gemini.slice(3)
  ];
}

async function callGemini(apiKey, input) {
  const prompt = buildPrompt(input);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        signal: controller.signal,
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.95,
            topP: 0.95,
            maxOutputTokens: 500,
            responseMimeType: "application/json"
          }
        })
      }
    );

    const rawText = await response.text();

    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(rawText);
    } catch {
      parsedResponse = {};
    }

    if (!response.ok) {
      const err = new Error(
        parsedResponse?.error?.message || rawText || `Gemini error ${response.status}`
      );
      err.status = response.status;
      err.retryable = response.status === 429 || response.status >= 500;
      throw err;
    }

    const modelText =
      parsedResponse?.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") ||
      rawText;

    const jsonText = extractJson(modelText);

    let finalData = {};
    try {
      finalData = JSON.parse(jsonText);
    } catch {
      const err = new Error("Invalid JSON from Gemini");
      err.retryable = true;
      throw err;
    }

    const caption = safeString(finalData.caption);
    const tip = safeString(finalData.tip, "First 15 minutes me engagement strong rakho.");

    if (!caption) {
      const err = new Error("Empty caption from Gemini");
      err.retryable = true;
      throw err;
    }

    return { caption, tip };
  } finally {
    clearTimeout(timeout);
  }
}

async function callGroq(apiKey, input) {
  const prompt = buildPrompt(input);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        temperature: 0.9,
        max_tokens: 400,
        messages: [
          {
            role: "system",
            content: "You are a viral Instagram caption strategist. Return only valid JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      })
    });

    const rawText = await response.text();

    let parsedResponse = {};
    try {
      parsedResponse = JSON.parse(rawText);
    } catch {
      parsedResponse = {};
    }

    if (!response.ok) {
      const err = new Error(
        parsedResponse?.error?.message || rawText || `Groq error ${response.status}`
      );
      err.status = response.status;
      err.retryable = response.status === 429 || response.status >= 500;
      throw err;
    }

    const content =
      parsedResponse?.choices?.[0]?.message?.content || rawText;

    const jsonText = extractJson(content);

    let finalData = {};
    try {
      finalData = JSON.parse(jsonText);
    } catch {
      const err = new Error("Invalid JSON from Groq");
      err.retryable = true;
      throw err;
    }

    const caption = safeString(finalData.caption);
    const tip = safeString(finalData.tip, "Post karne ke baad first 15 minutes active raho.");

    if (!caption) {
      const err = new Error("Empty caption from Groq");
      err.retryable = true;
      throw err;
    }

    return { caption, tip };
  } finally {
    clearTimeout(timeout);
  }
}

async function runProvider(node, input) {
  if (node.provider === "gemini") {
    return callGemini(node.key, input);
  }

  if (node.provider === "groq") {
    return callGroq(node.key, input);
  }

  throw new Error("Unknown provider");
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body =
      typeof req.body === "string"
        ? JSON.parse(req.body || "{}")
        : (req.body || {});

    const topic = String(body.topic || "").trim().slice(0, 240);
    const category = String(body.category || "Viral Hinglish").trim().slice(0, 80);

    if (!topic) {
      return res.status(400).json({ error: "topic is required" });
    }

    const ip = String(req.headers["x-forwarded-for"] || "0.0.0.0")
      .split(",")[0]
      .trim();

    const minuteBucket = new Date().toISOString().slice(0, 16);
    const seed = hashString(`${ip}:${minuteBucket}:${topic}:${category}`);

    const providerPool = buildProviderPool(seed);

    if (!providerPool.length) {
      return res.status(200).json(buildFallback(topic));
    }

    let lastError = null;

    for (let i = 0; i < providerPool.length; i++) {
      const node = providerPool[i];

      try {
        const ai = await runProvider(node, { topic, category });

        return res.status(200).json({
          caption: ai.caption,
          tip: ai.tip,
          analytics: estimateAnalytics(topic),
          type: node.label
        });
      } catch (err) {
        lastError = err;
        console.error(`[${node.label}] failed:`, err.message);
        continue;
      }
    }

    console.error("All providers failed:", lastError?.message || "Unknown error");
    return res.status(200).json(buildFallback(topic));

  } catch (err) {
    console.error("API fatal error:", err);
    return res.status(200).json(buildFallback("Aaj ka mood"));
  }
}

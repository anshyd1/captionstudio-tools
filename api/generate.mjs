const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
  process.env.GEMINI_KEY_4,
  process.env.GEMINI_KEY_5,
  process.env.GEMINI_KEY_6,
  process.env.GEMINI_KEY_7,
  process.env.GEMINI_KEY_8,
  process.env.GEMINI_KEY_9,
  process.env.GEMINI_KEY_10,
].filter(Boolean); // Empty strings/null ko hata dega

let currentKeyIndex = 0;

function getNextGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

async function callGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.9,
        maxOutputTokens: 2048,     // Increased for better responses
        topP: 0.95,
      },
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    const errorMessage = data?.error?.message || 'Unknown error';
    throw new Error(`Gemini Error (${res.status}): ${errorMessage}`);
  }

  if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text.trim();
  }

  throw new Error('Invalid response from Gemini');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { prompt, tool } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 5) {
      return res.status(400).json({ error: 'Valid prompt is required (minimum 5 characters)' });
    }

    if (GEMINI_KEYS.length === 0) {
      return res.status(500).json({ error: 'No Gemini API keys configured' });
    }

    let lastError = null;

    // Try all 10 keys one by one
    for (let i = 0; i < GEMINI_KEYS.length; i++) {
      const key = getNextGeminiKey();
      try {
        const result = await callGemini(prompt, key);

        return res.status(200).json({
          success: true,
          result,
          tool: tool || 'unknown',
          provider: 'gemini',
          keyUsed: i + 1
        });

      } catch (err) {
        lastError = err;
        console.error(`Key ${i + 1} failed:`, err.message);
        // Continue to next key
      }
    }

    // Sab keys fail ho gaye
    console.error('All Gemini keys failed. Last error:', lastError?.message);
    return res.status(500).json({
      error: 'All API keys failed. Please try again in some time.'
    });

  } catch (error) {
    console.error('Handler Error:', error);
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
}

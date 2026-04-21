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
].filter(Boolean);

const GROK_KEY = process.env.GROK_KEY;
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
        maxOutputTokens: 1024
      }
    })
  });
  const data = await res.json();
  if (data.candidates && data.candidates[0]) {
    return data.candidates[0].content.parts[0].text;
  }
  throw new Error('Gemini failed');
}

async function callGrok(prompt) {
  if (!GROK_KEY) throw new Error('No Grok key');
  const res = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROK_KEY}`
    },
    body: JSON.stringify({
      model: 'grok-3-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.9
    })
  });
  const data = await res.json();
  if (data.choices && data.choices[0]) {
    return data.choices[0].message.content;
  }
  throw new Error('Grok failed');
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { prompt, tool } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt required' });

    let result = null;
    let usedProvider = '';

    for (let i = 0; i < GEMINI_KEYS.length; i++) {
      try {
        const key = getNextGeminiKey();
        result = await callGemini(prompt, key);
        usedProvider = 'gemini';
        break;
      } catch (e) { continue; }
    }

    if (!result && GROK_KEY) {
      try {
        result = await callGrok(prompt);
        usedProvider = 'grok';
      } catch (e) {}
    }

    if (result) {
      return res.status(200).json({ success: true, result, tool: tool || 'unknown', provider: usedProvider });
    } else {
      return res.status(500).json({ error: 'All API keys failed. Try again.' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Server error', message: error.message });
  }
      }

// 10 Gemini Keys + Better Error Handling
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
].filter(Boolean);

let currentKeyIndex = 0;

function getNextKey() {
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
        temperature: 0.85,
        maxOutputTokens: 2048,
      }
    })
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No response from Gemini');
  return text.trim();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim().length < 5) {
      return res.status(400).json({ error: 'Prompt chhota hai bhai' });
    }

    let result = null;

    // Try all 10 keys
    for (let i = 0; i < GEMINI_KEYS.length; i++) {
      try {
        const key = getNextKey();
        result = await callGemini(prompt, key);
        if (result) {
          return res.status(200).json({ 
            success: true, 
            result,
            provider: 'gemini'
          });
        }
      } catch (e) {
        console.error(`Key ${i+1} failed:`, e.message);
      }
    }

    // Sab fail ho gaye
    return res.status(500).json({ 
      error: 'Server Busy. 1 min ruko bhai.' 
    });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      error: 'Invalid server response. Server Busy. 1 min ruko bhai.' 
    });
  }
}

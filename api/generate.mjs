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

const GROQ_KEY = process.env.GROQ_KEY;

let currentKeyIndex = 0;

function getNextGeminiKey() {
  if (GEMINI_KEYS.length === 0) return null;
  const key = GEMINI_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % GEMINI_KEYS.length;
  return key;
}

async function callGemini(prompt, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.85,
        maxOutputTokens: 2048,
        topP: 0.95,
      }
    })
  });

  if (!response.ok) {
    throw new Error(`Gemini HTTP ${response.status}`);
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || null;
}

async function callGroq(prompt) {
  if (!GROQ_KEY) throw new Error('No Groq key');
  
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_KEY}`
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',   // ya 'mixtral-8x7b-32768' jo fast ho
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 2048
    })
  });

  if (!response.ok) throw new Error(`Groq HTTP ${response.status}`);
  
  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() || null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { prompt } = req.body;
    if (!prompt || prompt.trim().length < 10) {
      return res.status(400).json({ error: 'Prompt too short' });
    }

    let result = null;
    let provider = '';

    // Try all Gemini keys first
    for (let i = 0; i < GEMINI_KEYS.length; i++) {
      try {
        const key = getNextGeminiKey();
        result = await callGemini(prompt, key);
        if (result) {
          provider = 'gemini';
          break;
        }
      } catch (e) {
        console.error(`Gemini key failed: ${e.message}`);
      }
    }

    // Agar Gemini sab fail ho gaye to Groq try karo
    if (!result && GROQ_KEY) {
      try {
        result = await callGroq(prompt);
        provider = 'groq';
      } catch (e) {
        console.error(`Groq also failed: ${e.message}`);
      }
    }

    if (result) {
      return res.status(200).json({ 
        success: true, 
        result, 
        provider 
      });
    } else {
      return res.status(500).json({ 
        error: 'All providers failed. Server busy, try after 1 min.' 
      });
    }

  } catch (error) {
    console.error('API Error:', error.message);
    return res.status(500).json({ 
      error: 'Invalid server response. Server Busy. 1 min ruko bhai.' 
    });
  }
          }

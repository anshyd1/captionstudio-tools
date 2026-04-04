const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Keys ko environment variables se uthayenge
const KEYS = {
    groq: process.env.GROQ_KEY,
    gemini: process.env.GEMINI_KEY
};

app.post('/api/generate', async (req, res) => {
    const { topic, category } = req.body;
    const prompt = `Write 1 viral Instagram caption for "${topic}" in ${category} style. Mix English and Hinglish. Add 3 emojis and 5 hashtags.`;

    try {
        // Try Groq First
        const groqRes = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }]
        }, {
            headers: { "Authorization": `Bearer ${KEYS.groq}` }
        });
        res.json({ success: true, data: groqRes.data.choices[0].message.content });
    } catch (err) {
        // Fallback to Gemini
        try {
            const geminiRes = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${KEYS.gemini}`, {
                contents: [{ parts: [{ text: prompt }] }]
            });
            res.json({ success: true, data: geminiRes.data.candidates[0].content.parts[0].text });
        } catch (err2) {
            res.status(500).json({ success: false, message: "APIs Exhausted" });
        }
    }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

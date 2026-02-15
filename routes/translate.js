const express = require('express');
const router = express.Router();

// Translation endpoint using Gemini/Groq
router.post('/translate', async (req, res) => {
    try {
        const { text, targetLang } = req.body;

        if (!text || !targetLang) {
            return res.status(400).json({ error: 'Text and target language required' });
        }

        // Language names for better prompts
        const langNames = {
            'hi': 'Hindi',
            'ta': 'Tamil',
            'te': 'Telugu',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'kn': 'Kannada',
            'mr': 'Marathi',
            'en': 'English'
        };

        const targetLanguage = langNames[targetLang] || targetLang;

        // Try Gemini first
        let translatedText = await translateWithGemini(text, targetLanguage);

        // Fallback to Groq if Gemini fails
        if (!translatedText) {
            console.log('Gemini translation failed, trying Groq...');
            translatedText = await translateWithGroq(text, targetLanguage);
        }

        // Return original text if both fail
        if (!translatedText) {
            console.error('Both translation services failed');
            return res.json({ translatedText: text, service: 'none' });
        }

        res.json({ translatedText, service: translatedText.service || 'gemini' });
    } catch (error) {
        console.error('Translation error:', error);
        res.status(500).json({ error: 'Translation failed', translatedText: req.body.text });
    }
});

// Translate using Gemini
async function translateWithGemini(text, targetLanguage) {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        
        if (!apiKey || apiKey === 'your_gemini_api_key_here') {
            return null;
        }

        const prompt = `Translate the following text to ${targetLanguage}. Only provide the translation, no explanations:

"${text}"

Translation:`;

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.3,
                        maxOutputTokens: 200,
                    }
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                const translation = data.candidates[0].content.parts[0].text.trim();
                return translation;
            }
        } else {
            console.error('Gemini translation error:', response.status);
        }
    } catch (error) {
        console.error('Gemini translation error:', error.message);
    }
    return null;
}

// Translate using Groq
async function translateWithGroq(text, targetLanguage) {
    try {
        const apiKey = process.env.GROQ_API_KEY;
        
        if (!apiKey || apiKey === 'your_groq_api_key_here') {
            return null;
        }

        const prompt = `Translate the following text to ${targetLanguage}. Only provide the translation, no explanations:

"${text}"

Translation:`;

        const response = await fetch(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        {
                            role: 'system',
                            content: 'You are a professional translator. Provide only the translation without any explanations.'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    temperature: 0.3,
                    max_tokens: 200,
                })
            }
        );

        if (response.ok) {
            const data = await response.json();
            if (data.choices && data.choices[0] && data.choices[0].message) {
                const translation = data.choices[0].message.content.trim();
                return translation;
            }
        } else {
            console.error('Groq translation error:', response.status);
        }
    } catch (error) {
        console.error('Groq translation error:', error.message);
    }
    return null;
}

module.exports = router;

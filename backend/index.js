require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { question, documentText, country, region, fileName } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not configured.' });
  }

  try {
    const messages = [
      { role: 'system', content: 'You are a helpful legal assistant.' },
      { role: 'user', content: `Question: ${question}\nDocument: ${documentText || ''}\nCountry: ${country}\nRegion: ${region}\nFile: ${fileName || ''}` }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return res.status(response.status).json({ error: errorData.error?.message || response.statusText });
    }

    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content || '';
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Failed to analyze question.' });
  }
});

app.listen(PORT, () => {
  console.log(`CivicScan backend running on port ${PORT}`);
});

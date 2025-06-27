import express from 'express';
import dotenv from 'dotenv';
import { LingoDotDevEngine } from 'lingo.dev/sdk';

dotenv.config();

const app = express();
app.use(express.json());

const lingoDotDev = new LingoDotDevEngine({
  apiKey: process.env.LINGO_API_KEY,
});

app.post('/api/translate', async (req, res) => {
  const { text, target_lang } = req.body;
  if (!lingoDotDev) {
    return res.status(500).json({ error: 'Lingo.dev SDK not initialized.' });
  }
  try {
    const result = await lingoDotDev.localizeObject(
      { text },
      { sourceLocale: 'en', targetLocale: target_lang }
    );
    res.json({ translated_text: result.text });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Proxy error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Lingo.dev proxy running on port ${PORT}`)); 
# CivicScan Backend

This is a Node.js Express backend for CivicScan. It proxies requests from the frontend to the OpenAI API for legal question analysis.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Add your OpenAI API key to the `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   PORT=5000
   ```
3. Start the backend:
   ```sh
   npm start
   ```

## API Endpoint

### POST /api/analyze

Request body:
```
{
  "question": "...",
  "documentText": "...",
  "country": "...",
  "region": "...",
  "fileName": "..."
}
```

Response:
```
{
  "answer": "..."
}
```

## Notes
- Do not expose your OpenAI API key in frontend code.
- The backend handles CORS automatically.

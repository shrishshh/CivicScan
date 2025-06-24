# ElevenLabs Integration Setup

## Overview
This project now includes ElevenLabs text-to-speech functionality to convert AI responses into clear, professional audio explanations.

## Features
- **Text-to-Speech Conversion**: Converts AI-generated responses into natural-sounding audio
- **Professional Voice**: Uses ElevenLabs' high-quality voice synthesis
- **Loading States**: Shows conversion progress with visual feedback
- **Error Handling**: Graceful error handling for API failures
- **Memory Management**: Automatic cleanup of audio resources

## Setup

### 1. API Key Configuration
The ElevenLabs API key is already configured in the `.env` file:
```
VITE_ELEVENLABS_API_KEY=sk_de5a5e57140d00766c7b4ca3494c8a33005697619bbb7230
```

### 2. Service Architecture
- **ElevenLabsService**: Handles all API interactions with ElevenLabs
- **Singleton Pattern**: Ensures single service instance across the app
- **Error Handling**: Comprehensive error handling for network issues

## Usage

### For Users
1. Enter your legal or civic question
2. Select your country and region
3. Upload any relevant documents (optional)
4. Click "Analyze" to get the AI response
5. Click "Play Voice Summary" to hear the response as audio

### For Developers

#### Initialization
The service is automatically initialized when the app loads:
```typescript
import { initializeElevenLabs, getElevenLabsService } from './services/elevenLabsService';

// Initialize with API key
initializeElevenLabs(apiKey);

// Get service instance
const service = getElevenLabsService();
```

#### Text-to-Speech
```typescript
const audioResponse = await service.textToSpeech(text);
const audio = new Audio(audioResponse.audioUrl);
await audio.play();
```

#### Voice Management
```typescript
// Get available voices
const voices = await service.getAvailableVoices();

// Change voice
service.setVoice('voice_id');

// Change model
service.setModel('model_id');
```

## Configuration Options

### Default Settings
- **Voice**: Rachel (21m00Tcm4TlvDq8ikWAM)
- **Model**: Eleven Monolingual v1
- **Stability**: 0.5
- **Similarity Boost**: 0.5
- **Speaker Boost**: Enabled

### Customization
You can modify voice settings in `src/services/elevenLabsService.ts`:
```typescript
voice_settings: {
  stability: 0.5,        // 0-1: Higher = more stable
  similarity_boost: 0.5, // 0-1: Higher = more similar to original
  style: 0.0,           // 0-1: Higher = more expressive
  use_speaker_boost: true
}
```

## Error Handling
The service includes comprehensive error handling for:
- Invalid API keys
- Network failures
- Audio playback issues
- Rate limiting
- Invalid text input

## Security Notes
- API key is stored in environment variables
- No API calls are made without valid key
- Audio URLs are properly cleaned up to prevent memory leaks

## Troubleshooting

### Common Issues
1. **"API key not found"**: Check `.env` file has `VITE_ELEVENLABS_API_KEY`
2. **"Failed to convert text to speech"**: Verify API key is valid and has credits
3. **Audio won't play**: Check browser audio permissions and network connection

### Debug Mode
Enable console logging by checking browser developer tools for:
- Service initialization messages
- API call responses
- Error details

## API Limits
- Check your ElevenLabs account for usage limits
- Monitor API response times for large text inputs
- Consider implementing text chunking for very long responses 

## Sentry Setup

### 1. Install Sentry SDK

You'll need the Sentry SDK for React and Vite:

```bash
npm install @sentry/react @sentry/tracing
```

### 2. Initialize Sentry in your app

Add the Sentry initialization code at the top of your `src/main.tsx` (or wherever your app entry point is):

```typescript
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN_HERE", // Replace with your Sentry DSN
  integrations: [new BrowserTracing()],
  tracesSampleRate: 1.0, // Adjust this value in production
});
```

- **dsn**: Get this from your Sentry project settings.
- **tracesSampleRate**: 1.0 means 100% of transactions are sent. Lower this in production if needed.

### 3. (Optional) Add Sentry to Vite config

For source map uploads and better integration, you can use the Sentry Vite plugin. This is optional for basic performance tracking, but recommended for production.

### 4. Use Sentry's React Profiler

You can wrap your app in Sentry's Profiler for more granular performance data:

```typescript
import { Profiler } from "@sentry/react";

// In your main render:
<Profiler>
  <App />
</Profiler>
```

### 5. Deploy and Monitor

Once deployed, you'll see performance data (like slow transactions, component render times, etc.) in your Sentry dashboard.

### **Summary**

- Sentry is fully compatible with your stack.
- You'll get both error and performance monitoring.
- You only need to add a few lines to your entry point and install the SDK.

### **Let me know if you want me to add the Sentry setup code for you! If you provide your Sentry DSN, I can wire it up directly.** 
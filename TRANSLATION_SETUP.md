# Dynamic Translation System Setup

This guide explains how to use the dynamic translation system implemented in CivicScan that translates your entire website using the Lingo.dev API.

## Overview

The translation system provides:
- **Dynamic translation** of all static website content
- **Real-time translation** using Lingo.dev API
- **Caching** for better performance
- **Fallback handling** when translation fails
- **Language selector** in the header

## Components

### 1. Translation Service (`src/services/translationService.ts`)
- Singleton service that handles API calls to Lingo.dev
- Includes caching mechanism
- Handles translation of text and objects

### 2. I18n Context (`src/contexts/I18nContext.tsx` & `src/hooks/useI18n.ts`)
- Manages current language state
- Provides translation functions
- Integrates with translation service

### 3. TranslatableText Component (`src/components/TranslatableText.tsx`)
- React component for translating static content
- Automatically translates when language changes
- Shows loading state during translation

### 4. Language Selector (`src/components/LanguageSelector.tsx`)
- Dropdown for language selection
- Appears in header and response sections

## Setup Instructions

### 1. Environment Variables
Add your Lingo.dev API key to `.env`:
```env
VITE_LINGO_API_KEY=your_lingo_dev_api_key_here
```

### 2. Start the Translation Proxy
The proxy server handles API calls to Lingo.dev:
```bash
node proxy-translate.mjs
```

### 3. Start the Development Server
```bash
npm run dev
```

## How to Use

### 1. For Content with Translation Keys
Use the `t()` function from the I18n context:
```tsx
import { useI18n } from './contexts/I18nContext';

function MyComponent() {
  const { t } = useI18n();
  
  return (
    <h1>{t('app.name')}</h1>
  );
}
```

### 2. For Static Content Without Translation Keys
Use the `TranslatableText` component:
```tsx
import { TranslatableText } from './components/TranslatableText';

function MyComponent() {
  return (
    <TranslatableText as="p" className="text-gray-700">
      This content will be automatically translated when the language changes.
    </TranslatableText>
  );
}
```

### 3. For Dynamic Content
Use the translation service directly:
```tsx
import { translationService } from './services/translationService';

async function translateContent(text: string, targetLang: string) {
  const translated = await translationService.translateText(text, targetLang, 'en');
  return translated;
}
```

## Supported Languages

The system supports these languages:
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Hindi (hi)
- Chinese (zh)
- Arabic (ar)
- Russian (ru)
- Portuguese (pt)
- Japanese (ja)

## Features

### 1. Automatic Translation
- All content using `t()` function is automatically translated
- `TranslatableText` components translate on language change
- Cached translations for better performance

### 2. Error Handling
- Falls back to original text if translation fails
- Shows loading states during translation
- Console logging for debugging

### 3. Performance Optimization
- Translation caching prevents duplicate API calls
- Cache is cleared when language changes
- Async translation to prevent UI blocking

## File Structure

```
src/
├── services/
│   └── translationService.ts    # Main translation service
├── contexts/
│   └── I18nContext.tsx         # React context for i18n
├── hooks/
│   ├── useI18n.ts              # Main i18n hook
│   └── useDynamicTranslation.ts # Dynamic translation hook
├── components/
│   ├── TranslatableText.tsx    # Component for static content
│   ├── LanguageSelector.tsx    # Language dropdown
│   └── Header.tsx              # Header with language selector
└── App.tsx                     # Main app with translation examples
```

## Translation Keys

The system uses translation keys defined in `public/locales/en.json`. Add new keys as needed:

```json
{
  "app": {
    "name": "CivicScan",
    "tagline": "Legal Information Made Simple"
  },
  "form": {
    "title": "Ask Your Legal Question",
    "submitButton": "Get Instant Legal Information"
  }
}
```

## Troubleshooting

### 1. Translation Not Working
- Check if the proxy server is running (`node proxy-translate.mjs`)
- Verify your Lingo.dev API key is set in `.env`
- Check browser console for error messages

### 2. Content Not Translating
- Ensure content uses `t()` function or `TranslatableText` component
- Check if translation key exists in locale files
- Verify language is not set to English (no translation needed)

### 3. API Errors
- Check network tab for failed requests
- Verify Lingo.dev API key is valid
- Check proxy server logs for errors

## Best Practices

1. **Use translation keys** for common UI elements
2. **Use TranslatableText** for one-off static content
3. **Cache translations** to reduce API calls
4. **Handle errors gracefully** with fallbacks
5. **Test translations** in multiple languages

## Example Usage

See the "Dynamic Translation Demo" section in the app for examples of:
- Recent questions with dynamic translation
- User testimonials with dynamic translation
- Additional static content examples

The demo shows how different types of content can be translated dynamically when users change the language using the header dropdown. 
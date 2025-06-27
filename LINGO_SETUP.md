# CivicScan Lingo.dev CLI Integration Guide

This guide explains how CivicScan has been integrated with Lingo.dev CLI for comprehensive internationalization (i18n) support.

## What's Been Implemented

### 1. Lingo.dev CLI Configuration
- **File**: `i18n.json` - Main configuration file for Lingo.dev CLI
- **Source Language**: English (`en`)
- **Target Languages**: Spanish, French, German, Hindi, Chinese, Arabic, Russian, Portuguese, Japanese
- **File Pattern**: `locales/[locale].json`

### 2. React i18n System
- **Hook**: `src/hooks/useI18n.ts` - Custom React hook for internationalization
- **Component**: `src/components/LanguageSelector.tsx` - Language selection dropdown
- **Features**:
  - Dynamic locale loading
  - Fallback to English if translation missing
  - Parameter interpolation (e.g., `{error}` placeholders)
  - Array support for example questions

### 3. Locale Files Structure
```
locales/
├── en.json          # English (source)
├── es.json          # Spanish
├── fr.json          # French
├── de.json          # German
├── hi.json          # Hindi
├── zh.json          # Chinese
├── ar.json          # Arabic
├── ru.json          # Russian
├── pt.json          # Portuguese
└── ja.json          # Japanese
```

### 4. Translation Keys Organization
The locale files are organized into logical sections:
- `app` - App name and tagline
- `header` - Navigation items
- `hero` - Main landing page content
- `stats` - Statistics labels
- `form` - Form labels and placeholders
- `exampleQuestions` - Array of example questions
- `response` - Analysis result section
- `recentQuestions` - Recent questions section
- `footer` - Footer content
- `errors` - Error messages
- `languages` - Language names

## Setup Instructions

### Step 1: Environment Variables
Create a `.env` file in your project root with the necessary API keys:

```bash
# Option 1: Using OpenAI directly
OPENAI_API_KEY=your-openai-api-key-here

# Option 2: Using Lingo.dev Engine (recommended)
LINGODOTDEV_API_KEY=your-lingo-api-key-here

# ElevenLabs for text-to-speech
VITE_ELEVENLABS_API_KEY=your-elevenlabs-api-key-here
```

### Step 2: Authentication

#### Option A: Lingo.dev Engine (Recommended)
1. Create a free account at [Lingo.dev Engine](https://lingo.dev)
2. Get your API key from Project Settings
3. Add it to your `.env` file as `LINGODOTDEV_API_KEY`
4. The CLI will automatically use the engine for translations

#### Option B: OpenAI Direct Access
1. Get an OpenAI API key
2. Add it to your `.env` file as `OPENAI_API_KEY`
3. Update `i18n.json` to include the provider configuration:

```json
{
  "locale": {
    "source": "en",
    "targets": ["es", "fr", "de", "hi", "zh", "ar", "ru", "pt", "ja"]
  },
  "buckets": {
    "json": {
      "include": ["locales/[locale].json"]
    }
  },
  "provider": {
    "id": "openai",
    "model": "gpt-4o-mini",
    "prompt": "Act as a professional software localization expert specializing in legal and civic information. Translate each key from {source} to {target}. Preserve ICU message format placeholders like {name} and {{count}}. Maintain Markdown formatting including links and code blocks. Match the tone and formality of the source text. For legal terms, use the most appropriate translation in the target language's legal system. Technical terms that are typically untranslated in the industry should remain in English. Ensure translations are culturally appropriate and legally accurate for the target region."
  }
}
```

### Step 3: Generate Translations
Run the Lingo.dev CLI to generate translations:

```bash
npx lingo.dev@latest i18n
```

This will:
- Read the English source file (`locales/en.json`)
- Generate translated files for all target languages
- Create an `i18n.lock` file to track content fingerprints
- Enable incremental updates on subsequent runs

### Step 4: Copy to Public Directory
After translation, copy the locale files to the public directory:

```bash
cp locales/*.json public/locales/
```

### Step 5: Start Development Server
```bash
npm run dev
```

## How It Works

### 1. Language Selection
- Users can select their preferred language using the `LanguageSelector` component
- The language selector appears in the header and response section
- Language changes are persisted during the session

### 2. Dynamic Content Loading
- The `useI18n` hook loads locale files dynamically from `/locales/[locale].json`
- If a translation is missing, it falls back to English
- The system supports nested keys (e.g., `form.questionLabel`)

### 3. Parameter Interpolation
- Error messages support parameter interpolation: `"documentProcessingFailed": "Document processing failed: {error}"`
- The `t()` function replaces placeholders with actual values

### 4. Array Support
- Example questions are stored as arrays and joined with commas when displayed
- This allows for flexible content management

## Adding New Content

### 1. Add New Translation Keys
1. Add the new key to `locales/en.json`
2. Run `npx lingo.dev@latest i18n` to translate
3. Copy updated files to `public/locales/`

### 2. Use in Components
```tsx
import { useI18n } from './hooks/useI18n';

function MyComponent() {
  const { t } = useI18n();
  
  return (
    <div>
      <h1>{t('mySection.title')}</h1>
      <p>{t('mySection.description')}</p>
    </div>
  );
}
```

### 3. Add New Languages
1. Add the language code to `i18n.json` targets array
2. Run `npx lingo.dev@latest i18n` to generate the new locale file
3. Copy the new file to `public/locales/`
4. Add the language name to the `LanguageSelector` component

## Best Practices

### 1. Key Naming
- Use descriptive, hierarchical keys: `form.questionLabel`, `errors.noCountry`
- Group related content under logical sections
- Use consistent naming conventions

### 2. Content Management
- Keep source content in English clear and concise
- Use placeholders for dynamic content: `{error}`, `{count}`
- Avoid hardcoded strings in components

### 3. Translation Quality
- Review generated translations for accuracy
- Consider cultural and legal context for each region
- Test the UI with different languages to ensure proper layout

### 4. Performance
- Locale files are loaded on-demand
- Fallback to English prevents broken UI
- Consider lazy loading for large locale files

## Troubleshooting

### Translation Not Working
1. Check API keys in `.env` file
2. Verify authentication: `npx lingo.dev@latest login`
3. Check network connectivity
4. Review console for error messages

### Missing Translations
1. Ensure locale files exist in `public/locales/`
2. Check file permissions
3. Verify JSON syntax is valid
4. Check browser network tab for 404 errors

### UI Layout Issues
1. Test with different language lengths
2. Consider RTL languages (Arabic, Hebrew)
3. Adjust CSS for longer text content
4. Test with different font sizes

## Next Steps

1. **Complete Translation**: Generate translations for all target languages
2. **Quality Review**: Review and refine translations for accuracy
3. **Testing**: Test the app with different languages and regions
4. **CI/CD Integration**: Set up automated translation workflow
5. **Content Management**: Establish process for adding new content
6. **Analytics**: Track language usage and user preferences

## Resources

- [Lingo.dev CLI Documentation](https://lingo.dev/docs)
- [Lingo.dev Engine](https://lingo.dev)
- [React i18n Best Practices](https://react.i18next.com/)
- [ICU Message Format](https://unicode-org.github.io/icu/userguide/format_parse/messages/) 
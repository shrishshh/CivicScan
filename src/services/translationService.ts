interface TranslationRequest {
  text: string;
  target_lang: string;
  source_lang?: string;
}

interface TranslationResponse {
  translated_text?: string;
  error?: string;
}

class TranslationService {
  private static instance: TranslationService;
  private cache: Map<string, string> = new Map();
  private apiKey: string;

  private constructor() {
    this.apiKey = import.meta.env.VITE_LINGO_API_KEY || '';
  }

  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }

  private getCacheKey(text: string, targetLang: string): string {
    return `${text}:${targetLang}`;
  }

  public async translateText(text: string, targetLang: string, sourceLang: string = 'en'): Promise<string> {
    if (!text.trim()) return text;
    if (targetLang === sourceLang) return text;

    const cacheKey = this.getCacheKey(text, targetLang);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          target_lang: targetLang,
          source_lang: sourceLang,
        } as TranslationRequest),
      });

      if (!response.ok) {
        throw new Error(`Translation request failed: ${response.status}`);
      }

      const data: TranslationResponse = await response.json();

      if (data.error) {
        console.error('Translation error:', data.error);
        return text; // Return original text on error
      }

      if (data.translated_text) {
        this.cache.set(cacheKey, data.translated_text);
        return data.translated_text;
      }

      return text; // Return original text if no translation
    } catch (error) {
      console.error('Translation service error:', error);
      return text; // Return original text on error
    }
  }

  public async translateObject(obj: any, targetLang: string, sourceLang: string = 'en'): Promise<any> {
    if (typeof obj === 'string') {
      return await this.translateText(obj, targetLang, sourceLang);
    }

    if (Array.isArray(obj)) {
      const translatedArray = [];
      for (const item of obj) {
        translatedArray.push(await this.translateObject(item, targetLang, sourceLang));
      }
      return translatedArray;
    }

    if (typeof obj === 'object' && obj !== null) {
      const translatedObj: any = {};
      for (const [key, value] of Object.entries(obj)) {
        translatedObj[key] = await this.translateObject(value, targetLang, sourceLang);
      }
      return translatedObj;
    }

    return obj;
  }

  public clearCache(): void {
    this.cache.clear();
  }

  public getCacheSize(): number {
    return this.cache.size;
  }
}

export const translationService = TranslationService.getInstance(); 
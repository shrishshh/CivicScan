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

    // Translation API removed, always return original text
    return text;
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
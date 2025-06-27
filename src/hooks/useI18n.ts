import { useState, useEffect } from 'react';
import { translationService } from '../services/translationService';

interface LocaleData {
  [key: string]: any;
}

interface UseI18nReturn {
  t: (key: string, params?: Record<string, string>) => string;
  locale: string;
  setLocale: (locale: string) => void;
  isLoading: boolean;
  availableLocales: string[];
  translateText: (text: string) => Promise<string>;
  translateObject: (obj: any) => Promise<any>;
}

export function useI18n(): UseI18nReturn {
  const [locale, setLocaleState] = useState<string>('en');
  const [localeData, setLocaleData] = useState<LocaleData>({});
  const [translatedData, setTranslatedData] = useState<LocaleData>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableLocales] = useState<string[]>(['en', 'es', 'fr', 'de', 'hi', 'zh', 'ar', 'ru', 'pt', 'ja']);

  useEffect(() => {
    loadLocaleData(locale);
  }, [locale]);

  const isLocaleActuallyTranslated = (data: LocaleData, source: LocaleData): boolean => {
    // Check a few keys to see if they are still in English
    // (This is a heuristic, not perfect)
    const keysToCheck = [
      'app.tagline',
      'header.browseTopics',
      'hero.title',
      'form.title',
      'footer.description'
    ];
    return keysToCheck.some(key => {
      const en = key.split('.').reduce((o, k) => (o && o[k] ? o[k] : null), source);
      const val = key.split('.').reduce((o, k) => (o && o[k] ? o[k] : null), data);
      return val && en && val !== en;
    });
  };

  const loadLocaleData = async (targetLocale: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/locales/${targetLocale}.json`);
      const enResponse = await fetch('/locales/en.json');
      const enData = await enResponse.json();
      if (response.ok) {
        const data = await response.json();
        setLocaleData(data);
        // Spanish is the only language with a real translation file
        if (targetLocale === 'es') {
          setTranslatedData(data);
        } else if (targetLocale !== 'en') {
          // For all other languages, always dynamically translate from English
          try {
            const translated = await translationService.translateObject(enData, targetLocale, 'en');
            setTranslatedData(translated);
          } catch (error) {
            console.error('Failed to auto-translate static locale:', error);
            setTranslatedData(data);
          }
        } else {
          setTranslatedData(data);
        }
      } else {
        console.warn(`Locale file for ${targetLocale} not found, falling back to English`);
        setLocaleData(enData);
        
        // If not English, translate the fallback data
        if (targetLocale !== 'en') {
          try {
            const translatedFallback = await translationService.translateObject(enData, targetLocale, 'en');
            setTranslatedData(translatedFallback);
          } catch (error) {
            console.error('Failed to translate fallback data:', error);
            setTranslatedData(enData);
          }
        } else {
          setTranslatedData(enData);
        }
      }
    } catch (error) {
      console.error('Failed to load locale data:', error);
      // Fallback to English
      try {
        const fallbackResponse = await fetch('/locales/en.json');
        const fallbackData = await fallbackResponse.json();
        setLocaleData(fallbackData);
        
        // If not English, translate the fallback data
        if (targetLocale !== 'en') {
          try {
            const translatedFallback = await translationService.translateObject(fallbackData, targetLocale, 'en');
            setTranslatedData(translatedFallback);
          } catch (error) {
            console.error('Failed to translate fallback locale data:', error);
            setTranslatedData(fallbackData);
          }
        } else {
          setTranslatedData(fallbackData);
        }
      } catch (fallbackError) {
        console.error('Failed to load fallback locale data:', fallbackError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const t = (key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translatedData;
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key if translation not found
      }
    }

    if (typeof value === 'string') {
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey] || match;
        });
      }
      return value;
    }

    if (Array.isArray(value)) {
      return value.join(', ');
    }

    return key;
  };

  const setLocale = (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      setLocaleState(newLocale);
    } else {
      console.warn(`Locale ${newLocale} is not supported`);
    }
  };

  const translateText = async (text: string): Promise<string> => {
    if (locale === 'en') return text;
    return await translationService.translateText(text, locale, 'en');
  };

  const translateObject = async (obj: any): Promise<any> => {
    if (locale === 'en') return obj;
    return await translationService.translateObject(obj, locale, 'en');
  };

  return {
    t,
    locale,
    setLocale,
    isLoading,
    availableLocales,
    translateText,
    translateObject,
  };
} 
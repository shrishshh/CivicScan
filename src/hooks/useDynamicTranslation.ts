import { useState, useEffect } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { translationService } from '../services/translationService';

interface UseDynamicTranslationReturn {
  translateContent: (content: string) => string;
  translateContentAsync: (content: string) => Promise<string>;
  isTranslating: boolean;
  clearCache: () => void;
}

export function useDynamicTranslation(): UseDynamicTranslationReturn {
  const { locale } = useI18n();
  const [translationCache, setTranslationCache] = useState<Map<string, string>>(new Map());
  const [isTranslating, setIsTranslating] = useState(false);

  // Clear cache when locale changes
  useEffect(() => {
    setTranslationCache(new Map());
  }, [locale]);

  const translateContent = (content: string): string => {
    if (!content || locale === 'en') return content;

    const cacheKey = `${content}:${locale}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    // Return original content and trigger async translation
    translateContentAsync(content);
    return content;
  };

  const translateContentAsync = async (content: string): Promise<string> => {
    if (!content || locale === 'en') return content;

    const cacheKey = `${content}:${locale}`;
    if (translationCache.has(cacheKey)) {
      return translationCache.get(cacheKey)!;
    }

    setIsTranslating(true);
    try {
      const translatedText = await translationService.translateText(content, locale, 'en');
      setTranslationCache(prev => new Map(prev).set(cacheKey, translatedText));
      return translatedText;
    } catch (error) {
      console.error('Dynamic translation failed:', error);
      return content;
    } finally {
      setIsTranslating(false);
    }
  };

  const clearCache = () => {
    setTranslationCache(new Map());
    translationService.clearCache();
  };

  return {
    translateContent,
    translateContentAsync,
    isTranslating,
    clearCache,
  };
} 
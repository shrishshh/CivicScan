import React, { useState, useEffect, ReactNode } from 'react';
import { useI18n } from '../contexts/I18nContext';
import { translationService } from '../services/translationService';

interface TranslatableTextProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  fallback?: string;
}

export const TranslatableText: React.FC<TranslatableTextProps> = ({
  children,
  className = '',
  as: Component = 'span',
  fallback
}) => {
  const { locale } = useI18n();
  const [translatedText, setTranslatedText] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);

  // Convert children to string
  const childrenString = React.Children.toArray(children).join('');

  useEffect(() => {
    const translateText = async () => {
      if (!childrenString || locale === 'en') {
        setTranslatedText(childrenString);
        return;
      }

      setIsTranslating(true);
      try {
        const translated = await translationService.translateText(childrenString, locale, 'en');
        setTranslatedText(translated);
      } catch (error) {
        console.error('Translation failed:', error);
        setTranslatedText(fallback || childrenString);
      } finally {
        setIsTranslating(false);
      }
    };

    translateText();
  }, [childrenString, locale, fallback]);

  return (
    <Component className={className}>
      {isTranslating ? `${childrenString}...` : translatedText}
    </Component>
  );
}; 
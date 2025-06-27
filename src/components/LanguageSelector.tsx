import React from 'react';
import { Globe } from 'lucide-react';
import { useI18n } from '../contexts/I18nContext';

interface LanguageSelectorProps {
  className?: string;
  showLabel?: boolean;
}

export function LanguageSelector({ className = '', showLabel = true }: LanguageSelectorProps) {
  const { t, locale, setLocale, availableLocales } = useI18n();

  const languageNames: Record<string, string> = {
    en: 'English',
    es: 'Español',
    fr: 'Français',
    de: 'Deutsch',
    hi: 'हिन्दी',
    zh: '中文',
    ar: 'العربية',
    ru: 'Русский',
    pt: 'Português',
    ja: '日本語',
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {showLabel && (
        <label htmlFor="language-selector" className="font-medium text-gray-700">
          {t('response.languageLabel')}
        </label>
      )}
      <div className="relative">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <select
          id="language-selector"
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none cursor-pointer"
        >
          {availableLocales.map((langCode) => (
            <option key={langCode} value={langCode}>
              {languageNames[langCode] || langCode}
            </option>
          ))}
        </select>
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
} 
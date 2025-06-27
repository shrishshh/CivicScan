import React, { createContext, useContext, ReactNode } from 'react';
import { useI18n as useI18nHook } from '../hooks/useI18n';

const I18nContext = createContext<ReturnType<typeof useI18nHook> | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const i18n = useI18nHook();
  return (
    <I18nContext.Provider value={i18n}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
} 
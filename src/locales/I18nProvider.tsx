'use client';

import * as React from 'react';
import type { Dictionary, Lang } from '@/utils/dictionary';

const I18nContext = React.createContext<
  { lang: Lang; dict: Dictionary } | undefined
>(undefined);

export function I18nProvider({
  lang,
  dict,
  children,
}: {
  lang: Lang;
  dict: Dictionary;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ lang, dict }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = React.useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return ctx;
}

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { en, type Translations } from './en';
import { ar } from './ar';

export type Locale = 'ar' | 'en';

const DICTIONARIES: Record<Locale, Translations> = { en, ar };
const STORAGE_KEY = 'adminpro_locale';

interface LocaleContextValue {
  locale: Locale;
  dir: 'rtl' | 'ltr';
  t: Translations;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Format a template string like "{years} Years" with the given values. */
  format: (template: string, values: Record<string, string | number>) => string;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'ar';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'ar' || stored === 'en') return stored;
  } catch {
    // localStorage unavailable — fall back to default.
  }
  return 'ar';
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore write failures (private mode, quota, etc.)
    }
  }, []);

  const toggleLocale = useCallback(() => {
    setLocale(locale === 'ar' ? 'en' : 'ar');
  }, [locale, setLocale]);

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    document.documentElement.lang = locale;
    // Keep the root <html> element's own direction fixed to LTR so the
    // browser always renders its native scrollbar on the conventional
    // (right) side of the viewport — some browsers move it to the left
    // when <html dir="rtl">, which looked like a stray bar/mark at the
    // far edge of the page. The actual RTL/LTR layout for all app content
    // is applied on the #root wrapper instead; CSS `direction` inherits
    // normally and Tailwind's [dir="rtl"] selectors match any ancestor,
    // so this has no effect on the app's own RTL layout.
    document.documentElement.dir = 'ltr';
    const root = document.getElementById('root');
    if (root) root.dir = dir;
  }, [locale, dir]);

  const format = useCallback((template: string, values: Record<string, string | number>) => {
    return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ''));
  }, []);

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, dir, t: DICTIONARIES[locale], setLocale, toggleLocale, format }),
    [locale, dir, setLocale, toggleLocale, format],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within a LocaleProvider');
  return ctx;
}

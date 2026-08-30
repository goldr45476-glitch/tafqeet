import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * The five lightweight, CSS-only background styles a visitor can cycle
 * through. Every one of them is built from gradients, blurred shapes, SVG
 * outlines, and slow transform/opacity animations only — no images, no
 * heavy libraries — so switching is instant and stays cheap on low-end
 * devices. The chosen style applies site-wide (via <BackgroundDecor>, which
 * every page already renders) and persists in local storage.
 */
export const BACKGROUND_STYLES = ['aurora', 'mesh', 'dots', 'waves', 'geometric'] as const;
export type BackgroundStyle = (typeof BACKGROUND_STYLES)[number];

const STORAGE_KEY = 'adminpro_bg_style';

interface BackgroundContextValue {
  style: BackgroundStyle;
  setStyle: (style: BackgroundStyle) => void;
  cycleStyle: () => BackgroundStyle;
}

const BackgroundContext = createContext<BackgroundContextValue | null>(null);

function getInitialStyle(): BackgroundStyle {
  if (typeof window === 'undefined') return 'aurora';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && (BACKGROUND_STYLES as readonly string[]).includes(stored)) {
      return stored as BackgroundStyle;
    }
  } catch {
    // ignore
  }
  return 'aurora';
}

export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<BackgroundStyle>(getInitialStyle);

  const setStyle = useCallback((next: BackgroundStyle) => {
    setStyleState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const cycleStyle = useCallback((): BackgroundStyle => {
    let next: BackgroundStyle = 'aurora';
    setStyleState((prev) => {
      const currentIndex = BACKGROUND_STYLES.indexOf(prev);
      next = BACKGROUND_STYLES[(currentIndex + 1) % BACKGROUND_STYLES.length];
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
    return next;
  }, []);

  const value = useMemo<BackgroundContextValue>(
    () => ({ style, setStyle, cycleStyle }),
    [style, setStyle, cycleStyle],
  );

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>;
}

export function useBackground(): BackgroundContextValue {
  const ctx = useContext(BackgroundContext);
  if (!ctx) throw new Error('useBackground must be used within a BackgroundProvider');
  return ctx;
}

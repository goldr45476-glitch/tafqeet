import React from 'react';
import { useBackground } from '../hooks/useBackground';
import { useLocale } from '../i18n';
import { useToast } from '../hooks/useToast';
import { IconPalette } from './icons';

/**
 * A small, fixed, site-wide control that cycles the background style. It
 * lives once in <App> (outside the page <Routes>) so it stays put across
 * navigation, and it never intercepts clicks meant for page content.
 */
export default function BackgroundSwitcher() {
  const { cycleStyle } = useBackground();
  const { t } = useLocale();
  const { showToast } = useToast();

  function handleClick() {
    cycleStyle();
    showToast(t.common.backgroundChanged, 'info');
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      title={t.common.changeBackground}
      aria-label={t.common.changeBackground}
      className="group fixed bottom-5 start-5 z-40 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/60 bg-white/80 text-slate-600 shadow-soft backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:text-brand-600 hover:shadow-glow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500 dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:text-brand-300 sm:bottom-6 sm:start-6"
    >
      <IconPalette className="h-5 w-5 transition-transform duration-500 group-hover:rotate-45" />
    </button>
  );
}

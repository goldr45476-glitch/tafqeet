import React, { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLocale } from '../i18n';
import { useTheme } from '../hooks/useTheme';
import { TOOLS } from '../data/tools';
import { IconClose, IconGlobe, IconLogoMark, IconMenu, IconMoon, IconSun } from './icons';

export default function Navbar() {
  const { t, locale, toggleLocale } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 12);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-md px-3.5 py-2 text-sm font-bold transition-colors ${
      isActive
        ? 'bg-accent-100 text-brand-800 dark:bg-white/10 dark:text-accent-200'
        : 'text-slate-600 hover:bg-accent-50 hover:text-brand-800 dark:text-slate-300 dark:hover:bg-white/5 dark:hover:text-accent-200'
    }`;

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 border-accent-500/70 bg-surface-card transition-shadow duration-300 dark:border-accent-700/60 dark:bg-slate-950 ${
        scrolled ? 'shadow-soft' : ''
      }`}
    >
      <nav className="section-container flex h-16 items-center justify-between gap-4" aria-label="Main navigation">
        <NavLink to="/" className="flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-accent-500 bg-brand-700 text-accent-100 shadow-soft">
            <IconLogoMark className="h-[18px] w-[18px]" />
          </span>
          <span className="font-display text-2xl font-bold text-brand-800 dark:text-accent-100">{t.common.appName}</span>
        </NavLink>

        <div className="hidden items-center gap-1 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            {t.nav.home}
          </NavLink>
          <NavLink to="/tools" className={navLinkClass}>
            {t.nav.tools}
          </NavLink>
          {TOOLS.map((tool) => (
            <NavLink key={tool.id} to={tool.path} className={navLinkClass}>
              {t.nav[tool.id]}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            className="btn-ghost h-10 w-10 rounded-full p-0"
            aria-label={t.common.toggleTheme}
            title={t.common.toggleTheme}
          >
            {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>

          <button
            type="button"
            onClick={toggleLocale}
            className="chip-toggle h-10 gap-1.5 px-3.5"
            aria-label="AR | EN"
            title="AR | EN"
          >
            <IconGlobe className="h-4 w-4" />
            <span className={locale === 'ar' ? 'font-bold' : 'text-slate-400 dark:text-slate-500'}>AR</span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className={locale === 'en' ? 'font-bold' : 'text-slate-400 dark:text-slate-500'}>EN</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="btn-ghost h-10 w-10 rounded-full p-0 lg:hidden"
            aria-label={t.nav.menu}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t border-accent-300 bg-surface-card px-4 py-3 dark:border-accent-800/60 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end className={navLinkClass}>
              {t.nav.home}
            </NavLink>
            <NavLink to="/tools" className={navLinkClass}>
              {t.nav.tools}
            </NavLink>
            {TOOLS.map((tool) => (
              <NavLink key={tool.id} to={tool.path} className={navLinkClass}>
                {t.nav[tool.id]}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

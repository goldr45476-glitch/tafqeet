import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import { TOOLS } from '../data/tools';
import { IconGlobe, IconLogoMark, IconShield } from './icons';

export default function Footer() {
  const { t, locale, toggleLocale, format } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-slate-200/70 bg-white/60 dark:border-white/10 dark:bg-slate-950/60">
      <div className="section-container grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-soft">
              <IconLogoMark className="h-[18px] w-[18px]" />
            </span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">{t.common.appName}</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-500 dark:text-slate-400">{t.footer.tagline}</p>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <IconShield className="h-4 w-4 text-accent-600 dark:text-accent-400" />
            <span>{t.common.poweredBy}</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.footer.toolsTitle}</h3>
          <ul className="mt-4 space-y-2.5">
            {TOOLS.map((tool) => (
              <li key={tool.id}>
                <Link
                  to={tool.path}
                  className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
                >
                  {t.nav[tool.id]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">{t.footer.resourcesTitle}</h3>
          <ul className="mt-4 space-y-2.5">
            <li>
              <Link
                to="/about"
                className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
              >
                {t.footer.about}
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
              >
                {t.footer.privacy}
              </Link>
            </li>
            <li>
              <Link
                to="/terms"
                className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
              >
                {t.footer.terms}
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-sm text-slate-500 transition-colors hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300"
              >
                {t.footer.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AR | EN</h3>
          <button type="button" onClick={toggleLocale} className="chip-toggle mt-4 gap-1.5">
            <IconGlobe className="h-4 w-4" />
            <span className={locale === 'ar' ? 'font-bold' : 'text-slate-400 dark:text-slate-500'}>العربية</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className={locale === 'en' ? 'font-bold' : 'text-slate-400 dark:text-slate-500'}>English</span>
          </button>
          <p className="mt-4 max-w-xs text-xs leading-5 text-slate-500 dark:text-slate-400">{t.footer.privacyNote}</p>
        </div>
      </div>

      <div className="border-t border-slate-200/70 py-5 dark:border-white/10">
        <p className="section-container text-center text-xs text-slate-500 dark:text-slate-400">
          {format(t.footer.copyright, { year })}
        </p>
      </div>
    </footer>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';

export default function NotFoundPage() {
  const { t, locale } = useLocale();
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <BackgroundDecor variant="compact" />
      <Seo title={locale === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'} />
      <div className="section-container text-center">
        <p className="text-7xl font-black text-brand-600 dark:text-brand-400">404</p>
        <h1 className="mt-4 text-2xl font-bold text-slate-900 dark:text-white">
          {locale === 'ar' ? 'عذرًا، الصفحة غير موجودة' : "Sorry, this page doesn't exist"}
        </h1>
        <Link to="/" className="btn-primary mt-8 inline-flex">
          {t.nav.home}
        </Link>
      </div>
    </div>
  );
}

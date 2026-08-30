import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import { IconInfo, IconMail, IconShield } from '../components/icons';

type PageKey = 'about' | 'privacy' | 'terms' | 'contact';

const ICONS: Record<PageKey, React.ComponentType<{ className?: string }>> = {
  about: IconInfo,
  privacy: IconShield,
  terms: IconInfo,
  contact: IconMail,
};

export default function StaticPage({ page }: { page: PageKey }) {
  const { t } = useLocale();
  const content = t.pages[page];
  const Icon = ICONS[page];

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <BackgroundDecor variant="compact" />
      <Seo title={content.title} />
      <div className="section-container max-w-3xl">
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">{content.title}</h1>
        <div className="glass-card mt-8 p-7 sm:p-8">
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{content.body}</p>
        </div>

        {page === 'contact' && (
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:hello@tafqeet.app" className="btn-primary">
              hello@tafqeet.app
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

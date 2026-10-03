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
        <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-md border border-accent-500 bg-brand-700 text-accent-100 shadow-soft">
          <Icon className="h-7 w-7" />
        </div>
        <h1 className="text-4xl font-bold text-brand-900 dark:text-accent-100">{content.title}</h1>
        <div className="glass-card mt-8 p-7 sm:p-8">
          <p className="text-base leading-8 text-slate-600 dark:text-slate-300">{content.body}</p>
        </div>

        {page === 'contact' && (
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="mailto:hello@adminpro.tools" className="btn-primary">
              hello@adminpro.tools
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

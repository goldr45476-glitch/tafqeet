import React from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import ToolCard from '../components/ToolCard';
import { TOOLS } from '../data/tools';

export default function ToolsPage() {
  const { t } = useLocale();

  return (
    <div className="relative overflow-hidden py-16 sm:py-24">
      <BackgroundDecor variant="compact" />
      <Seo title={t.tools.pageTitle} description={t.tools.pageSubtitle} />
      <div className="section-container">
        <PageHeader title={t.tools.pageTitle} subtitle={t.tools.pageSubtitle} />

        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

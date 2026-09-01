import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import { TOOLS } from '../data/tools';
import { IconArrowEnd, IconStar } from '../components/icons';
import NumberToWordsTool from '../components/tools/NumberToWordsTool';
import DateDifferenceTool from '../components/tools/DateDifferenceTool';
import FinancialCalculatorTool from '../components/tools/FinancialCalculatorTool';
import DocumentHelperTool from '../components/tools/DocumentHelperTool';

/** Derives the in-page section id (e.g. "number-to-words") from a tool's standalone route. */
function sectionIdFor(path: string): string {
  return path.replace('/tools/', '');
}

/** Small "open as standalone page" link shown at the top of each inline tool section. */
function StandaloneLink({ path }: { path: string }) {
  const { t, dir } = useLocale();
  return (
    <div className="section-container flex justify-end pb-0 pt-6 sm:pt-8">
      <Link
        to={path}
        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur transition-colors hover:border-brand-300 hover:text-brand-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:border-brand-400/50 dark:hover:text-brand-300"
      >
        {t.home.openStandalone}
        <IconArrowEnd className={`h-3.5 w-3.5 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
      </Link>
    </div>
  );
}

export default function HomePage() {
  const { t } = useLocale();
  const [activeSection, setActiveSection] = useState<string>(() => sectionIdFor(TOOLS[0].path));

  // Lightweight scroll-spy: highlights the quick-nav button for whichever
  // tool section is currently most visible, so the toolbar stays in sync
  // with manual scrolling (not just clicks on the toolbar itself).
  useEffect(() => {
    const ids = TOOLS.map((tool) => sectionIdFor(tool.path));
    const sections = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (mostVisible) setActiveSection(mostVisible.target.id);
      },
      { rootMargin: '-140px 0px -55% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  return (
    <div>
      <Seo title={t.meta.titleHome} description={t.meta.descriptionHome} />

      {/* ---------------- Minimal intro (kept short on purpose — the first tool must be usable without scrolling) ---------------- */}
      <section className="relative overflow-hidden pb-6 pt-10 sm:pt-14">
        <BackgroundDecor variant="compact" />
        <div className="section-container relative text-center">
          <span className="animate-fadeInUp glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
            <IconStar className="h-3.5 w-3.5" />
            {t.home.badge}
          </span>
          <h1
            className="animate-fadeInUp mt-4 text-2xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-3xl"
            style={{ animationDelay: '80ms' }}
          >
            <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
              {t.home.heroTitle}
            </span>
          </h1>
        </div>
      </section>

      {/* ---------------- Sticky quick-nav toolbar ---------------- */}
      <div className="sticky top-16 z-40 border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90">
        <nav className="section-container flex gap-2 overflow-x-auto py-3" aria-label={t.home.quickNavLabel}>
          {TOOLS.map((tool) => {
            const sectionId = sectionIdFor(tool.path);
            const Icon = tool.icon;
            const isActive = activeSection === sectionId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => scrollToSection(sectionId)}
                className="chip-toggle shrink-0 whitespace-nowrap"
                data-active={isActive}
                aria-current={isActive ? 'true' : undefined}
              >
                <Icon className="h-4 w-4" />
                {t.nav[tool.id]}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ---------------- All four tools, fully functional inline, top to bottom ---------------- */}
      {TOOLS.map((tool) => {
        const sectionId = sectionIdFor(tool.path);
        return (
          <section key={tool.id} id={sectionId} className="scroll-mt-36">
            <StandaloneLink path={tool.path} />
            {tool.id === 'numberToWords' && <NumberToWordsTool />}
            {tool.id === 'dateDifference' && <DateDifferenceTool />}
            {tool.id === 'financialCalculator' && <FinancialCalculatorTool />}
            {tool.id === 'documentHelper' && <DocumentHelperTool />}
          </section>
        );
      })}
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import { TOOLS } from '../data/tools';
import { IconArrowEnd } from '../components/icons';
import NumberToWordsTool from '../components/tools/NumberToWordsTool';
import DateDifferenceTool from '../components/tools/DateDifferenceTool';
import FinancialCalculatorTool from '../components/tools/FinancialCalculatorTool';
import DocumentHelperTool from '../components/tools/DocumentHelperTool';

/** Derives the in-page section id (e.g. "number-to-words") from a tool's standalone route. */
function sectionIdFor(path: string): string {
  return path.replace('/tools/', '');
}

/**
 * Small, deliberately understated "open as standalone page" link shown at the
 * top-end corner of each inline tool section — for people who want to
 * bookmark or share a direct link to just that one tool. It's plain muted
 * text (not a bordered pill) so it doesn't compete with the tool itself.
 */
function StandaloneLink({ path }: { path: string }) {
  const { t, dir } = useLocale();
  return (
    <div className="section-container flex justify-end pb-0 pt-3">
      <Link
        to={path}
        className="inline-flex items-center gap-1 text-xs font-medium text-slate-400 transition-colors hover:text-brand-600 dark:text-slate-500 dark:hover:text-brand-400"
      >
        {t.home.openStandalone}
        <IconArrowEnd className={`h-3 w-3 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
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

      {/*
        Quick-nav: a clean underline-tab bar attached directly under the
        global Navbar (same background treatment, no floating "card" look)
        so it reads as one continuous header, not a separate widget. The
        active tab is marked with a bottom accent bar instead of a filled
        pill, which keeps the bar visually quiet — its job is wayfinding,
        not decoration. No hero copy above it: the first tool must be
        usable the instant the page loads, with zero scrolling or reading.
      */}
      <div className="sticky top-16 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/95">
        <nav
          className="section-container flex items-center justify-center gap-0.5 overflow-x-auto sm:gap-1"
          aria-label={t.home.quickNavLabel}
        >
          {TOOLS.map((tool) => {
            const sectionId = sectionIdFor(tool.path);
            const Icon = tool.icon;
            const isActive = activeSection === sectionId;
            return (
              <button
                key={tool.id}
                type="button"
                onClick={() => scrollToSection(sectionId)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative flex shrink-0 items-center gap-2 whitespace-nowrap px-3.5 py-3.5 text-sm font-semibold transition-colors sm:px-4 ${
                  isActive
                    ? 'text-brand-700 dark:text-brand-300'
                    : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {t.nav[tool.id]}
                <span
                  className={`absolute inset-x-2.5 -bottom-px h-0.5 rounded-full bg-gradient-to-r from-brand-600 to-brand-500 transition-opacity ${
                    isActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
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

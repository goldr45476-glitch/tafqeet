import React from 'react';
import { Link } from 'react-router-dom';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import ToolCard from '../components/ToolCard';
import AnimatedCounter from '../components/AnimatedCounter';
import { TOOLS } from '../data/tools';
import { IconArrowEnd, IconBolt, IconLanguages, IconShield, IconSparkles, IconStar, IconTafqeet } from '../components/icons';

export default function HomePage() {
  const { t, dir } = useLocale();

  const features = [
    { icon: IconLanguages, title: t.home.feature1Title, desc: t.home.feature1Desc },
    { icon: IconShield, title: t.home.feature2Title, desc: t.home.feature2Desc },
    { icon: IconTafqeet, title: t.home.feature3Title, desc: t.home.feature3Desc },
    { icon: IconBolt, title: t.home.feature4Title, desc: t.home.feature4Desc },
  ];

  return (
    <div>
      <Seo title={t.meta.titleHome} description={t.meta.descriptionHome} />

      {/* ---------------- Hero ---------------- */}
      <section className="relative overflow-hidden pb-20 pt-16 sm:pb-28 sm:pt-24">
        <BackgroundDecor />
        <div className="section-container relative">
          <div className="mx-auto max-w-3xl text-center">
            <span className="animate-fadeInUp glass-panel mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-brand-700 dark:text-brand-300">
              <IconStar className="h-3.5 w-3.5" />
              {t.home.badge}
            </span>

            <h1
              className="animate-fadeInUp text-4xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
              style={{ animationDelay: '80ms' }}
            >
              <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-accent-500 bg-clip-text text-transparent">
                {t.home.heroTitle}
              </span>
            </h1>

            <p
              className="animate-fadeInUp mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300 sm:text-lg"
              style={{ animationDelay: '160ms' }}
            >
              {t.home.heroSubtitle}
            </p>

            <div className="animate-fadeInUp mt-9 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '240ms' }}>
              <Link to="/tools/number-to-words" className="btn-primary text-base">
                <IconSparkles className="h-4 w-4" />
                {t.home.ctaStart}
              </Link>
              <Link to="/tools" className="btn-secondary text-base">
                {t.home.ctaExplore}
                <IconArrowEnd className={`h-4 w-4 ${dir === 'rtl' ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>

          <div
            className="animate-fadeInUp glass-panel mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-6 rounded-3xl px-6 py-8 sm:grid-cols-4 sm:px-10"
            style={{ animationDelay: '320ms' }}
          >
            {[
              { value: 4, suffix: '', label: t.home.statTools },
              { value: 11, suffix: '+', label: t.home.statCurrencies },
              { value: 2, suffix: '', label: t.home.statLanguages },
              { value: 100, suffix: '%', label: t.home.statPrivate },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold text-brand-600 dark:text-brand-400 sm:text-4xl">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400 sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Tools grid ---------------- */}
      <section className="relative py-16 sm:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.home.sectionToolsTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">{t.home.sectionToolsSubtitle}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- Features ---------------- */}
      <section className="relative overflow-hidden py-16 sm:py-24">
        <div className="section-container">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {t.home.featuresTitle}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-500 dark:text-slate-400">{t.home.featuresSubtitle}</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.title} className="glass-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA band ---------------- */}
      <section className="relative py-16 sm:py-20">
        <div className="section-container">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-accent-600 px-6 py-14 text-center shadow-glow sm:px-16">
            <div className="pointer-events-none absolute inset-0 bg-grid-pattern bg-[length:36px_36px] opacity-10" />
            <h2 className="relative text-2xl font-extrabold text-white sm:text-3xl">{t.home.ctaBandTitle}</h2>
            <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-brand-50/90 sm:text-base">
              {t.home.ctaBandSubtitle}
            </p>
            <div className="relative mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/tools/number-to-words" className="rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 shadow-soft transition-transform hover:-translate-y-0.5">
                {t.home.ctaStart}
              </Link>
              <Link
                to="/tools"
                className="rounded-2xl border border-white/40 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                {t.home.ctaExplore}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

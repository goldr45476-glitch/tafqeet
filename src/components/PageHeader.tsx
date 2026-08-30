import React from 'react';

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="animate-fadeInUp mx-auto max-w-3xl text-center">
      {icon && (
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-glow">
          {icon}
        </div>
      )}
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full border border-brand-200 bg-brand-50 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700 dark:border-brand-800/60 dark:bg-brand-500/10 dark:text-brand-300">
          {eyebrow}
        </span>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">{title}</h1>
      {subtitle && <p className="mt-4 text-base leading-7 text-slate-500 dark:text-slate-400 sm:text-lg">{subtitle}</p>}
    </div>
  );
}

import React from 'react';

/** Eight-pointed star medallion that frames the tool icon. */
function Medallion({ children, tone }: { children: React.ReactNode; tone: string }) {
  return (
    <div className="relative mx-auto mb-5 h-[88px] w-[88px]">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="currentColor" className={tone}>
          <rect x="16" y="16" width="68" height="68" />
          <rect x="16" y="16" width="68" height="68" transform="rotate(45 50 50)" />
        </g>
        <g fill="none" stroke="#b98530" strokeWidth="1.6">
          <rect x="16" y="16" width="68" height="68" />
          <rect x="16" y="16" width="68" height="68" transform="rotate(45 50 50)" />
          <circle cx="50" cy="50" r="27" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-accent-100">{children}</div>
    </div>
  );
}

export default function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon,
  tone = 'text-brand-700',
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  /** Tailwind text-colour class used as the medallion's fill, e.g. `text-sapphire-700`. */
  tone?: string;
}) {
  return (
    <div className="animate-fadeInUp mx-auto max-w-3xl text-center">
      {icon && <Medallion tone={tone}>{icon}</Medallion>}
      {eyebrow && (
        <span className="mb-2 inline-block text-sm font-bold tracking-wide text-accent-700 dark:text-accent-300">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl font-bold text-brand-900 dark:text-accent-100 sm:text-5xl">{title}</h1>
      <div className="ornament mt-4" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor">
          <path d="M9 0 L12 6 L18 9 L12 12 L9 18 L6 12 L0 9 L6 6 Z" />
        </svg>
      </div>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

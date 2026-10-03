import React, { useId } from 'react';

/**
 * Large star medallion that frames the tool icon: an eight-pointed star in the
 * tool's colour, a dotted outer ring, gilt inner ring and four diamond finials.
 */
function Medallion({ children, tone }: { children: React.ReactNode; tone: string }) {
  const dots = Array.from({ length: 24 }, (_, i) => {
    const a = (i * 360) / 24;
    return <circle key={i} cx={60 + 54 * Math.cos((a * Math.PI) / 180)} cy={60 + 54 * Math.sin((a * Math.PI) / 180)} r="1.5" />;
  });
  return (
    <div className="relative mx-auto mb-6 h-[120px] w-[120px]">
      <svg viewBox="0 0 120 120" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <g fill="#b98530">{dots}</g>
        <g fill="currentColor" className={tone}>
          <rect x="21" y="21" width="78" height="78" />
          <rect x="21" y="21" width="78" height="78" transform="rotate(45 60 60)" />
        </g>
        <g fill="none" stroke="#e0bb66" strokeWidth="1.2">
          <rect x="27" y="27" width="66" height="66" />
          <rect x="27" y="27" width="66" height="66" transform="rotate(45 60 60)" />
        </g>
        <g fill="none" stroke="#b98530" strokeWidth="2">
          <rect x="21" y="21" width="78" height="78" />
          <rect x="21" y="21" width="78" height="78" transform="rotate(45 60 60)" />
        </g>
        <circle cx="60" cy="60" r="30" fill="rgba(0,0,0,0.18)" stroke="#e0bb66" strokeWidth="1.6" />
        <circle cx="60" cy="60" r="26" fill="none" stroke="#b98530" strokeWidth="0.8" />
        <g fill="#b98530">
          <path d="M60 1 L63.5 6 L60 11 L56.5 6Z" />
          <path d="M60 109 L63.5 114 L60 119 L56.5 114Z" />
          <path d="M1 60 L6 56.5 L11 60 L6 63.5Z" />
          <path d="M109 60 L114 56.5 L119 60 L114 63.5Z" />
        </g>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-accent-100">{children}</div>
    </div>
  );
}

/** Wide divider: fading rules, diamonds, dots and a central double star. */
function Flourish() {
  const uid = useId();
  return (
    <svg viewBox="0 0 320 36" className="mx-auto mt-5 h-9 w-[320px] max-w-full text-accent-500" aria-hidden="true">
      <defs>
        <linearGradient id={`${uid}-l`} x1="0" x2="1">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient id={`${uid}-r`} x1="1" x2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
      </defs>
      <path d="M4 18H112" stroke={`url(#${uid}-l)`} strokeWidth="1.6" />
      <path d="M208 18H316" stroke={`url(#${uid}-r)`} strokeWidth="1.6" />
      <path d="M4 14H96M224 14H316" stroke="currentColor" strokeOpacity="0.35" strokeWidth="0.8" />
      <g fill="currentColor">
        <path d="M118 18 L123 13 L128 18 L123 23Z" />
        <path d="M192 18 L197 13 L202 18 L197 23Z" />
        <circle cx="136" cy="18" r="2.2" />
        <circle cx="184" cy="18" r="2.2" />
        <circle cx="146" cy="18" r="1.4" />
        <circle cx="174" cy="18" r="1.4" />
        <rect x="150" y="8" width="20" height="20" />
        <rect x="150" y="8" width="20" height="20" transform="rotate(45 160 18)" />
      </g>
      <g className="fill-surface-card dark:fill-slate-900">
        <rect x="154.5" y="12.5" width="11" height="11" />
        <rect x="154.5" y="12.5" width="11" height="11" transform="rotate(45 160 18)" />
      </g>
      <circle cx="160" cy="18" r="2.8" fill="currentColor" />
    </svg>
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
        <span className="mb-2 inline-block rounded-sm border border-accent-400 bg-accent-50 px-4 py-0.5 text-sm font-bold tracking-wide text-accent-800 dark:border-accent-700/70 dark:bg-white/5 dark:text-accent-200">
          {eyebrow}
        </span>
      )}
      <h1 className="text-4xl font-bold text-brand-900 dark:text-accent-100 sm:text-5xl">{title}</h1>
      <Flourish />
      {subtitle && (
        <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}

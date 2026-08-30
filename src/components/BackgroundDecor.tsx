import React from 'react';

/**
 * Purely decorative, purely CSS background: a soft grid, a couple of blurred
 * gradient "blobs" that float gently, and a scattering of faint dots. All
 * animation is transform/opacity based (GPU-friendly) and very slow, so it
 * reads as "alive" without drawing attention or costing performance.
 */
export default function BackgroundDecor({ variant = 'default' }: { variant?: 'default' | 'compact' }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-[0.35] dark:opacity-[0.18]" />

      <div
        className="animate-float absolute -start-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/40 to-brand-600/10 blur-3xl dark:from-brand-500/20 dark:to-brand-800/10"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="animate-floatSlow absolute -end-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-accent-400/30 to-accent-600/10 blur-3xl dark:from-accent-500/15 dark:to-accent-800/10"
        style={{ animationDelay: '1.2s' }}
      />
      {variant === 'default' && (
        <>
          <div
            className="animate-float absolute bottom-0 start-1/4 h-80 w-80 rounded-full bg-gradient-to-tr from-violet-400/25 to-brand-400/10 blur-3xl dark:from-violet-500/15 dark:to-brand-500/5"
            style={{ animationDelay: '2.4s' }}
          />
          <svg
            className="absolute end-6 top-24 h-40 w-40 text-brand-300/40 dark:text-brand-500/20 sm:h-56 sm:w-56"
            viewBox="0 0 200 200"
            fill="none"
          >
            <circle cx="100" cy="100" r="99" stroke="currentColor" strokeWidth="1" strokeDasharray="4 6" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1" />
          </svg>
          <svg
            className="absolute bottom-10 start-10 h-28 w-28 text-accent-300/40 dark:text-accent-500/20 sm:h-40 sm:w-40"
            viewBox="0 0 100 100"
            fill="none"
          >
            <rect
              x="10"
              y="10"
              width="80"
              height="80"
              rx="18"
              stroke="currentColor"
              strokeWidth="1.5"
              transform="rotate(18 50 50)"
            />
          </svg>
        </>
      )}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-light dark:to-surface-dark" />
    </div>
  );
}

import React from 'react';
import { useBackground } from '../hooks/useBackground';

interface BackgroundDecorProps {
  /** `default` = the fuller hero treatment (more shapes). `compact` = a calmer version for inner pages. */
  variant?: 'default' | 'compact';
}

/**
 * Purely decorative, purely CSS background. Every page renders this once;
 * it reads the currently selected style from `useBackground()` so the whole
 * site stays visually consistent, while the small "Change Background"
 * control (see `BackgroundSwitcher`) lets a visitor cycle through a
 * handful of alternate looks. All animation is transform/opacity based
 * (GPU-friendly) and slow, so it reads as "alive" without being distracting
 * or costing performance — no images, no external assets.
 */
export default function BackgroundDecor({ variant = 'default' }: BackgroundDecorProps) {
  const { style } = useBackground();
  const full = variant === 'default';

  return (
    <div
      className="animate-bgSwitchIn pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      {style === 'aurora' && <AuroraLayer full={full} />}
      {style === 'mesh' && <MeshLayer full={full} />}
      {style === 'dots' && <DotsLayer full={full} />}
      {style === 'waves' && <WavesLayer full={full} />}
      {style === 'geometric' && <GeometricLayer full={full} />}

      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-surface-light dark:to-surface-dark" />
    </div>
  );
}

/** Grid lines + soft floating gradient blobs + faint outline rings (the original look). */
function AuroraLayer({ full }: { full: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:44px_44px] opacity-[0.35] dark:opacity-[0.18]" />
      <div
        className="animate-float absolute -start-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-brand-400/40 to-brand-600/10 blur-3xl dark:from-brand-500/20 dark:to-brand-800/10"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="animate-floatSlow absolute -end-32 top-1/4 h-96 w-96 rounded-full bg-gradient-to-br from-accent-400/30 to-accent-600/10 blur-3xl dark:from-accent-500/15 dark:to-accent-800/10"
        style={{ animationDelay: '1.2s' }}
      />
      {full && (
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
    </>
  );
}

/** Several overlapping, heavily blurred color fields that pulse — a soft "mesh gradient" look, no grid. */
function MeshLayer({ full }: { full: boolean }) {
  return (
    <>
      <div
        className="animate-pulseSoft absolute -start-20 -top-32 h-[26rem] w-[26rem] rounded-full bg-gradient-to-br from-brand-400/35 to-transparent blur-[90px] dark:from-brand-500/20"
        style={{ animationDelay: '0s' }}
      />
      <div
        className="animate-pulseSoft absolute -end-24 top-0 h-[22rem] w-[22rem] rounded-full bg-gradient-to-bl from-accent-400/30 to-transparent blur-[90px] dark:from-accent-500/18"
        style={{ animationDelay: '1.6s' }}
      />
      <div
        className="animate-pulseSoft absolute bottom-[-6rem] start-1/3 h-[24rem] w-[24rem] rounded-full bg-gradient-to-tr from-violet-400/25 to-transparent blur-[100px] dark:from-violet-500/15"
        style={{ animationDelay: '3s' }}
      />
      {full && (
        <div
          className="animate-pulseSoft absolute end-1/4 bottom-1/4 h-72 w-72 rounded-full bg-gradient-to-t from-brand-300/25 to-transparent blur-[90px] dark:from-brand-400/12"
          style={{ animationDelay: '2.1s' }}
        />
      )}
    </>
  );
}

/** A calm, minimal dot-grid with one or two very soft accent blobs. */
function DotsLayer({ full }: { full: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-dot-pattern bg-[length:22px_22px] opacity-[0.5] dark:opacity-[0.22]" />
      <div
        className="animate-floatSlow absolute -end-20 -top-16 h-80 w-80 rounded-full bg-gradient-to-br from-brand-300/25 to-transparent blur-3xl dark:from-brand-500/15"
        style={{ animationDelay: '0.4s' }}
      />
      {full && (
        <div
          className="animate-floatSlow absolute bottom-[-4rem] start-10 h-72 w-72 rounded-full bg-gradient-to-tr from-accent-300/25 to-transparent blur-3xl dark:from-accent-500/12"
          style={{ animationDelay: '2s' }}
        />
      )}
    </>
  );
}

/** Layered translucent wave shapes near the bottom, drifting slowly left/right. */
function WavesLayer({ full }: { full: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:52px_52px] opacity-[0.16] dark:opacity-[0.1]" />
      <svg
        className="animate-drift absolute inset-x-[-10%] bottom-[-4rem] h-64 w-[120%] text-brand-300/35 dark:text-brand-600/20"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,150 C200,220 400,80 600,140 C800,200 1000,90 1200,150 L1200,300 L0,300 Z" />
      </svg>
      <svg
        className="animate-driftReverse absolute inset-x-[-10%] bottom-[-6rem] h-72 w-[120%] text-accent-300/25 dark:text-accent-600/15"
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        fill="currentColor"
      >
        <path d="M0,180 C250,110 450,240 700,170 C900,120 1050,200 1200,160 L1200,300 L0,300 Z" />
      </svg>
      {full && (
        <div
          className="animate-float absolute -top-16 -end-10 h-64 w-64 rounded-full bg-gradient-to-br from-violet-300/25 to-transparent blur-3xl dark:from-violet-500/12"
          style={{ animationDelay: '1s' }}
        />
      )}
    </>
  );
}

/** Sparse rotated outline shapes (squares, rings, a triangle) over a faint grid — a clean, geometric feel. */
function GeometricLayer({ full }: { full: boolean }) {
  return (
    <>
      <div className="absolute inset-0 bg-grid-pattern bg-[length:56px_56px] opacity-[0.25] dark:opacity-[0.14]" />
      <svg
        className="animate-spinSlow absolute -start-10 -top-10 h-56 w-56 text-brand-300/40 dark:text-brand-500/20"
        viewBox="0 0 100 100"
        fill="none"
      >
        <rect x="15" y="15" width="70" height="70" rx="12" stroke="currentColor" strokeWidth="1.4" />
      </svg>
      <svg
        className="animate-float absolute end-10 top-16 h-40 w-40 text-accent-300/40 dark:text-accent-500/20"
        viewBox="0 0 100 100"
        fill="none"
      >
        <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="1.4" strokeDasharray="3 7" />
      </svg>
      {full && (
        <svg
          className="animate-spinSlow absolute bottom-10 start-1/4 h-48 w-48 text-violet-300/35 dark:text-violet-500/18"
          viewBox="0 0 100 100"
          fill="none"
          style={{ animationDirection: 'reverse' }}
        >
          <polygon points="50,10 90,85 10,85" stroke="currentColor" strokeWidth="1.4" />
        </svg>
      )}
      <div
        className="animate-pulseSoft absolute end-0 bottom-0 h-72 w-72 rounded-full bg-gradient-to-tl from-brand-400/20 to-transparent blur-3xl dark:from-brand-500/10"
        style={{ animationDelay: '1.4s' }}
      />
    </>
  );
}

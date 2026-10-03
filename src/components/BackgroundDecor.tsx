import React from 'react';

export type DecorTone = 'brand' | 'sapphire' | 'accent' | 'ruby';

/**
 * Each tool section sits on its own softly tinted "page" of the manuscript
 * (emerald, sapphire, gold or burgundy), bordered top and bottom by a frieze of
 * eight-pointed stars. `--tone-rgb` feeds the frieze fill so it matches the page.
 * Static and flat on purpose: no blur, glow or motion.
 */
const TONES: Record<DecorTone, string> = {
  brand:
    'bg-brand-600/[0.06] dark:bg-brand-400/[0.05] [--tone-rgb:18_80_67] dark:[--tone-rgb:63_151_127]',
  sapphire:
    'bg-sapphire-600/[0.07] dark:bg-sapphire-400/[0.06] [--tone-rgb:34_71_103] dark:[--tone-rgb:81_131_174]',
  accent:
    'bg-accent-400/[0.085] dark:bg-accent-400/[0.05] [--tone-rgb:138_90_28] dark:[--tone-rgb:208_160_64]',
  ruby: 'bg-ruby-600/[0.06] dark:bg-ruby-400/[0.06] [--tone-rgb:114_38_57] dark:[--tone-rgb:195_95_114]',
};

export default function BackgroundDecor({
  tone = 'brand',
}: {
  variant?: 'default' | 'compact';
  tone?: DecorTone;
}) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${TONES[tone]}`}
      aria-hidden="true"
    >
      <div className="frieze absolute inset-x-0 top-0" />
      <div className="frieze absolute inset-x-0 bottom-0" />
    </div>
  );
}

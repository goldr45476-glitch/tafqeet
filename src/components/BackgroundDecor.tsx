import React from 'react';

export type DecorTone = 'brand' | 'sapphire' | 'accent' | 'ruby';

/**
 * Each tool section sits on its own softly tinted "page" of the manuscript —
 * emerald, sapphire, gold or burgundy — framed top and bottom by a fine
 * double gold rule. Static and flat on purpose: no blur, glow or motion.
 */
const TONES: Record<DecorTone, string> = {
  brand: 'bg-brand-600/[0.06] dark:bg-brand-400/[0.05]',
  sapphire: 'bg-sapphire-600/[0.07] dark:bg-sapphire-400/[0.06]',
  accent: 'bg-accent-400/[0.14] dark:bg-accent-400/[0.05]',
  ruby: 'bg-ruby-600/[0.06] dark:bg-ruby-400/[0.06]',
};

function Rule({ position }: { position: 'top' | 'bottom' }) {
  return (
    <div className={`absolute inset-x-0 ${position === 'top' ? 'top-0' : 'bottom-0'} h-[5px]`}>
      <div className="h-px bg-accent-500/70 dark:bg-accent-500/40" />
      <div className="mt-[2px] h-px bg-accent-400/50 dark:bg-accent-500/25" />
    </div>
  );
}

export default function BackgroundDecor({
  tone = 'brand',
}: {
  variant?: 'default' | 'compact';
  tone?: DecorTone;
}) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className={`absolute inset-0 ${TONES[tone]}`} />
      <Rule position="top" />
      <Rule position="bottom" />
    </div>
  );
}

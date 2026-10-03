import React from 'react';
import { useLocale } from '../i18n';

export type SideNoteTool = 'numberToWords' | 'dateDifference' | 'financial' | 'documentHelper';

/** Half-width (px) of the tool's main grid; decides when the notes fit in the page margins. */
const SPAN: Record<SideNoteTool, 'sm' | 'md' | 'lg'> = {
  numberToWords: 'md',
  dateDifference: 'md',
  financial: 'sm',
  documentHelper: 'lg',
};

function Star() {
  return (
    <svg className="side-note__star" viewBox="0 0 40 40" aria-hidden="true">
      <g fill="currentColor">
        <rect x="9" y="9" width="22" height="22" />
        <rect x="9" y="9" width="22" height="22" transform="rotate(45 20 20)" />
      </g>
      <g className="side-note__star-core">
        <rect x="14.5" y="14.5" width="11" height="11" />
        <rect x="14.5" y="14.5" width="11" height="11" transform="rotate(45 20 20)" />
      </g>
      <circle cx="20" cy="20" r="2.6" fill="currentColor" />
    </svg>
  );
}

function Note({ side, label, text }: { side: 'r' | 'l'; label: string; text: string }) {
  return (
    <aside className={`side-note side-note--${side}`}>
      <Star />
      <span className="side-note__label">{label}</span>
      <span className="side-note__rule" aria-hidden="true" />
      <p className="side-note__text">{text}</p>
      <span className="side-note__dia" aria-hidden="true" />
    </aside>
  );
}

/**
 * Two ornamental cartouches (a proverb or maxim, and a short "why it helps"
 * note). On wide screens they stand as arched panels in the empty margins on
 * either side of the tool; on smaller screens they sit side by side beneath it.
 * The text is ordinary Unicode, so it copies and pastes cleanly.
 */
export default function SideNotes({ tool }: { tool: SideNoteTool }) {
  const { t } = useLocale();
  const n = t.sideNotes[tool];
  return (
    <div className="side-notes" data-span={SPAN[tool]}>
      <Note side="r" label={n.rightLabel} text={n.rightText} />
      <Note side="l" label={n.leftLabel} text={n.leftText} />
    </div>
  );
}

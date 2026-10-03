import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { useLocale } from '../i18n';
import { CURRENCIES } from '../utils/numberToWordsEngine';

interface CurrencySelectProps {
  id: string;
  value: string;
  onChange: (code: string) => void;
  /** Show only the currency code (e.g. "IQD") on the closed field. */
  compact?: boolean;
}

/**
 * Currency picker. A native <select> opens upward whenever the field sits
 * near the bottom of the screen, which hides the first entries and makes a
 * 30+ item list awkward — so this is a custom listbox whose panel *always*
 * opens downward, scrolls inside itself, can be searched by name or code,
 * and is fully keyboard operable (arrows, Enter, Escape, type-to-search).
 */
export default function CurrencySelect({ id, value, onChange, compact = false }: CurrencySelectProps) {
  const { locale } = useLocale();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const selected = CURRENCIES.find((c) => c.code === value) ?? CURRENCIES[0];
  const nameOf = (c: (typeof CURRENCIES)[number]) => (locale === 'ar' ? c.nameAr : c.nameEn);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return CURRENCIES;
    return CURRENCIES.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.nameAr.includes(q) ||
        c.nameEn.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q),
    );
  }, [query]);

  function openPanel() {
    setQuery('');
    setActive(Math.max(0, CURRENCIES.findIndex((c) => c.code === value)));
    setOpen(true);
  }

  function closePanel() {
    setOpen(false);
  }

  function choose(code: string) {
    onChange(code);
    closePanel();
  }

  // Focus the search box on open and keep the whole panel visible by
  // scrolling the page (never by flipping the panel upward).
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    panelRef.current?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [open]);

  // Close when clicking or tabbing away.
  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: PointerEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closePanel();
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  // Keep the highlighted option in view while arrowing through the list.
  useEffect(() => {
    if (!open) return;
    document.getElementById(`${listId}-opt-${active}`)?.scrollIntoView({ block: 'nearest' });
  }, [active, open, listId]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      closePanel();
      (rootRef.current?.querySelector('button[aria-haspopup]') as HTMLElement | null)?.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const item = filtered[active];
      if (item) choose(item.code);
    } else if (e.key === 'Tab') {
      closePanel();
    }
  }

  return (
    <div ref={rootRef} className="relative" onKeyDown={open ? onKeyDown : undefined}>
      <button
        id={id}
        type="button"
        className="field-select text-start"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        onClick={() => (open ? closePanel() : openPanel())}
        onKeyDown={(e) => {
          if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
            e.preventDefault();
            openPanel();
          }
        }}
      >
        <span className="block truncate">
          {compact ? selected.code : `${nameOf(selected)} (${selected.code})`}
        </span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute inset-x-0 top-full z-40 mt-1.5 overflow-hidden rounded-md border-2 border-accent-500 bg-surface-card shadow-[0_14px_30px_-12px_rgba(74,52,20,0.55)] dark:bg-slate-900"
        >
          <div className="border-b border-accent-300 bg-slate-100 p-2 dark:border-accent-800/60 dark:bg-slate-950">
            <input
              ref={searchRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActive(0);
              }}
              placeholder={locale === 'ar' ? 'ابحث عن عملة…' : 'Search currency…'}
              aria-label={locale === 'ar' ? 'ابحث عن عملة' : 'Search currency'}
              aria-controls={listId}
              aria-activedescendant={filtered.length ? `${listId}-opt-${active}` : undefined}
              className="field-input py-1.5 text-sm"
            />
          </div>
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1" aria-label={locale === 'ar' ? 'العملات' : 'Currencies'}>
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                {locale === 'ar' ? 'لا توجد عملة مطابقة.' : 'No matching currency.'}
              </li>
            )}
            {filtered.map((c, i) => {
              const isSelected = c.code === value;
              return (
                <li
                  key={c.code}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => choose(c.code)}
                  className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2 text-sm ${
                    i === active ? 'bg-accent-100 text-brand-900 dark:bg-white/10 dark:text-accent-100' : 'text-slate-700 dark:text-slate-200'
                  } ${isSelected ? 'font-bold' : ''}`}
                >
                  <span className="truncate">
                    {isSelected && <span className="me-2 text-accent-600 dark:text-accent-300">◆</span>}
                    {nameOf(c)}
                  </span>
                  <span dir="ltr" className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">
                    {c.code}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

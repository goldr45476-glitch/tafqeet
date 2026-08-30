import React, { useMemo, useState } from 'react';
import { useLocale } from '../i18n';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import {
  CURRENCIES,
  DEFAULT_CURRENCY_CODE,
  convertNumberToWords,
  getCurrency,
  type ConvertNumberOutcome,
} from '../utils/numberToWordsEngine';
import {
  IconChevronDown,
  IconHash,
  IconPrinter,
  IconSwap,
  IconTafqeet,
  IconTrash,
} from '../components/icons';

interface RecentEntry {
  id: string;
  rawValue: string;
  currencyCode: string | null;
  wordsAr: string;
  wordsEn: string;
  createdAt: number;
}

const HISTORY_KEY = 'adminpro_ntw_history';
const MAX_HISTORY = 12;

type Mode = 'plain' | 'currency';

export default function NumberToWordsPage() {
  const { t, locale } = useLocale();
  const { showToast } = useToast();

  const [mode, setMode] = useState<Mode>('currency');
  const [rawValue, setRawValue] = useState('1250.750');
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);
  const [displayLanguage, setDisplayLanguage] = useState<'ar' | 'en'>(locale);
  const [decimalPlacesOverride, setDecimalPlacesOverride] = useState<number | 'default'>('default');
  const [includeSubunit, setIncludeSubunit] = useState(true);
  const [addOnly, setAddOnly] = useState(true);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const [outcome, setOutcome] = useState<ConvertNumberOutcome | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [history, setHistory] = useLocalStorage<RecentEntry[]>(HISTORY_KEY, []);

  const currency = getCurrency(mode === 'currency' ? currencyCode : null);
  const effectiveDecimalPlaces =
    decimalPlacesOverride === 'default' ? (currency?.decimalPlaces ?? 2) : decimalPlacesOverride;

  function runConversion(valueOverride?: string) {
    const value = valueOverride ?? rawValue;
    const result = convertNumberToWords({
      rawValue: value,
      currencyCode: mode === 'currency' ? currencyCode : null,
      decimalPlaces: effectiveDecimalPlaces,
      includeSubunit,
      addOnly,
    });
    setOutcome(result);
    setHasSubmitted(true);

    if (result.success) {
      const entry: RecentEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        rawValue: value,
        currencyCode: mode === 'currency' ? currencyCode : null,
        wordsAr: result.wordsAr,
        wordsEn: result.wordsEn,
        createdAt: Date.now(),
      };
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));
    }
    return result;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    runConversion();
  }

  function handleClear() {
    setRawValue('');
    setOutcome(null);
    setHasSubmitted(false);
  }

  function handleSwapLanguage() {
    setDisplayLanguage((prev) => (prev === 'ar' ? 'en' : 'ar'));
  }

  function handleDeleteHistory() {
    setHistory([]);
    showToast(locale === 'ar' ? 'تم حذف السجل' : 'History cleared', 'info');
  }

  function handleReuseEntry(entry: RecentEntry) {
    setMode(entry.currencyCode ? 'currency' : 'plain');
    if (entry.currencyCode) setCurrencyCode(entry.currencyCode);
    setRawValue(entry.rawValue);
    const result = convertNumberToWords({
      rawValue: entry.rawValue,
      currencyCode: entry.currencyCode,
      includeSubunit,
      addOnly,
    });
    setOutcome(result);
    setHasSubmitted(true);
  }

  function handlePrint() {
    window.print();
  }

  const primaryWords = outcome?.success ? (displayLanguage === 'ar' ? outcome.wordsAr : outcome.wordsEn) : '';
  const numberToCopy = outcome?.success
    ? mode === 'currency' && currency
      ? `${rawValue.trim()} ${currency.code}`
      : rawValue.trim()
    : '';

  const errorMessage = useMemo(() => {
    if (!outcome || outcome.success) return null;
    if (outcome.errorKey === 'empty') return t.numberToWords.emptyNumberError;
    if (outcome.errorKey === 'too_large') return t.numberToWords.tooLargeError;
    return t.numberToWords.invalidNumberError;
  }, [outcome, t]);

  return (
    <div className="relative overflow-hidden py-10 sm:py-14">
      <BackgroundDecor variant="compact" />
      <Seo title={t.numberToWords.title} description={t.numberToWords.subtitle} />

      <div className="section-container">
        <PageHeader
          eyebrow={t.nav.tools}
          title={t.numberToWords.title}
          subtitle={t.numberToWords.subtitle}
          icon={<IconTafqeet className="h-7 w-7" />}
        />

        {/* Centered vertical flow: number -> currency -> (options) -> compact result */}
        <div className="mx-auto mt-8 max-w-2xl">
          <form onSubmit={handleSubmit} className="glass-card p-6 sm:p-9">
            <div className="mx-auto mb-5 inline-flex w-full justify-center rounded-2xl border border-slate-200 bg-slate-50 p-1 dark:border-white/10 dark:bg-white/5">
              <button
                type="button"
                onClick={() => setMode('currency')}
                className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              >
                <span
                  className={
                    mode === 'currency'
                      ? 'rounded-xl bg-white px-1 text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300'
                      : 'px-1 text-slate-500 dark:text-slate-400'
                  }
                >
                  {t.numberToWords.modeCurrency}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setMode('plain')}
                className="flex-1 rounded-xl px-4 py-2 text-sm font-semibold transition-all"
              >
                <span
                  className={
                    mode === 'plain'
                      ? 'rounded-xl bg-white px-1 text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300'
                      : 'px-1 text-slate-500 dark:text-slate-400'
                  }
                >
                  {t.numberToWords.modePlain}
                </span>
              </button>
            </div>

            {/* 1. Number input — centered, large */}
            <label className="field-label text-center" htmlFor="ntw-input">
              {t.numberToWords.inputLabel}
            </label>
            <input
              id="ntw-input"
              type="text"
              inputMode="decimal"
              dir="ltr"
              className="field-input text-center text-2xl font-bold tracking-wide sm:text-3xl"
              placeholder={t.numberToWords.inputPlaceholder}
              value={rawValue}
              onChange={(e) => setRawValue(e.target.value)}
              aria-invalid={!!errorMessage}
              aria-describedby={errorMessage ? 'ntw-error' : undefined}
            />
            {errorMessage && (
              <p
                id="ntw-error"
                role="alert"
                className="mt-2 text-center text-sm font-medium text-red-600 dark:text-red-400"
              >
                {errorMessage}
              </p>
            )}

            {/* 2. Currency select — directly below the number */}
            {mode === 'currency' && (
              <div className="mt-5">
                <label className="field-label text-center" htmlFor="ntw-currency">
                  {t.numberToWords.currencyLabel}
                </label>
                <select
                  id="ntw-currency"
                  className="field-select text-center text-base font-semibold"
                  value={currencyCode}
                  onChange={(e) => setCurrencyCode(e.target.value)}
                >
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {locale === 'ar' ? c.nameAr : c.nameEn} ({c.code})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Collapsible advanced options */}
            <button
              type="button"
              onClick={() => setOptionsOpen((v) => !v)}
              className="mx-auto mt-6 flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800 dark:text-brand-300 dark:hover:text-brand-200"
              aria-expanded={optionsOpen}
            >
              {t.numberToWords.optionsToggle}
              <IconChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${optionsOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {optionsOpen && (
              <div className="animate-fadeInUp mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="field-label" htmlFor="ntw-language">
                    {t.numberToWords.languageLabel}
                  </label>
                  <select
                    id="ntw-language"
                    className="field-select"
                    value={displayLanguage}
                    onChange={(e) => setDisplayLanguage(e.target.value as 'ar' | 'en')}
                  >
                    <option value="ar">{t.common.langSwitchAr}</option>
                    <option value="en">{t.common.langSwitchEn}</option>
                  </select>
                </div>

                <div>
                  <label className="field-label" htmlFor="ntw-decimals">
                    {t.numberToWords.decimalPlacesLabel}
                  </label>
                  <select
                    id="ntw-decimals"
                    className="field-select"
                    value={decimalPlacesOverride}
                    onChange={(e) =>
                      setDecimalPlacesOverride(e.target.value === 'default' ? 'default' : Number(e.target.value))
                    }
                  >
                    <option value="default">
                      {locale === 'ar' ? 'افتراضي' : 'Default'} ({currency?.decimalPlaces ?? 2})
                    </option>
                    {[0, 1, 2, 3, 4].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col justify-end gap-3 sm:col-span-2 sm:flex-row sm:justify-center sm:gap-8">
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
                      checked={includeSubunit}
                      onChange={(e) => setIncludeSubunit(e.target.checked)}
                      disabled={mode !== 'currency' || !currency?.minor}
                    />
                    {t.numberToWords.includeSubunitLabel}
                  </label>
                  <label className="inline-flex cursor-pointer items-center gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800"
                      checked={addOnly}
                      onChange={(e) => setAddOnly(e.target.checked)}
                    />
                    {t.numberToWords.addOnlyLabel}
                  </label>
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="submit" className="btn-primary">
                <IconTafqeet className="h-4 w-4" />
                {t.numberToWords.convertButton}
              </button>
              <button type="button" onClick={handleClear} className="btn-secondary">
                {t.numberToWords.clearButton}
              </button>
              <button type="button" onClick={handleSwapLanguage} className="btn-secondary">
                <IconSwap className="h-4 w-4" />
                {t.numberToWords.swapLanguageButton}
              </button>
            </div>
          </form>

          {/* 3. Compact, centered result box below the form — number, words, and
              copy actions all sit close together so this never needs much
              scrolling, even with the options panel open above it. */}
          <div className="result-box mt-6 px-5 py-6 text-center sm:px-10 sm:py-7" id="print-area">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              {t.numberToWords.resultTitle}
            </h2>

            {outcome?.success ? (
              <>
                <p dir="ltr" className="mt-1.5 font-mono text-base font-semibold text-slate-500 dark:text-slate-400">
                  {numberToCopy}
                </p>
                <p
                  dir={displayLanguage === 'ar' ? 'rtl' : 'ltr'}
                  className="mx-auto mt-2 max-w-xl text-2xl font-bold leading-9 text-slate-900 dark:text-white sm:text-3xl sm:leading-[1.5]"
                >
                  {primaryWords}
                </p>
              </>
            ) : (
              <p className="mt-3 text-sm leading-6 text-slate-400 dark:text-slate-500">
                {hasSubmitted && errorMessage ? errorMessage : t.numberToWords.resultPlaceholder}
              </p>
            )}

            <div className="no-print mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <CopyButton
                text={numberToCopy}
                label={t.numberToWords.copyNumberButton}
                toastMessage={t.common.copiedNumber}
                icon={<IconHash className="h-4 w-4" />}
                disabled={!outcome?.success}
              />
              <CopyButton
                text={primaryWords}
                label={t.numberToWords.copyTafqeetButton}
                toastMessage={t.common.copiedTafqeet}
                disabled={!outcome?.success}
              />
              <button
                type="button"
                onClick={handlePrint}
                disabled={!outcome?.success}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconPrinter className="h-4 w-4" />
                {t.numberToWords.printButton}
              </button>
            </div>

            <div className="no-print mt-2.5 flex flex-wrap items-center justify-center gap-2">
              <CopyButton
                text={outcome?.success ? outcome.wordsAr : ''}
                label={t.numberToWords.copyArabicButton}
                variant="secondary"
                className="!px-3.5 !py-1.5 text-xs"
                disabled={!outcome?.success}
              />
              <CopyButton
                text={outcome?.success ? outcome.wordsEn : ''}
                label={t.numberToWords.copyEnglishButton}
                variant="secondary"
                className="!px-3.5 !py-1.5 text-xs"
                disabled={!outcome?.success}
              />
            </div>
          </div>

          {/* ---------------- Recent conversions ---------------- */}
          <div className="glass-card no-print mt-6 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {t.numberToWords.recentConversionsTitle}
              </h3>
              {history.length > 0 && (
                <button
                  type="button"
                  onClick={handleDeleteHistory}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 dark:text-red-400"
                >
                  <IconTrash className="h-3.5 w-3.5" />
                  {t.numberToWords.deleteHistoryButton}
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <p className="text-sm text-slate-400 dark:text-slate-500">{t.numberToWords.emptyHistory}</p>
            ) : (
              <ul className="space-y-2.5">
                {history.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => handleReuseEntry(entry)}
                      className="w-full rounded-xl border border-slate-100 bg-slate-50/60 px-3.5 py-2.5 text-start text-xs transition-colors hover:border-brand-200 hover:bg-brand-50/60 dark:border-white/5 dark:bg-white/5 dark:hover:border-brand-800/50 dark:hover:bg-brand-500/10"
                    >
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-200" dir="ltr">
                        {entry.rawValue}
                        {entry.currencyCode ? ` ${entry.currencyCode}` : ''}
                      </span>
                      <p
                        dir={locale === 'ar' ? 'rtl' : 'ltr'}
                        className="mt-1 line-clamp-2 text-slate-500 dark:text-slate-400"
                      >
                        {locale === 'ar' ? entry.wordsAr : entry.wordsEn}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

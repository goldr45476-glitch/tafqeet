import React, { useEffect, useMemo, useState } from 'react';
import { useLocale } from '../i18n';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import { DOCUMENT_TYPES, getDocumentType, type DocumentTypeId } from '../data/documentTypes';
import {
  composeDocument,
  computeAmountInfo,
  emptyDocumentValues,
  substituteAmountToken,
  type DocumentFieldValues,
} from '../utils/documentComposer';
import { CURRENCIES, DEFAULT_CURRENCY_CODE } from '../utils/numberToWordsEngine';
import { todayISO } from '../utils/dateUtils';
import {
  IconAlignCenter,
  IconAlignJustify,
  IconAlignLeft,
  IconAlignRight,
  IconBold,
  IconBookmark,
  IconDirection,
  IconDocument,
  IconInfo,
  IconItalic,
  IconLayoutTemplate,
  IconLineHeight,
  IconPrinter,
  IconTrash,
  IconType,
  IconUnderline,
} from '../components/icons';

type FontFamilyId = 'notoSansArabic' | 'cairo' | 'tajawal' | 'arial' | 'timesNewRoman';
type Align = 'right' | 'center' | 'left' | 'justify';
type Direction = 'rtl' | 'ltr';

interface StyleSettings {
  fontFamily: FontFamilyId;
  fontSize: number;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  align: Align;
  lineHeight: number;
  letterSpacing: number;
  direction: Direction;
}

const FONT_STACKS: Record<FontFamilyId, string> = {
  notoSansArabic: `'Noto Sans Arabic', 'Segoe UI', sans-serif`,
  cairo: `'Cairo', 'Segoe UI', sans-serif`,
  tajawal: `'Tajawal', 'Segoe UI', sans-serif`,
  arial: `Arial, 'Helvetica Neue', sans-serif`,
  timesNewRoman: `'Times New Roman', Times, serif`,
};
const FONT_LABELS: Record<FontFamilyId, string> = {
  notoSansArabic: 'Noto Sans Arabic',
  cairo: 'Cairo',
  tajawal: 'Tajawal',
  arial: 'Arial',
  timesNewRoman: 'Times New Roman',
};
const FONT_IDS = Object.keys(FONT_STACKS) as FontFamilyId[];
const FONT_SIZES = [12, 13, 14, 15, 16, 17, 18, 20, 22, 24];
const LINE_HEIGHTS = [1.4, 1.6, 1.8, 1.9, 2, 2.2, 2.5];
const LETTER_SPACINGS = [0, 0.5, 1, 1.5, 2, 3];
const MAX_PRESETS = 2;

function defaultStyle(dir: Direction): StyleSettings {
  return {
    fontFamily: 'cairo',
    fontSize: 15,
    bold: false,
    italic: false,
    underline: false,
    align: dir === 'rtl' ? 'right' : 'left',
    lineHeight: 1.9,
    letterSpacing: 0,
    direction: dir,
  };
}

const VALUES_KEY = 'adminpro_doc_values';
const TYPE_KEY = 'adminpro_doc_type';
const STYLE_KEY = 'adminpro_doc_style';
const CLOSING_TOUCHED_KEY = 'adminpro_doc_closing_touched';
const PRESETS_KEY = 'adminpro_doc_explanation_presets';

function ToolbarToggle({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        active
          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-700/60 dark:bg-brand-500/15 dark:text-brand-300'
          : 'border-slate-200 bg-white text-slate-500 hover:text-slate-800 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:text-slate-100'
      }`}
    >
      {children}
    </button>
  );
}

function StyleToolbar({ style, onChange }: { style: StyleSettings; onChange: (next: StyleSettings) => void }) {
  const { t } = useLocale();
  const s = t.documentHelper.styleToolbar;
  const set = <K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) =>
    onChange({ ...style, [key]: value });

  const alignOptions: { id: Align; icon: React.ComponentType<{ className?: string }>; label: string }[] = [
    { id: 'right', icon: IconAlignRight, label: s.alignRight },
    { id: 'center', icon: IconAlignCenter, label: s.alignCenter },
    { id: 'left', icon: IconAlignLeft, label: s.alignLeft },
    { id: 'justify', icon: IconAlignJustify, label: s.alignJustify },
  ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-slate-800 dark:text-slate-100">
        <IconType className="h-4 w-4 text-brand-600 dark:text-brand-400" />
        {s.title}
      </h3>

      <div className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="doc-style-font">
          {s.fontFamily}
        </label>
        <select
          id="doc-style-font"
          className="field-select h-9 !w-auto min-w-[9.5rem] !py-0 text-xs"
          value={style.fontFamily}
          onChange={(e) => set('fontFamily', e.target.value as FontFamilyId)}
        >
          {FONT_IDS.map((id) => (
            <option key={id} value={id}>
              {FONT_LABELS[id]}
            </option>
          ))}
        </select>

        <label className="sr-only" htmlFor="doc-style-size">
          {s.fontSize}
        </label>
        <select
          id="doc-style-size"
          className="field-select h-9 !w-auto !py-0 text-xs"
          value={style.fontSize}
          onChange={(e) => set('fontSize', Number(e.target.value))}
          title={s.fontSize}
        >
          {FONT_SIZES.map((n) => (
            <option key={n} value={n}>
              {n}px
            </option>
          ))}
        </select>

        <div className="flex items-center gap-1.5">
          <ToolbarToggle active={style.bold} onClick={() => set('bold', !style.bold)} title={s.bold}>
            <IconBold className="h-4 w-4" />
          </ToolbarToggle>
          <ToolbarToggle active={style.italic} onClick={() => set('italic', !style.italic)} title={s.italic}>
            <IconItalic className="h-4 w-4" />
          </ToolbarToggle>
          <ToolbarToggle
            active={style.underline}
            onClick={() => set('underline', !style.underline)}
            title={s.underline}
          >
            <IconUnderline className="h-4 w-4" />
          </ToolbarToggle>
        </div>

        <div className="flex items-center gap-1.5">
          {alignOptions.map((opt) => (
            <ToolbarToggle key={opt.id} active={style.align === opt.id} onClick={() => set('align', opt.id)} title={opt.label}>
              <opt.icon className="h-4 w-4" />
            </ToolbarToggle>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <IconLineHeight className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <select
            aria-label={s.lineHeight}
            title={s.lineHeight}
            className="field-select h-9 !w-auto !py-0 text-xs"
            value={style.lineHeight}
            onChange={(e) => set('lineHeight', Number(e.target.value))}
          >
            {LINE_HEIGHTS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-400" aria-hidden="true">
            ↔
          </span>
          <select
            aria-label={s.letterSpacing}
            title={s.letterSpacing}
            className="field-select h-9 !w-auto !py-0 text-xs"
            value={style.letterSpacing}
            onChange={(e) => set('letterSpacing', Number(e.target.value))}
          >
            {LETTER_SPACINGS.map((n) => (
              <option key={n} value={n}>
                {n}px
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1.5">
          <IconDirection className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={() => set('direction', 'rtl')}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                style.direction === 'rtl'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-800 dark:bg-white/5 dark:text-slate-400'
              }`}
            >
              {s.directionRtl}
            </button>
            <button
              type="button"
              onClick={() => set('direction', 'ltr')}
              className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                style.direction === 'ltr'
                  ? 'bg-brand-600 text-white'
                  : 'bg-white text-slate-500 hover:text-slate-800 dark:bg-white/5 dark:text-slate-400'
              }`}
            >
              {s.directionLtr}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DocumentHelperPage() {
  const { t, locale } = useLocale();
  const { showToast } = useToast();

  const [docType, setDocType] = useLocalStorage<DocumentTypeId>(TYPE_KEY, 'paymentRequest');
  const [values, setValues] = useLocalStorage<DocumentFieldValues>(
    VALUES_KEY,
    emptyDocumentValues({ date: todayISO(), currencyCode: DEFAULT_CURRENCY_CODE }),
  );
  const [style, setStyle] = useLocalStorage<StyleSettings>(STYLE_KEY, defaultStyle(locale === 'ar' ? 'rtl' : 'ltr'));
  const [closingTouched, setClosingTouched] = useLocalStorage<boolean>(CLOSING_TOUCHED_KEY, false);
  const [presets, setPresets] = useLocalStorage<string[]>(PRESETS_KEY, []);

  // Pre-fill the (fully editable) closing phrase with a sensible per-type
  // default whenever the type changes — but only while the user hasn't
  // customized it themselves, so we never clobber their own wording.
  useEffect(() => {
    if (closingTouched) return;
    const def = getDocumentType(docType).defaultClosingPhrase[locale];
    setValues((prev) => (prev.closingPhrase === def ? prev : { ...prev, closingPhrase: def }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docType, locale]);

  function updateField<K extends keyof DocumentFieldValues>(key: K, value: DocumentFieldValues[K]) {
    if (key === 'closingPhrase') setClosingTouched(true);
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  function handleClear() {
    setValues(emptyDocumentValues({ date: todayISO(), currencyCode: values.currencyCode || DEFAULT_CURRENCY_CODE }));
    setClosingTouched(false);
    showToast(t.common.reset, 'info');
  }

  function handleSavePreset() {
    const text = values.explanation.trim();
    if (!text) return;
    setPresets((prev) => {
      const withoutDup = prev.filter((p) => p !== text);
      return [text, ...withoutDup].slice(0, MAX_PRESETS);
    });
    showToast(t.documentHelper.presetSavedToast, 'success');
  }

  function handleUsePreset(text: string) {
    updateField('explanation', text);
  }

  function handleDeletePreset(text: string) {
    setPresets((prev) => prev.filter((p) => p !== text));
  }

  function handlePrint() {
    window.print();
  }

  const amountInfo = useMemo(
    () => computeAmountInfo(values.amount, values.currencyCode, locale),
    [values.amount, values.currencyCode, locale],
  );

  const composerLabels = {
    referenceNumber: t.documentHelper.fields.referenceNumber,
    date: t.documentHelper.fields.date,
    subject: t.documentHelper.fields.subject,
    amountBlockLabel: t.documentHelper.amountBlockLabel,
    tafqeetBlockLabel: t.documentHelper.tafqeetBlockLabel,
  };

  const fullText = useMemo(
    () => composeDocument(values, locale, composerLabels),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, locale],
  );
  const bodyOnlyText = useMemo(
    () => composeDocument(values, locale, composerLabels, { bodyOnly: true }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [values, locale],
  );

  const hasAnyContent = Boolean(
    values.recipient.trim() ||
      values.subject.trim() ||
      values.explanation.trim() ||
      values.reason.trim() ||
      values.closingPhrase.trim(),
  );

  const previewExplanation = substituteAmountToken(values.explanation.trim(), amountInfo);
  const previewReason = substituteAmountToken(values.reason.trim(), amountInfo);
  const previewClosing = substituteAmountToken(values.closingPhrase.trim(), amountInfo);

  const sheetFontStyle: React.CSSProperties = {
    fontFamily: FONT_STACKS[style.fontFamily],
    fontSize: `${style.fontSize}px`,
    fontWeight: style.bold ? 700 : 400,
    fontStyle: style.italic ? 'italic' : 'normal',
    textDecoration: style.underline ? 'underline' : 'none',
    lineHeight: style.lineHeight,
    letterSpacing: `${style.letterSpacing}px`,
  };
  const bodyStyle: React.CSSProperties = { ...sheetFontStyle, textAlign: style.align };
  const cornerStyle: React.CSSProperties = { ...sheetFontStyle, textAlign: 'start' };

  return (
    <div className="relative overflow-hidden py-14 sm:py-20">
      <BackgroundDecor variant="compact" />
      <Seo title={t.documentHelper.title} description={t.documentHelper.subtitle} />

      <div className="section-container">
        <PageHeader
          eyebrow={t.nav.tools}
          title={t.documentHelper.title}
          subtitle={t.documentHelper.subtitle}
          icon={<IconDocument className="h-7 w-7" />}
        />

        <div className="mx-auto mt-10 flex max-w-3xl items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4 text-sm text-amber-800 dark:border-amber-800/40 dark:bg-amber-500/10 dark:text-amber-300">
          <IconInfo className="mt-0.5 h-5 w-5 shrink-0" />
          <p>{t.documentHelper.disclaimer}</p>
        </div>

        <div className="mx-auto mt-8 grid max-w-7xl grid-cols-1 gap-8 xl:grid-cols-2">
          {/* ---------------- Form ---------------- */}
          <div className="glass-card space-y-6 p-6 sm:p-8">
            <div>
              <label className="field-label flex items-center gap-1.5" htmlFor="doc-type">
                <IconLayoutTemplate className="h-4 w-4 text-brand-600 dark:text-brand-400" />
                {t.documentHelper.documentTypeLabel}
              </label>
              <select
                id="doc-type"
                className="field-select"
                value={docType}
                onChange={(e) => setDocType(e.target.value as DocumentTypeId)}
              >
                {DOCUMENT_TYPES.map((dt) => (
                  <option key={dt.id} value={dt.id}>
                    {t.documentHelper.documentTypes[dt.id]}
                  </option>
                ))}
              </select>
            </div>

            {/* Reference & date */}
            <div>
              <p className="field-label mb-2">{t.documentHelper.referenceAndDate}</p>
              <div className="grid grid-cols-2 gap-3">
                <input
                  aria-label={t.documentHelper.fields.referenceNumber}
                  type="text"
                  className="field-input"
                  placeholder={t.documentHelper.placeholders.referenceNumber}
                  value={values.referenceNumber}
                  onChange={(e) => updateField('referenceNumber', e.target.value)}
                />
                <input
                  aria-label={t.documentHelper.fields.date}
                  type="date"
                  className="field-input"
                  value={values.date}
                  onChange={(e) => updateField('date', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="doc-recipient">
                {t.documentHelper.fields.recipient}
              </label>
              <input
                id="doc-recipient"
                type="text"
                className="field-input"
                placeholder={t.documentHelper.placeholders.recipient}
                value={values.recipient}
                onChange={(e) => updateField('recipient', e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="doc-subject">
                {t.documentHelper.fields.subject}
              </label>
              <input
                id="doc-subject"
                type="text"
                className="field-input font-semibold"
                placeholder={t.documentHelper.placeholders.subject}
                value={values.subject}
                onChange={(e) => updateField('subject', e.target.value)}
              />
            </div>

            {/* Amount + currency */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-white/5">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="field-label" htmlFor="doc-amount">
                    {t.documentHelper.fields.amount}
                  </label>
                  <input
                    id="doc-amount"
                    type="text"
                    inputMode="decimal"
                    dir="ltr"
                    className="field-input"
                    value={values.amount}
                    onChange={(e) => updateField('amount', e.target.value)}
                  />
                </div>
                <div>
                  <label className="field-label" htmlFor="doc-currency">
                    {t.documentHelper.fields.currency}
                  </label>
                  <select
                    id="doc-currency"
                    className="field-select"
                    value={values.currencyCode}
                    onChange={(e) => updateField('currencyCode', e.target.value)}
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {amountInfo.hasAmount && (
                <div className="mt-3 rounded-xl bg-white/70 p-3 dark:bg-slate-900/40">
                  <p dir={locale === 'ar' ? 'rtl' : 'ltr'} className="text-xs leading-6 text-slate-600 dark:text-slate-300">
                    <span className="font-semibold text-brand-700 dark:text-brand-300">
                      {t.documentHelper.tafqeetBlockLabel}:
                    </span>{' '}
                    {amountInfo.tafqeetText}
                  </p>
                  <div className="no-print mt-2 flex flex-wrap gap-1.5">
                    <CopyButton
                      text={amountInfo.numberText}
                      label={t.common.copyNumber}
                      toastMessage={t.common.copiedNumber}
                      variant="secondary"
                      className="!px-2.5 !py-1 text-[11px]"
                    />
                    <CopyButton
                      text={amountInfo.tafqeetText}
                      label={t.common.copyTafqeet}
                      toastMessage={t.common.copiedTafqeet}
                      variant="secondary"
                      className="!px-2.5 !py-1 text-[11px]"
                    />
                  </div>
                </div>
              )}
              <p className="mt-2 text-[11px] leading-5 text-slate-400 dark:text-slate-500">
                {t.documentHelper.amountHint}
              </p>
            </div>

            <div>
              <label className="field-label" htmlFor="doc-explanation">
                {t.documentHelper.fields.explanation}
              </label>
              <textarea
                id="doc-explanation"
                className="field-input min-h-[120px] resize-y"
                placeholder={t.documentHelper.placeholders.explanation}
                value={values.explanation}
                onChange={(e) => updateField('explanation', e.target.value)}
              />
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <button type="button" onClick={handleSavePreset} className="btn-ghost !px-2.5 !py-1.5 text-xs">
                  <IconBookmark className="h-3.5 w-3.5" />
                  {t.documentHelper.savePresetButton}
                </button>
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {t.documentHelper.presetLimitNote}
                </span>
              </div>

              <div className="mt-2 rounded-xl border border-slate-100 bg-slate-50/60 p-3 dark:border-white/5 dark:bg-white/5">
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300">
                  <IconBookmark className="h-3.5 w-3.5 text-brand-600 dark:text-brand-400" />
                  {t.documentHelper.savedExplanations}
                </p>
                {presets.length === 0 ? (
                  <p className="text-xs text-slate-400 dark:text-slate-500">{t.documentHelper.presetEmpty}</p>
                ) : (
                  <ul className="space-y-1.5">
                    {presets.map((preset) => (
                      <li
                        key={preset}
                        className="flex items-center gap-2 rounded-lg bg-white px-2.5 py-1.5 text-xs dark:bg-slate-900/40"
                      >
                        <span
                          dir={locale === 'ar' ? 'rtl' : 'ltr'}
                          className="line-clamp-1 flex-1 text-slate-600 dark:text-slate-300"
                          title={preset}
                        >
                          {preset}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUsePreset(preset)}
                          className="shrink-0 font-semibold text-brand-600 hover:text-brand-800 dark:text-brand-400"
                        >
                          {t.documentHelper.loadPreset}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePreset(preset)}
                          aria-label={t.documentHelper.deletePreset}
                          className="shrink-0 text-slate-400 hover:text-red-600 dark:text-slate-500 dark:hover:text-red-400"
                        >
                          <IconTrash className="h-3.5 w-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div>
              <label className="field-label" htmlFor="doc-reason">
                {t.documentHelper.fields.reason}
              </label>
              <textarea
                id="doc-reason"
                className="field-input min-h-[80px] resize-y"
                placeholder={t.documentHelper.placeholders.reason}
                value={values.reason}
                onChange={(e) => updateField('reason', e.target.value)}
              />
            </div>

            <div>
              <label className="field-label" htmlFor="doc-closing">
                {t.documentHelper.fields.closingPhrase}
              </label>
              <textarea
                id="doc-closing"
                className="field-input min-h-[70px] resize-y text-center"
                placeholder={t.documentHelper.placeholders.closingPhrase}
                value={values.closingPhrase}
                onChange={(e) => updateField('closingPhrase', e.target.value)}
              />
            </div>

            {/* Signature block */}
            <div>
              <p className="field-label mb-2">{t.documentHelper.signatureBlock}</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <input
                  aria-label={t.documentHelper.fields.position}
                  type="text"
                  className="field-input"
                  placeholder={t.documentHelper.placeholders.position}
                  value={values.position}
                  onChange={(e) => updateField('position', e.target.value)}
                />
                <input
                  aria-label={t.documentHelper.fields.employeeName}
                  type="text"
                  className="field-input font-semibold"
                  placeholder={t.documentHelper.placeholders.employeeName}
                  value={values.employeeName}
                  onChange={(e) => updateField('employeeName', e.target.value)}
                />
              </div>
            </div>

            <StyleToolbar style={style} onChange={setStyle} />

            <button type="button" onClick={handleClear} className="btn-secondary w-full">
              <IconTrash className="h-4 w-4" />
              {t.common.clear}
            </button>
          </div>

          {/* ---------------- A4 live preview ---------------- */}
          <div>
            <h2 className="no-print mb-3 text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
              {t.documentHelper.previewTitle}
            </h2>

            <div className="mx-auto w-full max-w-[720px]">
              <div
                id="print-area"
                dir={style.direction}
                style={sheetFontStyle}
                className="relative mx-auto aspect-[210/297] w-full overflow-hidden rounded-sm bg-white text-slate-900 shadow-2xl ring-1 ring-slate-900/10"
              >
                {!hasAnyContent && !amountInfo.hasAmount ? (
                  <p className="absolute inset-0 flex items-center justify-center p-10 text-center text-sm text-slate-400">
                    {t.documentHelper.resultPlaceholder}
                  </p>
                ) : (
                  <>
                    <div style={cornerStyle} className="absolute left-[7%] top-[6%] max-w-[40%] text-[0.72em]">
                      {values.referenceNumber.trim() && (
                        <p>
                          <strong>{t.documentHelper.fields.referenceNumber}:</strong> {values.referenceNumber.trim()}
                        </p>
                      )}
                      {values.date.trim() && (
                        <p className="mt-0.5">
                          <strong>{t.documentHelper.fields.date}:</strong> {values.date.trim()}
                        </p>
                      )}
                    </div>

                    <div className="absolute inset-x-[7%] bottom-[6%] top-[16%] flex flex-col overflow-hidden">
                      <div style={cornerStyle} className="shrink-0">
                        {values.recipient.trim() && <p className="whitespace-pre-wrap">{values.recipient.trim()}</p>}
                      </div>

                      {values.subject.trim() && (
                        <p className="mt-4 shrink-0 rounded-md bg-brand-50 px-3 py-1.5 text-center font-bold text-brand-800">
                          {t.documentHelper.fields.subject}: {values.subject.trim()}
                        </p>
                      )}

                      <div style={bodyStyle} className="mt-4 flex-1 space-y-4 overflow-hidden whitespace-pre-wrap">
                        {previewExplanation && <p>{previewExplanation}</p>}
                        {previewReason && <p>{previewReason}</p>}
                      </div>

                      {previewClosing && (
                        <p style={{ ...sheetFontStyle, textAlign: 'center' }} className="mt-4 shrink-0">
                          {previewClosing}
                        </p>
                      )}

                      {amountInfo.hasAmount && (
                        <div className="mt-4 shrink-0 text-center text-[0.8em]">
                          <p>
                            <strong>{t.documentHelper.amountBlockLabel}:</strong> {amountInfo.numberText}
                          </p>
                          <p className="mt-0.5 text-[0.9em]">
                            <strong>{t.documentHelper.tafqeetBlockLabel}:</strong> {amountInfo.tafqeetText}
                          </p>
                        </div>
                      )}
                    </div>

                    <div style={cornerStyle} className="absolute bottom-[6%] left-[7%] max-w-[45%] text-[0.85em]">
                      {values.position.trim() && <p>{values.position.trim()}</p>}
                      {values.employeeName.trim() && <p className="mt-1 font-semibold">{values.employeeName.trim()}</p>}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="no-print mt-6 flex flex-wrap items-center justify-center gap-2.5">
              <CopyButton text={fullText} label={t.documentHelper.copyFullButton} disabled={!fullText} />
              <CopyButton
                text={bodyOnlyText}
                label={t.documentHelper.copyBodyButton}
                variant="secondary"
                disabled={!bodyOnlyText}
              />
              <button
                type="button"
                onClick={handlePrint}
                disabled={!hasAnyContent}
                className="btn-secondary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <IconPrinter className="h-4 w-4" />
                {t.documentHelper.printButton}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

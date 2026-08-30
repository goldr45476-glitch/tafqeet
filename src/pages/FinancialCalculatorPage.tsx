import React, { useState } from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import CopyButton from '../components/CopyButton';
import {
  decreaseByPercent,
  increaseByPercent,
  percentDifference,
  percentOf,
  profitLoss,
  vatForward,
  vatReverse,
} from '../utils/financialUtils';
import { CURRENCIES, DEFAULT_CURRENCY_CODE, convertNumberToWords } from '../utils/numberToWordsEngine';
import { IconFinancial } from '../components/icons';

type Tab = 'percentage' | 'vat' | 'profit';
type PercentMode = 'of' | 'increase' | 'decrease' | 'change';
type VatDirection = 'forward' | 'reverse';

function parseNum(value: string): number | null {
  if (value.trim() === '') return null;
  const n = Number(value.replace(/,/g, ''));
  return Number.isFinite(n) ? n : null;
}

function fmt(n: number, locale: string): string {
  return n.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US', { maximumFractionDigits: 4 });
}

/** A non-monetary result (a percentage, a ratio) — no currency, no Tafqeet. */
function ResultTile({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={`rounded-2xl border p-5 text-center shadow-sm ${
        highlight
          ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 dark:border-brand-800/50 dark:from-brand-500/10 dark:to-accent-500/10'
          : 'border-white/70 bg-white/70 dark:border-white/10 dark:bg-white/5'
      }`}
    >
      <p
        className={`text-2xl font-bold ${highlight ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-100'}`}
      >
        {value}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>
    </div>
  );
}

/**
 * A monetary result: the formatted amount, a smaller "mini-Tafqeet" line
 * underneath written out in the selected currency, and its own independent
 * Copy Result / Copy Tafqeet controls — every important money figure gets
 * this treatment, not just the headline one.
 */
function AmountResultTile({
  label,
  amount,
  currencyCode,
  highlight = false,
}: {
  label: string;
  amount: number;
  currencyCode: string;
  highlight?: boolean;
}) {
  const { t, locale } = useLocale();
  const numberText = fmt(amount, locale);
  const outcome = convertNumberToWords({
    rawValue: amount.toFixed(6),
    currencyCode,
    includeSubunit: true,
    addOnly: false,
  });
  const words = outcome.success ? (locale === 'ar' ? outcome.wordsAr : outcome.wordsEn) : '';

  return (
    <div
      className={`rounded-2xl border p-5 text-center shadow-sm ${
        highlight
          ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 dark:border-brand-800/50 dark:from-brand-500/10 dark:to-accent-500/10'
          : 'border-white/70 bg-white/70 dark:border-white/10 dark:bg-white/5'
      }`}
    >
      <p
        dir="ltr"
        className={`text-2xl font-bold ${highlight ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-100'}`}
      >
        {numberText}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>

      {words && (
        <p
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="mt-3 border-t border-slate-200/70 pt-3 text-[11px] leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400"
        >
          <span className="font-semibold text-brand-600 dark:text-brand-400">{t.financial.tafqeetLabel}: </span>
          {words}
        </p>
      )}

      <div className="no-print mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <CopyButton
          text={numberText}
          label={t.common.copyResult}
          toastMessage={t.common.copiedResult}
          variant="secondary"
          className="!px-2.5 !py-1 text-[11px]"
        />
        <CopyButton
          text={words}
          label={t.common.copyTafqeet}
          toastMessage={t.common.copiedTafqeet}
          variant="secondary"
          className="!px-2.5 !py-1 text-[11px]"
          disabled={!words}
        />
      </div>
    </div>
  );
}

/**
 * A percentage-only result (a ratio, a margin, a rate of change) — no
 * currency involved, but still gets its own mini-Tafqeet line (as a plain
 * number, e.g. "خمسة عشر فاصلة خمسة") and its own Copy Result / Copy
 * Tafqeet controls, exactly like AmountResultTile does for monetary values.
 */
function PercentResultTile({ label, value, highlight = false }: { label: string; value: number; highlight?: boolean }) {
  const { t, locale } = useLocale();
  const valueText = `${fmt(value, locale)}%`;
  const outcome = convertNumberToWords({
    rawValue: Math.abs(value).toFixed(4),
    currencyCode: null,
    addOnly: false,
  });
  const words = outcome.success ? (locale === 'ar' ? outcome.wordsAr : outcome.wordsEn) : '';

  return (
    <div
      className={`rounded-2xl border p-5 text-center shadow-sm ${
        highlight
          ? 'border-brand-200 bg-gradient-to-br from-brand-50 to-accent-50 dark:border-brand-800/50 dark:from-brand-500/10 dark:to-accent-500/10'
          : 'border-white/70 bg-white/70 dark:border-white/10 dark:bg-white/5'
      }`}
    >
      <p
        dir="ltr"
        className={`text-2xl font-bold ${highlight ? 'text-brand-700 dark:text-brand-300' : 'text-slate-800 dark:text-slate-100'}`}
      >
        {valueText}
      </p>
      <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{label}</p>

      {words && (
        <p
          dir={locale === 'ar' ? 'rtl' : 'ltr'}
          className="mt-3 border-t border-slate-200/70 pt-3 text-[11px] leading-5 text-slate-500 dark:border-white/10 dark:text-slate-400"
        >
          <span className="font-semibold text-brand-600 dark:text-brand-400">{t.financial.tafqeetLabel}: </span>
          {words}
        </p>
      )}

      <div className="no-print mt-3 flex flex-wrap items-center justify-center gap-1.5">
        <CopyButton
          text={valueText}
          label={t.common.copyResult}
          toastMessage={t.common.copiedResult}
          variant="secondary"
          className="!px-2.5 !py-1 text-[11px]"
        />
        <CopyButton
          text={words}
          label={t.common.copyTafqeet}
          toastMessage={t.common.copiedTafqeet}
          variant="secondary"
          className="!px-2.5 !py-1 text-[11px]"
          disabled={!words}
        />
      </div>
    </div>
  );
}

function CurrencySelect({ currencyCode, onChange }: { currencyCode: string; onChange: (code: string) => void }) {
  const { t, locale } = useLocale();
  return (
    <div className="mx-auto mb-6 max-w-xs">
      <label className="field-label text-center" htmlFor="fin-currency">
        {t.financial.currencyLabel}
      </label>
      <select
        id="fin-currency"
        className="field-select text-center text-sm font-semibold"
        value={currencyCode}
        onChange={(e) => onChange(e.target.value)}
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {locale === 'ar' ? c.nameAr : c.nameEn} ({c.code})
          </option>
        ))}
      </select>
    </div>
  );
}

function PercentagePanel({ currencyCode }: { currencyCode: string }) {
  const { t } = useLocale();
  const [mode, setMode] = useState<PercentMode>('of');
  const [value, setValue] = useState('500000');
  const [percent, setPercent] = useState('10');
  const [valueA, setValueA] = useState('500000');
  const [valueB, setValueB] = useState('575000');

  const modeOptions: { id: PercentMode; label: string }[] = [
    { id: 'of', label: t.financial.percentage.modeOf },
    { id: 'increase', label: t.financial.percentage.modeIncrease },
    { id: 'decrease', label: t.financial.percentage.modeDecrease },
    { id: 'change', label: t.financial.percentage.modeChange },
  ];

  const v = parseNum(value);
  const p = parseNum(percent);
  const vA = parseNum(valueA);
  const vB = parseNum(valueB);

  const invalid = mode === 'change' ? vA === null || vB === null : v === null || p === null;

  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.financial.percentage.title}</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        {modeOptions.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => setMode(opt.id)}
            className="chip-toggle"
            data-active={mode === opt.id}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {mode === 'change' ? (
          <>
            <div>
              <label className="field-label" htmlFor="pct-value-a">
                {t.financial.percentage.valueALabel}
              </label>
              <input
                id="pct-value-a"
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="field-input"
                value={valueA}
                onChange={(e) => setValueA(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pct-value-b">
                {t.financial.percentage.valueBLabel}
              </label>
              <input
                id="pct-value-b"
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="field-input"
                value={valueB}
                onChange={(e) => setValueB(e.target.value)}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="field-label" htmlFor="pct-value">
                {t.financial.percentage.valueLabel}
              </label>
              <input
                id="pct-value"
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="field-input"
                value={value}
                onChange={(e) => setValue(e.target.value)}
              />
            </div>
            <div>
              <label className="field-label" htmlFor="pct-percent">
                {t.financial.percentage.percentLabel}
              </label>
              <input
                id="pct-percent"
                type="text"
                inputMode="decimal"
                dir="ltr"
                className="field-input"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
              />
            </div>
          </>
        )}
      </div>

      {invalid ? (
        <p className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">{t.financial.invalidInput}</p>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {mode === 'of' && (
            <AmountResultTile
              highlight
              label={t.financial.percentage.resultLabel}
              amount={percentOf(v!, p!).result}
              currencyCode={currencyCode}
            />
          )}
          {mode === 'increase' && (
            <>
              <AmountResultTile
                highlight
                label={t.financial.percentage.resultLabel}
                amount={increaseByPercent(v!, p!).newValue}
                currencyCode={currencyCode}
              />
              <AmountResultTile
                label={t.financial.percentage.changeLabel}
                amount={increaseByPercent(v!, p!).changeAmount}
                currencyCode={currencyCode}
              />
            </>
          )}
          {mode === 'decrease' && (
            <>
              <AmountResultTile
                highlight
                label={t.financial.percentage.resultLabel}
                amount={decreaseByPercent(v!, p!).newValue}
                currencyCode={currencyCode}
              />
              <AmountResultTile
                label={t.financial.percentage.changeLabel}
                amount={decreaseByPercent(v!, p!).changeAmount}
                currencyCode={currencyCode}
              />
            </>
          )}
          {mode === 'change' && (
            <>
              <AmountResultTile
                label={t.financial.percentage.resultLabel}
                amount={percentDifference(vA!, vB!).difference}
                currencyCode={currencyCode}
              />
              {percentDifference(vA!, vB!).percentChange === null ? (
                <ResultTile highlight label={t.financial.percentage.changeLabel} value="—" />
              ) : (
                <PercentResultTile
                  highlight
                  label={t.financial.percentage.changeLabel}
                  value={percentDifference(vA!, vB!).percentChange!}
                />
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

function VatPanel({ currencyCode }: { currencyCode: string }) {
  const { t } = useLocale();
  const [direction, setDirection] = useState<VatDirection>('forward');
  const [amount, setAmount] = useState('100000');
  const [taxPercent, setTaxPercent] = useState('15');

  const a = parseNum(amount);
  const tp = parseNum(taxPercent);
  const invalid = a === null || tp === null;

  const result = !invalid ? (direction === 'forward' ? vatForward(a!, tp!) : vatReverse(a!, tp!)) : null;

  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.financial.vat.title}</h2>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDirection('forward')}
          className="chip-toggle"
          data-active={direction === 'forward'}
        >
          {t.financial.vat.directionForward}
        </button>
        <button
          type="button"
          onClick={() => setDirection('reverse')}
          className="chip-toggle"
          data-active={direction === 'reverse'}
        >
          {t.financial.vat.directionReverse}
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="vat-amount">
            {direction === 'forward' ? t.financial.vat.amountLabel : t.financial.vat.totalLabel}
          </label>
          <input
            id="vat-amount"
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="field-input"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="vat-tax-percent">
            {t.financial.vat.taxPercentLabel}
          </label>
          <input
            id="vat-tax-percent"
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="field-input"
            value={taxPercent}
            onChange={(e) => setTaxPercent(e.target.value)}
          />
        </div>
      </div>

      {invalid || !result ? (
        <p className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">{t.financial.invalidInput}</p>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AmountResultTile label={t.financial.vat.subtotal} amount={result.subtotal} currencyCode={currencyCode} />
          <AmountResultTile label={t.financial.vat.taxAmount} amount={result.taxAmount} currencyCode={currencyCode} />
          <AmountResultTile
            highlight
            label={t.financial.vat.total}
            amount={result.total}
            currencyCode={currencyCode}
          />
        </div>
      )}
    </div>
  );
}

function ProfitPanel({ currencyCode }: { currencyCode: string }) {
  const { t } = useLocale();
  const [cost, setCost] = useState('80000');
  const [selling, setSelling] = useState('100000');

  const c = parseNum(cost);
  const s = parseNum(selling);
  const invalid = c === null || s === null;
  const result = !invalid ? profitLoss(c!, s!) : null;

  return (
    <div className="glass-card p-6 sm:p-8">
      <h2 className="text-lg font-bold text-slate-900 dark:text-white">{t.financial.profitLoss.title}</h2>

      <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="pl-cost">
            {t.financial.profitLoss.costLabel}
          </label>
          <input
            id="pl-cost"
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="field-input"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
          />
        </div>
        <div>
          <label className="field-label" htmlFor="pl-selling">
            {t.financial.profitLoss.sellingLabel}
          </label>
          <input
            id="pl-selling"
            type="text"
            inputMode="decimal"
            dir="ltr"
            className="field-input"
            value={selling}
            onChange={(e) => setSelling(e.target.value)}
          />
        </div>
      </div>

      {invalid || !result ? (
        <p className="mt-6 text-sm font-medium text-red-600 dark:text-red-400">{t.financial.invalidInput}</p>
      ) : (
        <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <AmountResultTile
            highlight
            label={
              result.isProfit
                ? t.financial.profitLoss.profit
                : result.isLoss
                  ? t.financial.profitLoss.loss
                  : t.financial.profitLoss.breakEven
            }
            amount={Math.abs(result.amount)}
            currencyCode={currencyCode}
          />
          {result.marginPercent === null ? (
            <ResultTile label={t.financial.profitLoss.marginPercent} value="—" />
          ) : (
            <PercentResultTile label={t.financial.profitLoss.marginPercent} value={result.marginPercent} />
          )}
        </div>
      )}
    </div>
  );
}

export default function FinancialCalculatorPage() {
  const { t } = useLocale();
  const [tab, setTab] = useState<Tab>('percentage');
  const [currencyCode, setCurrencyCode] = useState(DEFAULT_CURRENCY_CODE);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'percentage', label: t.financial.tabPercentage },
    { id: 'vat', label: t.financial.tabVat },
    { id: 'profit', label: t.financial.tabProfit },
  ];

  return (
    <div className="relative overflow-hidden py-14 sm:py-20">
      <BackgroundDecor variant="compact" />
      <Seo title={t.financial.title} description={t.financial.subtitle} />

      <div className="section-container">
        <PageHeader
          eyebrow={t.nav.tools}
          title={t.financial.title}
          subtitle={t.financial.subtitle}
          icon={<IconFinancial className="h-7 w-7" />}
        />

        <div className="mx-auto mt-10 max-w-3xl">
          <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 dark:border-white/10 dark:bg-white/5">
            {tabs.map((tabItem) => (
              <button
                key={tabItem.id}
                type="button"
                onClick={() => setTab(tabItem.id)}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
                  tab === tabItem.id
                    ? 'bg-white text-brand-700 shadow-sm dark:bg-slate-800 dark:text-brand-300'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                {tabItem.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-8 max-w-3xl">
          <CurrencySelect currencyCode={currencyCode} onChange={setCurrencyCode} />
          {tab === 'percentage' && <PercentagePanel currencyCode={currencyCode} />}
          {tab === 'vat' && <VatPanel currencyCode={currencyCode} />}
          {tab === 'profit' && <ProfitPanel currencyCode={currencyCode} />}
        </div>
      </div>
    </div>
  );
}

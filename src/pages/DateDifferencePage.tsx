import React, { useState } from 'react';
import { useLocale } from '../i18n';
import Seo from '../components/Seo';
import BackgroundDecor from '../components/BackgroundDecor';
import PageHeader from '../components/PageHeader';
import { calendarDiff, isValidDateString, parseDateInputToUTC, todayISO } from '../utils/dateUtils';
import { IconDateDiff, IconSwap } from '../components/icons';

interface DiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
}

export default function DateDifferencePage() {
  const { t, format, locale } = useLocale();

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(todayISO());
  const [result, setResult] = useState<DiffResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!startDate || !endDate || !isValidDateString(startDate) || !isValidDateString(endDate)) {
      setError(t.dateDifference.invalidDateError);
      return;
    }

    const start = parseDateInputToUTC(startDate)!;
    const end = parseDateInputToUTC(endDate)!;
    const diff = calendarDiff(start, end);

    setResult({
      years: diff.years,
      months: diff.months,
      days: diff.days,
      totalDays: diff.totalDays,
      totalWeeks: diff.totalWeeks,
      totalHours: diff.totalHours,
    });
  }

  function handleSwap() {
    setStartDate(endDate);
    setEndDate(startDate);
  }

  function handleReset() {
    setStartDate('');
    setEndDate(todayISO());
    setResult(null);
    setError(null);
  }

  const useCases = [
    t.dateDifference.useCase1,
    t.dateDifference.useCase2,
    t.dateDifference.useCase3,
    t.dateDifference.useCase4,
    t.dateDifference.useCase5,
  ];

  const totals = result
    ? [
        { label: t.dateDifference.totalDays, value: result.totalDays },
        { label: t.dateDifference.totalWeeks, value: result.totalWeeks },
        { label: t.dateDifference.totalHours, value: result.totalHours },
      ]
    : [];

  return (
    <div className="relative overflow-hidden py-14 sm:py-20">
      <BackgroundDecor variant="compact" />
      <Seo title={t.dateDifference.title} description={t.dateDifference.subtitle} />

      <div className="section-container">
        <PageHeader
          eyebrow={t.nav.tools}
          title={t.dateDifference.title}
          subtitle={t.dateDifference.subtitle}
          icon={<IconDateDiff className="h-7 w-7" />}
        />

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-5">
          <form onSubmit={handleCalculate} className="glass-card p-6 sm:p-8 lg:col-span-2">
            <div className="mb-5">
              <label className="field-label" htmlFor="start-date">
                {t.dateDifference.startDateLabel}
              </label>
              <input
                id="start-date"
                type="date"
                className="field-input"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label className="field-label" htmlFor="end-date">
                {t.dateDifference.endDateLabel}
              </label>
              <input
                id="end-date"
                type="date"
                className="field-input"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            <p className="mt-3 text-xs text-slate-400 dark:text-slate-500">{t.dateDifference.orderNote}</p>

            {error && (
              <p role="alert" className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <button type="submit" className="btn-primary">
                {t.dateDifference.calculateButton}
              </button>
              <button type="button" onClick={handleSwap} className="btn-secondary">
                <IconSwap className="h-4 w-4" />
                {t.dateDifference.swapButton}
              </button>
              <button type="button" onClick={handleReset} className="btn-secondary">
                {t.dateDifference.resetButton}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/10">
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {t.dateDifference.useCasesTitle}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {useCases.map((useCase) => (
                  <span
                    key={useCase}
                    className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                  >
                    {useCase}
                  </span>
                ))}
              </div>
            </div>
          </form>

          <div className="lg:col-span-3">
            <div className="result-box">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-700 dark:text-brand-300">
                {t.dateDifference.resultTitle}
              </h2>

              {result ? (
                <>
                  <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                    {format(t.dateDifference.yearsMonthsDays, {
                      years: result.years,
                      months: result.months,
                      days: result.days,
                    })}
                  </p>

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {totals.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-2xl border border-white/70 bg-white/70 p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
                          {item.value.toLocaleString(locale === 'ar' ? 'ar-EG' : 'en-US')}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-400 dark:text-slate-500">
                  {locale === 'ar'
                    ? 'أدخل تاريخي البداية والنهاية ثم اضغط احسب لعرض النتيجة.'
                    : 'Enter a start and end date, then press Calculate to see the result.'}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

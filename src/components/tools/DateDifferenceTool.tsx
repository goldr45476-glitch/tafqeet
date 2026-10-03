import React, { useState } from 'react';
import { useLocale } from '../../i18n';
import BackgroundDecor from '../BackgroundDecor';
import PageHeader from '../PageHeader';
import SideNotes from '../SideNotes';
import {
  calendarDiff,
  isValidDateString,
  parseDateInputToUTC,
  parseTimeInput,
  timeDiff,
  todayISO,
  type TimeDiff,
} from '../../utils/dateUtils';
import { IconDateDiff, IconSwap } from '../icons';

interface DiffResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalWeeks: number;
  totalHours: number;
}

type Mode = 'dates' | 'times';

/** Arabic count + noun with proper agreement: ساعة، ساعتان، 3 ساعات، 11 ساعة. */
const AR_UNITS = {
  hours: { one: 'ساعة واحدة', two: 'ساعتان', few: 'ساعات', many: 'ساعة' },
  minutes: { one: 'دقيقة واحدة', two: 'دقيقتان', few: 'دقائق', many: 'دقيقة' },
  seconds: { one: 'ثانية واحدة', two: 'ثانيتان', few: 'ثوان', many: 'ثانية' },
} as const;

const EN_UNITS = {
  hours: ['hour', 'hours'],
  minutes: ['minute', 'minutes'],
  seconds: ['second', 'seconds'],
} as const;

function unitPhrase(n: number, unit: keyof typeof AR_UNITS, locale: 'ar' | 'en'): string {
  if (locale === 'en') {
    const [one, many] = EN_UNITS[unit];
    return `${n} ${n === 1 ? one : many}`;
  }
  const forms = AR_UNITS[unit];
  const r = n % 100;
  if (n === 1) return forms.one;
  if (n === 2) return forms.two;
  if (r >= 3 && r <= 10) return `${n} ${forms.few}`;
  return `${n} ${forms.many}`;
}

/** "8 hours, 30 minutes" / "8 ساعات و30 دقيقة" — zero parts are left out. */
function formatDuration(diff: TimeDiff, locale: 'ar' | 'en', emptyText: string): string {
  const parts: string[] = [];
  if (diff.hours > 0) parts.push(unitPhrase(diff.hours, 'hours', locale));
  if (diff.minutes > 0) parts.push(unitPhrase(diff.minutes, 'minutes', locale));
  if (diff.seconds > 0) parts.push(unitPhrase(diff.seconds, 'seconds', locale));
  if (parts.length === 0) return emptyText;
  return locale === 'ar' ? parts.map((p, i) => (i === 0 ? p : `و${p}`)).join(' ') : parts.join(', ');
}

/**
 * The fully self-contained Date / Time Difference tool: form, state, calculation
 * logic and result panel. Used both on the standalone `/tools/date-difference`
 * page and inline on the homepage. A switch picks between two calendar dates and
 * two times of day.
 */
export default function DateDifferenceTool() {
  const { t, format, locale } = useLocale();

  const [mode, setMode] = useState<Mode>('dates');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(todayISO());
  const [result, setResult] = useState<DiffResult | null>(null);

  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [overnight, setOvernight] = useState(true);
  const [timeResult, setTimeResult] = useState<TimeDiff | null>(null);

  const [error, setError] = useState<string | null>(null);

  function handleCalculate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (mode === 'times') {
      setTimeResult(null);
      const a = parseTimeInput(startTime);
      const b = parseTimeInput(endTime);
      if (a === null || b === null) {
        setError(t.dateDifference.invalidTimeError);
        return;
      }
      setTimeResult(timeDiff(a, b, overnight));
      return;
    }

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
    if (mode === 'times') {
      setStartTime(endTime);
      setEndTime(startTime);
    } else {
      setStartDate(endDate);
      setEndDate(startDate);
    }
  }

  function handleReset() {
    setError(null);
    if (mode === 'times') {
      setStartTime('');
      setEndTime('');
      setTimeResult(null);
    } else {
      setStartDate('');
      setEndDate(todayISO());
      setResult(null);
    }
  }

  function switchMode(next: Mode) {
    setMode(next);
    setError(null);
  }

  const useCases =
    mode === 'times'
      ? [
          t.dateDifference.timeUseCase1,
          t.dateDifference.timeUseCase2,
          t.dateDifference.timeUseCase3,
          t.dateDifference.timeUseCase4,
          t.dateDifference.timeUseCase5,
        ]
      : [
          t.dateDifference.useCase1,
          t.dateDifference.useCase2,
          t.dateDifference.useCase3,
          t.dateDifference.useCase4,
          t.dateDifference.useCase5,
        ];

  const dateTotals = result
    ? [
        { label: t.dateDifference.totalDays, value: result.totalDays },
        { label: t.dateDifference.totalWeeks, value: result.totalWeeks },
        { label: t.dateDifference.totalHours, value: result.totalHours },
      ]
    : [];

  const timeTotals = timeResult
    ? [
        { label: t.dateDifference.totalMinutes, value: timeResult.totalMinutes },
        { label: t.dateDifference.totalHours, value: timeResult.totalHours },
        { label: t.dateDifference.totalSeconds, value: timeResult.totalSeconds },
      ]
    : [];

  const totals = mode === 'times' ? timeTotals : dateTotals;
  const hasResult = mode === 'times' ? timeResult !== null : result !== null;

  const segmentClass = (active: boolean) =>
    active
      ? 'rounded-full bg-brand-700 px-3 py-1 text-accent-50 shadow-sm'
      : 'px-3 py-1 text-slate-600 dark:text-slate-400';

  return (
    <div className="relative overflow-hidden py-14 sm:py-20">
      <BackgroundDecor tone="sapphire" />

      <div className="section-container">
        <PageHeader
          tone="text-sapphire-700"
          eyebrow={t.nav.tools}
          title={t.dateDifference.title}
          subtitle={t.dateDifference.subtitle}
          icon={<IconDateDiff className="h-7 w-7" />}
        />

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 lg:grid-cols-5">
          <form onSubmit={handleCalculate} className="glass-card p-6 sm:p-8 lg:col-span-2">
            <div
              role="group"
              aria-label={locale === 'ar' ? 'نوع الحساب' : 'Calculation type'}
              className="mb-6 inline-flex rounded-full border border-accent-300 bg-slate-100 p-1 dark:border-accent-800/60 dark:bg-white/5"
            >
              <button
                type="button"
                onClick={() => switchMode('dates')}
                aria-pressed={mode === 'dates'}
                className="rounded-full px-1 py-1 text-sm font-semibold transition-all"
              >
                <span className={segmentClass(mode === 'dates')}>{t.dateDifference.modeDates}</span>
              </button>
              <button
                type="button"
                onClick={() => switchMode('times')}
                aria-pressed={mode === 'times'}
                className="rounded-full px-1 py-1 text-sm font-semibold transition-all"
              >
                <span className={segmentClass(mode === 'times')}>{t.dateDifference.modeTimes}</span>
              </button>
            </div>

            {mode === 'dates' ? (
              <>
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

                <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{t.dateDifference.orderNote}</p>
              </>
            ) : (
              <>
                <div className="mb-5">
                  <label className="field-label" htmlFor="start-time">
                    {t.dateDifference.startTimeLabel}
                  </label>
                  <input
                    id="start-time"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    dir="ltr"
                    className="field-input text-lg font-semibold"
                    placeholder={t.dateDifference.timePlaceholderStart}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>

                <div className="mb-2">
                  <label className="field-label" htmlFor="end-time">
                    {t.dateDifference.endTimeLabel}
                  </label>
                  <input
                    id="end-time"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    dir="ltr"
                    className="field-input text-lg font-semibold"
                    placeholder={t.dateDifference.timePlaceholderEnd}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>

                <p className="mt-3 text-xs leading-6 text-slate-500 dark:text-slate-400">{t.dateDifference.timeHint}</p>

                <label className="mt-4 inline-flex cursor-pointer items-start gap-2.5 text-sm font-medium text-slate-600 dark:text-slate-300">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-slate-300 dark:border-slate-600 dark:bg-slate-800"
                    checked={overnight}
                    onChange={(e) => setOvernight(e.target.checked)}
                  />
                  <span>{t.dateDifference.overnightLabel}</span>
                </label>
              </>
            )}

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
                {mode === 'times' ? t.dateDifference.swapTimesButton : t.dateDifference.swapButton}
              </button>
              <button type="button" onClick={handleReset} className="btn-secondary">
                {t.dateDifference.resetButton}
              </button>
            </div>

            <div className="mt-8 border-t border-slate-100 pt-6 dark:border-white/10">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400">
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
              <h2 className="text-xl font-bold text-brand-800 dark:text-accent-200">
                {t.dateDifference.resultTitle}
              </h2>

              {hasResult ? (
                <>
                  <p className="mt-4 text-2xl font-extrabold text-slate-900 dark:text-white sm:text-3xl">
                    {mode === 'times' && timeResult
                      ? formatDuration(timeResult, locale, t.dateDifference.noTimeDifference)
                      : result &&
                        format(t.dateDifference.yearsMonthsDays, {
                          years: result.years,
                          months: result.months,
                          days: result.days,
                        })}
                  </p>

                  {mode === 'times' && timeResult && (timeResult.crossedMidnight || timeResult.swapped) && (
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                      {timeResult.crossedMidnight
                        ? t.dateDifference.crossedMidnightNote
                        : t.dateDifference.swappedTimesNote}
                    </p>
                  )}

                  <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {totals.map((item) => (
                      <div
                        key={item.label}
                        className="rounded-md border border-accent-300 bg-surface-card p-5 text-center shadow-sm dark:border-white/10 dark:bg-white/5"
                      >
                        <p className="text-2xl font-bold text-brand-700 dark:text-brand-300">
                          {item.value.toLocaleString('en-US', { maximumFractionDigits: 2 })}
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-500 dark:text-slate-400">{item.label}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="mt-4 text-sm leading-6 text-slate-500 dark:text-slate-400">
                  {mode === 'times'
                    ? t.dateDifference.timeResultPlaceholder
                    : locale === 'ar'
                      ? 'أدخل تاريخي البداية والنهاية ثم اضغط احسب لعرض النتيجة.'
                      : 'Enter a start and end date, then press Calculate to see the result.'}
                </p>
              )}
            </div>
          </div>
        </div>
        <SideNotes tool="dateDifference" />
      </div>
    </div>
  );
}
